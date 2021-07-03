import { HostApp } from "../../../interface/chat_entry";
import { GET_CHAT_HISTORY } from "../../../interface/service";
import { TextButton } from "../../button";
import { ColorScheme } from "../../color_scheme";
import { formatTimestamp } from "../../timestamp_formatter";
import { SERVICE_CLIENT } from "./service_client";
import { E } from "@selfage/element/factory";
import { Ref, assign } from "@selfage/ref";
import { ServiceClient } from "@selfage/service_client";

export class HistoryPage {
  private cursor: string;

  public constructor(
    public ele: HTMLElement,
    private entryListContainer: HTMLElement,
    private showMoreButton: TextButton,
    private serviceClient: ServiceClient
  ) {}

  public static create(): HistoryPage {
    let entryListContainer = new Ref<HTMLDivElement>();
    let showMoreButton = new Ref<TextButton>();
    let container = E.div(
      `class="history-container" style="display: flex; ` +
        `flex-flow: column nowrap; align-items: center;"`,
      E.divRef(
        entryListContainer,
        `class="history-entry-list"`,
        HistoryPage.createHistoryEntry(
          0,
          "Video site",
          "Video id",
          "Timestamp",
          "Content",
          "Posted date"
        )
      ),
      assign(showMoreButton, TextButton.create(E.text("Show more"))).button.ele
    );
    return new HistoryPage(
      container,
      entryListContainer.val,
      showMoreButton.val,
      SERVICE_CLIENT
    ).init();
  }

  private static createHistoryEntry(
    mod: number,
    hostAppStr: string,
    hostContentIdStr: string,
    timestampStr: string,
    contentStr: string,
    createdStr: string
  ): HTMLDivElement {
    let backgroundColor: string;
    if (mod === 1) {
      backgroundColor = ColorScheme.getBackground();
    } else {
      backgroundColor = ColorScheme.getAlternativeBackground();
    }
    return E.div(
      `class="history-entry-container" style="display: flex; ` +
        `flex-flow: row nowrap; width: 100%; padding: .8rem; ` +
        `font-size: 1.6rem; color: ${ColorScheme.getContent()}; ` +
        `background-color: ${backgroundColor};"`,
      E.div(
        `class="history-entry-host-app" style="flex-grow: 1; ` +
          `padding-right: .1rem; word-break: break-all;" ` +
          `title="${hostAppStr}"`,
        E.text(hostAppStr)
      ),
      E.div(
        `class="history-entry-host-content-id" style="flex-grow: 1; ` +
          `padding-right: .1rem; word-break: break-all;" ` +
          `title="${hostContentIdStr}"`,
        E.text(hostContentIdStr)
      ),
      E.div(
        `class-"histroy-entry-timestamp" style="flex-grow: 1; ` +
          `padding-right: .1rem; word-break: break-all;" ` +
          `title="${timestampStr}"`,
        E.text(timestampStr)
      ),
      E.div(
        `class="history-entry-content" style="style="flex-grow: 3; ` +
          `paddin-right: .1rem; word-break: break-all;" ` +
          `title="${contentStr}"`,
        E.text(contentStr)
      ),
      E.div(
        `class="history-entry-created" style="flex-grow: 1; ` +
          `padding-right: .1rem; word-break: break-all;" ` +
          `title="${createdStr}"`,
        E.text(createdStr)
      )
    );
  }

  public init(): this {
    this.showMoreButton.on("click", () => {
      return this.loadMore();
    });
    return this;
  }

  private async loadMore(): Promise<void> {
    let response = await this.serviceClient.fetchAuthed(
      { cursor: this.cursor },
      GET_CHAT_HISTORY
    );
    for (let chatEntry of response.chatEntries) {
      let mod = (this.entryListContainer.childElementCount + 1) % 2;
      let timestampStr = formatTimestamp(chatEntry.timestamp);
      let createdStr = new Date(chatEntry.created).toString();
      this.entryListContainer.appendChild(
        HistoryPage.createHistoryEntry(
          mod,
          HostApp[chatEntry.hostApp],
          chatEntry.hostContentId,
          timestampStr,
          chatEntry.content,
          createdStr
        )
      );
    }

    this.cursor = response.cursor;
    if (!this.cursor) {
      this.showMoreButton.button.hide();
    }
  }
}
