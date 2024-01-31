import { ChatEntry, HostApp } from "../../../interface/chat_entry";
import { PlayerSettings } from "../../../interface/player_settings";
import {
  GET_CHAT,
  GetChatRequest,
  GetChatResponse,
  POST_CHAT,
  PostChatRequest,
  PostChatResponse,
} from "../../../interface/service";
import { SERVICE_CLIENT } from "../common/service_client";
import {
  ChatPool,
  StructuredChatPool,
  TwitchChatPool,
  YouTubeChatPool,
} from "./chat_pool";
import { GlobalDocuments } from "./common/global_documents";
import { ControlPanelComponent } from "./control_panel_component";
import {
  ControlPanelDocker,
  ControlPanelOneTimePrepender,
  ControlPanelPeriodicPrepender,
} from "./control_panel_docker";
import { DanmakuCanvasController } from "./danmaku_canvas/danmaku_canvas_controller";
import {
  CrunchyrollVideoIdExtractor,
  NoopVideoIdExtractor,
  VideoIdExtractor,
  YouTubeVideoIdExtractor,
} from "./video_id_extractor";
import { OnceCaller } from "@selfage/once/caller";
import { ServiceClient } from "@selfage/service_client";

export class BodyController {
  private static HAVE_NOTHING = 0;

  private videoId: string;
  private nextFrameId: number;
  private playerOnce = new OnceCaller(() => this.play());

  public constructor(
    private video: HTMLVideoElement,
    private documentBody: HTMLElement,
    private danmakuCanvasController: DanmakuCanvasController,
    private controlPanelComponent: ControlPanelComponent,
    private controlPanelDocker: ControlPanelDocker,
    private chatPool: ChatPool,
    private videoIdExtractor: VideoIdExtractor,
    private serviceClient: ServiceClient,
    private window: Window,
    private hostApp?: HostApp
  ) {}

  public static createYouTubeStructured(
    video: HTMLVideoElement,
    canvas: HTMLElement,
    anchorButtonElement: Element,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings
  ): BodyController {
    let controlPanelComponent = ControlPanelComponent.createYouTubeStructured(
      globalDocuments,
      playerSettings
    );
    return BodyController.create(
      video,
      DanmakuCanvasController.createStructured(canvas, playerSettings),
      controlPanelComponent,
      ControlPanelOneTimePrepender.create(
        controlPanelComponent.body,
        anchorButtonElement
      ),
      StructuredChatPool.create(playerSettings.blockSettings),
      YouTubeVideoIdExtractor.create(canvas),
      HostApp.YouTube
    );
  }

  public static createYouTubeChat(
    video: HTMLVideoElement,
    canvas: HTMLElement,
    anchorButtonElement: Element,
    chatContainer: Element,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings
  ): BodyController {
    let controlPanelComponent = ControlPanelComponent.createYouTubeChat(
      globalDocuments,
      playerSettings
    );
    return BodyController.create(
      video,
      DanmakuCanvasController.createYouTube(canvas, playerSettings),
      controlPanelComponent,
      ControlPanelOneTimePrepender.create(
        controlPanelComponent.body,
        anchorButtonElement
      ),
      YouTubeChatPool.create(chatContainer, playerSettings.blockSettings),
      NoopVideoIdExtractor.create()
    );
  }

  public static createTwitchVideo(
    video: HTMLVideoElement,
    canvas: HTMLElement,
    anchorButtonElement: Element,
    chatContainer: Element,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings
  ): BodyController {
    let controlPanelComponent = ControlPanelComponent.createTwitchVideo(
      globalDocuments,
      playerSettings
    );
    return BodyController.create(
      video,
      DanmakuCanvasController.createTwitch(canvas, playerSettings),
      controlPanelComponent,
      ControlPanelOneTimePrepender.create(
        controlPanelComponent.body,
        anchorButtonElement
      ),
      TwitchChatPool.create(chatContainer, playerSettings.blockSettings),
      NoopVideoIdExtractor.create()
    );
  }

  public static createTwitchLive(
    video: HTMLVideoElement,
    canvas: HTMLElement,
    anchorButtonElement: Element,
    chatContainer: Element,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings
  ): BodyController {
    let controlPanelComponent = ControlPanelComponent.createTwitchLive(
      globalDocuments,
      playerSettings
    );
    return BodyController.create(
      video,
      DanmakuCanvasController.createTwitch(canvas, playerSettings),
      controlPanelComponent,
      ControlPanelOneTimePrepender.create(
        controlPanelComponent.body,
        anchorButtonElement
      ),
      TwitchChatPool.create(chatContainer, playerSettings.blockSettings),
      NoopVideoIdExtractor.create()
    );
  }

  public static createCrunchyroll(
    video: HTMLVideoElement,
    canvas: HTMLElement,
    anchorButtonSelector: string,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings
  ): BodyController {
    let controlPanelComponent = ControlPanelComponent.createCrunchyroll(
      globalDocuments,
      playerSettings
    );
    return BodyController.create(
      video,
      DanmakuCanvasController.createStructured(canvas, playerSettings),
      controlPanelComponent,
      ControlPanelPeriodicPrepender.create(
        controlPanelComponent.body,
        anchorButtonSelector
      ),
      StructuredChatPool.create(playerSettings.blockSettings),
      CrunchyrollVideoIdExtractor.create(),
      HostApp.Crunchyroll
    );
  }

