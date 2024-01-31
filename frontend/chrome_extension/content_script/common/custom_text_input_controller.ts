import EventEmitter = require("events");
import { TextInputController } from "@selfage/element/text_input_controller";

export declare interface CustomTextInputController {
  on(event: "enter", listener: () => Promise<void> | void): this;
}

export class CustomTextInputController extends EventEmitter {
  public constructor(
    private input: HTMLInputElement,
    private textInputController: TextInputController
  ) {
    super();
  }

  public static create(input: HTMLInputElement): CustomTextInputController {
    return new CustomTextInputController(
      input,
      TextInputController.create(input)
    ).init();
  }

  public init(): this {
    this.textInputController.on("enter", () => this.enter());
    this.input.addEventListener("keydown", (event: KeyboardEvent) =>
      this.keydown(event)
    );
    this.input.addEventListener("keyup", (event: KeyboardEvent) =>
      event.stopPropagation()
    );
    this.input.addEventListener("keypress", (event: KeyboardEvent) =>
      event.stopPropagation()
    );
    return this;
  }

  private keydown(event: KeyboardEvent): void {
    this.input.dispatchEvent(
      new MouseEvent("mousemove", {
        bubbles: true,
        clientX: Math.random() * 10,
        clientY: Math.random() * 10,
      })
    );
    event.stopPropagation();
  }

  private enter(): void {
    this.emit("enter");
  }
}
