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
    private buttonController: ButtonController
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
    this.buttonController.on("enable", () => this.enable());
    this.buttonController.on("disable", () => this.disable());
    this.buttonController.on("down", () => this.down());
    this.buttonController.on("up", () => this.up());
    this.buttonController.on("click", () => this.click());
    this.enable();
    return this;
  }

  public enable(): void {
    this.body.style.backgroundColor = ColorScheme.getPrimaryButtonBackground();
  }

  public disable(): void {
    this.body.style.backgroundColor = ColorScheme.getDisabledPrimaryButtonBackground();
  }

  public down(): void {
    this.body.style.backgroundColor = ColorScheme.getPressedPrimaryButtonBackground();
  }

  public up(): void {
    this.body.style.backgroundColor = ColorScheme.getPrimaryButtonBackground();
  }

  public async click(): Promise<void> {
    await Promise.all(this.listeners("click").map((callback) => callback()));
  }

  public hide(): void {
    this.buttonController.hide();
  }

  public show(): void {
    this.buttonController.show();
  }
}

export declare interface TextButtonComponent {
  on(event: "click", listener: () => Promise<void>): this;
  on(event: string, listener: Function): this;
}

export class TextButtonComponent extends EventEmitter {
  public constructor(
    public body: HTMLButtonElement,
    private buttonController: ButtonController
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
    this.buttonController.on("enable", () => this.enable());
    this.buttonController.on("disable", () => this.disable());
    this.buttonController.on("down", () => this.down());
    this.buttonController.on("up", () => this.up());
    this.buttonController.on("click", () => this.click());
    this.enable();
    return this;
  }

  public enable(): void {
    this.body.style.color = ColorScheme.getContent();
  }

  public disable(): void {
    this.body.style.color = ColorScheme.getDisabledInputContent();
  }

  public down(): void {
    this.body.style.backgroundColor = ColorScheme.getPressedButtonBackground();
  }

  public up(): void {
    this.body.style.backgroundColor = "initial";
  }

  public async click(): Promise<void> {
    await Promise.all(this.listeners("click").map((callback) => callback()));
  }

  public hide(): void {
    this.buttonController.hide();
  }

  public show(): void {
    this.buttonController.show();
  }
}
