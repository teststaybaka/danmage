import { ChatEntry } from "../../../../interface/chat_entry";
import {
  DistributionStyle,
  PlayerSettings,
} from "../../../../interface/player_settings";
import { LinkedList, LinkedNode } from "../common/linked_list";
import { DanmakuElement } from "./danmaku_element";

export class DanmakuCanvasController {
  public static createStructured(
    canvas: HTMLElement,
    playerSettings: PlayerSettings,
  ): DanmakuCanvasController {
    return new DanmakuCanvasController(
      canvas,
      playerSettings,
      DanmakuElement.createStructured,
      Math.random,
    );
  }

  public static createYouTube(
    canvas: HTMLElement,
    playerSettings: PlayerSettings,
  ): DanmakuCanvasController {
    return new DanmakuCanvasController(
      canvas,
      playerSettings,
      DanmakuElement.createYouTube,
      Math.random,
    );
  }

  public static createTwitch(
    canvas: HTMLElement,
    playerSettings: PlayerSettings,
  ): DanmakuCanvasController {
    return new DanmakuCanvasController(
      canvas,
      playerSettings,
      DanmakuElement.createTwitch,
      Math.random,
    );
  }

  private width: number;
  private height: number;
  private playing: boolean;
  private occupied = new Array<number>();
  private elements = new LinkedList<DanmakuElement>();
  private resizeObserver: ResizeObserver;

  public constructor(
    private canvas: HTMLElement,
    private playerSettings: PlayerSettings,
    private createDanmakuElement: (
      playerSettings: PlayerSettings,
      chatEntry: ChatEntry,
    ) => DanmakuElement,
    private random: () => number,
  ) {
    this.resizeObserver = new ResizeObserver((entries) =>
      this.getNewSize(entries[0]),
    );
    this.resizeObserver.observe(this.canvas);
    this.pause();
  }

  private getNewSize(entry: ResizeObserverEntry): void {
    let newWidth: number;
    if (entry.contentBoxSize) {
      newWidth = entry.contentBoxSize[0].inlineSize;
      this.height = entry.contentBoxSize[0].blockSize;
    } else {
      newWidth = entry.contentRect.width;
      this.height = entry.contentRect.height;
    }
    if (newWidth !== this.width) {
      this.width = newWidth;
      this.elements.forEach((danmakuElement) => {
        danmakuElement.updateCanvasSize(this.width);
      });
    }
    while (this.occupied.length < this.height) {
      this.occupied.push(0);
    }
  }

  public add(chatEntries: Array<ChatEntry>): void {
    if (!this.playerSettings.displaySettings.enable || !this.playing) {
      return;
    }
    for (let chatEntry of chatEntries) {
      this.tryStartPlaying(chatEntry);
    }
  }

  private tryStartPlaying(chatEntry: ChatEntry): void {
    let element = this.createDanmakuElement(this.playerSettings, chatEntry);
    this.canvas.append(element.body);

    let elementHeight = element.getOffsetHeight();
    let startY = Math.floor(
      (this.playerSettings.displaySettings.topMargin / 100) * elementHeight,
    );
    let endY =
      elementHeight -
      Math.floor(
        (this.playerSettings.displaySettings.bottomMargin / 100) *
          elementHeight,
      ); // Exclusive
    if (endY - startY - elementHeight < 0) {
      // Not enough room for a danmaku.
      element.remove();
      return;
    }

    let marginAround =
      Math.floor(
        elementHeight / (this.playerSettings.displaySettings.density / 100),
      ) - elementHeight;
    let occupyScore = 0;
    let initY = this.getInitY(startY, endY, elementHeight);
    let headY = initY - marginAround;
    let tailY = initY + elementHeight + marginAround; // Exclusive
    for (let i = Math.max(0, headY); i < Math.min(endY, tailY); i++) {
      occupyScore += this.occupied[i];
    }

    let posYDown = this.findPosYDownward(
      initY,
      headY,
      tailY,
      occupyScore,
      elementHeight,
      startY,
      endY,
    );
    let posYUp = this.findPosYUpward(
      initY,
      headY,
      tailY,
      occupyScore,
      startY,
      endY,
    );
    if (posYDown < 0 && posYUp < 0) {
      element.remove();
      return;
    }

    let posY: number;
    if (posYDown < 0) {
      posY = posYUp;
    } else if (posYUp < 0) {
      posY = posYDown;
    } else if (posYDown - initY > initY - posYUp) {
      posY = posYUp;
    } else {
      posY = posYDown;
    }

    for (let i = posY; i < posY + elementHeight; i++) {
      this.occupied[i]++;
    }
    let node = this.elements.pushBack(element);
    element.once("occupyEnded", () =>
      this.releaseOccupied(posY, elementHeight),
    );
    element.once("displayEnded", () => this.removeNode(node));
    element.setReadyToPlay(posY, this.width);
    element.play();
  }

  private getInitY(
    startY: number,
    endY: number,
    elementHeight: number,
  ): number {
    switch (this.playerSettings.displaySettings.distributionStyle) {
      case DistributionStyle.TopDownDistributionStyle:
        return startY;
      case DistributionStyle.RandomDistributionStyle:
        return (
          Math.floor(this.random() * (endY - startY - elementHeight + 1)) +
          startY
        );
    }
    return ((): never => {})();
  }

  private findPosYDownward(
    posY: number,
    headY: number,
    tailY: number,
    score: number,
    elementHeight: number,
    startY: number,
    endY: number,
  ): number {
    while (score > 0 && posY + elementHeight < endY) {
      posY++;
      headY++;
      tailY++;
      if (headY - 1 >= startY) {
        score -= this.occupied[headY - 1];
      }
      if (tailY <= endY) {
        score += this.occupied[tailY - 1];
      }
    }
    if (score > 0) {
      return -1;
    } else {
      return posY;
    }
  }

  private findPosYUpward(
    posY: number,
    headY: number,
    tailY: number,
    score: number,
    startY: number,
    endY: number,
  ): number {
    while (score > 0 && posY > startY) {
      posY--;
      headY--;
      tailY--;
      if (headY >= startY) {
        score += this.occupied[headY];
      }
      if (tailY < endY) {
        score -= this.occupied[tailY];
      }
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

  private removeNode(node: LinkedNode<DanmakuElement>): void {
    node.remove();
    node.value.remove();
  }

  public play(): void {
    this.playing = true;
    this.elements.forEach((danmakuElement) => {
      danmakuElement.play();
    });
  }

  public pause(): void {
    this.playing = false;
    this.elements.forEach((danmakuElement) => {
      danmakuElement.pause();
    });
  }

  public updateDisplaySettings(): void {
    if (!this.playerSettings.displaySettings.enable) {
      this.elements.forEach((danmakuElement) => {
        danmakuElement.remove();
      });
      this.elements.clear();
      for (let i = 0; i < this.occupied.length; i++) {
        this.occupied[i] = 0;
      }
    } else {
      this.elements.forEach((danmakuElement) => {
        danmakuElement.reRender();
      });
    }
  }

  public updateBlockSettings(): void {
    this.elements.forEachNode((danmakuElementNode) => {
      if (danmakuElementNode.value.isBlocked()) {
        this.removeNode(danmakuElementNode);
      }
    });
  }

  public clear(): void {
    this.elements.forEachNode((danmakuElementNode) => {
      this.removeNode(danmakuElementNode)
    });
  }

  public remove(): void {
    this.resizeObserver.disconnect();
    this.clear();
  }
}
