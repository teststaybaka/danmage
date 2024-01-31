import EventEmitter = require("events");
import { ChatEntry } from "../../../interface/chat_entry";
import { PlayerSettings } from "../../../interface/player_settings";
import { ColorScheme } from "../../color_scheme";
import {
  CHROME_PLAYER_SETTINGS_STORAGE,
  ChromePlayerSettingsStorage,
} from "../common/chrome_player_settings_storage";
import { AccountTabComponent } from "./account_tab/account_tab_component";
import { BlockSettingsTabComponent } from "./block_settings_tab/block_settings_tab_component";
import { ChatListTabComponent } from "./chat_list_tab/chat_list_tab_component";
import { GlobalDocuments } from "./common/global_documents";
import { DisplaySettingsTabComponent } from "./display_settings_tab/display_settings_tab_component";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { TabsSwitcher } from "@selfage/tabs";

export interface ControlPanelComponent {
  on(
    event: "fire",
    listener: (chatEntry: ChatEntry) => Promise<void> | void
  ): this;
  on(event: "updateDisplay", listener: () => void): this;
  on(event: "updateBlocked", listener: () => void): this;
}

export class ControlPanelComponent extends EventEmitter {
  private static TAB_BUTTON_WIDTH = 2.4;
  private static WIDTH_TRANSITION_STYLE = "width .3s";

  public body: HTMLDivElement;
  private controlPanelButton: HTMLDivElement;
  private controlPanelPopup: HTMLDivElement;
  private tabHeadLine: HTMLDivElement;
  private accountTabHead: HTMLDivElement | undefined;
  private accountTabButton: HTMLDivElement | undefined;
  private chatListTabHead: HTMLDivElement | undefined;
  private chatListTabButton: HTMLDivElement | undefined;
  private displaySettingsTabHead: HTMLDivElement;
  private displaySettingsTabButton: HTMLDivElement;
  private blockSettingsTabHead: HTMLDivElement;
  private blockSettingsTabButton: HTMLDivElement;
  private controlPanelPopupDisplayStyle: string;
  private tabsSwitcher = TabsSwitcher.create();

