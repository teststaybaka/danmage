import { PlayerSettings } from "../../../interface/player_settings";
import { BodyController } from "./body_controller";
import { GlobalDocuments } from "./global_documents";

export interface BodyAssembler {
  queryElements: () => Element[];
  assemble: () => BodyController;
}

export class YouTubeBodyAssembler implements BodyAssembler {
  public assemble: () => BodyController;
  private canvas: HTMLElement;
  private video: HTMLVideoElement;
  private chatContainer: HTMLElement;
  private buttonsContainer: HTMLElement;
  private iframeDocument: Document;

  public constructor(private playerSettings: PlayerSettings) {}

  public queryElements(): Element[] {
    this.canvas = document.getElementById("movie_player");
    this.video = document.getElementsByTagName("video")[0];
    let chatFrame = document.getElementById("chatframe") as HTMLIFrameElement;
    if (!chatFrame) {
      this.buttonsContainer = document.querySelector(".ytp-right-controls");
      this.assemble = this.assembleStructured;
      return [this.canvas, this.video, this.buttonsContainer];
    } else {
      this.iframeDocument = chatFrame.contentDocument;
      this.chatContainer = this.iframeDocument.querySelector("#chat #items");
      this.buttonsContainer = this.iframeDocument.querySelector(
        "#chat-messages > yt-live-chat-header-renderer"
      );
      this.assemble = this.assembleChat;
      return [
        this.canvas,
        this.video,
        this.chatContainer,
        this.buttonsContainer,
      ];
    }
  }

  public assembleStructured(): BodyController {
    return BodyController.createYouTubeStructured(
      this.video,
      this.canvas,
      this.buttonsContainer,
      new GlobalDocuments([document]),
      this.playerSettings
    );
  }

  public assembleChat(): BodyController {
    return BodyController.createYouTubeChat(
      this.video,
      this.canvas,
      this.buttonsContainer,
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
  private chatContainer: HTMLElement;
  private buttonsContainer: HTMLElement;

  public constructor(private playerSettings: PlayerSettings) {
    document.documentElement.style.fontSize = "62.5%";
  }

  public queryElements(): Element[] {
    this.canvas = document.querySelector(".video-player__container");
    this.video = document.getElementsByTagName("video")[0];
    this.chatContainer = document.querySelector("div[role=log]");
    if (!this.chatContainer) {
      this.chatContainer = document.querySelector(
        ".video-chat__message-list-wrapper ul"
      );
      this.buttonsContainer = document.querySelector(".video-chat__header");
      this.assemble = this.assembleVideo;
    } else {
      this.buttonsContainer = document.querySelector(
        ".chat-input__buttons-container > .tw-align-content-center"
      );
      this.assemble = this.assembleLive;
    }
    return [this.canvas, this.video, this.chatContainer, this.buttonsContainer];
  }

  public assembleVideo(): BodyController {
    return BodyController.createTwitchVideo(
      this.video,
      this.canvas,
      this.buttonsContainer,
      this.chatContainer,
      new GlobalDocuments([document]),
      this.playerSettings
    );
  }

  public assembleLive(): BodyController {
    return BodyController.createTwitchLive(
      this.video,
      this.canvas,
      this.buttonsContainer,
      this.chatContainer,
      new GlobalDocuments([document]),
      this.playerSettings
    );
  }
}

export class CrunchyrollBodyAssembler implements BodyAssembler {
  private canvas: HTMLElement;
  private video: HTMLVideoElement;
  private buttonsContainer: HTMLElement;

  public constructor(private playerSettings: PlayerSettings) {
    document.documentElement.style.fontSize = "62.5%";
  }

  public queryElements(): Element[] {
    this.canvas = document.body;
    this.video = document.getElementById(
      "player_html5_api"
    ) as HTMLVideoElement;
    this.buttonsContainer = document.querySelector(".vjs-control-bar");
    return [this.canvas, this.video, this.buttonsContainer];
  }

  public assemble(): BodyController {
    return BodyController.createCrunchyroll(
      this.video,
      this.canvas,
      this.buttonsContainer,
      new GlobalDocuments([document]),
      this.playerSettings
    );
  }
}
