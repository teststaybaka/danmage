import EventEmitter = require("events");
import { FILLED_BUTTON_STYLE, TEXT_BUTTON_STYLE } from "./button_styles";
import { ColorScheme } from "./color_scheme";
import { E } from "@selfage/element/factory";

export interface BlockingButton {
  on(event: "action", listener: () => Promise<void>): this;
  on(event: "postAction", listener: (error?: Error) => void): this;
}

export abstract class BlockingButton extends EventEmitter {
  protected body_: HTMLButtonElement;
  private displayStyle: string;
  private cursorStyle: string;

  public constructor(customStyle: string) {
    super();
    this.body_ = E.button({
      class: "blocking-button",
      style: customStyle,
      type: "button",
    });
    this.displayStyle = this.body.style.display;
    this.cursorStyle = this.body.style.cursor;

    this.body.addEventListener("click", () => this.handleClick());
  }

  private async handleClick(): Promise<void> {
    this.disable();
    try {
      await Promise.all(this.listeners("action").map((callback) => callback()));
    } catch (e) {
      this.enable();
      this.emit("postAction", e);
      return;
    }
    this.enable();
    this.emit("postAction");
  }

  public append(...childNodes: Array<Node>): this {
    this.body.append(...childNodes);
    return this;
  }

  public get body() {
    return this.body_;
  }

  public enable(): this {
    this.body.style.cursor = this.cursorStyle;
    this.body.disabled = false;
    this.enableOverride();
    return this;
  }
  protected abstract enableOverride(): void;

  public disable(): this {
    this.body.style.cursor = "not-allowed";
    this.body.disabled = true;
    this.disableOverride();
    return this;
  }
  protected abstract disableOverride(): void;

  public click(): void {
    this.body.click();
  }

  public show(): this {
    this.body.style.display = this.displayStyle;
    return this;
  }

  public hide(): this {
    this.body.style.display = "none";
    return this;
  }

  public remove(): void {
    this.body.remove();
  }
}

export class FilledBlockingButton extends BlockingButton {
  public static create(customStyle: string): FilledBlockingButton {
    return new FilledBlockingButton(customStyle);
  }

  public constructor(customStyle: string) {
    super(`${FILLED_BUTTON_STYLE} ${customStyle}`);
  }

  protected enableOverride(): void {
    this.body.style.backgroundColor = ColorScheme.getPrimaryButtonBackground();
  }

  protected disableOverride(): void {
    this.body.style.backgroundColor =
      ColorScheme.getDisabledPrimaryButtonBackground();
  }
}

export class TextBlockingButton extends BlockingButton {
  public static create(customStyle: string): TextBlockingButton {
    return new TextBlockingButton(customStyle);
  }

  public constructor(customStyle: string) {
    super(`${TEXT_BUTTON_STYLE} ${customStyle}`);
  }

  protected enableOverride(): void {
    this.body.style.color = ColorScheme.getContent();
  }

  protected disableOverride(): void {
    this.body.style.color = ColorScheme.getDisabledInputContent();
  }
}
