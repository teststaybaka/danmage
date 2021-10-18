import EventEmitter = require("events");
import { ChatEntry } from "../../../../interface/chat_entry";
import {
  DisplaySettings,
  PlayerSettings,
} from "../../../../interface/player_settings";
import { BlockPatternTester } from "../block_pattern_tester";
import {
  DanmakuElementContentBuilder,
  StructuredContentBuilder,
  TwitchChatContentBuilder,
  YouTubeChatContentBuilder,
} from "./danmaku_element_content_builder";
import { E } from "@selfage/element/factory";

export interface DanmakuElementComponent {
  on(event: "occupationEnded", listener: () => void): this;
  on(event: "displayEnded", listener: () => void): this;
}

export class DanmakuElementComponent extends EventEmitter {
  private static DANMAKU_ELEMENT_ATTRIBUTES = {
    class: "danmaku-element",
    style: `display: flex; flex-flow: row nowrap; align-items: center; position: absolute; top: 0; right: 0; padding: .2rem 1.5rem .2rem 0; z-index: 10; pointer-events: none; white-space: nowrap; visibility: hidden;`,
  };
  private static OPACITY_SCALE = 1 / 100;
  private static FONT_SIZE_SCALE = 1 / 10;

  public heightOriginal: number;
  public posYOriginal: number;
  private chatEntry: ChatEntry;
  private emitOccupationEndedTimeoutId: number;
  private emitDisplayEndedTimeoutId: number;
  private emitOccupationEndedNoop = (): void => {};
  private tryEmitOccupationEnded = this.emitOccupationEndedNoop;
  private emitDisplayEndedNoop = (): void => {};
  private tryEmitDisplayEnded = this.emitDisplayEndedNoop;
  private startTransitionNoop = (): void => {};
  private tryStartTransition: (canvasWidth: number) => void;
  private pauseTransitionNoop = (): void => {};
  private tryPauseTransition: () => void;

  public constructor(
    public body: HTMLDivElement,
    private displaySettings: DisplaySettings,
    private blockPatternTester: BlockPatternTester,
    private danmakuElementContentBuilder: DanmakuElementContentBuilder,
    private window: Window
  ) {
    super();
  }

  public static createStructured(
    playerSettings: PlayerSettings
  ): DanmakuElementComponent {
    return new DanmakuElementComponent(
      E.div(DanmakuElementComponent.DANMAKU_ELEMENT_ATTRIBUTES),
      playerSettings.displaySettings,
      BlockPatternTester.createIdentity(playerSettings.blockSettings),
      new StructuredContentBuilder(),
      window
    );
  }

  public static createTwitch(
    playerSettings: PlayerSettings
  ): DanmakuElementComponent {
    return new DanmakuElementComponent(
      E.div(DanmakuElementComponent.DANMAKU_ELEMENT_ATTRIBUTES),
      playerSettings.displaySettings,
      BlockPatternTester.createHtml(playerSettings.blockSettings),
      new TwitchChatContentBuilder(),
      window
    );
  }

  public static createYouTube(
    playerSettings: PlayerSettings
  ): DanmakuElementComponent {
    return new DanmakuElementComponent(
      E.div(DanmakuElementComponent.DANMAKU_ELEMENT_ATTRIBUTES),
      playerSettings.displaySettings,
      BlockPatternTester.createHtml(playerSettings.blockSettings),
      new YouTubeChatContentBuilder(),
      window
    );
  }

  public setContent(chatEntry: ChatEntry): void {
    this.chatEntry = chatEntry;
    this.render();
    this.heightOriginal = this.body.offsetHeight;
  }

  private render(): void {
    this.body.style.opacity = `${
      this.displaySettings.opacity * DanmakuElementComponent.OPACITY_SCALE
    }`;
    this.body.style.fontSize = `${
      this.displaySettings.fontSize * DanmakuElementComponent.FONT_SIZE_SCALE
    }rem`;
    this.body.style.lineHeight = `${
      this.displaySettings.fontSize * DanmakuElementComponent.FONT_SIZE_SCALE
    }rem`;
    this.body.style.setProperty(
      "fontFamily",
      this.displaySettings.fontFamily,
      "important"
    );
    this.body.innerHTML = this.danmakuElementContentBuilder.build(
      this.chatEntry,
      this.displaySettings
    );
  }

  public setStartPosition(posY: number): void {
    this.tryEmitOccupationEnded = this.emitOccupationEnded;
    this.tryEmitDisplayEnded = this.emitDisplayEnded;
    this.posYOriginal = posY;
    this.transform(this.body.offsetWidth);
    this.body.style.transition = `none`;
    this.body.style.visibility = "visible";
  }

  private transform(posX: number): void {
    this.body.style.transform = `translate3d(${posX}px, ${this.posYOriginal}px, 0)`;
  }

  private getPosXComputed(): number {
    return new DOMMatrix(this.window.getComputedStyle(this.body).transform).m41;
  }

  private emitOccupationEnded = (): void => {
    this.emit("occupationEnded");
    this.tryEmitOccupationEnded = this.emitOccupationEndedNoop;
  };

  private emitDisplayEnded = (): void => {
    this.body.style.visibility = "hidden";
    this.emit("displayEnded");
    this.tryEmitDisplayEnded = this.emitDisplayEndedNoop;
  };

  public play(canvasWidth: number): void {
    this.tryStartTransition = this.startTransition;
    this.tryPauseTransition = this.pauseTransition;
    this.tryStartTransition(canvasWidth);
  }

  private startTransition(canvasWidth: number): void {
    let posXComputed = this.getPosXComputed();
    if (posXComputed > 0) {
      let remainingDuration = posXComputed / this.displaySettings.speed;
      this.emitOccupationEndedTimeoutId = this.window.setTimeout(() => {
        this.tryEmitOccupationEnded();
      }, remainingDuration * 1000);
    } else {
      this.tryEmitOccupationEnded();
    }
    if (posXComputed > -canvasWidth) {
      let duration = (canvasWidth + posXComputed) / this.displaySettings.speed;
      this.body.style.transition = `transform ${duration}s linear`;
      this.transform(-canvasWidth);
      this.emitDisplayEndedTimeoutId = this.window.setTimeout(() => {
        this.tryEmitDisplayEnded();
      }, duration * 1000);
    } else {
      this.tryEmitDisplayEnded();
    }
  }

  public pause(): void {
    this.tryPauseTransition();
    this.tryStartTransition = this.startTransitionNoop;
    this.tryPauseTransition = this.pauseTransitionNoop;
  }

  private pauseTransition(): void {
    this.clearTimeouts();
    this.transform(this.getPosXComputed());
    this.body.style.transition = `none`;
  }

  private clearTimeouts(): void {
    this.window.clearTimeout(this.emitOccupationEndedTimeoutId);
    this.window.clearTimeout(this.emitDisplayEndedTimeoutId);
  }

  public refreshDisplay(canvasWidth: number): void {
    this.tryPauseTransition();
    this.render();
    this.tryStartTransition(canvasWidth);
  }

  public refreshBlocked(): void {
    if (this.blockPatternTester.test(this.chatEntry)) {
      this.clear();
    }
  }

  public refreshCanvasSize(canvasWidth: number): void {
    this.tryPauseTransition();
    this.tryStartTransition(canvasWidth);
  }

  public clear(): void {
    this.clearTimeouts();
    this.body.style.visibility = "hidden";
    this.tryEmitOccupationEnded();
    this.tryEmitDisplayEnded();
  }

  public remove(): void {
    this.clearTimeouts();
    this.body.remove();
  }
}
