import EventEmitter = require("events");
import { ChatEntry } from "../../../../interface/chat_entry";
import { BlockSettings } from "../../../../interface/player_settings";
import { ColorScheme } from "../../../color_scheme";
import { FONT_M } from "../../../font_sizes";
import { BlockPatternTester } from "../common/block_pattern_tester";
import { E } from "@selfage/element/factory";

export class ChatListEntry extends EventEmitter {
  public static create(
    chatEntry: ChatEntry,
    blockSettings: BlockSettings,
  ): ChatListEntry {
    return new ChatListEntry(
      chatEntry,
      BlockPatternTester.createIdentity(blockSettings),
    );
  }

  public body: HTMLDivElement;

  public constructor(
    private chatEntry: ChatEntry,
    private blockPatternTester: BlockPatternTester,
  ) {
    super();
    this.body = E.div(
      {
        class: "chat-list-entry",
        style: `position: relative; padding: .25rem 0; line-height: 100%; font-size: ${FONT_M}rem; font-family: initial !important; word-break: break-all;`,
      },
      E.text(`${chatEntry.userNickname}: ${chatEntry.content}`),
    );
    this.leave();

    this.body.addEventListener("mouseenter", () => this.hover());
    this.body.addEventListener("mouseleave", () => this.leave());
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
