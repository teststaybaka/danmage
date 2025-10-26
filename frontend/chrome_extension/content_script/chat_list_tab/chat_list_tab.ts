import EventEmitter = require("events");
import { ChatEntry } from "../../../../interface/chat_entry";
import { BlockSettings } from "../../../../interface/player_settings";
import { FilledBlockingButton } from "../../../blocking_button";
import { ColorScheme } from "../../../color_scheme";
import { FONT_M } from "../../../font_sizes";
import { CustomTextInputController } from "../common/custom_text_input_controller";
import { LinkedList } from "../common/linked_list";
import { LOCAL_SESSION_STORAGE } from "../common/local_session_storage";
import { TAB_SIDE_PADDING } from "../common/styles";
import { ChatListEntry } from "./chat_list_entry";
import { E } from "@selfage/element/factory";
import { Ref, assign } from "@selfage/ref";
import { LocalSessionStorage } from "@selfage/web_service_client/local_session_storage";

export interface ChatListTab {
  on(
    event: "fire",
    listener: (chatEntry: ChatEntry) => Promise<void> | void,
  ): this;
}

export class ChatListTab extends EventEmitter {
  public static create(blockSettings: BlockSettings): ChatListTab {
    return new ChatListTab(LOCAL_SESSION_STORAGE, blockSettings);
  }

  private static LENGTH_LIMIT = 40;

  public body: HTMLDivElement;
  private entryList = new Ref<HTMLDivElement>();
  private chatInput = new Ref<HTMLInputElement>();
  private fireButton = new Ref<FilledBlockingButton>();
  private chatInputController: CustomTextInputController;
  private chatListEntries = new LinkedList<ChatListEntry>();

  public constructor(
    private localSessionStorage: LocalSessionStorage,
    private blockSettings: BlockSettings,
  ) {
    super();
    this.body = E.div(
      {
        class: "chat-list-tab-container",
        style: `flex-flow: column nowrap; height: 100%;`,
      },
      E.div(
        {
          class: "chat-list-tab-entry-list-container",
          style: `flex-grow: 1; position: relative;`,
        },
        E.div({
          ref: this.entryList,
          class: "chat-list-tab-entry-list",
          style: `position: absolute; bottom: 0; padding: 0 ${TAB_SIDE_PADDING}; box-sizing: border-box; width: 100%; max-height: 100%; overflow-y: auto;`,
        }),
      ),
      E.div(
        {
          class: "chat-list-tab-fire-form",
          style: `display: flex; flex-flow: row nowrap; align-items: center;  padding: 0 ${TAB_SIDE_PADDING};`,
        },
        E.input({
          ref: this.chatInput,
          class: "chat-list-tab-input",
          style: `padding: 0; margin: 0; outline: none; border: 0; min-width: 0; flex-grow: 1; margin-right: 8px; font-size: ${FONT_M}px; line-height: 32px; border-bottom: 1px solid ${ColorScheme.getInputBorder()}; font-family: initial !important; color: ${ColorScheme.getContent()};`,
        }),
        assign(
          this.fireButton,
          FilledBlockingButton.create("").append(
            E.text(chrome.i18n.getMessage("submitNewChatButton")),
          ),
        ).body,
      ),
    );
    this.chatInputController = CustomTextInputController.create(
      this.chatInput.val,
    );

    this.chatInputController.on("enter", () => this.enterToFire());
    this.fireButton.val.on("action", () => this.fire());
  }

  private enterToFire(): void {
    this.fireButton.val.click();
  }

  private async fire(): Promise<void> {
    if (!this.chatInput.val.value) {
      return;
    }

    let chatEntry: ChatEntry = {
      content: this.chatInput.val.value,
    };
    this.chatInput.val.value = "";
    await Promise.all(
      this.listeners("fire").map((callback) => callback(chatEntry)),
    );
  }

  public add(chatEntries: Array<ChatEntry>): void {
    let needsScrollToBottom =
      this.entryList.val.scrollTop + this.entryList.val.offsetHeight >=
      this.entryList.val.scrollHeight;
    for (let chatEntry of chatEntries) {
      let entry = ChatListEntry.create(chatEntry, this.blockSettings);
      this.entryList.val.appendChild(entry.body);
      this.chatListEntries.pushBack(entry);
    }
    if (needsScrollToBottom) {
      this.entryList.val.scrollTop = this.entryList.val.scrollHeight;
    }

    while (this.chatListEntries.getSize() > ChatListTab.LENGTH_LIMIT) {
      let poppedEntry = this.chatListEntries.popFront();
      poppedEntry.remove();
    }
  }

  public updateBlockSettings(): void {
    this.chatListEntries.forEachNodeReverse((chatListEntryNode) => {
      if (chatListEntryNode.value.isBlocked()) {
        chatListEntryNode.value.remove();
        chatListEntryNode.remove();
      }
    });
  }

  public clear(): void {
    this.chatListEntries.forEachReverse((chatListEntry) =>
      chatListEntry.remove(),
    );
    this.chatListEntries.clear();
  }

  public show(): this {
    let session = this.localSessionStorage.read();
    this.chatInput.val.placeholder = "";
    if (!session) {
      this.chatInput.val.placeholder = chrome.i18n.getMessage(
        "chatInputPlaceHolderSignedOut",
      );
      this.fireButton.val.disable();
    } else {
      this.chatInput.val.placeholder = chrome.i18n.getMessage(
        "chatInputPlaceHolderSignedIn",
      );
      this.fireButton.val.enable();
    }
    this.body.style.display = "flex";
    return this;
  }

  public hide(): this {
    this.body.style.display = "none";
    return this;
  }
}
