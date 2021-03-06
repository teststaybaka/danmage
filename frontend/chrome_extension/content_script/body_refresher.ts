import { PlayerSettings } from "../../../interface/player_settings";
import {
  BodyAssembler,
  CrunchyrollBodyAssembler,
  TwitchBodyAssembler,
  YouTubeBodyAssembler,
} from "./body_assembler";
import { BodyController } from "./body_controller";

enum ElementsComparisonResult {
  UNCHANGED,
  LACK_REQUIRED_ELEMENTS,
  CHANGED,
}

export class BodyRefresher {
  private static REFRESH_INTERVAL = 500; // ms

  private lastElements: Element[] = [];
  private bodyController: BodyController;

  public constructor(
    private bodyAssembler: BodyAssembler,
    private window: Window
  ) {}

  public static createYouTube(playerSettings: PlayerSettings): BodyRefresher {
    return BodyRefresher.create(new YouTubeBodyAssembler(playerSettings));
  }

  public static createTwitch(playerSettings: PlayerSettings): BodyRefresher {
    return BodyRefresher.create(new TwitchBodyAssembler(playerSettings));
  }

  public static createCrunchyroll(
    playerSettings: PlayerSettings
  ): BodyRefresher {
    return BodyRefresher.create(new CrunchyrollBodyAssembler(playerSettings));
  }

  private static create(bodyAssembler: BodyAssembler): BodyRefresher {
    return new BodyRefresher(bodyAssembler, window).init();
  }

  public init(): this {
    this.window.setInterval(
      () => this.refresh(),
      BodyRefresher.REFRESH_INTERVAL
    );
    return this;
  }

  private refresh(): void {
    let newElements = this.bodyAssembler.queryElements();
    let comparisonResult = this.checkNewElements(newElements);
    switch (comparisonResult) {
      case ElementsComparisonResult.LACK_REQUIRED_ELEMENTS:
        if (this.bodyController) {
          this.bodyController.remove();
          this.bodyController = undefined;
        }
        this.lastElements = [];
        break;
      case ElementsComparisonResult.CHANGED:
        if (this.bodyController) {
          this.bodyController.remove();
          this.bodyController = undefined;
        }
        this.lastElements = newElements;
        this.bodyController = this.bodyAssembler.assemble();
        break;
      default:
        break;
    }
  }

  private checkNewElements(newElements: Element[]): ElementsComparisonResult {
    for (let element of newElements) {
      if (!element) {
        return ElementsComparisonResult.LACK_REQUIRED_ELEMENTS;
      }
    }

    if (this.lastElements.length !== newElements.length) {
      return ElementsComparisonResult.CHANGED;
    } else {
      for (let i = 0; i < this.lastElements.length; i++) {
        let element = this.lastElements[i];
        let newElement = newElements[i];
        if (element !== newElement) {
          return ElementsComparisonResult.CHANGED;
        }
      }
    }

    return ElementsComparisonResult.UNCHANGED;
  }
}
