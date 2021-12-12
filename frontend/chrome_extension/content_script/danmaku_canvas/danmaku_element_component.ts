import EventEmitter = require("events");
import { ChatEntry } from "../../../../interface/chat_entry";
import {
  DisplaySettings,
  PlayerSettings,
} from "../../../../interface/player_settings";
import { BlockPatternTester } from "../common/block_pattern_tester";
import {
  DanmakuElementContentBuilder,
  StructuredContentBuilder,
  TwitchChatContentBuilder,
  YouTubeChatContentBuilder,
} from "./danmaku_element_content_builder";
import { E } from "@selfage/element/factory";
import { OnceCaller } from "@selfage/once/caller";

export interface DanmakuElementComponent {
  on(event: "occupationEnded", listener: () => void): this;
  on(event: "displayEnded", listener: () => void): this;
}

export class DanmakuElementComponent extends EventEmitter {
  private static DANMAKU_ELEMENT_ATTRIBUTES = {
    class: "danmaku-element",
    style: `display: flex; flex-flow: row nowrap; align-items: center; position: absolute; top: 0; right: 0; padding: .2rem 1.5rem .2rem 0; line-height: normal; z-index: 10; pointer-events: none; white-space: nowrap; visibility: hidden;`,
  };
  private static OPACITY_SCALE = 1 / 100;
  private static FONT_SIZE_SCALE = 1 / 10;

  private chatEntry: ChatEntry;
  private posY: number;
  private emitOccupationEndedTimeoutId: number;
  private emitDisplayEndedTimeoutId: number;
  private startTransitionNoop = (): void => {};
  private tryStartTransition: (canvasWidth: number) => void;
  private pauseTransitionNoop = (): void => {};
  private tryPauseTransition: () => void;
  private occupationEndedEmitterOnce = new OnceCaller(() =>
    this.emitOccupationEnded()
  );
  private displayEndedEmitterOnce = new OnceCaller(() =>
    this.emitDisplayEnded()
  );

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

  public setContentAndGetHeight(chatEntry: ChatEntry): number {
    this.chatEntry = chatEntry;
    this.render();
    return this.body.offsetHeight;
  }

  private render(): void {
    this.body.style.opacity = `${
      this.displaySettings.opacity * DanmakuElementComponent.OPACITY_SCALE
    }`;
    this.body.style.fontSize = `${
      this.displaySettings.fontSize * DanmakuElementComponent.FONT_SIZE_SCALE
    }rem`;
    this.body.style.setProperty(
      "font-family",
      this.displaySettings.fontFamily,
      "important"
    );
    this.body.innerHTML = this.danmakuElementContentBuilder.build(
      this.chatEntry,
      this.displaySettings
    );
  }

  public setStartPosition(posY: number): void {
    this.occupationEndedEmitterOnce.reset();
    this.displayEndedEmitterOnce.reset();
    this.posY = posY;
    this.transform(this.body.offsetWidth);
    this.body.style.transition = `none`;
    this.body.style.visibility = "visible";
  }

  private transform(posX: number): void {
    this.body.style.transform = `translate3d(${posX}px, ${this.posY}px, 0)`;
  }

  private emitOccupationEnded(): void {
    this.emit("occupationEnded");
  }

  private emitDisplayEnded(): void {
    this.body.style.visibility = "hidden";
    this.emit("displayEnded");
  }

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
        this.occupationEndedEmitterOnce.call();
      }, remainingDuration * 1000);
    } else {
      this.occupationEndedEmitterOnce.call();
    }
    if (posXComputed > -canvasWidth) {
      let duration = (canvasWidth + posXComputed) / this.displaySettings.speed;
      this.body.style.transition = `transform ${duration}s linear`;
      this.transform(-canvasWidth);
      this.emitDisplayEndedTimeoutId = this.window.setTimeout(() => {
        this.displayEndedEmitterOnce.call();
      }, duration * 1000);
    } else {
      this.displayEndedEmitterOnce.call();
    }
  }

  private getPosXComputed(): number {
    return new DOMMatrix(this.window.getComputedStyle(this.body).transform).m41;
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
    this.occupationEndedEmitterOnce.call();
    this.displayEndedEmitterOnce.call();
  }

  public remove(): void {
    this.clearTimeouts();
    this.body.remove();
  }
}
