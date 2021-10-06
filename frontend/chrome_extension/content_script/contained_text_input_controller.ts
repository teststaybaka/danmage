import EventEmitter = require("events");
import { TextInputController } from "@selfage/element/text_input_controller";

export declare interface ContainedTextInputController {
  on(event: "enter", listener: () => Promise<void> | void): this;
}

export class ContainedTextInputController extends EventEmitter {
  public constructor(
    private input: HTMLInputElement,
    private textInputController: TextInputController
  ) {
    super();
  }

  public static create(input: HTMLInputElement): ContainedTextInputController {
    return new ContainedTextInputController(
      input,
      TextInputController.create(input)
    ).init();
  }

  public init(): this {
    this.textInputController.on("enter", () => this.enter());
    this.input.addEventListener("keydown", (event: KeyboardEvent) =>
      this.keydown(event)
    );
    return this;
  }

  private keydown(event: KeyboardEvent): void {
    event.stopPropagation();
  }

  private enter(): void {
    this.emit("enter");
  }
}
