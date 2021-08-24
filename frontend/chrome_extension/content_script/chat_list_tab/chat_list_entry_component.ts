import EventEmitter = require("events");
import { ChatEntry } from "../../../../interface/chat_entry";
import { BlockSettings } from "../../../../interface/player_settings";
import { ColorScheme } from "../../../color_scheme";
import { BlockPatternTester } from "../block_pattern_tester";
import { E } from "@selfage/element/factory";

export class ChatListEntryComponent extends EventEmitter {
  public constructor(
    public body: HTMLDivElement,
    private chatEntry: ChatEntry,
    private blockPatternTester: BlockPatternTester
  ) {
    super();
  }

  public static create(
    chatEntry: ChatEntry,
    blockSettings: BlockSettings
  ): ChatListEntryComponent {
    return new ChatListEntryComponent(
      ChatListEntryComponent.createView(chatEntry),
      chatEntry,
      BlockPatternTester.createIdentity(blockSettings)
    ).init();
  }

  public static createView(chatEntry: ChatEntry) {
    return E.div(
      `class="chat-list-entry" style="position: relative; padding: .3rem 0; ` +
        `line-height: 1.6rem; font-size: 1.4rem; ` +
        `font-family: initial !important; word-break: break-all;"`,
      E.text(`${chatEntry.userNickname}@ ${chatEntry.content}`)
    );
  }

  public init(): this {
    this.body.addEventListener("mouseenter", () => this.hover());
    this.body.addEventListener("mouseleave", () => this.leave());
    return this;
  }

  private hover(): void {
    this.body.style.color = ColorScheme.getHighlightContent();
  }

  private leave(): void {
    this.body.style.color = ColorScheme.getContent();
  }

  public isBlocked(): boolean {
    return this.blockPatternTester.test(this.chatEntry);
  }

  public remove(): void {
    this.body.remove();
  }
}

export class ChatListEntryComponentFactory {
  public constructor(private blockSettings: BlockSettings) {}

  public create(chatEntry: ChatEntry): ChatListEntryComponent {
    return ChatListEntryComponent.create(chatEntry, this.blockSettings);
  }
}
