import { ChatEntry, HostApp } from "../../../interface/chat_entry";
import { PlayerSettings } from "../../../interface/player_settings";
import { newGetChatRequest, newPostChatRequest } from "../../client_requests";
import { ChatPool, OnPageChatPool, StructuredChatPool } from "./chat_pool";
import { ChatWindowToggler, NoopChatWindowToggler, YouTubeChatWindowToggler } from "./chat_window_toggler";
import { BlockPatternTester } from "./common/block_pattern_tester";
import { GlobalDocuments } from "./common/global_documents";
import { SERVICE_CLIENT } from "./common/service_client";
import { ControlPanel } from "./control_panel";
import {
  ControlPanelAttacher,
  ControlPanelOneTimeAttacher,
  ControlPanelPeriodicAttacher,
} from "./control_panel_attacher";
import { DanmakuCanvasController } from "./danmaku_canvas/danmaku_canvas_controller";
import {
  KickChatContentBuilder,
  StructuredContentBuilder,
  Twitch7tvChatContentBuilder,
  TwitchChatContentBuilder,
  YouTubeChatContentBuilder,
} from "./danmaku_canvas/danmaku_element_content_builder";
import {
  CrunchyrollVideoIdExtractor,
  NoopVideoIdExtractor,
  VideoIdExtractor,
  YouTubeVideoIdExtractor,
} from "./video_id_extractor";
import { WebServiceClient } from "@selfage/web_service_client";

export class PlayerController {
  public static createYouTubeStructured(
    video: HTMLVideoElement,
    canvas: HTMLElement,
    anchorButtonElement: Element,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings,
  ): PlayerController {
    let controlPanel = ControlPanel.createYouTubeStructured(
      globalDocuments,
      playerSettings,
    );
    return new PlayerController(
      window,
      SERVICE_CLIENT,
      video,
      DanmakuCanvasController.create(
        canvas,
        playerSettings,
        BlockPatternTester.createIdentity(playerSettings.blockSettings),
        new StructuredContentBuilder(),
      ),
      NoopChatWindowToggler.create(),
      controlPanel,
      ControlPanelOneTimeAttacher.create(controlPanel, anchorButtonElement),
      StructuredChatPool.create(playerSettings.blockSettings),
      YouTubeVideoIdExtractor.create(canvas),
      HostApp.YouTube,
    );
  }

  public static createYouTubeChat(
    video: HTMLVideoElement,
    canvas: HTMLElement,
    anchorButtonElement: Element,
    chatContainer: Element,
    chatWindowContainers: Array<HTMLElement>,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings,
  ): PlayerController {
    let controlPanel = ControlPanel.createYouTubeChat(
      globalDocuments,
      playerSettings,
    );
    return new PlayerController(
      window,
      SERVICE_CLIENT,
      video,
      DanmakuCanvasController.create(
        canvas,
        playerSettings,
        BlockPatternTester.createHtml(playerSettings.blockSettings),
        new YouTubeChatContentBuilder(),
      ),
      YouTubeChatWindowToggler.create(chatWindowContainers, playerSettings.displaySettings),
      controlPanel,
      ControlPanelOneTimeAttacher.create(controlPanel, anchorButtonElement),
      OnPageChatPool.create(chatContainer, playerSettings.blockSettings),
      NoopVideoIdExtractor.create(),
    );
  }

  public static createTwitch(
    video: HTMLVideoElement,
    canvas: HTMLElement,
    anchorButtonElement: Element,
    chatContainer: Element,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings,
  ): PlayerController {
    let controlPanel = ControlPanel.createTwitch(
      globalDocuments,
      playerSettings,
    );
    return new PlayerController(
      window,
      SERVICE_CLIENT,
      video,
      DanmakuCanvasController.create(
        canvas,
        playerSettings,
        BlockPatternTester.createHtml(playerSettings.blockSettings),
        new TwitchChatContentBuilder(),
      ),
      NoopChatWindowToggler.create(),
      controlPanel,
      ControlPanelOneTimeAttacher.create(controlPanel, anchorButtonElement),
      OnPageChatPool.create(chatContainer, playerSettings.blockSettings),
      NoopVideoIdExtractor.create(),
    );
  }

  public static createTwitch7tvLive(
    video: HTMLVideoElement,
    canvas: HTMLElement,
    anchorButtonElement: Element,
    chatContainer: Element,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings,
  ): PlayerController {
    let controlPanel = ControlPanel.createTwitch(
      globalDocuments,
      playerSettings,
    );
    return new PlayerController(
      window,
      SERVICE_CLIENT,
      video,
      DanmakuCanvasController.create(
        canvas,
        playerSettings,
        BlockPatternTester.createHtml(playerSettings.blockSettings),
        new Twitch7tvChatContentBuilder(),
      ),
      NoopChatWindowToggler.create(),
      controlPanel,
      ControlPanelOneTimeAttacher.create(controlPanel, anchorButtonElement),
      OnPageChatPool.create(chatContainer, playerSettings.blockSettings),
      NoopVideoIdExtractor.create(),
    );
  }

