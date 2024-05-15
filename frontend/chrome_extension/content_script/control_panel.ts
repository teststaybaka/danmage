import EventEmitter = require("events");
import { ChatEntry } from "../../../interface/chat_entry";
import { PlayerSettings } from "../../../interface/player_settings";
import { updatePlayerSettings } from "../../client_requests";
import { ColorScheme } from "../../color_scheme";
import { FONT_M } from "../../font_sizes";
import { PageNavigator } from "../../page_navigator";
import { SERVICE_CLIENT } from "../common/service_client";
import { AccountTab } from "./account_tab/account_tab";
import { BlockSettingsTab } from "./block_settings_tab/block_settings_tab";
import { ChatListTab } from "./chat_list_tab/chat_list_tab";
import { GlobalDocuments } from "./common/global_documents";
import { DisplaySettingsTab } from "./display_settings_tab/display_settings_tab";
import { E } from "@selfage/element/factory";
import { Ref, assign } from "@selfage/ref";
import { WebServiceClient } from "@selfage/web_service_client";

enum Tab {
  ACCOUNT = 1,
  CHAT_LIST = 2,
  DISPLAY_SETTINGS = 3,
  BLOCK_SETTINGS = 4,
}

export interface ControlPanel {
  on(
    event: "fire",
    listener: (chatEntry: ChatEntry) => Promise<void> | void,
  ): this;
  on(event: "updateDisplaySettings", listener: () => void): this;
  on(event: "updateBlockSettings", listener: () => void): this;
}

export class ControlPanel extends EventEmitter {
  public static createYouTubeStructured(
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings,
  ): ControlPanel {
    return new ControlPanel(
      `position: relative; height: 100%;`,
      "currentColor",
      "bottom: 100%; right: 0;",
      true,
      globalDocuments,
      playerSettings,
      SERVICE_CLIENT,
    );
  }

  public static createYouTubeChat(
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings,
  ): ControlPanel {
    return new ControlPanel(
      `position: relative; height: 4rem;`,
      "var(--yt-live-chat-header-button-color)",
      "top: 4rem; right: 0;",
      false,
      globalDocuments,
      playerSettings,
      SERVICE_CLIENT,
    );
  }

  public static createTwitchVideo(
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings,
  ): ControlPanel {
    return new ControlPanel(
      `position: absolute; height: 3rem; right: 1rem;`,
      "currentColor",
      "top: 3rem; right: 0;",
      false,
      globalDocuments,
      playerSettings,
      SERVICE_CLIENT,
    );
  }

  public static createTwitchLive(
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings,
  ): ControlPanel {
    return new ControlPanel(
      `position: relative; height: 3rem;`,
      "currentColor",
      "bottom: 3rem; right: 0;",
      false,
      globalDocuments,
      playerSettings,
      SERVICE_CLIENT,
    );
  }

  public static createCrunchyroll(
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings,
  ): ControlPanel {
    return new ControlPanel(
      `position: relative; height: 4rem;`,
      "white",
      "bottom: 4rem; right: 0;",
      true,
      globalDocuments,
      playerSettings,
      SERVICE_CLIENT,
    );
  }

  private static TAB_BUTTON_WIDTH = 2.4;
  private static WIDTH_TRANSITION_STYLE = "width .3s";

  public body: HTMLDivElement;
  private controlPanelButton = new Ref<HTMLDivElement>();
  private controlPanelPopup = new Ref<HTMLDivElement>();
  private tabHeadLine = new Ref<HTMLDivElement>();
  private accountTabHead = new Ref<HTMLDivElement>();
  private accountTabButton = new Ref<HTMLDivElement>();
  private chatListTabHead = new Ref<HTMLDivElement>();
  private chatListTabButton = new Ref<HTMLDivElement>();
  private displaySettingsTabHead = new Ref<HTMLDivElement>();
  private displaySettingsTabButton = new Ref<HTMLDivElement>();
  private blockSettingsTabHead = new Ref<HTMLDivElement>();
  private blockSettingsTabButton = new Ref<HTMLDivElement>();
  private accountTab = new Ref<AccountTab>();
  private chatListTab = new Ref<ChatListTab>();
  private displaySettingsTab = new Ref<DisplaySettingsTab>();
  private blockSettingsTab = new Ref<BlockSettingsTab>();
  private pageNavigator: PageNavigator<Tab>;

