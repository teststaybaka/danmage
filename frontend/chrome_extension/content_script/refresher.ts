import { PlayerSettings } from "../../../interface/player_settings";
import { GlobalDocuments } from "./common/global_documents";
import { PlayerController } from "./player_controller";

export interface Assembler {
  queryElements: () => Element[];
  assemble: () => void;
  remove: () => void;
}

export class YouTubeAssembler implements Assembler {
  public assemble: () => void;
  private canvas: HTMLElement;
  private video: HTMLVideoElement;
  private chatContainer: Element;
  private anchorButtonElement: Element;
  private iframeDocument: Document;
  private playController: PlayerController;

  public constructor(private playerSettings: PlayerSettings) {}

  public queryElements(): Element[] {
    this.canvas = document.getElementById("movie_player");
    this.video = document.getElementsByTagName("video")[0];
    let chatFrame = document.getElementById("chatframe") as HTMLIFrameElement;
    if (!chatFrame) {
      this.anchorButtonElement = document.querySelector(
        ".ytp-right-controls > .ytp-settings-button",
      );
      this.assemble = this.assembleStructured;
      return [this.canvas, this.video, this.anchorButtonElement];
    } else {
      this.iframeDocument = chatFrame.contentDocument;
      this.chatContainer = this.iframeDocument.querySelector("#chat #items");
      this.anchorButtonElement = this.iframeDocument.querySelector(
        "#live-chat-header-context-menu",
      );
      this.assemble = this.assembleChat;
      return [
        this.canvas,
        this.video,
        this.chatContainer,
        this.anchorButtonElement,
      ];
    }
  }

  public assembleStructured(): void {
    this.playController = PlayerController.createYouTubeStructured(
      this.video,
      this.canvas,
      this.anchorButtonElement,
      GlobalDocuments.create([document]),
      this.playerSettings,
    );
  }

  public assembleChat(): void {
    this.playController = PlayerController.createYouTubeChat(
      this.video,
      this.canvas,
      this.anchorButtonElement,
      this.chatContainer,
      GlobalDocuments.create([document, this.iframeDocument]),
      this.playerSettings,
    );
  }

  public remove(): void {
    if (this.playController) {
      this.playController.remove();
      this.playController = undefined;
    }
  }
}

export class TwitchAssembler implements Assembler {
  public assemble: () => void;
  private canvas: HTMLElement;
  private video: HTMLVideoElement;
  private chatContainer: Element;
  private anchorButtonElement: Element;
  private playController: PlayerController;

  public constructor(private playerSettings: PlayerSettings) {
    document.documentElement.style.fontSize = "62.5%";
  }

  public queryElements(): Element[] {
    this.canvas = document.querySelector(".video-player__container");
    this.video = document.getElementsByTagName("video")[0];
    this.chatContainer = document.querySelector(
      ".chat-scrollable-area__message-container",
    );
    if (!this.chatContainer) {
      this.chatContainer = document.querySelector(
        ".video-chat__message-list-wrapper ul",
      );
      this.anchorButtonElement = document.querySelector(
        ".video-chat__header > span",
      );
      this.assemble = this.assembleVideo;
    } else {
      this.anchorButtonElement = document.querySelector(
        ".chat-input__buttons-container > div:last-child > div:last-child",
      );
      this.assemble = this.assembleLive;
    }
    return [
      this.canvas,
      this.video,
      this.chatContainer,
      this.anchorButtonElement,
    ];
  }

  public assembleVideo(): void {
    this.playController = PlayerController.createTwitchVideo(
      this.video,
      this.canvas,
      this.anchorButtonElement,
      this.chatContainer,
      GlobalDocuments.create([document]),
      this.playerSettings,
    );
  }

  public assembleLive(): void {
    this.playController = PlayerController.createTwitchLive(
      this.video,
      this.canvas,
      this.anchorButtonElement,
      this.chatContainer,
      GlobalDocuments.create([document]),
      this.playerSettings,
    );
  }

  public remove(): void {
    if (this.playController) {
      this.playController.remove();
      this.playController = undefined;
    }
  }
}

export class CrunchyrollAssembler implements Assembler {
  private canvas: HTMLElement;
  private video: HTMLVideoElement;
  private playController: PlayerController;

  public constructor(private playerSettings: PlayerSettings) {
    document.documentElement.style.fontSize = "62.5%";
  }

  public queryElements(): Element[] {
    this.canvas = document.querySelector("#velocity-player-package");
    this.video = document.querySelector("#player0") as HTMLVideoElement;
    return [this.canvas, this.video];
  }

  public assemble(): void {
    this.playController = PlayerController.createCrunchyroll(
      this.video,
      this.canvas,
      "#settingsControl",
      GlobalDocuments.create([document]),
      this.playerSettings,
    );
  }

  public remove(): void {
    if (this.playController) {
      this.playController.remove();
      this.playController = undefined;
    }
  }
}

enum ElementsComparisonResult {
  UNCHANGED,
  LACK_REQUIRED_ELEMENTS,
  CHANGED,
}

export class Refresher {
  public static createYouTube(playerSettings: PlayerSettings): Refresher {
    return new Refresher(new YouTubeAssembler(playerSettings), window);
  }

  public static createTwitch(playerSettings: PlayerSettings): Refresher {
    return new Refresher(new TwitchAssembler(playerSettings), window);
  }

  public static createCrunchyroll(playerSettings: PlayerSettings): Refresher {
    return new Refresher(new CrunchyrollAssembler(playerSettings), window);
  }

  private static REFRESH_INTERVAL = 500; // ms

  private lastElements: Element[] = [];

  public constructor(
    private assembler: Assembler,
    private window: Window,
  ) {
    this.window.setInterval(() => this.refresh(), Refresher.REFRESH_INTERVAL);
  }

  private refresh(): void {
    let newElements = this.assembler.queryElements();
    let comparisonResult = this.compareElements(newElements);
    switch (comparisonResult) {
      case ElementsComparisonResult.LACK_REQUIRED_ELEMENTS:
        this.assembler.remove();
        this.lastElements = [];
        break;
      case ElementsComparisonResult.CHANGED:
        this.assembler.remove();
        this.lastElements = newElements;
        this.assembler.assemble();
        break;
      default:
        break;
    }
  }

  private compareElements(newElements: Element[]): ElementsComparisonResult {
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
