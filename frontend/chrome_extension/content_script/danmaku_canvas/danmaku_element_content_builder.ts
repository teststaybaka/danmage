import { ChatEntry } from "../../../../interface/chat_entry";
import { DisplaySettings } from "../../../../interface/player_settings";

let FONT_SIZE_SCALE = 1 / 1;
let TEXT_SHADOW =
  "-1px 0 1px black, 0 1px 1px black, 1px 0 1px black, 0 -1px 1px black";

function removeSelectedChildElements(children: NodeListOf<Element>): void {
  for (let i = children.length - 1; i >= 0; i--) {
    children.item(i).remove();
  }
}

function setStyleForSelectedChildElements(
  children: NodeListOf<Element>,
  styleAttributes: { [key: string]: string },
): void {
  for (let i = children.length - 1; i >= 0; i--) {
    let child = children.item(i) as HTMLElement;
    for (let styleName in styleAttributes) {
      let styleValue = styleAttributes[styleName];
      child.style.setProperty(styleName, styleValue);
    }
  }
}

function getFontStyles(displaySettings: DisplaySettings): {
  [key: string]: string;
} {
  return {
    "font-family": displaySettings.fontFamily,
    "font-size": `${displaySettings.fontSize * FONT_SIZE_SCALE}px`,
    "line-height": "100%",
  };
}

function getFontAndColorStyles(displaySettings: DisplaySettings): {
  [key: string]: string;
} {
  return {
    ...getFontStyles(displaySettings),
    color: "white",
    "text-shadow": TEXT_SHADOW,
  };
}

function getHeightStyles(fontSize: number): { [key: string]: string } {
  return {
    height: `${fontSize * FONT_SIZE_SCALE}px`,
    width: "auto",
  };
}

export interface DanmakuElementContentBuilder {
  build: (chatEntry: ChatEntry, displaySettings: DisplaySettings) => string;
}

export class StructuredContentBuilder implements DanmakuElementContentBuilder {
  public build(chatEntry: ChatEntry, displaySettings: DisplaySettings): string {
    let contentHTML = `<span style="color: white; text-shadow: ${TEXT_SHADOW};">${chatEntry.content}</span>`;
    if (displaySettings.showUserName) {
      return `<span style="color: white; margin-right: 8px;">${chatEntry.userNickname}</span>${contentHTML}`;
    } else {
      return contentHTML;
    }
  }
}

export class YouTubeChatContentBuilder implements DanmakuElementContentBuilder {
  private static CUSTOM_TAG_OPEN = /<ytd?-.*? /g;
  private static CUSTOM_TAG_CLOSE = /<\/ytd?-.*?>/g;

  public build(chatEntry: ChatEntry, displaySettings: DisplaySettings): string {
    let template = document.createElement("template");
    template.innerHTML = chatEntry.content
      .replace(YouTubeChatContentBuilder.CUSTOM_TAG_OPEN, "<div ")
      .replace(YouTubeChatContentBuilder.CUSTOM_TAG_CLOSE, "</div>");
    removeSelectedChildElements(
      template.content.querySelectorAll("#timestamp"),
    );
    removeSelectedChildElements(
      template.content.querySelectorAll("#deleted-state"),
    );
    removeSelectedChildElements(template.content.querySelectorAll("#menu"));
    removeSelectedChildElements(
      template.content.querySelectorAll("#inline-action-button-container"),
    );
    removeSelectedChildElements(
      template.content.querySelectorAll("#action-buttons"),
    );
    if (!displaySettings.showUserName) {
      removeSelectedChildElements(
        template.content.querySelectorAll("#author-photo"),
      );
      removeSelectedChildElements(
        template.content.querySelectorAll("#author-name"),
      );
      removeSelectedChildElements(
        template.content.querySelectorAll("#chat-badges"),
      );
    }
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(".yt-live-chat-text-message-renderer"),
      {
        padding: "0px",
        display: "inline-flex",
        "align-items": "center",
      },
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll("#message"),
      {
        flex: "0 0 auto",
        display: "inline", // Override .yt-live-chat-text-message-renderer
        ...getFontAndColorStyles(displaySettings),
      },
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll("#author-name"),
      getFontStyles(displaySettings),
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(".emoji"),
      getHeightStyles(displaySettings.fontSize),
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll("#author-photo > img"),
      getHeightStyles(displaySettings.fontSize),
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll("#chip-badges"),
      getHeightStyles(displaySettings.fontSize),
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll("#chat-badges"),
      {
        "margin-right": "8px",
      },
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll("#chat-badges img"),
      getHeightStyles(displaySettings.fontSize),
    );
    // Super chat
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(".yt-live-chat-paid-message-renderer"),
      {
        display: "inline-flex",
        "align-items": "center",
        "background-color": "transparent",
      },
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(
        ".yt-live-chat-paid-message-renderer #header-content-primary-column",
      ),
      {
        "align-items": "flex-start",
      },
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(
        "#card.yt-live-chat-paid-message-renderer",
      ),
      {
        "align-items": "flex-start",
      },
    );
    // Membership chat
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(
        ".yt-live-chat-membership-item-renderer",
      ),
      {
        display: "inline-flex",
        "align-items": "center",
        "background-color": "transparent",
      },
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(
        "#header-primary-text.yt-live-chat-membership-item-renderer",
      ),
      getFontAndColorStyles(displaySettings),
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(
        "#header-subtext.yt-live-chat-membership-item-renderer",
      ),
      {
        margin: "0px",
        "margin-left": "8px",
      },
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(
        "#header-subtext.yt-live-chat-membership-item-renderer",
      ),
      getFontAndColorStyles(displaySettings),
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(
        "#card.yt-live-chat-membership-item-renderer",
      ),
      {
        "align-items": "flex-start",
      },
    );
    // Gifted membership chat
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(
        ".ytd-sponsorships-live-chat-header-renderer",
      ),
      {
        display: "inline-flex",
        "align-items": "center",
        "background-color": "transparent",
      },
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(
        "#primary-text.ytd-sponsorships-live-chat-header-renderer",
      ),
      getFontAndColorStyles(displaySettings),
    );
    return template.innerHTML;
  }
}

