import { ChatEntry } from "../../../../interface/chat_entry";
import { PlayerSettings } from "../../../../interface/player_settings";
import { LinkedList } from "../linked_list";
import {
  DanmakuElementComponent,
  MoveResult,
} from "./danmaku_element_component";

export class DanmakuCanvasController {
  private canvasWidth: number;
  private canvasHeight: number;
  private occupied = new Array<number>();
  private elementsIdle = new Array<DanmakuElementComponent>();
  private elementsOccupying = new LinkedList<DanmakuElementComponent>();
  private elementsDisplaying = new LinkedList<DanmakuElementComponent>();

  public constructor(
    private canvas: HTMLElement,
    private playerSettings: PlayerSettings,
    private danmakuElementComponentFactoryFn: (
      playerSettings: PlayerSettings
    ) => DanmakuElementComponent
  ) {}

  public static createStructured(
    canvas: HTMLElement,
    playerSettings: PlayerSettings
  ): DanmakuCanvasController {
    return new DanmakuCanvasController(
      canvas,
      playerSettings,
      DanmakuElementComponent.createStructured
    ).init();
  }

  public static createYouTube(
    canvas: HTMLElement,
    playerSettings: PlayerSettings
  ): DanmakuCanvasController {
    return new DanmakuCanvasController(
      canvas,
      playerSettings,
      DanmakuElementComponent.createYouTube
    ).init();
  }

  public static createTwitch(
    canvas: HTMLElement,
    playerSettings: PlayerSettings
  ): DanmakuCanvasController {
    return new DanmakuCanvasController(
      canvas,
      playerSettings,
      DanmakuElementComponent.createTwitch
    ).init();
  }

  public init(): this {
    this.refreshIdleElements();
    return this;
  }

  private refreshIdleElements(): void {
    for (
      let i = this.getSize() + this.elementsIdle.length;
      i < this.playerSettings.displaySettings.numLimit;
      i++
    ) {
      this.createOneIdleElement();
    }
  }

  private getSize(): number {
    return this.elementsOccupying.getSize() + this.elementsDisplaying.getSize();
  }

  private createOneIdleElement(): void {
    let newDanmakuElement = this.danmakuElementComponentFactoryFn(
      this.playerSettings
    );
    this.canvas.appendChild(newDanmakuElement.body);
    this.elementsIdle.push(newDanmakuElement);
  }

  public addPerCycle(chatEntries: Array<ChatEntry>): void {
    // Store width & height to save extra reflows.
    this.canvasWidth = this.canvas.offsetWidth;
    this.canvasHeight = this.canvas.offsetHeight;
    if (!this.playerSettings.displaySettings.enable) {
      return;
    }

    for (let chatEntry of chatEntries) {
      if (this.getSize() >= this.playerSettings.displaySettings.numLimit) {
        break;
      }
      this.addOne(chatEntry, this.elementsIdle.pop());
    }
  }

  private addOne(
    chatEntry: ChatEntry,
    danmakuElementComponent: DanmakuElementComponent
  ): void {
    danmakuElementComponent.setContent(chatEntry);
    let elementHeight = danmakuElementComponent.height;
    while (this.occupied.length < Math.max(elementHeight, this.canvasHeight)) {
      this.occupied.push(0);
    }

    let score = 0;
    for (let i = 0; i < elementHeight; i++) {
      score += this.occupied[i];
    }

    let minScore = score;
    let minY = elementHeight - 1;
    for (let i = elementHeight; i < this.canvasHeight; i++) {
      score -= this.occupied[i - elementHeight];
      score += this.occupied[i];
      if (score < minScore) {
        minScore = score;
        minY = i;
      }
    }

    let posY = minY - elementHeight + 1;
    for (let i = posY; i < posY + elementHeight; i++) {
      this.occupied[i]++;
    }

    danmakuElementComponent.startMoving(posY);
    this.elementsOccupying.pushBack(danmakuElementComponent);
  }

  public addOneForce(chatEntry: ChatEntry): void {
    this.createOneIdleElement();
    this.addOne(chatEntry, this.elementsIdle.pop());
  }

  public moveOneFrame(deltaTime: number /* ms */): void {
    for (let it = this.elementsDisplaying.createLeftIterator(); !it.isEnd(); ) {
      let danmakuElementComponent = it.getValue();
      let result = danmakuElementComponent.moveOneFrame(
        deltaTime,
        this.canvasWidth
      );
      if (result === MoveResult.End) {
        danmakuElementComponent.hide();
        this.elementsIdle.push(danmakuElementComponent);
        it.removeAndNext();
      } else {
        it.next();
      }
    }
    for (let it = this.elementsOccupying.createLeftIterator(); !it.isEnd(); ) {
      let danmakuElementComponent = it.getValue();
      let result = danmakuElementComponent.moveOneFrame(
        deltaTime,
        this.canvasWidth
      );
      if (result === MoveResult.End || result === MoveResult.Display) {
        for (
          let i = danmakuElementComponent.posY;
          i < danmakuElementComponent.posY + danmakuElementComponent.height;
          i++
        ) {
          this.occupied[i]--;
        }
      }

      if (result === MoveResult.End) {
        danmakuElementComponent.hide();
        this.elementsIdle.push(danmakuElementComponent);
        it.removeAndNext();
      } else if (result === MoveResult.Display) {
        this.elementsDisplaying.pushBack(danmakuElementComponent);
        it.removeAndNext();
      } else {
        it.next();
      }
    }
  }

  public refreshDisplay(): void {
    this.refreshIdleElements();

    if (this.playerSettings.displaySettings.enable) {
      DanmakuCanvasController.renderList(this.elementsOccupying);
      DanmakuCanvasController.renderList(this.elementsDisplaying);
    } else {
      this.clear();
    }
  }

  private static renderList(
    linkedList: LinkedList<DanmakuElementComponent>
  ): void {
    for (
      let iter = linkedList.createLeftIterator();
      !iter.isEnd();
      iter.next()
    ) {
      iter.getValue().render();
    }
  }

  public refreshBlocked(): void {
    for (let it = this.elementsOccupying.createLeftIterator(); !it.isEnd(); ) {
      let danmakuElementComponent = it.getValue();
      if (danmakuElementComponent.isBlocked()) {
        for (
          let i = danmakuElementComponent.posY;
          i < danmakuElementComponent.posY + danmakuElementComponent.height;
          i++
        ) {
          this.occupied[i]--;
        }
        danmakuElementComponent.hide();
        this.elementsIdle.push(danmakuElementComponent);
        it.removeAndNext();
      } else {
        it.next();
      }
    }
    for (let it = this.elementsDisplaying.createLeftIterator(); !it.isEnd(); ) {
      let danmakuElementComponent = it.getValue();
      if (danmakuElementComponent.isBlocked()) {
        danmakuElementComponent.hide();
        this.elementsIdle.push(danmakuElementComponent);
        it.removeAndNext();
      } else {
        it.next();
      }
    }
  }

  public clear(): void {
    for (let i = 0; i < this.occupied.length; i++) {
      this.occupied[i] = 0;
    }
    this.clearList(this.elementsOccupying);
    this.clearList(this.elementsDisplaying);
  }

  private clearList(linkedList: LinkedList<DanmakuElementComponent>): void {
    for (
      let iter = linkedList.createLeftIterator();
      !iter.isEnd();
      iter.next()
    ) {
      let danmakuElementComponent = iter.getValue();
      danmakuElementComponent.hide();
      this.elementsIdle.push(danmakuElementComponent);
    }
    linkedList.clear();
  }
}
