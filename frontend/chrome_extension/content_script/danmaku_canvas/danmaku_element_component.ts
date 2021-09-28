import { ChatEntry } from "../../../../interface/chat_entry";
import {
  DisplaySettings,
  PlayerSettings,
} from "../../../../interface/player_settings";
import { BlockPatternTester } from "../block_pattern_tester";
import { E } from "@selfage/element/factory";

let GREYNESS_THRESHOLD = 120;
let FONT_SIZE_SCALE = 1 / 10;

export function reverseColorAsTextShadow(
  red: number,
  green: number,
  blue: number
): string {
  let greyness = (red + green + blue) / 3;
  if (greyness > GREYNESS_THRESHOLD) {
    return "-.2rem 0 black, 0 .2rem black, .2rem 0 black, 0 -.2rem black";
  } else {
    return "-.2rem 0 white, 0 .2rem white, .2rem 0 white, 0 -.2rem white";
  }
}

function removeSelectedChildElements(
  container: HTMLElement | DocumentFragment,
  selector: string
): void {
  let children = container.querySelectorAll(selector);
  for (let i = children.length - 1; i >= 0; i--) {
    children.item(i).remove();
  }
}

function resizeSelectedChildElements(
  container: HTMLElement | DocumentFragment,
  selector: string,
  fontSize: number
): void {
  let children = container.querySelectorAll(selector);
  for (let i = children.length - 1; i >= 0; i--) {
    let child = children.item(i) as HTMLElement;
    child.style.width = `${fontSize * FONT_SIZE_SCALE}rem`;
    child.style.height = `${fontSize * FONT_SIZE_SCALE}rem`;
  }
}

export interface DanmakuElementContentBuilder {
  build: (chatEntry: ChatEntry, displaySettings: DisplaySettings) => string;
}

class StructuredContentBuilder implements DanmakuElementContentBuilder {
  public build(chatEntry: ChatEntry, displaySettings: DisplaySettings): string {
    let textShadow = reverseColorAsTextShadow(255, 255, 255);
    let contentHTML = `<span style="color: white; text-shadow: ${textShadow};">${chatEntry.content}</span>`;
    if (displaySettings.showUserName) {
      return `<span style="color: white; margin-right: .7rem;">${chatEntry.userNickname}</span>${contentHTML}`;
    } else {
      return contentHTML;
    }
  }
}

class YouTubeChatContentBuilder implements DanmakuElementContentBuilder {
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
      "#inline-action-button-container"
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
      (message as HTMLElement).style.textShadow = reverseColorAsTextShadow(
        255,
        255,
        255
      );
    }
    for (let authorName of template.content.querySelectorAll("#author-name")) {
      (authorName as HTMLElement).style.display = "flex";
      (authorName as HTMLElement).style.fontSize = `${
        displaySettings.fontSize * FONT_SIZE_SCALE
      }rem`;
      (authorName as HTMLElement).style.lineHeight = "100%";
      (authorName as HTMLElement).parentElement.style.display = "flex";
      (authorName as HTMLElement).parentElement.style.marginRight = ".8rem";
    }
    for (let subtext of template.content.querySelectorAll("#header-subtext")) {
      (subtext as HTMLElement).style.fontSize = `${
        displaySettings.fontSize * FONT_SIZE_SCALE
      }rem`;
      (subtext as HTMLElement).style.lineHeight = "100%";
    }
    resizeSelectedChildElements(
      template.content,
      ".emoji",
      displaySettings.fontSize
    );
    resizeSelectedChildElements(
      template.content,
      "#author-photo > img",
      displaySettings.fontSize
    );
    resizeSelectedChildElements(
      template.content,
      "#chip-badges",
      displaySettings.fontSize
    );
    resizeSelectedChildElements(
      template.content,
      "#chat-badges div#image",
      displaySettings.fontSize
    );
    resizeSelectedChildElements(
      template.content,
      "#chat-badges img",
      displaySettings.fontSize
    );
    resizeSelectedChildElements(
      template.content,
      "#icon",
      displaySettings.fontSize
    );
    return template.innerHTML;
  }
}

class TwitchChatContentBuilder implements DanmakuElementContentBuilder {
  private static COLON_REPLACER = />: ?<\//;

  public build(chatEntry: ChatEntry, displaySettings: DisplaySettings): string {
    let template = document.createElement("template");
    template.innerHTML = chatEntry.content.replace(
      TwitchChatContentBuilder.COLON_REPLACER,
      `> </`
    );
    removeSelectedChildElements(template.content, ".vod-message__header");
    if (!displaySettings.showUserName) {
      removeSelectedChildElements(template.content, ".chat-badge");
      removeSelectedChildElements(
        template.content,
        ".chat-author__display-name"
      );
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
      displaySettings.fontSize
    );
    resizeSelectedChildElements(
      template.content,
      ".chat-image__container",
      displaySettings.fontSize
    );
    resizeSelectedChildElements(
      template.content,
      ".chat-line__message--emote",
      displaySettings.fontSize
    );
    return template.innerHTML;
  }

