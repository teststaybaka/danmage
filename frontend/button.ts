import EventEmitter = require("events");
import { ColorScheme } from "./color_scheme";
import { Button } from "@selfage/element/button";

// !important since some website will override it.
let COMMON_BUTTON_STYLE =
  `outline: none; border: 0; background-color: initial; ` +
  `font-family: initial !important; font-size: 1.4rem; line-height: 1em; ` +
  `border-radius: .5rem; padding: .8rem 1.2rem;`;

export declare interface FillButton {
  on(event: "click", listener: () => Promise<void>): this;
  on(event: string, listener: Function): this;
}

export class FillButton extends EventEmitter {
  public constructor(public button: Button) {
    super();
  }

  public static create(...childNodes: Node[]): FillButton {
    return new FillButton(
      Button.create(
        `class="fill-button" style="${COMMON_BUTTON_STYLE} ` +
          `color: ${ColorScheme.getPrimaryButtonContent()};"`,
        ...childNodes
      )
    ).init();
  }

  public init(): this {
    this.button.on("enable", () => this.enable());
    this.button.on("disable", () => this.disable());
    this.button.on("down", () => this.down());
    this.button.on("up", () => this.up());
    this.button.on("click", () => this.click());
    this.enable();
    return this;
  }

  public enable(): void {
    this.button.ele.style.backgroundColor = ColorScheme.getPrimaryButtonBackground();
  }

  public disable(): void {
    this.button.ele.style.backgroundColor = ColorScheme.getDisabledPrimaryButtonBackground();
  }

  public down(): void {
    this.button.ele.style.backgroundColor = ColorScheme.getPressedPrimaryButtonBackground();
  }

  public up(): void {
    this.button.ele.style.backgroundColor = ColorScheme.getPrimaryButtonBackground();
  }

  public async click(): Promise<void> {
    await Promise.all(this.listeners("click").map((callback) => callback()));
  }
}

export declare interface TextButton {
  on(event: "click", listener: () => Promise<void>): this;
  on(event: string, listener: Function): this;
}

export class TextButton extends EventEmitter {
  public constructor(public button: Button) {
    super();
  }

  public static create(...childNodes: Node[]): TextButton {
    return new TextButton(
      Button.create(
        `class="text-button" style="${COMMON_BUTTON_STYLE}"`,
        ...childNodes
      )
    ).init();
  }

  public init(): this {
    this.button.on("enable", () => this.enable());
    this.button.on("disable", () => this.disable());
    this.button.on("down", () => this.down());
    this.button.on("up", () => this.up());
    this.button.on("click", () => this.click());
    this.enable();
    return this;
  }

  public enable(): void {
    this.button.ele.style.color = ColorScheme.getContent();
  }

  public disable(): void {
    this.button.ele.style.color = ColorScheme.getDisabledInputContent();
  }

  public down(): void {
    this.button.ele.style.backgroundColor = ColorScheme.getPressedButtonBackground();
  }

  public up(): void {
    this.button.ele.style.backgroundColor = "initial";
  }

  public async click(): Promise<void> {
    await Promise.all(this.listeners("click").map((callback) => callback()));
  }
}
