import EventEmitter = require("events");
import { HostApp } from "../../../interface/chat_entry";
import { TextBlockingButton } from "../../blocking_button";
import { newGetChatHistoryRequest } from "../../client_requests";
import { ColorScheme } from "../../color_scheme";
import { FONT_L } from "../../font_sizes";
import { formatTimestamp } from "../../timestamp_formatter";
import { LOCALIZED_TEXT } from "./locales/localized_text";
import { SERVICE_CLIENT } from "./service_client";
import { E } from "@selfage/element/factory";
import { Ref, assign } from "@selfage/ref";
import { WebServiceClient } from "@selfage/web_service_client";

export interface HistoryPage {
  on(event: "loaded", listening: () => void): this;
}

export class HistoryPage extends EventEmitter {
  public static create(): HistoryPage {
    return new HistoryPage(SERVICE_CLIENT);
  }

  public body: HTMLDivElement;
  private entryListContainer = new Ref<HTMLDivElement>();
  public showMoreButton = new Ref<TextBlockingButton>();
  private cursor: string;
  private dateFormatter: Intl.DateTimeFormat;

  public constructor(private serviceClient: WebServiceClient) {
    super();
    this.dateFormatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });

    this.body = E.div(
      {
        class: "history-container",
        style: `display: flex; flex-flow: column nowrap; width: 100%; align-items: center;`,
      },
      E.div(
        {
          ref: this.entryListContainer,
          class: "history-entry-list",
          style: `width: 100%;`,
        },
        HistoryPage.createEntryView(
          0,
          LOCALIZED_TEXT.chatVideoSiteLabel,
          LOCALIZED_TEXT.chatVideoIdLabel,
          LOCALIZED_TEXT.chatTimestampLabel,
          LOCALIZED_TEXT.chatContentLabel,
          LOCALIZED_TEXT.chatPostedDateLabel,
        ),
      ),
      assign(
        this.showMoreButton,
        TextBlockingButton.create(`margin: .5rem 0;`)
          .append(E.text(LOCALIZED_TEXT.showMoreChatsButton))
          .enable(),
      ).body,
    );

    this.showMoreButton.val.on("action", () => this.loadMore());
    this.showMoreButton.val.click();
  }

  private static createEntryView(
    mod: number,
    hostAppStr: string,
    hostContentIdStr: string,
    timestampStr: string,
    contentStr: string,
    createdStr: string,
  ): HTMLDivElement {
    let backgroundColor: string;
    if (mod === 1) {
      backgroundColor = ColorScheme.getBackground();
    } else {
      backgroundColor = ColorScheme.getAlternativeBackground();
    }
    return E.div(
      {
        class: "history-entry-container",
        style: `display: flex; flex-flow: row nowrap; width: 100%; padding: .5rem; box-sizing: border-box; font-size: ${FONT_L}rem; color: ${ColorScheme.getContent()}; background-color: ${backgroundColor};`,
      },
      E.div(
        {
          class: "history-entry-host-app",
          style: `flex: 2 0 0; padding-right: .25rem; word-break: break-all;`,
          title: hostAppStr,
        },
        E.text(hostAppStr),
      ),
      E.div(
        {
          class: "history-entry-host-content-id",
          style: `flex: 3 0 0; padding-right: .25rem; word-break: break-all;`,
          title: hostContentIdStr,
        },
        E.text(hostContentIdStr),
      ),
      E.div(
        {
          class: "histroy-entry-timestamp",
          style: `flex: 2 0 0; padding-right: .25rem; word-break: break-all;`,
          title: timestampStr,
        },
        E.text(timestampStr),
      ),
      E.div(
        {
          class: "histroy-entry-content",
          style: `flex: 15 0 0; padding-right: .25rem; word-break: break-all;`,
          title: contentStr,
        },
        E.text(contentStr),
      ),
      E.div(
        {
          class: "history-entry-created",
          style: `flex: 5 0 0; word-break: break-all;`,
          title: createdStr,
        },
        E.text(createdStr),
      ),
    );
  }

  private async loadMore(): Promise<void> {
    let response = await this.serviceClient.send(
      newGetChatHistoryRequest({
        cursor: this.cursor,
      }),
    );
    for (let chatEntry of response.chatEntries) {
      let mod = this.entryListContainer.val.childElementCount % 2;
      let timestampStr = formatTimestamp(chatEntry.timestamp);
      let createdStr = this.dateFormatter.format(
        new Date(chatEntry.created * 1000),
      );
      this.entryListContainer.val.appendChild(
        HistoryPage.createEntryView(
          mod,
          HostApp[chatEntry.hostApp],
          chatEntry.hostContentId,
          timestampStr,
          chatEntry.content,
          createdStr,
        ),
      );
    }

    this.cursor = response.cursor;
    if (!this.cursor) {
      this.showMoreButton.val.hide();
    }
    this.emit("loaded");
  }

  public remove(): void {
    this.body.remove();
  }
}
