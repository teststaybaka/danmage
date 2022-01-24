import EventEmitter = require("events");
import { ColorScheme } from "./color_scheme";
import { ButtonController } from "@selfage/element/button_controller";
import { E } from "@selfage/element/factory";

// !important since some website will override it.
let COMMON_BUTTON_STYLE = `outline: none; border: 0; flex: 0 0 auto; background-color: initial; font-family: initial !important; font-size: 1.4rem; line-height: 100%; border-radius: .5rem; padding: .8rem 1.2rem; cursor: pointer;`;

export declare interface FillButtonComponent {
  on(
    event: "click",
    listener: () => boolean | void | Promise<boolean | void>
  ): this;
}

export class FillButtonComponent extends EventEmitter {
  public body: HTMLButtonElement;
  private controller: ButtonController;

  public constructor(
    childNodes: Array<Node>,
    private buttonControllerFactoryFn: (
      button: HTMLButtonElement
    ) => ButtonController
  ) {
    super();
    this.body = E.button(
      {
        class: "fill-button",
        style: `${COMMON_BUTTON_STYLE} color: ${ColorScheme.getPrimaryButtonContent()};`,
      },
      ...childNodes
    );
  }

  public static create(...childNodes: Array<Node>): FillButtonComponent {
    return new FillButtonComponent(childNodes, ButtonController.create).init();
  }

  public init(): this {
    this.controller = this.buttonControllerFactoryFn(this.body);
    this.controller.on("enable", () => this.enable());
    this.controller.on("disable", () => this.handleDisable());
    this.controller.on("down", () => this.down());
    this.controller.on("up", () => this.up());
    this.controller.on("click", () => this.handleClick());
    this.enable();
    return this;
  }

  private enable(): void {
    this.body.style.backgroundColor = ColorScheme.getPrimaryButtonBackground();
  }

  private handleDisable(): void {
    this.body.style.backgroundColor =
      ColorScheme.getDisabledPrimaryButtonBackground();
  }

  private down(): void {
    this.body.style.backgroundColor =
      ColorScheme.getPressedPrimaryButtonBackground();
  }

  private up(): void {
    this.body.style.backgroundColor = ColorScheme.getPrimaryButtonBackground();
  }

  private async handleClick(): Promise<boolean> {
    let keepDisableds = await Promise.all(
      this.listeners("click").map((callback) => callback())
    );
    return keepDisableds.some((keepDisabled) => keepDisabled);
  }

  public async click(): Promise<void> {
    await this.controller.click();
  }

  public disable(): void {
    this.controller.disable();
  }

  public hide(): void {
    this.controller.hide();
  }

  public show(): void {
    this.controller.show();
  }
}

export declare interface TextButtonComponent {
  on(
    event: "click",
    listener: () => boolean | void | Promise<boolean | void>
  ): this;
}

export class TextButtonComponent extends EventEmitter {
  public body: HTMLButtonElement;
  private controller: ButtonController;

  public constructor(
    childNodes: Array<Node>,
    private buttonControllerFactoryFn: (
      button: HTMLButtonElement
    ) => ButtonController
  ) {
    super();
    this.body = E.button(
      { class: "text-button", style: COMMON_BUTTON_STYLE },
      ...childNodes
    );
  }

  public static create(...childNodes: Array<Node>): TextButtonComponent {
    return new TextButtonComponent(childNodes, ButtonController.create).init();
  }

  public init(): this {
    this.controller = this.buttonControllerFactoryFn(this.body);
    this.controller.on("enable", () => this.enable());
    this.controller.on("disable", () => this.handleDisable());
    this.controller.on("down", () => this.down());
    this.controller.on("up", () => this.up());
    this.controller.on("click", () => this.handleClick());
    this.enable();
    return this;
  }

  private enable(): void {
    this.body.style.color = ColorScheme.getContent();
  }

  private handleDisable(): void {
    this.body.style.color = ColorScheme.getDisabledInputContent();
  }

  private down(): void {
    this.body.style.backgroundColor = ColorScheme.getPressedButtonBackground();
  }

  private up(): void {
    this.body.style.backgroundColor = "initial";
  }

  private async handleClick(): Promise<boolean> {
    let keepDisableds = await Promise.all(
      this.listeners("click").map((callback) => callback())
    );
    return keepDisableds.some((keepDisabled) => keepDisabled);
  }

  public async click(): Promise<void> {
    await this.controller.click();
  }

  public disable(): void {
    this.controller.disable();
  }

  public hide(): void {
    this.controller.hide();
  }

  public show(): void {
    this.controller.show();
  }
}