  public constructor(
    elementStyle: string,
    controlPanelButtonColor: string,
    controlPanelPopupStyle: string,
    hasChat: boolean,
    private globalDocuments: GlobalDocuments,
    private playerSettings: PlayerSettings,
    private serviceClient: WebServiceClient,
  ) {
    super();
    let tabHeads = new Array<HTMLDivElement>();
    tabHeads.push(
      assign(
        this.accountTabHead,
        ControlPanel.createTabHead(
          this.accountTabButton,
          chrome.i18n.getMessage("accountTitle"),
          `M0 200 A105 105 0 0 1 200 200 L0 200 M100 0 A65 65 0 1 1 100 130 A65 65 0 1 1 100 0 z`,
        ),
      ),
    );
    if (hasChat) {
      tabHeads.push(
        assign(
          this.chatListTabHead,
          ControlPanel.createTabHead(
            this.chatListTabButton,
            chrome.i18n.getMessage("chatTitle"),
            `M0 0 L50 0 L50 50 L0 50 z  M0 75 L50 75 L50 125 L0 125 z  M0 150 L50 150 L50 200 L0 200 z  M75 0 L200 0 L200 50 L75 50 z  M75 75 L200 75 L200 125 L75 125 z  M75 150 L200 150 L200 200 L75 200 z`,
          ),
        ),
      );
    }
    tabHeads.push(
      assign(
        this.displaySettingsTabHead,
        ControlPanel.createTabHead(
          this.displaySettingsTabButton,
          chrome.i18n.getMessage("displaySettingsTitle"),
          `M83 0 L117 0 L117 29 A73 73 0 0 1 138 38 L159 17 L183 41 L162 62 A73 73 0 0 1 171 83 L200 83 L200 117 L171 117 A73 73 0 0 1 162 138 L183 158 L159 183 L138 162 A73 73 0 0 1 117 171 L117 200 L83 200 L83 171 A73 73 0 0 1 62 162 L41 183 L17 159 L38 138 A73 73 0 0 1 29 117 L0 117 L0 83 L29 83 A73 73 0 0 1 38 62 L17 41 L41 17 L63 38 A73 73 0 0 1 83 29 z  M100 60 A40 40 0 0 0 100 140 A40 40 0 0 0 100 60 z`,
        ),
      ),
      assign(
        this.blockSettingsTabHead,
        ControlPanel.createTabHead(
          this.blockSettingsTabButton,
          chrome.i18n.getMessage("blockSettingsTitle"),
          `M100 0 A100 100 0 0 1 100 200 A100 100 0 0 1 100 0 z  M159 138 A70 70 0 0 0 62 41 z  M41 62 A70 70 0 0 0 138 159 z`,
        ),
      ),
    );

    let tabs = new Array<HTMLDivElement>();
    tabs.push(assign(this.accountTab, AccountTab.create().hide()).body);
    if (hasChat) {
      tabs.push(
        assign(
          this.chatListTab,
          ChatListTab.create(this.playerSettings.blockSettings).hide(),
        ).body,
      );
    }
    tabs.push(
      assign(
        this.displaySettingsTab,
        DisplaySettingsTab.create(this.playerSettings.displaySettings).hide(),
      ).body,
      assign(
        this.blockSettingsTab,
        BlockSettingsTab.create(this.playerSettings.blockSettings).hide(),
      ).body,
    );

    this.body = E.div(
      {
        class: "control-panel-container",
        style: `display: inline-block; text-align: left; text-shadow: none; vertical-align: top; font-size: 0; line-height: 0; ${elementStyle}`,
      },
      E.divRef(
        this.controlPanelButton,
        {
          class: "control-panel-button",
          style: `height: 100%; padding: 22%; box-sizing: border-box; cursor: pointer;`,
        },
        E.svg(
          {
            class: "control-panel-svg",
            style: `display: block; height: 100%; fill: ${controlPanelButtonColor};`,
            viewBox: "0 0 200 200",
          },
          E.path({
            class: "control-panel-control-panel-path",
            d: "M99 0 L99 97 L49 49 z  M120 17 L149 17 L149 80 L120 80 z  M171 17 L200 17 L200 80 L171 80 z  M50 103 L50 200 L0 152 z  M71 120 L100 120 L100 183 L71 183 z  M122 120 L151 120 L151 183 L122 183 z",
          }),
        ),
      ),
      E.divRef(
        this.controlPanelPopup,
        {
          class: "control-panel-control-panel-popup",
          style: `position: absolute; display: flex; flex-flow: column nowrap; width: 30rem; height: 38rem; padding: .3rem; box-sizing: content-box; background-color: ${ColorScheme.getBackground()}; box-shadow: 0.1rem 0.1rem 0.3rem ${ColorScheme.getPopupShadow()}; z-index: 100; ${controlPanelPopupStyle}`,
        },
        E.divRef(
          this.tabHeadLine,
          { class: "control-panel-tab-head-line", style: `width: 100%;` },
          ...tabHeads,
        ),
        E.div(
          {
            class: "control-panel-tabs",
            style: `flex-grow: 1; box-sizing: border-box; width: 100%; min-height: 0;`,
          },
          ...tabs,
        ),
      ),
    );
    this.hidePopup();
    this.pageNavigator = new PageNavigator(
      (tab) => this.addTab(tab),
      (tab) => this.removeTab(tab),
    );
    this.pageNavigator.goTo(Tab.ACCOUNT);

    if (this.chatListTabButton.val) {
      this.chatListTabButton.val.addEventListener("click", () =>
        this.pageNavigator.goTo(Tab.CHAT_LIST),
      );
    }
    this.accountTabHead.val.addEventListener("click", () =>
      this.pageNavigator.goTo(Tab.ACCOUNT),
    );
    this.displaySettingsTabButton.val.addEventListener("click", () =>
      this.pageNavigator.goTo(Tab.DISPLAY_SETTINGS),
    );
    this.blockSettingsTabButton.val.addEventListener("click", () =>
      this.pageNavigator.goTo(Tab.BLOCK_SETTINGS),
    );
    if (this.chatListTab.val) {
      this.chatListTab.val.on("fire", (chatEntry) => this.fire(chatEntry));
    }
    this.displaySettingsTab.val.on("update", () =>
      this.updateDisplaySettings(),
    );
    this.blockSettingsTab.val.on("update", () => this.updateBlockSettings());

    this.body.addEventListener("click", (event) => event.stopPropagation());
    this.body.addEventListener("mousedown", (event) => event.stopPropagation());
    this.body.addEventListener("mouseup", (event) => event.stopPropagation());
    this.controlPanelButton.val.addEventListener("click", () =>
      this.togglePopup(),
    );
    this.globalDocuments.hideWhenMousedown(this.body, () => this.hidePopup());
  }

