import EventEmitter = require("events");
import { ChatEntry } from "../../../../interface/chat_entry";
import { BlockSettings } from "../../../../interface/player_settings";
import { FillButtonComponent } from "../../../button_component";
import { ColorScheme } from "../../../color_scheme";
import { CustomTextInputController } from "../custom_text_input_controller";
import { LinkedList } from "../linked_list";
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

  private chatListEntries = new LinkedList<ChatListEntryComponent>();
  private displayStyle: string;

  public constructor(
    public body: HTMLDivElement,
    private entryList: HTMLDivElement,
    private chatInput: HTMLInputElement,
    private fireButton: FillButtonComponent,
    private chatInputController: CustomTextInputController,
    private blockSettings: BlockSettings,
    private chatListEntryComponentFactoryFn: (
      chatEntry: ChatEntry,
      blockSettings: BlockSettings
    ) => ChatListEntryComponent
  ) {
    super();
  }

  public static create(blockSettings: BlockSettings): ChatListTabComponent {
    let views = ChatListTabComponent.createView(
      FillButtonComponent.create(E.text("Fire!"))
    );
    return new ChatListTabComponent(
      ...views,
      CustomTextInputController.create(views[2]),
      blockSettings,
      ChatListEntryComponent.create
    ).init();
  }

  public static createView(fireButton: FillButtonComponent) {
    let entryListRef = new Ref<HTMLDivElement>();
    let chatInputRef = new Ref<HTMLInputElement>();
    let body = E.div(
      {
        class: "chat-list-tab-container",
        style: `display: flex; flex-flow: column nowrap; height: 100%;`,
      },
      E.div(
        {
          class: "chat-list-tab-entry-list-container",
          style: `flex-grow: 1; width: 100%; position: relative;`,
        },
        E.divRef(entryListRef, {
          class: "chat-list-tab-entry-list",
          style: `position: absolute; bottom: 0; max-height: 100%; width: 100%; overflow: auto;`,
        })
      ),
      E.div(
        {
          class: "chat-list-tab-fire-form",
          style: `display: flex; flex-flow: row nowrap; align-items: center; width: 100%;`,
        },
        E.inputRef(chatInputRef, {
          class: "chat-list-tab-input",
          style: `padding: 0; margin: 0; outline: none; border: 0; min-width: 0; flex-grow: 1; margin-right: 1rem; font-size: 1.4rem; line-height: 3rem; border-bottom: .1rem solid ${ColorScheme.getInputBorder()}; font-family: initial !important; color: ${ColorScheme.getContent()};`,
          placeholder: "Sign in before posting chats!",
        }),
        fireButton.body
      )
    );
    return [body, entryListRef.val, chatInputRef.val, fireButton] as const;
  }

  public init(): this {
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

  public show(): void {
    this.body.style.display = this.displayStyle;
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
