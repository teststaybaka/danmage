import { ChatEntry } from "../../../../interface/chat_entry";
import {
  DisplaySettings,
  PlayerSettings,
} from "../../../../interface/player_settings";
import { BlockPatternTester } from "../block_pattern_tester";
import { USERNAME_SEPARATOR } from "../common";
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
    if (displaySettings.showUserName) {
      body.innerHTML = `${chatEntry.userNickname}${USERNAME_SEPARATOR}${chatEntry.content}`;
    } else {
      body.innerHTML = chatEntry.content;
    }
    body.style.color = "white";
    body.style.textShadow = reverseColorAsTextShadow(255, 255, 255);
  }
}

class TwitchChatCustomizer implements DanmakuElementCustomizer {
  private static COLOR_EXTRACTION_REGEX = /^rgb\((.*),(.*),(.*)\)$/;
  private static COLON_REPLACER = />: ?<\//;

  public render(
    body: HTMLDivElement,
    chatEntry: ChatEntry,
    displaySettings: DisplaySettings
  ): void {
    body.innerHTML = chatEntry.content.replace(
      TwitchChatCustomizer.COLON_REPLACER,
      `></`
    );

    if (displaySettings.showUserName) {
      let nameElement = body.querySelector(
        ".chat-author__display-name"
      ) as HTMLElement;
      if (nameElement) {
        let matched = body.style.color.match(
          TwitchChatCustomizer.COLOR_EXTRACTION_REGEX
        );
        if (matched) {
          let red = parseInt(matched[1].trim());
          let green = parseInt(matched[2].trim());
          let blue = parseInt(matched[3].trim());
          nameElement.style.textShadow = reverseColorAsTextShadow(
            red,
            green,
            blue
          );
        }
      }
    } else {
      removeSelectedChildElements(body, ".chat-badge");
      removeSelectedChildElements(body, ".chat-author__display-name");
    }

    let texts = body.querySelectorAll(".text-fragment");
    TwitchChatCustomizer.setContentStyle(texts, displaySettings);
    let mentions = body.querySelectorAll(".mention-fragment");
    TwitchChatCustomizer.setContentStyle(mentions, displaySettings);
    let links = body.querySelectorAll(".link-fragment");
    TwitchChatCustomizer.setContentStyle(links, displaySettings);
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

class YouTubeChatCustomizer implements DanmakuElementCustomizer {
  public render(
    body: HTMLDivElement,
    chatEntry: ChatEntry,
    displaySettings: DisplaySettings
  ): void {
    if (displaySettings.showUserName) {
      body.innerHTML = `${chatEntry.userNickname}${USERNAME_SEPARATOR}${chatEntry.content}`;
    } else {
      body.innerHTML = chatEntry.content;
    }

    removeSelectedChildElements(body, "#chip-badges");

    body.style.color = "white";
    body.style.textShadow = reverseColorAsTextShadow(255, 255, 255);

    let emojis = body.querySelectorAll(".emoji");
    for (let i = 0; i < emojis.length; i++) {
      let emoji = emojis.item(i) as HTMLElement;
      emoji.style.width = `${displaySettings.fontSize * FONT_SIZE_SCALE}rem`;
      emoji.style.height = `${displaySettings.fontSize * FONT_SIZE_SCALE}rem`;
      emoji.style.marginLeft = ".2rem";
      emoji.style.marginRight = ".2rem";
      emoji.style.display = "inline-block";
      emoji.style.verticalAlign = "bottom";
    }
  }
}

export enum MoveResult {
  OccupyAndDisplay,
  Display,
  End,
}

export class DanmakuElementComponent {
  private static DANMAKU_ELEMENT_ATTRIBUTES =
    `class="danmaku-element" style="display: none; flex-flow: row nowrap; ` +
    `align-items: center; position: absolute; top: 0; right: 0; ` +
    `padding: .2rem; z-index: 10; pointer-events: none;"`;
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
