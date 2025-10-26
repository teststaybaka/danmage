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

function resizeSelectedChildElements(
  container: HTMLElement | DocumentFragment,
  selector: string,
  fontSize: number,
): void {
  let children = container.querySelectorAll(selector);
  for (let i = children.length - 1; i >= 0; i--) {
    let child = children.item(i) as HTMLElement;
    child.style.width = `${fontSize * FONT_SIZE_SCALE}px`;
    child.style.height = `${fontSize * FONT_SIZE_SCALE}px`;
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
    if (!displaySettings.showUserName) {
      removeSelectedChildElements(template.content, "#author-photo");
      removeSelectedChildElements(template.content, "#author-name");
      removeSelectedChildElements(template.content, "#chat-badges");
    }

    for (let content of template.content.querySelectorAll("#content")) {
      (content as HTMLElement).style.display = "flex";
    }
    for (let message of template.content.querySelectorAll("#message")) {
      (message as HTMLElement).style.lineHeight = "100%";
      (message as HTMLElement).style.color = "white";
      (message as HTMLElement).style.textShadow = TEXT_SHADOW;
    }
    for (let authorName of template.content.querySelectorAll("#author-name")) {
      (authorName as HTMLElement).style.display = "flex";
      (authorName as HTMLElement).style.fontSize = `${
        displaySettings.fontSize * FONT_SIZE_SCALE
      }px`;
      (authorName as HTMLElement).style.lineHeight = "100%";
      (authorName as HTMLElement).parentElement.style.display = "flex";
      (authorName as HTMLElement).parentElement.style.marginRight = "8px";
    }
    for (let subtext of template.content.querySelectorAll("#header-subtext")) {
      (subtext as HTMLElement).style.fontSize = `${
        displaySettings.fontSize * FONT_SIZE_SCALE
      }px`;
      (subtext as HTMLElement).style.lineHeight = "100%";
    }
    resizeSelectedChildElements(
      template.content,
      ".emoji",
      displaySettings.fontSize,
    );
    resizeSelectedChildElements(
      template.content,
      "#author-photo > img",
      displaySettings.fontSize,
    );
    resizeSelectedChildElements(
      template.content,
      "#chip-badges",
      displaySettings.fontSize,
    );
    resizeSelectedChildElements(
      template.content,
      "#chat-badges div#image",
      displaySettings.fontSize,
    );
    resizeSelectedChildElements(
      template.content,
      "#chat-badges img",
      displaySettings.fontSize,
    );
    resizeSelectedChildElements(
      template.content,
      "#icon",
      displaySettings.fontSize,
    );
    return template.innerHTML;
  }
}

export class TwitchChatContentBuilder implements DanmakuElementContentBuilder {
  private static COLON_REPLACER = />: ?<\//;

  public build(chatEntry: ChatEntry, displaySettings: DisplaySettings): string {
    let template = document.createElement("template");
    template.innerHTML = chatEntry.content.replace(
      TwitchChatContentBuilder.COLON_REPLACER,
      `> </`,
    );
    removeSelectedChildElements(template.content, ".vod-message__header");
    if (!displaySettings.showUserName) {
      removeSelectedChildElements(template.content, ".chat-badge");
      removeSelectedChildElements(
        template.content,
        ".chat-author__display-name",
      );
      removeSelectedChildElements(template.content, ".chat-author__intl-login");
    }

    let texts = template.content.querySelectorAll(".text-fragment");
    TwitchChatContentBuilder.setContentStyle(texts, displaySettings);
    let mentions = template.content.querySelectorAll(".mention-fragment");
    TwitchChatContentBuilder.setContentStyle(mentions, displaySettings);
    let links = template.content.querySelectorAll(".link-fragment");
    TwitchChatContentBuilder.setContentStyle(links, displaySettings);
    resizeSelectedChildElements(
      template.content,
      ".chat-badge",
      displaySettings.fontSize,
    );
    resizeSelectedChildElements(
      template.content,
      ".chat-image__container",
      displaySettings.fontSize,
    );
    resizeSelectedChildElements(
      template.content,
      ".chat-line__message--emote",
      displaySettings.fontSize,
    );
    return template.innerHTML;
  }

  private static setContentStyle(
    texts: NodeListOf<Element>,
    displaySettings: DisplaySettings,
  ): void {
    for (let i = 0; i < texts.length; i++) {
      let text = texts.item(i) as HTMLElement;
      text.style.color = "white";
      text.style.textShadow = TEXT_SHADOW;
      text.style.fontFamily = displaySettings.fontFamily;
    }
  }
}