  private static create(
    video: HTMLVideoElement,
    danmakuCanvasController: DanmakuCanvasController,
    controlPanelComponent: ControlPanelComponent,
    controlPanelDocker: ControlPanelDocker,
    chatPool: ChatPool,
    videoIdExtractor: VideoIdExtractor,
    hostApp?: HostApp
  ): BodyController {
    return new BodyController(
      video,
      document.body,
      danmakuCanvasController,
      controlPanelComponent,
      controlPanelDocker,
      chatPool,
      videoIdExtractor,
      SERVICE_CLIENT,
      window,
      hostApp
    ).init();
  }

  public init(): this {
    this.video.onplay = () => this.playerOnce.call();
    this.video.onpause = () => this.pause();
    this.video.onended = () => this.reset();
    if (this.hostApp) {
      this.video.onloadedmetadata = () => this.switchVideo();
      this.video.onseeking = () => this.reset();
      this.video.onseeked = () => this.playerOnce.call();
      this.controlPanelComponent.on("fire", (chatEntry) =>
        this.fire(chatEntry)
      );
    }
    this.controlPanelComponent.on("updateDisplay", () => this.refreshDisplay());
    this.controlPanelComponent.on("updateBlocked", () => this.refreshBlocked());

    // Video can be loaded and started because it is completely async for content script.
    if (this.video.readyState > BodyController.HAVE_NOTHING && this.hostApp) {
      this.window.setTimeout(() => this.switchVideo(), 0);
    }
    if (!this.video.paused && !this.video.ended && !this.video.seeking) {
      this.window.setTimeout(() => this.playerOnce.call(), 0);
    }

    this.documentBody.addEventListener("keydown", (event) =>
      this.handleKeyDown(event)
    );
    return this;
  }

  private play(): void {
    this.chatPool.start(this.getCurrentTimestamp());
    this.requestNextFrame();
    this.danmakuCanvasController.play();
  }

  private getCurrentTimestamp(): number {
    return this.video.currentTime * 1000;
  }

  private requestNextFrame(): void {
    this.nextFrameId = this.window.requestAnimationFrame(this.animationCycle);
  }

  private animationCycle = (): void => {
    let videoTimestamp = this.getCurrentTimestamp();
    let chatEntries = this.chatPool.read(videoTimestamp);
    this.controlPanelComponent.addChat(chatEntries);
    this.danmakuCanvasController.addEntries(chatEntries);
    this.requestNextFrame();
  };

  private pause(): void {
    this.window.cancelAnimationFrame(this.nextFrameId);
    this.playerOnce.reset();
    this.danmakuCanvasController.pause();
  }

  private reset(): void {
    this.pause();
    this.clearDisplay();
  }

  private clearDisplay(): void {
    this.controlPanelComponent.clearChat();
    this.danmakuCanvasController.clear();
  }

  private async switchVideo(): Promise<void> {
    this.clearDisplay();
    this.chatPool.clear();
    this.videoId = await this.videoIdExtractor.extract();
    if (!this.videoId) {
      return;
    }

    let videoIdBeforeLoad = this.videoId;
    let response = await this.serviceClient.fetchUnauthed<
      GetChatRequest,
      GetChatResponse
    >(
      {
        hostApp: this.hostApp,
        hostContentId: this.videoId,
      },
      GET_CHAT
    );
    if (videoIdBeforeLoad !== this.videoId) {
      return;
    }

    this.chatPool.fill(response.chatEntries);
  }

  private async fire(chatEntry: ChatEntry): Promise<void> {
    if (!this.videoId) {
      throw new Error("No video id found yet.");
    }

    let timestamp = this.getCurrentTimestamp();
    chatEntry.timestamp = timestamp;
    chatEntry.hostApp = this.hostApp;
    chatEntry.hostContentId = this.videoId;

    let videoIdBeforeLoad = this.videoId;
    let response = await this.serviceClient.fetchAuthed<
      PostChatRequest,
      PostChatResponse
    >(
      {
        chatEntry: chatEntry,
      },
      POST_CHAT
    );
    if (videoIdBeforeLoad !== this.videoId) {
      return;
    }

    this.chatPool.fill([response.chatEntry]);
    this.controlPanelComponent.addChat([response.chatEntry]);
    this.danmakuCanvasController.addExtraEntry(response.chatEntry);
  }

  private refreshDisplay(): void {
    this.danmakuCanvasController.refreshDisplay();
  }

  private refreshBlocked(): void {
    this.danmakuCanvasController.refreshBlocked();
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.code === "KeyD") {
      this.controlPanelComponent.toggleEnableScrolling();
    }
  }

  public remove(): void {
    this.video.onplay = undefined;
    this.video.onpause = undefined;
    this.video.onended = undefined;
    this.video.onloadedmetadata = undefined;
    this.video.onseeking = undefined;
    this.video.onseeked = undefined;
    this.window.cancelAnimationFrame(this.nextFrameId);
    this.danmakuCanvasController.remove();
    this.controlPanelDocker.remove();
  }
}
