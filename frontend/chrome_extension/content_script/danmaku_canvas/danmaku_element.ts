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

export interface DanmakuElement {
  on(event: "occupyEnded", listener: () => void): this;
  on(event: "displayEnded", listener: () => void): this;
}

export class DanmakuElement extends EventEmitter {
  public static createStructured(
    playerSettings: PlayerSettings,
    chatEntry: ChatEntry,
  ): DanmakuElement {
    return new DanmakuElement(
      BlockPatternTester.createIdentity(playerSettings.blockSettings),
      new StructuredContentBuilder(),
      window,
      playerSettings.displaySettings,
      chatEntry,
    );
  }

  public static createTwitch(
    playerSettings: PlayerSettings,
    chatEntry: ChatEntry,
  ): DanmakuElement {
    return new DanmakuElement(
      BlockPatternTester.createHtml(playerSettings.blockSettings),
      new TwitchChatContentBuilder(),
      window,
      playerSettings.displaySettings,
      chatEntry,
    );
  }

  public static createYouTube(
    playerSettings: PlayerSettings,
    chatEntry: ChatEntry,
  ): DanmakuElement {
    return new DanmakuElement(
      BlockPatternTester.createHtml(playerSettings.blockSettings),
      new YouTubeChatContentBuilder(),
      window,
      playerSettings.displaySettings,
      chatEntry,
    );
  }

  private static OPACITY_SCALE = 1 / 100;
  private static FONT_SIZE_SCALE = 1 / 10;

  public body: HTMLDivElement;
  private canvasWidth: number;
  private posX: number;
  private posY: number;
  private playAfterLeaving: boolean;
  private playByPlayer: boolean;
  private endOccupyTimeoutId: number;
  private endDisplayTimeoutId: number;

  public constructor(
    private blockPatternTester: BlockPatternTester,
    private danmakuElementContentBuilder: DanmakuElementContentBuilder,
    private window: Window,
    private displaySettings: DisplaySettings,
    private chatEntry: ChatEntry,
  ) {
    super();
    this.body = E.div({
      class: "danmaku-element",
      style: `display: flex; flex-flow: row nowrap; align-items: center; position: absolute; bottom: 100%; right: 0; padding: .2rem 1.5rem .2rem 0; line-height: normal; z-index: 10; white-space: nowrap; visibility: hidden;`,
    });
    this.render();
    this.leaveToResume();
    this.body.addEventListener("mouseenter", () => this.hoverToPause());
    this.body.addEventListener("mouseleave", () => this.leaveToResume());
  }

  private render(): void {
    this.body.style.opacity = `${
      this.displaySettings.opacity * DanmakuElement.OPACITY_SCALE
    }`;
    this.body.style.fontSize = `${
      this.displaySettings.fontSize * DanmakuElement.FONT_SIZE_SCALE
    }rem`;
    this.body.style.setProperty(
      "font-family",
      this.displaySettings.fontFamily,
      "important",
    );
    if (this.displaySettings.enableInteraction) {
      this.body.style.pointerEvents = "auto";
    } else {
      this.body.style.pointerEvents = "none";
    }
    this.body.innerHTML = this.danmakuElementContentBuilder.build(
      this.chatEntry,
      this.displaySettings,
    );
  }
  private leaveToResume(): void {
    this.playAfterLeaving = true;
    this.tryStartTransition();
  }

  private tryStartTransition(): void {
    if (this.playAfterLeaving && this.playByPlayer) {
      this.startTransition();
    }
  }

  private startTransition(): void {
    if (this.posX > 0) {
      let remainingDuration = this.posX / this.displaySettings.speed;
      this.endOccupyTimeoutId = this.window.setTimeout(() => {
        this.emit("occupyEnded");
      }, remainingDuration * 1000);
    } else {
      this.emit("occupyEnded");
    }
    if (this.posX > -this.canvasWidth) {
      let duration =
        (this.canvasWidth + this.posX) / this.displaySettings.speed;
      this.body.style.transition = `transform ${duration}s linear`;
      this.transform(-this.canvasWidth);
      this.endDisplayTimeoutId = this.window.setTimeout(() => {
        this.emit("displayEnded");
      }, duration * 1000);
    } else {
      this.emit("displayEnded");
    }
  }

  private transform(posX: number): void {
    this.body.style.transform = `translate3d(${posX}px, ${this.posY}px, 0)`;
  }

  private hoverToPause(): void {
    this.playAfterLeaving = false;
    this.pauseTransition();
  }

  private pauseTransition(): void {
    this.clearAllTimeouts();
    this.posX = this.getPosXComputed();
    this.transform(this.posX);
    this.body.style.transition = `none`;
    // Force reflow.
    this.body.offsetHeight;
  }

  private getPosXComputed(): number {
    return new DOMMatrix(this.window.getComputedStyle(this.body).transform).m41;
  }

  private clearAllTimeouts(): void {
    this.window.clearTimeout(this.endOccupyTimeoutId);
    this.window.clearTimeout(this.endDisplayTimeoutId);
  }

  public getOffsetHeight(): number {
    return this.body.offsetHeight;
  }

  public setReadyToPlay(posY: number, canvasWidth: number): void {
    this.canvasWidth = canvasWidth;
    this.posX = this.body.offsetWidth;
    this.posY = posY;
    this.body.style.bottom = "";
    this.body.style.top = "0";
    this.transform(this.posX);
    this.body.style.transition = `none`;
    this.body.style.visibility = "visible";
    // Force reflow.
    this.body.offsetHeight;
  }

  public play(): void {
    this.playByPlayer = true;
    this.tryStartTransition();
  }

  public pause(): void {
    this.playByPlayer = false;
    this.pauseTransition();
  }

  public reRender(): void {
    this.tryPauseTransition();
    this.render();
    this.tryStartTransition();
  }

  private tryPauseTransition(): void {
    if (this.playAfterLeaving && this.playByPlayer) {
      this.pauseTransition();
    }
  }

  public isBlocked(): boolean {
    return this.blockPatternTester.test(this.chatEntry);
  }

  public updateCanvasSize(canvasWidth: number): void {
    this.canvasWidth = canvasWidth;
    this.tryPauseTransition();
    this.tryStartTransition();
  }

  public remove(): void {
    this.clearAllTimeouts();
    this.body.remove();
  }
}