  private static setContentStyle(
    texts: NodeListOf<Element>,
    displaySettings: DisplaySettings
  ): void {
    for (let i = 0; i < texts.length; i++) {
      let text = texts.item(i) as HTMLElement;
      text.style.color = "white";
      text.style.textShadow = reverseColorAsTextShadow(255, 255, 255);
      text.style.fontFamily = displaySettings.fontFamily;
    }
  }
}

export enum MoveResult {
  OccupyAndDisplay,
  Display,
  End,
}

export class DanmakuElementComponent {
  private static DANMAKU_ELEMENT_ATTRIBUTES = {
    class: "danmaku-element",
    style: `display: none; flex-flow: row nowrap; align-items: center; position: absolute; top: 0; right: 0; padding: .2rem 1.5rem .2rem 0; z-index: 10; pointer-events: none; white-space: nowrap;`,
  };
  private static OPACITY_SCALE = 1 / 100;
  private static SPEED_SCALE = 1 / 1000; // Scale for time in milliseconds.

  public height: number;
  public posY: number;
  private posX: number;
  private chatEntry: ChatEntry;
  private speed: number;

  public constructor(
    public body: HTMLDivElement,
    private displaySettings: DisplaySettings,
    private blockPatternTester: BlockPatternTester,
    private danmakuElementContentBuilder: DanmakuElementContentBuilder
  ) {}

  public static createStructured(
    playerSettings: PlayerSettings
  ): DanmakuElementComponent {
    return new DanmakuElementComponent(
      E.div(DanmakuElementComponent.DANMAKU_ELEMENT_ATTRIBUTES),
      playerSettings.displaySettings,
      BlockPatternTester.createIdentity(playerSettings.blockSettings),
      new StructuredContentBuilder()
    );
  }

  public static createTwitch(
    playerSettings: PlayerSettings
  ): DanmakuElementComponent {
    return new DanmakuElementComponent(
      E.div(DanmakuElementComponent.DANMAKU_ELEMENT_ATTRIBUTES),
      playerSettings.displaySettings,
      BlockPatternTester.createHtml(playerSettings.blockSettings),
      new TwitchChatContentBuilder()
    );
  }

  public static createYouTube(
    playerSettings: PlayerSettings
  ): DanmakuElementComponent {
    return new DanmakuElementComponent(
      E.div(DanmakuElementComponent.DANMAKU_ELEMENT_ATTRIBUTES),
      playerSettings.displaySettings,
      BlockPatternTester.createHtml(playerSettings.blockSettings),
      new YouTubeChatContentBuilder()
    );
  }

  public setContent(chatEntry: ChatEntry): void {
    this.chatEntry = chatEntry;
    this.body.style.visibility = "hidden";
    this.body.style.display = "flex";
    this.render();
    this.height = this.body.offsetHeight;
  }

  public render(): void {
    this.speed =
      this.displaySettings.speed * DanmakuElementComponent.SPEED_SCALE;
    this.body.style.opacity = `${
      this.displaySettings.opacity * DanmakuElementComponent.OPACITY_SCALE
    }`;
    this.body.style.fontSize = `${
      this.displaySettings.fontSize * FONT_SIZE_SCALE
    }rem`;
    this.body.style.lineHeight = `${
      this.displaySettings.fontSize * FONT_SIZE_SCALE
    }rem`;
    this.body.style.setProperty(
      "fontFamily",
      this.displaySettings.fontFamily,
      "important"
    );
    this.body.innerHTML = this.danmakuElementContentBuilder.build(
      this.chatEntry,
      this.displaySettings
    );
  }

  public startMoving(posY: number): void {
    this.posX = this.body.offsetWidth;
    this.posY = posY;
    this.transform();
    this.body.style.visibility = "visible";
  }

  private transform(): void {
    this.body.style.transform = `translate3d(${this.posX}px, ${this.posY}px, 0)`;
  }

  public moveOneFrame(
    deltaTime: number /* ms */,
    videoWidth: number
  ): MoveResult {
    this.posX -= this.speed * deltaTime;
    this.transform();
    if (this.posX < -videoWidth) {
      return MoveResult.End;
    } else if (this.posX < 0) {
      return MoveResult.Display;
    } else {
      return MoveResult.OccupyAndDisplay;
    }
  }

  public isBlocked(): boolean {
    return this.blockPatternTester.test(this.chatEntry);
  }

  public hide(): void {
    this.body.style.display = "none";
  }

  public remove(): void {
    this.body.remove();
  }
}
