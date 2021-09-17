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
import {
  ChatPool,
  StructuredChatPool,
  TwitchLiveChatPool,
  TwitchVideoChatPool,
  YouTubeChatPool,
} from "./chat_pool";
import { ControlPanelComponent } from "./control_panel_component";
import { DanmakuCanvasController } from "./danmaku_canvas/danmaku_canvas_controller";
import { GlobalDocuments } from "./global_documents";
import { SERVICE_CLIENT } from "./service_client";
import {
  CrunchyrollVideoIdExtractor,
  NoopVideoIdExtractor,
  VideoIdExtractor,
  YouTubeVideoIdExtractor,
} from "./video_id_extractor";
import { ServiceClient } from "@selfage/service_client";

export class BodyController {
  private static HAVE_NOTHING = 0;
  private static CYCLE_INTERVAL = 200; // ms

  private videoId: string;
  private nextCycleId: number;
  private nextFrameId: number;
  private lastTime: number = 0; // ms

  public constructor(
    private video: HTMLVideoElement,
    private buttonsContainer: Element,
    private danmakuCanvasController: DanmakuCanvasController,
    private controlPanelComponent: ControlPanelComponent,
    private chatPool: ChatPool,
    private videoIdExtractor: VideoIdExtractor,
    private serviceClient: ServiceClient,
    private window: Window,
    private date: DateConstructor,
    private hostApp?: HostApp
  ) {}

  public static createYouTubeStructured(
    video: HTMLVideoElement,
    canvas: HTMLElement,
    buttonsContainer: Element,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings
  ): BodyController {
    return BodyController.create(
      video,
      buttonsContainer,
      DanmakuCanvasController.createStructured(canvas, playerSettings),
      ControlPanelComponent.createYouTubeStructured(
        globalDocuments,
        playerSettings
      ),
      StructuredChatPool.create(playerSettings.blockSettings),
      YouTubeVideoIdExtractor.create(canvas),
      HostApp.YouTube
    );
  }

  public static createYouTubeChat(
    video: HTMLVideoElement,
    canvas: HTMLElement,
    buttonsContainer: Element,
    chatContainer: Element,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings
  ): BodyController {
    return BodyController.create(
      video,
      buttonsContainer,
      DanmakuCanvasController.createYouTube(canvas, playerSettings),
      ControlPanelComponent.createYouTubeChat(globalDocuments, playerSettings),
      YouTubeChatPool.create(chatContainer, playerSettings.blockSettings),
      NoopVideoIdExtractor.create()
    );
  }

  public static createTwitchVideo(
    video: HTMLVideoElement,
    canvas: HTMLElement,
    buttonsContainer: Element,
    chatContainer: Element,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings
  ): BodyController {
    return BodyController.create(
      video,
      buttonsContainer,
      DanmakuCanvasController.createTwitch(canvas, playerSettings),
      ControlPanelComponent.createTwitchVideo(globalDocuments, playerSettings),
      TwitchVideoChatPool.create(chatContainer, playerSettings.blockSettings),
      NoopVideoIdExtractor.create()
    );
  }

  public static createTwitchLive(
    video: HTMLVideoElement,
    canvas: HTMLElement,
    buttonsContainer: Element,
    chatContainer: Element,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings
  ): BodyController {
    return BodyController.create(
      video,
      buttonsContainer,
      DanmakuCanvasController.createTwitch(canvas, playerSettings),
      ControlPanelComponent.createTwitchLive(globalDocuments, playerSettings),
      TwitchLiveChatPool.create(chatContainer, playerSettings.blockSettings),
      NoopVideoIdExtractor.create()
    );
  }

  public static createCrunchyroll(
    video: HTMLVideoElement,
    canvas: HTMLElement,
    buttonsContainer: Element,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings
  ): BodyController {
    return BodyController.create(
      video,
      buttonsContainer,
      DanmakuCanvasController.createStructured(canvas, playerSettings),
      ControlPanelComponent.createCrunchyroll(globalDocuments, playerSettings),
      StructuredChatPool.create(playerSettings.blockSettings),
      CrunchyrollVideoIdExtractor.create(),
      HostApp.Crunchyroll
    );
  }

  private static create(
    video: HTMLVideoElement,
    buttonsContainer: Element,
    danmakuCanvasController: DanmakuCanvasController,
    controlPanelComponent: ControlPanelComponent,
    chatPool: ChatPool,
    videoIdExtractor: VideoIdExtractor,
    hostApp?: HostApp
  ): BodyController {
    return new BodyController(
      video,
      buttonsContainer,
      danmakuCanvasController,
      controlPanelComponent,
      chatPool,
      videoIdExtractor,
      SERVICE_CLIENT,
      window,
      Date,
      hostApp
    ).init();
  }

  public init(): this {
    this.buttonsContainer.appendChild(this.controlPanelComponent.body);

    this.video.onplay = () => this.start();
    this.video.onpause = () => this.pause();
    this.video.onended = () => this.reset();
    if (this.hostApp) {
      this.video.onloadedmetadata = () => this.switchVideo();
      this.video.onseeking = () => this.reset();
      this.video.onseeked = () => this.start();
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
      this.window.setTimeout(() => this.start(), 0);
    }
    return this;
  }

  private start(): void {
    if (this.nextCycleId !== undefined || this.nextFrameId !== undefined) {
      return;
    }

    this.chatPool.start(this.getCurrentTimestamp());
    this.lastTime = this.date.now();
    this.requestNextCyle();
    this.requestNextFrame();
  }

  private getCurrentTimestamp(): number {
    return this.video.currentTime * 1000;
  }

  private requestNextCyle(): void {
    this.nextCycleId = this.window.setTimeout(
      this.cycle,
      BodyController.CYCLE_INTERVAL
    );
  }

  private cycle = (): void => {
    let videoTimestamp = this.getCurrentTimestamp();
    let chatEntries = this.chatPool.read(videoTimestamp);
    this.controlPanelComponent.addChat(chatEntries);
    this.danmakuCanvasController.addPerCycle(chatEntries);
    this.requestNextCyle();
  };

  private requestNextFrame(): void {
    this.nextFrameId = this.window.requestAnimationFrame(this.moveOneFrame);
  }

  private moveOneFrame = (): void => {
    let currentTime = this.date.now();
    let deltaTime = currentTime - this.lastTime;
    this.danmakuCanvasController.moveOneFrame(deltaTime);
    this.lastTime = currentTime;
    this.requestNextFrame();
  };

  private pause(): void {
    this.window.clearTimeout(this.nextCycleId);
    this.window.cancelAnimationFrame(this.nextFrameId);
    this.nextCycleId = undefined;
    this.nextFrameId = undefined;
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
    this.danmakuCanvasController.addOneForce(response.chatEntry);
  }

  private refreshDisplay(): void {
    this.danmakuCanvasController.refreshDisplay();
  }

  private refreshBlocked(): void {
    this.danmakuCanvasController.refreshBlocked();
  }

  public remove(): void {
    this.video.onplay = undefined;
    this.video.onpause = undefined;
    this.video.onended = undefined;
    this.video.onloadedmetadata = undefined;
    this.video.onseeking = undefined;
    this.video.onseeked = undefined;
    this.reset();
    this.controlPanelComponent.remove();
    this.danmakuCanvasController.remove();
  }
}
