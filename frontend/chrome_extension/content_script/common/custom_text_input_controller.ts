import EventEmitter = require("events");

export declare interface CustomTextInputController {
  on(event: "enter", listener: () => Promise<void> | void): this;
}

export class CustomTextInputController extends EventEmitter {
  public static create(input: HTMLInputElement): CustomTextInputController {
    return new CustomTextInputController(input).init();
  }

  public constructor(private input: HTMLInputElement) {
    super();
  }

  public init(): this {
    this.input.addEventListener("keydown", (event: KeyboardEvent) =>
      this.keydown(event),
    );
    this.input.addEventListener("keyup", (event: KeyboardEvent) =>
      event.stopPropagation(),
    );
    this.input.addEventListener("keypress", (event: KeyboardEvent) =>
      event.stopPropagation(),
    );
    return this;
  }

  private keydown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.emit("enter");
    }
    this.input.dispatchEvent(
      new MouseEvent("mousemove", {
        bubbles: true,
        clientX: Math.random() * 10,
        clientY: Math.random() * 10,
      }),
    );
    event.stopPropagation();
  }
}