  public constructor(
    elementStyle: string,
    controlPanelButtonColor: string,
    controlPanelPopupStyle: string,
    private hasChat: boolean,
    private accountTabComponent: AccountTabComponent | undefined,
    private chatListTabComponent: ChatListTabComponent | undefined,
    private displaySettingsTabComponent: DisplaySettingsTabComponent,
    private blockSettingsTabComponent: BlockSettingsTabComponent,
    private globalDocuments: GlobalDocuments,
    private playerSettings: PlayerSettings,
    private playerSettingsStorage: ChromePlayerSettingsStorage
  ) {
    super();
    let controlPanelButtonRef = new Ref<HTMLDivElement>();
    let controlPanelPopupRef = new Ref<HTMLDivElement>();
    let tabHeadLineRef = new Ref<HTMLDivElement>();
    let accountTabHeadRef = new Ref<HTMLDivElement>();
    let accountTabButtonRef = new Ref<HTMLDivElement>();
    let chatListTabHeadRef = new Ref<HTMLDivElement>();
    let chatListTabButtonRef = new Ref<HTMLDivElement>();
    let displaySettingsTabHeadRef = new Ref<HTMLDivElement>();
    let displaySettingsTabButtonRef = new Ref<HTMLDivElement>();
    let blockSettingsTabHeadRef = new Ref<HTMLDivElement>();
    let blockSettingsTabButtonRef = new Ref<HTMLDivElement>();

    let tabHeads = new Array<HTMLDivElement>();
    if (hasChat) {
      tabHeads.push(
        ControlPanelComponent.createTabHead(
          accountTabHeadRef,
          accountTabButtonRef,
          chrome.i18n.getMessage("accountTitle"),
          `M0 200 A105 105 0 0 1 200 200 L0 200 M100 0 A65 65 0 1 1 100 130 A65 65 0 1 1 100 0 z`
        ),
        ControlPanelComponent.createTabHead(
          chatListTabHeadRef,
          chatListTabButtonRef,
          chrome.i18n.getMessage("chatTitle"),
          `M0 0 L50 0 L50 50 L0 50 z  M0 75 L50 75 L50 125 L0 125 z  M0 150 L50 150 L50 200 L0 200 z  M75 0 L200 0 L200 50 L75 50 z  M75 75 L200 75 L200 125 L75 125 z  M75 150 L200 150 L200 200 L75 200 z`
        )
      );
    }
    tabHeads.push(
      ControlPanelComponent.createTabHead(
        displaySettingsTabHeadRef,
        displaySettingsTabButtonRef,
        chrome.i18n.getMessage("displaySettingsTitle"),
        `M83 0 L117 0 L117 29 A73 73 0 0 1 138 38 L159 17 L183 41 L162 62 A73 73 0 0 1 171 83 L200 83 L200 117 L171 117 A73 73 0 0 1 162 138 L183 158 L159 183 L138 162 A73 73 0 0 1 117 171 L117 200 L83 200 L83 171 A73 73 0 0 1 62 162 L41 183 L17 159 L38 138 A73 73 0 0 1 29 117 L0 117 L0 83 L29 83 A73 73 0 0 1 38 62 L17 41 L41 17 L63 38 A73 73 0 0 1 83 29 z  M100 60 A40 40 0 0 0 100 140 A40 40 0 0 0 100 60 z`
      ),
      ControlPanelComponent.createTabHead(
        blockSettingsTabHeadRef,
        blockSettingsTabButtonRef,
        chrome.i18n.getMessage("blockSettingsTitle"),
        `M100 0 A100 100 0 0 1 100 200 A100 100 0 0 1 100 0 z  M159 138 A70 70 0 0 0 62 41 z  M41 62 A70 70 0 0 0 138 159 z`
      )
    );

    let tabBodies = new Array<HTMLDivElement>();
    if (hasChat) {
      tabBodies.push(accountTabComponent.body, chatListTabComponent.body);
    }
    tabBodies.push(
      displaySettingsTabComponent.body,
      blockSettingsTabComponent.body
    );

    this.body = E.div(
      {
        class: "control-panel-container",
        style: `display: inline-block; text-align: left; text-shadow: none; vertical-align: top; font-size: 0; line-height: 0; ${elementStyle}`,
      },
      E.divRef(
        controlPanelButtonRef,
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
          })
        )
      ),
      E.divRef(
        controlPanelPopupRef,
        {
          class: "control-panel-control-panel-popup",
          style: `position: absolute; display: flex; flex-flow: column nowrap; width: 30rem; height: 38rem; padding: .3rem; box-sizing: content-box; background-color: ${ColorScheme.getBackground()}; box-shadow: 0.1rem 0.1rem 0.3rem ${ColorScheme.getPopupShadow()}; z-index: 100; ${controlPanelPopupStyle}`,
        },
        E.divRef(
          tabHeadLineRef,
          { class: "control-panel-tab-head-line", style: `width: 100%;` },
          ...tabHeads
        ),
        E.div(
          {
            class: "control-panel-tabs",
            style: `flex-grow: 1; box-sizing: border-box; width: 100%; min-height: 0;`,
          },
          ...tabBodies
        )
      )
    );

    this.controlPanelButton = controlPanelButtonRef.val;
    this.controlPanelPopup = controlPanelPopupRef.val;
    this.tabHeadLine = tabHeadLineRef.val;
    this.accountTabHead = accountTabHeadRef.val;
    this.accountTabButton = accountTabButtonRef.val;
    this.chatListTabHead = chatListTabHeadRef.val;
    this.chatListTabButton = chatListTabButtonRef.val;
    this.displaySettingsTabHead = displaySettingsTabHeadRef.val;
    this.displaySettingsTabButton = displaySettingsTabButtonRef.val;
    this.blockSettingsTabHead = blockSettingsTabHeadRef.val;
    this.blockSettingsTabButton = blockSettingsTabButtonRef.val;
  }

  private static createTabHead(
    tabHead: Ref<HTMLDivElement>,
    tabButton: Ref<HTMLDivElement>,
    titleText: string,
    svgPath: string
  ): HTMLDivElement {
    return E.divRef(
      tabHead,
      {
        class: "control-panel-tab-head",
        style: `display: inline-flex; align-items: center; border-radius: .5rem .5rem 0 0; transition: ${ControlPanelComponent.WIDTH_TRANSITION_STYLE}; overflow: hidden;`,
      },
      E.divRef(
        tabButton,
        {
          class: "control-panel-tab-button",
          style: `flex-shrink: 0; height: ${ControlPanelComponent.TAB_BUTTON_WIDTH}rem; padding: .3rem; box-sizing: border-box; cursor: pointer;`,
        },
        E.svg(
          {
            class: "control-panel-tab-button-svg",
            style: `display: block; height: 100%; fill: ${ColorScheme.getSvgContent()};`,
            viewBox: "0 0 200 200",
          },
          E.path({ class: "control-panel-tab-button-path", d: svgPath })
        )
      ),
      E.div(
        {
          class: "control-panel-title",
          style: `flex-grow: 1; font-size: 1.4rem; line-height: 100%; font-family: initial !important; text-align: center; white-space: nowrap; color: ${ColorScheme.getContent()};`,
        },
        E.text(titleText)
      )
    );
  }

  public static createYouTubeStructured(
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings
  ): ControlPanelComponent {
    return ControlPanelComponent.create(
      `position: relative; height: 100%;`,
      "currentColor",
      "bottom: 100%; right: 0;",
      true,
      globalDocuments,
      playerSettings
    );
  }

  public static createYouTubeChat(
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings
  ): ControlPanelComponent {
    return ControlPanelComponent.create(
      `position: relative; height: 4rem;`,
      "var(--yt-live-chat-header-button-color)",
      "top: 4rem; right: 0;",
      false,
      globalDocuments,
      playerSettings
    );
  }

  public static createTwitchVideo(
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings
  ): ControlPanelComponent {
    return ControlPanelComponent.create(
      `position: absolute; height: 3rem; right: 1rem;`,
      "currentColor",
      "top: 3rem; right: 0;",
      false,
      globalDocuments,
      playerSettings
    );
  }

  public static createTwitchLive(
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings
  ): ControlPanelComponent {
    return ControlPanelComponent.create(
      `position: relative; height: 3rem;`,
      "currentColor",
      "bottom: 3rem; right: 0;",
      false,
      globalDocuments,
      playerSettings
    );
  }

  public static createCrunchyroll(
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings
  ): ControlPanelComponent {
    return ControlPanelComponent.create(
      `position: relative; height: 4rem;`,
      "white",
      "bottom: 4rem; right: 0;",
      true,
      globalDocuments,
      playerSettings
    );
  }

  private static create(
    elementStyle: string,
    controlPanelButtonColor: string,
    controlPanelPopupStyle: string,
    hasChat: boolean,
    globalDocuments: GlobalDocuments,
    playerSettings: PlayerSettings
  ): ControlPanelComponent {
    let accountTabComponent: AccountTabComponent;
    let chatListTabComponent: ChatListTabComponent;
    if (hasChat) {
      accountTabComponent = AccountTabComponent.create();
      chatListTabComponent = ChatListTabComponent.create(
        playerSettings.blockSettings
      );
    }
    return new ControlPanelComponent(
      elementStyle,
      controlPanelButtonColor,
      controlPanelPopupStyle,
      hasChat,
      accountTabComponent,
      chatListTabComponent,
      DisplaySettingsTabComponent.create(playerSettings.displaySettings),
      BlockSettingsTabComponent.create(playerSettings.blockSettings),
      globalDocuments,
      playerSettings,
      CHROME_PLAYER_SETTINGS_STORAGE
    ).init();
  }

  public init(): this {
    this.body.addEventListener("click", (event) => event.stopPropagation());
    this.body.addEventListener("mousedown", (event) => event.stopPropagation());
    this.body.addEventListener("mouseup", (event) => event.stopPropagation());

    this.controlPanelPopupDisplayStyle = this.controlPanelPopup.style.display;
    this.hidePopup();
    this.controlPanelButton.addEventListener("click", () => this.showPopup());
    this.globalDocuments.hideWhenMousedown(this.body, () => this.hidePopup());

    if (this.hasChat) {
      this.showAccountTab();
      this.lowlightTabHead(this.chatListTabHead);
      this.chatListTabComponent.hide();
      this.lowlightTabHead(this.displaySettingsTabHead);
      this.displaySettingsTabComponent.hide();
    } else {
      this.showDisplaySettingsTab();
    }
    this.lowlightTabHead(this.blockSettingsTabHead);
    this.blockSettingsTabComponent.hide();

    if (this.hasChat) {
      this.accountTabButton.addEventListener("click", () =>
        this.showAccountTab()
      );
      this.chatListTabButton.addEventListener("click", () =>
        this.showChatListTab()
      );
      this.chatListTabComponent.on("fire", (chatEntry) => this.fire(chatEntry));
    }
    this.displaySettingsTabButton.addEventListener("click", () =>
      this.showDisplaySettingsTab()
    );
    this.blockSettingsTabButton.addEventListener("click", () =>
      this.showBlockSettingsTab()
    );
    this.displaySettingsTabComponent.on("update", () => this.updateDisplay());
    this.blockSettingsTabComponent.on("update", () => this.updateBlocked());
    return this;
  }

  private hidePopup(): void {
    this.controlPanelPopup.style.display = "none";
  }

  private showPopup(): void {
    this.controlPanelPopup.style.display = this.controlPanelPopupDisplayStyle;
  }

  private showChatListTab(): void {
    this.tabsSwitcher.show(
      () => {
        this.highlightTabHead(this.chatListTabHead);
        return this.chatListTabComponent.show();
      },
      () => {
        this.lowlightTabHead(this.chatListTabHead);
        this.chatListTabComponent.hide();
      }
    );
  }

  private highlightTabHead(tabHead: HTMLDivElement): void {
    tabHead.style.width = `calc(100% - ${
      ControlPanelComponent.TAB_BUTTON_WIDTH *
      (this.tabHeadLine.childElementCount - 1)
    }rem)`;
    tabHead.style.backgroundColor = ColorScheme.getBackground();
  }

  private lowlightTabHead(tabHead: HTMLDivElement): void {
    tabHead.style.width = `${ControlPanelComponent.TAB_BUTTON_WIDTH}rem`;
    tabHead.style.backgroundColor = ColorScheme.getAlternativeBackground();
  }

  private showDisplaySettingsTab(): void {
    this.tabsSwitcher.show(
      () => {
        this.highlightTabHead(this.displaySettingsTabHead);
        return this.displaySettingsTabComponent.show();
      },
      () => {
        this.lowlightTabHead(this.displaySettingsTabHead);
        this.displaySettingsTabComponent.hide();
      }
    );
  }

  private showBlockSettingsTab(): void {
    this.tabsSwitcher.show(
      () => {
        this.highlightTabHead(this.blockSettingsTabHead);
        return this.blockSettingsTabComponent.show();
      },
      () => {
        this.lowlightTabHead(this.blockSettingsTabHead);
        this.blockSettingsTabComponent.hide();
      }
    );
  }

  private showAccountTab(): void {
    this.tabsSwitcher.show(
      () => {
        this.highlightTabHead(this.accountTabHead);
        return this.accountTabComponent.show();
      },
      () => {
        this.lowlightTabHead(this.accountTabHead);
        this.accountTabComponent.hide();
      }
    );
  }

  private async fire(chatEntry: ChatEntry): Promise<void> {
    await Promise.all(
      this.listeners("fire").map((callback) => callback(chatEntry))
    );
  }

  private async updateDisplay(): Promise<void> {
    this.emit("updateDisplay");
    await this.playerSettingsStorage.save(this.playerSettings);
  }

  private async updateBlocked(): Promise<void> {
    if (this.chatListTabComponent) {
      this.chatListTabComponent.refreshBlocked();
    }
    this.emit("updateBlocked");
    await this.playerSettingsStorage.save(this.playerSettings);
  }

  public toggleEnableScrolling(): void {
    this.displaySettingsTabComponent.toggleEnableChange();
  }

  public addChat(chatEntries: ChatEntry[]): void {
    if (this.chatListTabComponent) {
      this.chatListTabComponent.add(chatEntries);
    }
  }

  public clearChat(): void {
    if (this.chatListTabComponent) {
      this.chatListTabComponent.clear();
    }
  }
}
