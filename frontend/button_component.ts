import EventEmitter = require("events");
import { ColorScheme } from "./color_scheme";
import { ButtonController } from "@selfage/element/button_controller";
import { E } from "@selfage/element/factory";

// !important since some website will override it.
let COMMON_BUTTON_STYLE =
  `outline: none; border: 0; background-color: initial; ` +
  `font-family: initial !important; font-size: 1.4rem; line-height: 1em; ` +
  `border-radius: .5rem; padding: .8rem 1.2rem;`;

export declare interface FillButtonComponent {
  on(event: "click", listener: () => Promise<void>): this;
  on(event: string, listener: Function): this;
}

export class FillButtonComponent extends EventEmitter {
  public constructor(
    public body: HTMLButtonElement,
    private controller: ButtonController
  ) {
    super();
  }

  public static create(...childNodes: Array<Node>): FillButtonComponent {
    let button = FillButtonComponent.createView(...childNodes);
    return new FillButtonComponent(
      button,
      ButtonController.create(button)
    ).init();
  }

  public static createView(...childNodes: Array<Node>): HTMLButtonElement {
    return E.button(
      `class="fill-button" style="${COMMON_BUTTON_STYLE} ` +
        `color: ${ColorScheme.getPrimaryButtonContent()};"`,
      ...childNodes
    );
  }

  public init(): this {
    this.controller.on("enable", () => this.enable());
    this.controller.on("disable", () => this.disable());
    this.controller.on("down", () => this.down());
    this.controller.on("up", () => this.up());
    this.controller.on("click", () => this.click());
    this.enable();
    return this;
  }

  private enable(): void {
    this.body.style.backgroundColor = ColorScheme.getPrimaryButtonBackground();
  }

  private disable(): void {
    this.body.style.backgroundColor = ColorScheme.getDisabledPrimaryButtonBackground();
  }

  private down(): void {
    this.body.style.backgroundColor = ColorScheme.getPressedPrimaryButtonBackground();
  }

  private up(): void {
    this.body.style.backgroundColor = ColorScheme.getPrimaryButtonBackground();
  }

  private async click(): Promise<void> {
    await Promise.all(this.listeners("click").map((callback) => callback()));
  }

  public async triggerClick(): Promise<void> {
    await this.controller.click();
  }

  public hide(): void {
    this.controller.hide();
  }

  public show(): void {
    this.controller.show();
  }
}

export declare interface TextButtonComponent {
  on(event: "click", listener: () => Promise<void>): this;
  on(event: string, listener: Function): this;
}

export class TextButtonComponent extends EventEmitter {
  public constructor(
    public body: HTMLButtonElement,
    private controller: ButtonController
  ) {
    super();
  }

  public static create(...childNodes: Array<Node>): TextButtonComponent {
    let button = TextButtonComponent.createView(...childNodes);
    return new TextButtonComponent(button, new ButtonController(button)).init();
  }

  public static createView(...childNodes: Array<Node>): HTMLButtonElement {
    return E.button(
      `class="text-button" style="${COMMON_BUTTON_STYLE}"`,
      ...childNodes
    );
  }

  public init(): this {
    this.controller.on("enable", () => this.enable());
    this.controller.on("disable", () => this.disable());
    this.controller.on("down", () => this.down());
    this.controller.on("up", () => this.up());
    this.controller.on("click", () => this.click());
    this.enable();
    return this;
  }

  private enable(): void {
    this.body.style.color = ColorScheme.getContent();
  }

  private disable(): void {
    this.body.style.color = ColorScheme.getDisabledInputContent();
  }

  private down(): void {
    this.body.style.backgroundColor = ColorScheme.getPressedButtonBackground();
  }

  private up(): void {
    this.body.style.backgroundColor = "initial";
  }

  private async click(): Promise<void> {
    await Promise.all(this.listeners("click").map((callback) => callback()));
  }

  public async triggerClick(): Promise<void> {
    await this.controller.click();
  }

  public hide(): void {
    this.controller.hide();
  }

  public show(): void {
    this.controller.show();
  }
}
