import { ChatEntry } from "../../../../interface/chat_entry";
import { PlayerSettings } from "../../../../interface/player_settings";
import { LinkedList, LinkedNode } from "../linked_list";
import { DanmakuElementComponent } from "./danmaku_element_component";

export class DanmakuCanvasController {
  private static REFRESH_INTERVAL = 1000; // ms

  private canvasWidth: number;
  private canvasHeight: number;
  private refreshCanvasSizeCycleId: number;
  private occupied = new Array<number>();
  private elementsIdle = new Array<DanmakuElementComponent>();
  private elementsDisplaying = new LinkedList<DanmakuElementComponent>();

  public constructor(
    private canvas: HTMLElement,
    private playerSettings: PlayerSettings,
    private danmakuElementComponentFactoryFn: (
      playerSettings: PlayerSettings
    ) => DanmakuElementComponent,
    private window: Window
  ) {}

  public static createStructured(
    canvas: HTMLElement,
    playerSettings: PlayerSettings
  ): DanmakuCanvasController {
    return new DanmakuCanvasController(
      canvas,
      playerSettings,
      DanmakuElementComponent.createStructured,
      window
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
      window
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
      window
    ).init();
  }

  public init(): this {
    this.canvasWidth = this.canvas.offsetWidth;
    this.canvasHeight = this.canvas.offsetHeight;
    this.refreshIdleElements();
    this.requestRefreshCanvasSizeCycle();
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

  private requestRefreshCanvasSizeCycle(): void {
    this.refreshCanvasSizeCycleId = this.window.setTimeout(
      this.refreshCanvasSizeCycle,
      DanmakuCanvasController.REFRESH_INTERVAL
    );
  }

  // Cache width & height to save extra reflows.
  private refreshCanvasSizeCycle = (): void => {
    if (this.canvasWidth != this.canvas.offsetWidth) {
      this.canvasWidth = this.canvas.offsetWidth;
      this.elementsDisplaying.forEach((danmakuElementComponent) => {
        danmakuElementComponent.refreshCanvasSize(this.canvasWidth);
      });
    }
    this.canvasHeight = this.canvas.offsetHeight;
    this.requestRefreshCanvasSizeCycle();
  };

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
    danmakuElementComponent.setContent(chatEntry);
    let elementHeight = danmakuElementComponent.heightOriginal;
    while (this.occupied.length < Math.max(elementHeight, this.canvasHeight)) {
      this.occupied.push(0);
    }

    let score = 0;
    let i = 0;
    for (; i < elementHeight; i++) {
      score += this.occupied[i];
    }
    for (; i < this.canvasHeight && score > 0; i++) {
      score -= this.occupied[i - elementHeight];
      score += this.occupied[i];
    }
    if (score > 0) {
      danmakuElementComponent.clear();
      return;
    }

    let posY = i - elementHeight;
    for (let j = posY; j < posY + elementHeight; j++) {
      this.occupied[j]++;
    }
    this.elementsIdle.pop();
    let node = this.elementsDisplaying.pushBack(danmakuElementComponent);
    danmakuElementComponent.start(posY, this.canvasWidth);
    danmakuElementComponent.once("occupationEnded", () =>
      this.releaseOccupied(danmakuElementComponent)
    );
    danmakuElementComponent.once("displayEnded", () => this.returnToIdle(node));
  }

  private releaseOccupied(
    danmakuElementComponent: DanmakuElementComponent
  ): void {
    for (
      let i = danmakuElementComponent.posYOriginal;
      i <
      danmakuElementComponent.posYOriginal +
        danmakuElementComponent.heightOriginal;
      i++
    ) {
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
    this.refreshCanvasSizeCycle();
    this.elementsDisplaying.forEach((danmakuElementComponent) => {
      danmakuElementComponent.play(this.canvasWidth);
    });
  }

  public pause(): void {
    this.window.clearTimeout(this.refreshCanvasSizeCycleId);
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
