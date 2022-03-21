import EventEmitter = require("events");
import { ChatEntry } from "../../../../interface/chat_entry";
import { BlockSettings } from "../../../../interface/player_settings";
import { FillButtonComponent } from "../../../button_component";
import { ColorScheme } from "../../../color_scheme";
import {
  CHROME_SESSION_STORAGE,
  ChromeSessionStorage,
} from "../../common/chrome_session_storage";
import { CustomTextInputController } from "../common/custom_text_input_controller";
import { LinkedList } from "../common/linked_list";
import { TAB_SIDE_PADDING } from "../common/styles";
import { ChatListEntryComponent } from "./chat_list_entry_component";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";

export interface ChatListTabComponent {
  on(
    event: "fire",
    listener: (chatEntry: ChatEntry) => Promise<void> | void
  ): this;
}

export class ChatListTabComponent extends EventEmitter {
  private static LENGTH_LIMIT = 40;

  public body: HTMLDivElement;
  private entryList: HTMLDivElement;
  private chatInput: HTMLInputElement;
  private chatInputController: CustomTextInputController;
  private chatListEntries = new LinkedList<ChatListEntryComponent>();
  private displayStyle: string;

  public constructor(
    private fireButton: FillButtonComponent,
    private chatInputControllerFactoryFn: (
      input: HTMLInputElement
    ) => CustomTextInputController,
    private chatListEntryComponentFactoryFn: (
      chatEntry: ChatEntry,
      blockSettings: BlockSettings
    ) => ChatListEntryComponent,
    private blockSettings: BlockSettings,
    private chromeSessionStorage: ChromeSessionStorage
  ) {
    super();
    let entryListRef = new Ref<HTMLDivElement>();
    let chatInputRef = new Ref<HTMLInputElement>();
    this.body = E.div(
      {
        class: "chat-list-tab-container",
        style: `display: flex; flex-flow: column nowrap; height: 100%;`,
      },
      E.div(
        {
          class: "chat-list-tab-entry-list-container",
          style: `flex-grow: 1; position: relative;`,
        },
        E.divRef(entryListRef, {
          class: "chat-list-tab-entry-list",
          style: `position: absolute; bottom: 0; padding: 0 ${TAB_SIDE_PADDING}; box-sizing: border-box; width: 100%; max-height: 100%; overflow-y: auto;`,
        })
      ),
      E.div(
        {
          class: "chat-list-tab-fire-form",
          style: `display: flex; flex-flow: row nowrap; align-items: center;  padding: 0 ${TAB_SIDE_PADDING};`,
        },
        E.inputRef(chatInputRef, {
          class: "chat-list-tab-input",
          style: `padding: 0; margin: 0; outline: none; border: 0; min-width: 0; flex-grow: 1; margin-right: 1rem; font-size: 1.4rem; line-height: 3rem; border-bottom: .1rem solid ${ColorScheme.getInputBorder()}; font-family: initial !important; color: ${ColorScheme.getContent()};`,
        }),
        fireButton.body
      )
    );
    this.entryList = entryListRef.val;
    this.chatInput = chatInputRef.val;
  }

  public static create(blockSettings: BlockSettings): ChatListTabComponent {
    return new ChatListTabComponent(
      FillButtonComponent.create(
        E.text(chrome.i18n.getMessage("submitNewChatButton"))
      ),
      CustomTextInputController.create,
      ChatListEntryComponent.create,
      blockSettings,
      CHROME_SESSION_STORAGE
    ).init();
  }

  public init(): this {
    this.chatInputController = this.chatInputControllerFactoryFn(
      this.chatInput
    );
    this.displayStyle = this.body.style.display;
    this.chatInputController.on("enter", () => this.enterToFire());
    this.fireButton.on("click", () => this.fire());
    return this;
  }

  private enterToFire(): void {
    this.fireButton.click();
  }

  private async fire(): Promise<void> {
    if (!this.chatInput.value) {
      return;
    }

    let chatEntry: ChatEntry = {
      content: this.chatInput.value,
    };
    await Promise.all(
      this.listeners("fire").map((callback) => callback(chatEntry))
    );
    this.chatInput.value = "";
  }

  public add(chatEntries: Array<ChatEntry>): void {
    let needsScrollToBottom =
      this.entryList.scrollTop + this.entryList.offsetHeight >=
      this.entryList.scrollHeight;
    for (let chatEntry of chatEntries) {
      let entry = this.chatListEntryComponentFactoryFn(
        chatEntry,
        this.blockSettings
      );
      this.entryList.appendChild(entry.body);
      this.chatListEntries.pushBack(entry);
    }
    if (needsScrollToBottom) {
      this.entryList.scrollTop = this.entryList.scrollHeight;
    }

    let poppedEntries = new Array<ChatListEntryComponent>();
    while (this.chatListEntries.getSize() > ChatListTabComponent.LENGTH_LIMIT) {
      let poppedEntry = this.chatListEntries.popFront();
      poppedEntries.push(poppedEntry);
    }
    for (let i = poppedEntries.length - 1; i >= 0; i--) {
      poppedEntries[i].remove();
    }
  }

  public refreshBlocked(): void {
    this.chatListEntries.forEachNodeReverse((chatListEntryNode) => {
      chatListEntryNode.value.remove();
      chatListEntryNode.remove();
    });
  }

  public clear(): void {
    this.chatListEntries.forEachReverse((chatListEntry) =>
      chatListEntry.remove()
    );
    this.chatListEntries.clear();
  }

  public async show(): Promise<void> {
    let session = await this.chromeSessionStorage.read();
    this.chatInput.placeholder = "";
    if (!session) {
      this.chatInput.placeholder = chrome.i18n.getMessage(
        "chatInputPlaceHolderSignedOut"
      );
    } else {
      this.chatInput.placeholder = chrome.i18n.getMessage(
        "chatInputPlaceHolderSignedIn"
      );
    }
    this.body.style.display = this.displayStyle;
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
