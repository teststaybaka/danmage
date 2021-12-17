import { ChatEntry } from "../../../../interface/chat_entry";
import {
  DistributionStyle,
  PlayerSettings,
} from "../../../../interface/player_settings";
import { LinkedList, LinkedNode } from "../common/linked_list";
import { DanmakuElementComponent } from "./danmaku_element_component";

export class DanmakuCanvasController {
  private static REFRESH_INTERVAL = 1000; // ms

  private canvasWidth: number;
  private canvasHeight: number;
  private refreshCanvasSizeCycleId: number;
  private notPlaying = (): void => {};
  private tryStartPlaying: (
    danmakuElementComponent: DanmakuElementComponent
  ) => void = this.notPlaying;
  private occupied = new Array<number>();
  private elementsIdle = new Array<DanmakuElementComponent>();
  private elementsDisplaying = new LinkedList<DanmakuElementComponent>();

  public constructor(
    private canvas: HTMLElement,
    private playerSettings: PlayerSettings,
    private danmakuElementComponentFactoryFn: (
      playerSettings: PlayerSettings
    ) => DanmakuElementComponent,
    private window: Window,
    private random: () => number
  ) {}

  public static createStructured(
    canvas: HTMLElement,
    playerSettings: PlayerSettings
  ): DanmakuCanvasController {
    return new DanmakuCanvasController(
      canvas,
      playerSettings,
      DanmakuElementComponent.createStructured,
      window,
      Math.random
    ).init();
  }

  public static createYouTube(
    canvas: HTMLElement,
    playerSettings: PlayerSettings
  ): DanmakuCanvasController {
    return new DanmakuCanvasController(
      canvas,
      playerSettings,
      DanmakuElementComponent.createYouTube,
      window,
      Math.random
    ).init();
  }

  public static createTwitch(
    canvas: HTMLElement,
    playerSettings: PlayerSettings
  ): DanmakuCanvasController {
    return new DanmakuCanvasController(
      canvas,
      playerSettings,
      DanmakuElementComponent.createTwitch,
      window,
      Math.random
    ).init();
  }

  public init(): this {
    this.canvasWidth = this.canvas.offsetWidth;
    this.canvasHeight = this.canvas.offsetHeight;
    this.refreshIdleElements();
    return this;
  }

  private refreshIdleElements(): void {
    for (
      let i = this.elementsDisplaying.getSize() + this.elementsIdle.length;
      i < this.playerSettings.displaySettings.numLimit;
      i++
    ) {
      this.createOneIdleElement();
    }
  }

  private createOneIdleElement(): void {
    let newDanmakuElementComponent = this.danmakuElementComponentFactoryFn(
      this.playerSettings
    );
    this.canvas.appendChild(newDanmakuElementComponent.body);
    this.elementsIdle.push(newDanmakuElementComponent);
  }

  public addEntries(chatEntries: Array<ChatEntry>): void {
    if (!this.playerSettings.displaySettings.enable) {
      return;
    }
    for (let chatEntry of chatEntries) {
      if (
        this.elementsDisplaying.getSize() >=
        this.playerSettings.displaySettings.numLimit
      ) {
        break;
      }
      this.tryStartDisplaying(chatEntry);
    }
  }

  private tryStartDisplaying(chatEntry: ChatEntry): void {
    let danmakuElementComponent =
      this.elementsIdle[this.elementsIdle.length - 1];
    let elementHeight =
      danmakuElementComponent.setContentAndGetHeight(chatEntry);
    while (this.occupied.length < Math.max(elementHeight, this.canvasHeight)) {
      this.occupied.push(0);
    }

    let startY = Math.floor(
      (this.playerSettings.displaySettings.topMargin / 100) * this.canvasHeight
    );
    let endY =
      this.canvasHeight -
      Math.floor(
        (this.playerSettings.displaySettings.bottomMargin / 100) *
          this.canvasHeight
      );
    let initScore = 0;
    let initY = this.getInitY(startY, endY, elementHeight);
    console.log(`${startY} ${endY} ${initY}`);
    for (let i = initY; i < initY + elementHeight; i++) {
      initScore += this.occupied[i];
    }

    let posYDown = this.findPosYDownward(initY, initScore, elementHeight, endY);
    let posYUp = this.findPosYUpward(initY, initScore, elementHeight, startY);
    if (posYDown === -1 && posYUp === -1) {
      danmakuElementComponent.clear();
      return;
    }

    let posY: number;
    if (posYDown === -1) {
      posY = posYUp;
    } else if (posYUp === -1) {
      posY = posYDown;
    } else if (posYDown - initY > initY - posYUp) {
      posY = posYUp;
    } else {
      posY = posYDown;
    }

    for (let j = posY; j < posY + elementHeight; j++) {
      this.occupied[j]++;
    }
    this.elementsIdle.pop();
    let node = this.elementsDisplaying.pushBack(danmakuElementComponent);
    danmakuElementComponent.once("occupationEnded", () =>
      this.releaseOccupied(posY, elementHeight)
    );
    danmakuElementComponent.once("displayEnded", () => this.returnToIdle(node));
    danmakuElementComponent.setStartPosition(posY);
    this.tryStartPlaying(danmakuElementComponent);
  }

