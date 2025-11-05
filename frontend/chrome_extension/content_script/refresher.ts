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
  private chatWindowContainer1: HTMLElement;
  private chatWindowContainer2: HTMLElement;
  private playController: PlayerController;

  public constructor(private playerSettings: PlayerSettings) {}

  public queryElements(): Element[] {
    this.canvas = document.getElementById("movie_player");
    this.video = document.getElementsByTagName("video")[0];
    this.anchorButtonElement = document.querySelector(".ytp-settings-button");
    let chatIframe = document.getElementById("chatframe") as HTMLIFrameElement;
    if (!chatIframe) {
      this.assemble = this.assembleStructured;
      return [this.canvas, this.video, this.anchorButtonElement];
    } else {
      this.iframeDocument = chatIframe.contentDocument;
      this.chatContainer = this.iframeDocument.querySelector("#chat #items");
      this.chatWindowContainer1 = document.getElementById("chat-container");
      this.chatWindowContainer2 = document.getElementById(
        "panels-full-bleed-container",
      );
      this.assemble = this.assembleChat;
      return [
        this.canvas,
        this.video,
        this.chatContainer,
        this.anchorButtonElement,
        this.chatWindowContainer1,
        this.chatWindowContainer2,
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
      [this.chatWindowContainer1, this.chatWindowContainer2],
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

  public constructor(private playerSettings: PlayerSettings) {}

  public queryElements(): Element[] {
    this.canvas = document.querySelector(".video-player__container");
    this.video = document.getElementsByTagName("video")[0];
    this.anchorButtonElement = document.querySelector(
      `[data-a-target="player-settings-button"]`,
    )?.parentElement?.parentElement?.parentElement?.parentElement;
    this.chatContainer = document.querySelector(
      ".chat-scrollable-area__message-container",
    );
    if (!this.chatContainer) {
      this.chatContainer = document.querySelector(`main.seventv-chat-list`);
      if (!this.chatContainer) {
        // Play back videos
        this.chatContainer = document.querySelector(
          ".video-chat__message-list-wrapper ul",
        );
        this.assemble = this.assembleVideo;
      } else {
        // Live 7tv chat
        this.assemble = this.assemble7tv;
      }
    } else {
      // Live Twitch chat
      this.assemble = this.assembleVideo;
    }
    return [
      this.canvas,
      this.video,
      this.chatContainer,
      this.anchorButtonElement,
    ];
  }

  public assembleVideo(): void {
    this.playController = PlayerController.createTwitch(
      this.video,
      this.canvas,
      this.anchorButtonElement,
      this.chatContainer,
      GlobalDocuments.create([document]),
      this.playerSettings,
    );
  }

  public assemble7tv(): void {
    this.playController = PlayerController.createTwitch7tvLive(
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

export class KickAssembler implements Assembler {
  private canvas: HTMLElement;
  private video: HTMLVideoElement;
  private chatContainer: Element;
  private playController: PlayerController;

  public constructor(private playerSettings: PlayerSettings) {}

  public queryElements(): Element[] {
    this.canvas = document.querySelector(
      "#injected-embedded-channel-player-video",
    )?.parentElement?.parentElement?.parentElement;
    this.video = document.getElementsByTagName("video")[0];
    this.chatContainer = document.querySelector("#chatroom-messages > div");
    return [this.canvas, this.video, this.chatContainer];
  }

  public assemble(): void {
    this.playController = PlayerController.createKick(
      this.video,
      this.canvas,
      this.chatContainer,
      () =>
        this.video?.nextElementSibling?.children?.[1]?.querySelector("button"),
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

  public constructor(private playerSettings: PlayerSettings) {}

  public queryElements(): Element[] {
    this.canvas = document.querySelector("#velocity-player-package");
    this.video = document.querySelector("#player0") as HTMLVideoElement;
    return [this.canvas, this.video];
  }

  public assemble(): void {
    this.playController = PlayerController.createCrunchyroll(
      this.video,
      this.canvas,
      () => document.querySelector("#settingsControl"),
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

  public static createKick(playerSettings: PlayerSettings): Refresher {
    return new Refresher(new KickAssembler(playerSettings), window);
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
    this.refresh();
  }

  private refresh = (): void => {
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
    this.window.setTimeout(this.refresh, Refresher.REFRESH_INTERVAL);
  };

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