  private static createTabHead(
    tabButton: Ref<HTMLDivElement>,
    titleText: string,
    svgPath: string,
  ): HTMLDivElement {
    let head = E.div(
      {
        class: "control-panel-tab-head",
        style: `display: inline-flex; align-items: center; border-radius: .5rem .5rem 0 0; transition: ${ControlPanel.WIDTH_TRANSITION_STYLE}; overflow: hidden;`,
      },
      E.divRef(
        tabButton,
        {
          class: "control-panel-tab-button",
          style: `flex-shrink: 0; height: ${ControlPanel.TAB_BUTTON_WIDTH}rem; padding: .3rem; box-sizing: border-box; cursor: pointer;`,
        },
        E.svg(
          {
            class: "control-panel-tab-button-svg",
            style: `display: block; height: 100%; fill: ${ColorScheme.getSvgContent()};`,
            viewBox: "0 0 200 200",
          },
          E.path({ class: "control-panel-tab-button-path", d: svgPath }),
        ),
      ),
      E.div(
        {
          class: "control-panel-title",
          style: `flex-grow: 1; font-size: ${FONT_M}rem; line-height: 100%; font-family: initial !important; text-align: center; white-space: nowrap; color: ${ColorScheme.getContent()};`,
        },
        E.text(titleText),
      ),
    );
    ControlPanel.lowlightTabHead(head);
    return head;
  }