export class TwitchChatContentBuilder implements DanmakuElementContentBuilder {
  private static COLON_REPLACER = />: ?<\//;

  public build(chatEntry: ChatEntry, displaySettings: DisplaySettings): string {
    let template = document.createElement("template");
    if (!displaySettings.showUserName) {
      template.innerHTML = chatEntry.content.replace(
        TwitchChatContentBuilder.COLON_REPLACER,
        `> </`,
      );
      removeSelectedChildElements(
        template.content.querySelectorAll(".chat-badge"),
      );
      removeSelectedChildElements(
        template.content.querySelectorAll(".chat-author__display-name"),
      );
      removeSelectedChildElements(
        template.content.querySelectorAll(".chat-author__intl-login"),
      );
    } else {
      template.innerHTML = chatEntry.content;
    }

    setStyleForSelectedChildElements(
      template.content.querySelectorAll(".chat-line__message"),
      { padding: "0px" },
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(".text-fragment"),
      getFontAndColorStyles(displaySettings),
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(".mention-fragment"),
      getFontAndColorStyles(displaySettings),
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(".link-fragment"),
      getFontAndColorStyles(displaySettings),
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(".chat-badge"),
      getHeightStyles(displaySettings.fontSize),
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(".chat-line__message--emote"),
      getHeightStyles(displaySettings.fontSize),
    );
    // Remove timestamp
    removeSelectedChildElements(
      template.content.querySelectorAll(".vod-message__header"),
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(".vod-message"),
      { padding: "0px" },
    );
    return template.innerHTML;
  }
}

export class Twitch7tvChatContentBuilder
  implements DanmakuElementContentBuilder
{
  private static COLON_REPLACER = />: ?<\//;

  public build(chatEntry: ChatEntry, displaySettings: DisplaySettings): string {
    let template = document.createElement("template");
    if (!displaySettings.showUserName) {
      template.innerHTML = chatEntry.content.replace(
        Twitch7tvChatContentBuilder.COLON_REPLACER,
        `> </`,
      );
      removeSelectedChildElements(
        template.content.querySelectorAll(".seventv-chat-user-badge-list"),
      );
      removeSelectedChildElements(
        template.content.querySelectorAll(".seventv-chat-user-username"),
      );
    } else {
      template.innerHTML = chatEntry.content;
    }
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(".seventv-chat-message-background"),
      { padding: "0px" },
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(".seventv-chat-message-body"),
      getFontAndColorStyles(displaySettings),
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(".seventv-chat-badge > img"),
      getHeightStyles(displaySettings.fontSize),
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll(".seventv-chat-emote"),
      getHeightStyles(displaySettings.fontSize),
    );
    return template.innerHTML;
  }
}

export class KickChatContentBuilder implements DanmakuElementContentBuilder {
  private static COLON_REPLACER = />:&nbsp;<\//;

  public build(chatEntry: ChatEntry, displaySettings: DisplaySettings): string {
    let template = document.createElement("template");
    template.innerHTML = chatEntry.content;
    if (!displaySettings.showUserName) {
      template.innerHTML = chatEntry.content.replace(
        KickChatContentBuilder.COLON_REPLACER,
        `> </`,
      );
      // Remove username element
      removeSelectedChildElements(
        template.content.querySelectorAll(
          ".inline-flex.min-w-0.flex-nowrap.items-baseline.rounded.transition-colors",
        ),
      );
    } else {
      template.innerHTML = chatEntry.content;
    }
    // Remove timestamp element
    removeSelectedChildElements(
      template.content.querySelectorAll(".text-neutral.pr-1.font-semibold"),
    );

    setStyleForSelectedChildElements(template.content.querySelectorAll("div"), {
      padding: "0px",
    });
    setStyleForSelectedChildElements(
      template.content.querySelectorAll("span"),
      getFontAndColorStyles(displaySettings),
    );
    // This is the username
    setStyleForSelectedChildElements(
      template.content.querySelectorAll("button"),
      getFontStyles(displaySettings),
    );
    setStyleForSelectedChildElements(
      template.content.querySelectorAll("img"),
      getHeightStyles(displaySettings.fontSize),
    );
    return template.innerHTML;
  }
}