  private getInitY(
    startY: number,
    endY: number,
    elementHeight: number
  ): number {
    switch (this.playerSettings.displaySettings.distributionStyle) {
      case DistributionStyle.TopDownDistributionStyle:
        return startY;
      case DistributionStyle.RandomDistributionStyle:
        return (
          Math.round(
            this.random() * Math.max(0, endY - startY - elementHeight)
          ) + startY
        );
    }
    return ((): never => {})();
  }

  private findPosYDownward(
    posY: number,
    score: number,
    elementHeight: number,
    endY: number
  ): number {
    while (score > 0 && posY < endY - elementHeight) {
      posY++;
      score -= this.occupied[posY - 1];
      score += this.occupied[posY + elementHeight - 1];
    }
    if (score > 0) {
      return -1;
    } else {
      return posY;
    }
  }

  private findPosYUpward(
    posY: number,
    score: number,
    elementHeight: number,
    startY: number
  ): number {
    while (score > 0 && posY > startY) {
      posY--;
      score -= this.occupied[posY + elementHeight];
      score += this.occupied[posY];
    }
    if (score > 0) {
      return -1;
    } else {
      return posY;
    }
  }

  private releaseOccupied(posY: number, elementHeight: number): void {
    for (let i = posY; i < posY + elementHeight; i++) {
      this.occupied[i]--;
    }
  }

  private returnToIdle(node: LinkedNode<DanmakuElementComponent>): void {
    node.remove();
    this.elementsIdle.push(node.value);
  }

  public addExtraEntry(chatEntry: ChatEntry): void {
    if (!this.playerSettings.displaySettings.enable) {
      return;
    }
    this.createOneIdleElement();
    this.tryStartDisplaying(chatEntry);
  }

  public play(): void {
    this.refreshCanvasSize();
    this.refreshCanvasSizeCycleId = this.window.setInterval(
      () => this.refreshCanvasSize(),
      DanmakuCanvasController.REFRESH_INTERVAL
    );
    this.tryStartPlaying = this.startPlaying;
    this.elementsDisplaying.forEach((danmakuElementComponent) => {
      danmakuElementComponent.play(this.canvasWidth);
    });
  }

  // Cache width & height to save extra reflows.
  private refreshCanvasSize(): void {
    if (this.canvasWidth != this.canvas.offsetWidth) {
      this.canvasWidth = this.canvas.offsetWidth;
      this.elementsDisplaying.forEach((danmakuElementComponent) => {
        danmakuElementComponent.refreshCanvasSize(this.canvasWidth);
      });
    }
    this.canvasHeight = this.canvas.offsetHeight;
  }

  private startPlaying(danmakuElementComponent: DanmakuElementComponent): void {
    danmakuElementComponent.play(this.canvasWidth);
  }

  public pause(): void {
    this.window.clearInterval(this.refreshCanvasSizeCycleId);
    this.tryStartPlaying = this.notPlaying;
    this.elementsDisplaying.forEach((danmakuElementComponent) => {
      danmakuElementComponent.pause();
    });
  }

  public refreshDisplay(): void {
    this.refreshIdleElements();

    if (this.playerSettings.displaySettings.enable) {
      this.elementsDisplaying.forEach((danmakuElementComponent) => {
        danmakuElementComponent.refreshDisplay(this.canvasWidth);
      });
    } else {
      this.clear();
    }
  }

  public refreshBlocked(): void {
    this.elementsDisplaying.forEach((danmakuElementComponent) => {
      danmakuElementComponent.refreshBlocked();
    });
  }

  public clear(): void {
    this.elementsDisplaying.forEach((danmakuElementComponent) => {
      danmakuElementComponent.clear();
    });
  }

  public remove(): void {
    this.elementsDisplaying.forEach((danmakuElementComponent) => {
      danmakuElementComponent.remove();
    });
    this.elementsIdle.forEach((danmakuElementComponent) => {
      danmakuElementComponent.remove();
    });
  }
}