  private hidePopup(): void {
    this.controlPanelPopup.val.style.display = "none";
  }

  private togglePopup(): void {
    if (this.controlPanelPopup.val.style.display === "none") {
      this.controlPanelPopup.val.style.display = "flex";
    } else {
      this.controlPanelPopup.val.style.display = "none";
    }
  }

  private addTab(tab: Tab): void {
    switch (tab) {
      case Tab.ACCOUNT:
        this.highlightTabHead(this.accountTabHead.val);
        this.accountTab.val.show();
        break;
      case Tab.CHAT_LIST:
        this.highlightTabHead(this.chatListTabHead.val);
        this.chatListTab.val.show();
        break;
      case Tab.DISPLAY_SETTINGS:
        this.highlightTabHead(this.displaySettingsTabHead.val);
        this.displaySettingsTab.val.show();
        break;
      case Tab.BLOCK_SETTINGS:
        this.highlightTabHead(this.blockSettingsTabHead.val);
        this.blockSettingsTab.val.show();
        break;
    }
  }

  private removeTab(tab: Tab): void {
    switch (tab) {
      case Tab.ACCOUNT:
        ControlPanel.lowlightTabHead(this.accountTabHead.val);
        this.accountTab.val.hide();
        break;
      case Tab.CHAT_LIST:
        ControlPanel.lowlightTabHead(this.chatListTabHead.val);
        this.chatListTab.val.hide();
        break;
      case Tab.DISPLAY_SETTINGS:
        ControlPanel.lowlightTabHead(this.displaySettingsTabHead.val);
        this.displaySettingsTab.val.hide();
        break;
      case Tab.BLOCK_SETTINGS:
        ControlPanel.lowlightTabHead(this.blockSettingsTabHead.val);
        this.blockSettingsTab.val.hide();
        break;
    }
  }

  private highlightTabHead(tabHead: HTMLDivElement): void {
    tabHead.style.width = `calc(100% - ${
      ControlPanel.TAB_BUTTON_WIDTH *
      (this.tabHeadLine.val.childElementCount - 1)
    }rem)`;
    tabHead.style.backgroundColor = ColorScheme.getBackground();
  }

  private static lowlightTabHead(tabHead: HTMLDivElement): void {
    tabHead.style.width = `${ControlPanel.TAB_BUTTON_WIDTH}rem`;
    tabHead.style.backgroundColor = ColorScheme.getAlternativeBackground();
  }

  private async fire(chatEntry: ChatEntry): Promise<void> {
    await Promise.all(
      this.listeners("fire").map((callback) => callback(chatEntry)),
    );
  }

  private async updateDisplaySettings(): Promise<void> {
    this.emit("updateDisplaySettings");
    await updatePlayerSettings(this.serviceClient, {
      playerSettings: this.playerSettings,
    });
  }

  private async updateBlockSettings(): Promise<void> {
    if (this.chatListTab.val) {
      this.chatListTab.val.updateBlockSettings();
    }
    this.emit("updateBlockSettings");
    await updatePlayerSettings(this.serviceClient, {
      playerSettings: this.playerSettings,
    });
  }

  public toggleEnableScrolling(): void {
    this.displaySettingsTab.val.toggleEnableChange();
  }

  public addChats(chatEntries: ChatEntry[]): void {
    if (this.chatListTab.val) {
      this.chatListTab.val.add(chatEntries);
    }
  }

  public clearChats(): void {
    if (this.chatListTab.val) {
      this.chatListTab.val.clear();
    }
  }

  public remove(): void {
    this.body.remove();
  }
}
