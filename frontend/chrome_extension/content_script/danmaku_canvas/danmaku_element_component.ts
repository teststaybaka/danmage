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
  container: HTMLElement,
  selector: string
): void {
  let children = container.querySelectorAll(selector);
  for (let i = children.length - 1; i >= 0; i--) {
    children.item(i).remove();
  }
}

function resizeSelectedChildElements(
  container: HTMLElement,
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

export interface DanmakuElementCustomizer {
  render: (
    body: HTMLDivElement,
    chatEntry: ChatEntry,
    displaySettings: DisplaySettings
  ) => void;
}

class StructuredCustomizer implements DanmakuElementCustomizer {
  public render(
    body: HTMLDivElement,
    chatEntry: ChatEntry,
    displaySettings: DisplaySettings
  ): void {
    let textShadow = reverseColorAsTextShadow(255, 255, 255);
    let contentHTML = `<span style="color: white; text-shadow: ${textShadow};">${chatEntry.content}</span>`;
    if (displaySettings.showUserName) {
      body.innerHTML = `<span style="color: white;">${chatEntry.userNickname}</span> ${contentHTML}`;
    } else {
      body.innerHTML = contentHTML;
    }
  }
}

class YouTubeChatCustomizer implements DanmakuElementCustomizer {
  private static CUSTOM_TAG_OPEN = /<yt-.*? /g;
  private static CUSTOM_TAG_CLOSE = /<\/yt-.*?>/g;

  public render(
    body: HTMLDivElement,
    chatEntry: ChatEntry,
    displaySettings: DisplaySettings
  ): void {
    body.innerHTML = chatEntry.content
      .replace(YouTubeChatCustomizer.CUSTOM_TAG_OPEN, "<div ")
      .replace(YouTubeChatCustomizer.CUSTOM_TAG_CLOSE, "</div>");
    removeSelectedChildElements(body, "#timestamp");
    removeSelectedChildElements(body, "#deleted-state");
    removeSelectedChildElements(body, "#menu");
    removeSelectedChildElements(body, "#inline-action-button-container");
    if (!displaySettings.showUserName) {
      removeSelectedChildElements(body, "#author-photo");
      removeSelectedChildElements(body, "#author-name");
      removeSelectedChildElements(body, "#chat-badges");
    }

    for (let content of body.querySelectorAll("#content")) {
      (content as HTMLElement).style.display = "flex";
    }
    for (let message of body.querySelectorAll("#message")) {
      (message as HTMLElement).style.lineHeight = "100%";
      (message as HTMLElement).style.color = "white";
      (message as HTMLElement).style.textShadow = reverseColorAsTextShadow(
        255,
        255,
        255
      );
    }
    for (let authorName of body.querySelectorAll("#author-name")) {
      (authorName as HTMLElement).style.display = "flex";
      (authorName as HTMLElement).style.fontSize = `${
        displaySettings.fontSize * FONT_SIZE_SCALE
      }rem`;
      (authorName as HTMLElement).style.lineHeight = "100%";
      (authorName as HTMLElement).parentElement.style.display = "flex";
      (authorName as HTMLElement).parentElement.style.marginRight = ".8rem";
    }
    for (let subtext of body.querySelectorAll("#header-subtext")) {
      (subtext as HTMLElement).style.fontSize = `${
        displaySettings.fontSize * FONT_SIZE_SCALE
      }rem`;
      (subtext as HTMLElement).style.lineHeight = "100%";
    }
    resizeSelectedChildElements(body, ".emoji", displaySettings.fontSize);
    resizeSelectedChildElements(
      body,
      "#author-photo > img",
      displaySettings.fontSize
    );
    resizeSelectedChildElements(body, "#chip-badges", displaySettings.fontSize);
    resizeSelectedChildElements(
      body,
      "#chat-badges div#image",
      displaySettings.fontSize
    );
    resizeSelectedChildElements(
      body,
      "#chat-badges img",
      displaySettings.fontSize
    );
    resizeSelectedChildElements(body, "#icon", displaySettings.fontSize);
  }
}

class TwitchChatCustomizer implements DanmakuElementCustomizer {
  private static COLON_REPLACER = />: ?<\//;

  public render(
    body: HTMLDivElement,
    chatEntry: ChatEntry,
    displaySettings: DisplaySettings
  ): void {
    body.innerHTML = chatEntry.content.replace(
      TwitchChatCustomizer.COLON_REPLACER,
      `> </`
    );
    removeSelectedChildElements(body, ".vod-message__header");
    if (!displaySettings.showUserName) {
      removeSelectedChildElements(body, ".chat-badge");
      removeSelectedChildElements(body, ".chat-author__display-name");
    }

    let texts = body.querySelectorAll(".text-fragment");
    TwitchChatCustomizer.setContentStyle(texts, displaySettings);
    let mentions = body.querySelectorAll(".mention-fragment");
    TwitchChatCustomizer.setContentStyle(mentions, displaySettings);
    let links = body.querySelectorAll(".link-fragment");
    TwitchChatCustomizer.setContentStyle(links, displaySettings);
    resizeSelectedChildElements(body, ".chat-badge", displaySettings.fontSize);
    resizeSelectedChildElements(
      body,
      ".chat-image__container",
      displaySettings.fontSize
    );
    resizeSelectedChildElements(
      body,
      ".chat-line__message--emote",
      displaySettings.fontSize
    );
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
    private danmakuElementCustomizer: DanmakuElementCustomizer
  ) {}

  public static createStructured(
    playerSettings: PlayerSettings
  ): DanmakuElementComponent {
    return new DanmakuElementComponent(
      E.div(DanmakuElementComponent.DANMAKU_ELEMENT_ATTRIBUTES),
      playerSettings.displaySettings,
      BlockPatternTester.createIdentity(playerSettings.blockSettings),
      new StructuredCustomizer()
    );
  }

  public static createTwitch(
    playerSettings: PlayerSettings
  ): DanmakuElementComponent {
    return new DanmakuElementComponent(
      E.div(DanmakuElementComponent.DANMAKU_ELEMENT_ATTRIBUTES),
      playerSettings.displaySettings,
      BlockPatternTester.createHtml(playerSettings.blockSettings),
      new TwitchChatCustomizer()
    );
  }

  public static createYouTube(
    playerSettings: PlayerSettings
  ): DanmakuElementComponent {
    return new DanmakuElementComponent(
      E.div(DanmakuElementComponent.DANMAKU_ELEMENT_ATTRIBUTES),
      playerSettings.displaySettings,
      BlockPatternTester.createHtml(playerSettings.blockSettings),
      new YouTubeChatCustomizer()
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
    this.danmakuElementCustomizer.render(
      this.body,
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
    this.body.style.transform = `translate(${this.posX}px, ${this.posY}px)`;
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
