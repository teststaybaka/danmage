import { PlayerSettings } from "../../../interface/player_settings";
import { BodyController } from "./body_controller";
import { GlobalDocuments } from "./common/global_documents";

export interface BodyAssembler {
  queryElements: () => Element[];
  assemble: () => BodyController;
}

export class YouTubeBodyAssembler implements BodyAssembler {
  public assemble: () => BodyController;
  private canvas: HTMLElement;
  private video: HTMLVideoElement;
  private chatContainer: Element;
  private anchorButtonElement: Element;
  private iframeDocument: Document;

  public constructor(private playerSettings: PlayerSettings) {}

  public queryElements(): Element[] {
    this.canvas = document.getElementById("movie_player");
    this.video = document.getElementsByTagName("video")[0];
    let chatFrame = document.getElementById("chatframe") as HTMLIFrameElement;
    if (!chatFrame) {
      this.anchorButtonElement = document.querySelector(
        ".ytp-right-controls > .ytp-settings-button"
      );
      this.assemble = this.assembleStructured;
      return [this.canvas, this.video, this.anchorButtonElement];
    } else {
      this.iframeDocument = chatFrame.contentDocument;
      this.chatContainer = this.iframeDocument.querySelector("#chat #items");
      this.anchorButtonElement = this.iframeDocument.querySelector(
        "#chat-messages yt-icon-button#overflow"
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

  public assembleStructured(): BodyController {
    return BodyController.createYouTubeStructured(
      this.video,
      this.canvas,
      this.anchorButtonElement,
      new GlobalDocuments([document]),
      this.playerSettings
    );
  }

  public assembleChat(): BodyController {
    return BodyController.createYouTubeChat(
      this.video,
      this.canvas,
      this.anchorButtonElement,
      this.chatContainer,
      new GlobalDocuments([document, this.iframeDocument]),
      this.playerSettings
    );
  }
}

export class TwitchBodyAssembler implements BodyAssembler {
  public assemble: () => BodyController;
  private canvas: HTMLElement;
  private video: HTMLVideoElement;
  private chatContainer: Element;
  private anchorButtonElement: Element;

  public constructor(private playerSettings: PlayerSettings) {
    document.documentElement.style.fontSize = "62.5%";
  }

  public queryElements(): Element[] {
    this.canvas = document.querySelector(".video-player__container");
    this.video = document.getElementsByTagName("video")[0];
    this.chatContainer = document.querySelector(".chat-scrollable-area__message-container");
    if (!this.chatContainer) {
      this.chatContainer = document.querySelector(
        ".video-chat__message-list-wrapper ul"
      );
      this.anchorButtonElement = document.querySelector(
        ".video-chat__header > span"
      );
      this.assemble = this.assembleVideo;
    } else {
      this.anchorButtonElement = document.querySelector(
        ".chat-input__buttons-container > div:last-child > div:last-child"
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

  public assembleVideo(): BodyController {
    return BodyController.createTwitchVideo(
      this.video,
      this.canvas,
      this.anchorButtonElement,
      this.chatContainer,
      new GlobalDocuments([document]),
      this.playerSettings
    );
  }

  public assembleLive(): BodyController {
    return BodyController.createTwitchLive(
      this.video,
      this.canvas,
      this.anchorButtonElement,
      this.chatContainer,
      new GlobalDocuments([document]),
      this.playerSettings
    );
  }
}

export class CrunchyrollBodyAssembler implements BodyAssembler {
  private canvas: HTMLElement;
  private video: HTMLVideoElement;

  public constructor(private playerSettings: PlayerSettings) {
    document.documentElement.style.fontSize = "62.5%";
  }

  public queryElements(): Element[] {
    this.canvas = document.querySelector("#velocity-player-package");
    this.video = document.querySelector("#player0") as HTMLVideoElement;
    return [this.canvas, this.video];
  }

  public assemble(): BodyController {
    return BodyController.createCrunchyroll(
      this.video,
      this.canvas,
      "#settingsControl",
      new GlobalDocuments([document]),
      this.playerSettings
    );
  }
}