  public static createKick(
    video: HTMLVideoElement,
    canvas: HTMLElement,
    chatContainer: Element,
    anchorElementSelectFn: () => HTMLElement,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings,
  ): PlayerController {
    let controlPanel = ControlPanel.createKick(globalDocuments, playerSettings);
    return new PlayerController(
      window,
      SERVICE_CLIENT,
      video,
      DanmakuCanvasController.create(
        canvas,
        playerSettings,
        BlockPatternTester.createHtml(playerSettings.blockSettings),
        new KickChatContentBuilder(),
      ),
      NoopChatWindowToggler.create(),
      controlPanel,
      ControlPanelPeriodicAttacher.create(controlPanel, anchorElementSelectFn),
      OnPageChatPool.create(chatContainer, playerSettings.blockSettings),
      NoopVideoIdExtractor.create(),
    );
  }

  public static createCrunchyroll(
    video: HTMLVideoElement,
    canvas: HTMLElement,
    anchorElementSelectFn: () => HTMLElement,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings,
  ): PlayerController {
    let controlPanel = ControlPanel.createCrunchyroll(
      globalDocuments,
      playerSettings,
    );
    return new PlayerController(
      window,
      SERVICE_CLIENT,
      video,
      DanmakuCanvasController.create(
        canvas,
        playerSettings,
        BlockPatternTester.createIdentity(playerSettings.blockSettings),
        new StructuredContentBuilder(),
      ),
      NoopChatWindowToggler.create(),
      controlPanel,
      ControlPanelPeriodicAttacher.create(controlPanel, anchorElementSelectFn),
      StructuredChatPool.create(playerSettings.blockSettings),
      CrunchyrollVideoIdExtractor.create(),
      HostApp.Crunchyroll,
    );
  }

  private static HAVE_NOTHING = 0;

  private videoId: string;
  private addChatsCycleId: number;

  public constructor(
    private window: Window,
    private serviceClient: WebServiceClient,
    private video: HTMLVideoElement,
    private danmakuCanvasController: DanmakuCanvasController,
    private chatWindowToggler: ChatWindowToggler,
    private controlPanel: ControlPanel,
    private controlPanelAttacher: ControlPanelAttacher,
    private chatPool: ChatPool,
    private videoIdExtractor: VideoIdExtractor,
    private hostApp?: HostApp,
  ) {
    this.controlPanelAttacher.start();

    this.video.onplaying = () => this.play();
    this.video.onpause = () => this.pause();
    this.video.onended = () => this.clear();
    if (!this.video.paused && !this.video.ended && !this.video.seeking) {
      this.window.setTimeout(() => this.play(), 0);
    }
    if (this.hostApp) {
      this.video.onseeking = () => this.clear();
      this.video.onloadedmetadata = () => this.switchVideo();
      // Video can be loaded and started because it is completely async for content script.
      if (this.video.readyState > PlayerController.HAVE_NOTHING) {
        this.window.setTimeout(() => this.switchVideo(), 0);
      }
      this.controlPanel.on("fire", (chatEntry) => this.fire(chatEntry));
    }
    this.controlPanel.on("updateDisplaySettings", () =>
      this.updateDisplaySettings(),
    );
    this.controlPanel.on("updateBlockSettings", () =>
      this.updateBlockSettings(),
    );
  }

  private play(): void {
    this.chatPool.start(this.getCurrentTimestamp());
    this.addChatsPeriodic();
    this.danmakuCanvasController.play();
  }

  private addChatsPeriodic = (): void => {
    let videoTimestamp = this.getCurrentTimestamp();
    let chatEntries = this.chatPool.read(videoTimestamp);
    this.controlPanel.addChats(chatEntries);
    this.danmakuCanvasController.add(chatEntries);
    this.addChatsCycleId = this.window.requestAnimationFrame(
      this.addChatsPeriodic,
    );
  };

  private getCurrentTimestamp(): number {
    return this.video.currentTime * 1000;
  }

  private pause(): void {
    this.window.cancelAnimationFrame(this.addChatsCycleId);
    this.danmakuCanvasController.pause();
  }

  private clear(): void {
    this.pause();
    this.clearChats();
  }

  private clearChats(): void {
    this.controlPanel.clearChats();
    this.danmakuCanvasController.clear();
  }

  private async switchVideo(): Promise<void> {
    this.clearChats();
    this.chatPool.clear();
    this.videoId = await this.videoIdExtractor.extract();
    if (!this.videoId) {
      return;
    }

    let videoIdBeforeLoad = this.videoId;
    let response = await this.serviceClient.send(
      newGetChatRequest({
        hostApp: this.hostApp,
        hostContentId: this.videoId,
      }),
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
    let response = await this.serviceClient.send(
      newPostChatRequest({
        chatEntry: chatEntry,
      }),
    );
    if (videoIdBeforeLoad !== this.videoId) {
      return;
    }

    this.chatPool.fill([response.chatEntry]);
    this.controlPanel.addChats([response.chatEntry]);
    this.danmakuCanvasController.add([response.chatEntry]);
  }

  private updateDisplaySettings(): void {
    this.danmakuCanvasController.updateDisplaySettings();
    this.chatWindowToggler.updateDisplaySettings();
  }

  private updateBlockSettings(): void {
    this.danmakuCanvasController.updateBlockSettings();
  }

  public remove(): void {
    this.video.onplaying = undefined;
    this.video.onpause = undefined;
    this.video.onended = undefined;
    this.video.onloadedmetadata = undefined;
    this.video.onseeking = undefined;
    this.pause();
    this.danmakuCanvasController.remove();
    this.controlPanel.remove();
    this.controlPanelAttacher.stop();
  }
}
