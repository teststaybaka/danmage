import { ChatEntry } from "../../../../interface/chat_entry";
import { DisplaySettings } from "../../../../interface/player_settings";

let FONT_SIZE_SCALE = 1 / 1;
let TEXT_SHADOW =
  "-1px 0 1px black, 0 1px 1px black, 1px 0 1px black, 0 -1px 1px black";

function removeSelectedChildElements(
  container: HTMLElement | DocumentFragment,
  selector: string,
): void {
  let children = container.querySelectorAll(selector);
  for (let i = children.length - 1; i >= 0; i--) {
    children.item(i).remove();
  }
}

function setHeightForSelectedChildElements(
  container: HTMLElement | DocumentFragment,
  selector: string,
  fontSize: number,
): void {
  let children = container.querySelectorAll(selector);
  for (let i = children.length - 1; i >= 0; i--) {
    let child = children.item(i) as HTMLElement;
    child.style.height = `${fontSize * FONT_SIZE_SCALE}px`;
    child.style.width = "auto";
  }
}

function setFontAndColorForSelectedChildElements(
  container: HTMLElement | DocumentFragment,
  selector: string,
  displaySettings: DisplaySettings,
): void {
  let children = container.querySelectorAll(selector);
  for (let i = children.length - 1; i >= 0; i--) {
    let child = children.item(i) as HTMLElement;
    child.style.fontFamily = displaySettings.fontFamily;
    child.style.fontSize = `${displaySettings.fontSize * FONT_SIZE_SCALE}px`;
    child.style.lineHeight = "100%";
    child.style.color = "white";
    child.style.textShadow = TEXT_SHADOW;
  }
}

function setStyleForSelectedChildElements(
  container: HTMLElement | DocumentFragment,
  selector: string,
  styleName: string,
  styleValue: string,
): void {
  let children = container.querySelectorAll(selector);
  for (let i = children.length - 1; i >= 0; i--) {
    let child = children.item(i) as HTMLElement;
    child.style.setProperty(styleName, styleValue);
  }
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
  private static CUSTOM_TAG_OPEN = /<yt-.*? /g;
  private static CUSTOM_TAG_CLOSE = /<\/yt-.*?>/g;

  public build(chatEntry: ChatEntry, displaySettings: DisplaySettings): string {
    let template = document.createElement("template");
    template.innerHTML = chatEntry.content
      .replace(YouTubeChatContentBuilder.CUSTOM_TAG_OPEN, "<div ")
      .replace(YouTubeChatContentBuilder.CUSTOM_TAG_CLOSE, "</div>");
    removeSelectedChildElements(template.content, "#timestamp");
    removeSelectedChildElements(template.content, "#deleted-state");
    removeSelectedChildElements(template.content, "#menu");
    removeSelectedChildElements(
      template.content,
      "#inline-action-button-container",
    );
    removeSelectedChildElements(
      template.content,
      "#action-buttons"
    )
    if (!displaySettings.showUserName) {
      removeSelectedChildElements(template.content, "#author-photo");
      removeSelectedChildElements(template.content, "#author-name");
      removeSelectedChildElements(template.content, "#chat-badges");
    }
    setStyleForSelectedChildElements(
      template.content,
      ".yt-live-chat-text-message-renderer",
      "padding",
      "0px",
    );
    setStyleForSelectedChildElements(
      template.content,
      ".yt-live-chat-text-message-renderer",
      "display",
      "inline-flex",
    );
    setStyleForSelectedChildElements(
      template.content,
      ".yt-live-chat-paid-message-renderer",
      "display",
      "flex",
    )
    setStyleForSelectedChildElements(
      template.content,
      "#chat-badges",
      "margin-right",
      "8px",
    );
    setStyleForSelectedChildElements(
      template.content,
      "#message",
      "flex",
      "0 0 auto",
    );
    setFontAndColorForSelectedChildElements(
      template.content,
      "#message",
      displaySettings,
    );
    setHeightForSelectedChildElements(
      template.content,
      ".emoji",
      displaySettings.fontSize,
    );
    setHeightForSelectedChildElements(
      template.content,
      "#author-photo > img",
      displaySettings.fontSize,
    );
    setHeightForSelectedChildElements(
      template.content,
      "#chip-badges",
      displaySettings.fontSize,
    );
    setHeightForSelectedChildElements(
      template.content,
      "#chat-badges img",
      displaySettings.fontSize,
    );
    return template.innerHTML;
  }
}

