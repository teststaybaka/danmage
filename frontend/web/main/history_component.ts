import { HostApp } from "../../../interface/chat_entry";
import { GET_CHAT_HISTORY } from "../../../interface/service";
import { TextButtonComponent } from "../../button_component";
import { ColorScheme } from "../../color_scheme";
import { formatTimestamp } from "../../timestamp_formatter";
import { LOCALIZED_TEXT } from "./locales/localized_text";
import { SERVICE_CLIENT } from "./service_client";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { ServiceClient } from "@selfage/service_client";

export class HistoryComponent {
  private displayStyle: string;
  private buttonDisplayStyle: string;
  private cursor: string;
  private dateFormatter: Intl.DateTimeFormat;

  public constructor(
    public body: HTMLDivElement,
    private entryListContainer: HTMLDivElement,
    private buttonContainer: HTMLDivElement,
    private showMoreButton: TextButtonComponent,
    private serviceClient: ServiceClient
  ) {
    this.dateFormatter = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }

  public static create(): HistoryComponent {
    return new HistoryComponent(
      ...HistoryComponent.createView(
        TextButtonComponent.create(E.text(LOCALIZED_TEXT.showMoreChatsButton))
      ),
      SERVICE_CLIENT
    ).init();
  }

  public static createView(showMoreButton: TextButtonComponent) {
    let entryListContainerRef = new Ref<HTMLDivElement>();
    let buttonContainerRef = new Ref<HTMLDivElement>();
    let body = E.div(
      {
        class: "history-container",
        style: `display: flex; flex-flow: column nowrap; width: 100%; align-items: center;`,
      },
      E.divRef(
        entryListContainerRef,
        {
          class: "history-entry-list",
          style: `width: 100%;`,
        },
        HistoryComponent.createEntryView(
          0,
          LOCALIZED_TEXT.chatVideoSiteLabel,
          LOCALIZED_TEXT.chatVideoIdLabel,
          LOCALIZED_TEXT.chatTimestampLabel,
          LOCALIZED_TEXT.chatContentLabel,
          LOCALIZED_TEXT.chatPostedDateLabel
        )
      ),
      E.divRef(
        buttonContainerRef,
        {
          class: "history-button-container",
          style: `display: block; margin: 1rem 0;`,
        },
        showMoreButton.body
      )
    );
    return [
      body,
      entryListContainerRef.val,
      buttonContainerRef.val,
      showMoreButton,
    ] as const;
  }

  public static createEntryView(
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
      {
        class: "history-entry-container",
        style: `display: flex; flex-flow: row nowrap; width: 100%; padding: .8rem; box-sizing: border-box; font-size: 1.6rem; color: ${ColorScheme.getContent()}; background-color: ${backgroundColor};`,
      },
      E.div(
        {
          class: "history-entry-host-app",
          style: `flex: 2 0 0; padding-right: .5rem; word-break: break-all;`,
          title: hostAppStr,
        },
        E.text(hostAppStr)
      ),
      E.div(
        {
          class: "history-entry-host-content-id",
          style: `flex: 3 0 0; padding-right: .5rem; word-break: break-all;`,
          title: hostContentIdStr,
        },
        E.text(hostContentIdStr)
      ),
      E.div(
        {
          class: "histroy-entry-timestamp",
          style: `flex: 2 0 0; padding-right: .5rem; word-break: break-all;`,
          title: timestampStr,
        },
        E.text(timestampStr)
      ),
      E.div(
        {
          class: "histroy-entry-content",
          style: `flex: 15 0 0; padding-right: .5rem; word-break: break-all;`,
          title: contentStr,
        },
        E.text(contentStr)
      ),
      E.div(
        {
          class: "history-entry-created",
          style: `flex: 5 0 0; word-break: break-all;`,
          title: createdStr,
        },
        E.text(createdStr)
      )
    );
  }

  public init(): this {
    this.displayStyle = this.body.style.display;
    this.buttonDisplayStyle = this.buttonContainer.style.display;
    this.showMoreButton.on("click", () => this.loadMore());
    return this;
  }

  private async loadMore(): Promise<void> {
    let response = await this.serviceClient.fetchAuthed(
      { cursor: this.cursor },
      GET_CHAT_HISTORY
    );
    for (let chatEntry of response.chatEntries) {
      let mod = this.entryListContainer.childElementCount % 2;
      let timestampStr = formatTimestamp(chatEntry.timestamp);
      let createdStr = this.dateFormatter.format(
        new Date(chatEntry.created * 1000)
      );
      this.entryListContainer.appendChild(
        HistoryComponent.createEntryView(
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
      this.buttonContainer.style.display = "none";
    }
  }

  public async show(): Promise<void> {
    this.cursor = undefined;
    while (this.entryListContainer.childElementCount > 1) {
      this.entryListContainer.lastElementChild.remove();
    }
    this.buttonContainer.style.display = this.buttonDisplayStyle;
    this.body.style.display = this.displayStyle;
    await this.showMoreButton.click();
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