export class TwitchLiveChatContentBuilder implements DanmakuElementContentBuilder {
  private static COLON_REPLACER = />: ?<\//;

  public build(chatEntry: ChatEntry, displaySettings: DisplaySettings): string {
    let template = document.createElement("template");
    if (!displaySettings.showUserName) {
      template.innerHTML = chatEntry.content.replace(
        TwitchLiveChatContentBuilder.COLON_REPLACER,
        `> </`,
      );
      removeSelectedChildElements(template.content, ".chat-badge");
      removeSelectedChildElements(
        template.content,
        ".chat-author__display-name",
      );
      removeSelectedChildElements(template.content, ".chat-author__intl-login");
    } else {
      template.innerHTML = chatEntry.content;
    }

    setStyleForSelectedChildElements(
      template.content,
      ".chat-line__message",
      "padding",
      "0px",
    );
    setFontAndColorForSelectedChildElements(
      template.content,
      ".text-fragment",
      displaySettings,
    );
    setFontAndColorForSelectedChildElements(
      template.content,
      ".mention-fragment",
      displaySettings,
    );
    setFontAndColorForSelectedChildElements(
      template.content,
      ".link-fragment",
      displaySettings,
    );
    setHeightForSelectedChildElements(
      template.content,
      ".chat-badge",
      displaySettings.fontSize,
    );
    setHeightForSelectedChildElements(
      template.content,
      ".chat-line__message--emote",
      displaySettings.fontSize,
    );
    return template.innerHTML;
  }
}

export class TwitchVideoChatContentBuilder implements DanmakuElementContentBuilder {
  private static COLON_REPLACER = />: ?<\//;

  public build(chatEntry: ChatEntry, displaySettings: DisplaySettings): string {
    let template = document.createElement("template");
    if (!displaySettings.showUserName) {
      template.innerHTML = chatEntry.content.replace(
        TwitchVideoChatContentBuilder.COLON_REPLACER,
        `> </`,
      );
      removeSelectedChildElements(template.content, ".chat-badge");
      removeSelectedChildElements(
        template.content,
        ".chat-author__display-name",
      );
      removeSelectedChildElements(template.content, ".chat-author__intl-login");
    } else {
      template.innerHTML = chatEntry.content;
    }
    removeSelectedChildElements(template.content, ".vod-message__header"); // Remove timestamp
    setStyleForSelectedChildElements(
      template.content,
      ".vod-message",
      "padding",
      "0px",
    );
    setFontAndColorForSelectedChildElements(
      template.content,
      ".text-fragment",
      displaySettings,
    );
    setFontAndColorForSelectedChildElements(
      template.content,
      ".mention-fragment",
      displaySettings,
    );
    setFontAndColorForSelectedChildElements(
      template.content,
      ".link-fragment",
      displaySettings,
    );
    setHeightForSelectedChildElements(
      template.content,
      ".chat-badge",
      displaySettings.fontSize,
    );
    setHeightForSelectedChildElements(
      template.content,
      ".chat-line__message--emote",
      displaySettings.fontSize,
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
        template.content,
        ".seventv-chat-user-badge-list",
      );
      removeSelectedChildElements(
        template.content,
        ".seventv-chat-user-username",
      );
    } else {
      template.innerHTML = chatEntry.content;
    }
    setStyleForSelectedChildElements(
      template.content,
      ".seventv-chat-message-background",
      "padding",
      "0px",
    );
    setFontAndColorForSelectedChildElements(
      template.content,
      ".seventv-chat-message-body",
      displaySettings,
    );
    setHeightForSelectedChildElements(
      template.content,
      ".seventv-chat-badge > img",
      displaySettings.fontSize,
    );
    setHeightForSelectedChildElements(
      template.content,
      ".seventv-chat-emote",
      displaySettings.fontSize,
    );
    return template.innerHTML;
  }
}
