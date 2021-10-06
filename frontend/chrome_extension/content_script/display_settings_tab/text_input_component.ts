import EventEmitter = require("events");
import { ContainedTextInputController } from "../text_input_controller";
import {
  ENTRY_MARGIN_TOP_STYLE,
  LABEL_STYLE,
  TEXT_INPUT_STYLE,
} from "./common";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";

export interface TextInputComponent {
  on(event: "change", listener: (value: string) => void): this;
}

export class TextInputComponent extends EventEmitter {
  public constructor(
    public body: HTMLDivElement,
    private input: HTMLInputElement,
    private textInputController: ContainedTextInputController,
    private defaultValue: string
  ) {
    super();
  }

  public static create(
    label: string,
    defaultValue: string,
    value: string
  ): TextInputComponent {
    let views = TextInputComponent.createView(label, value);
    return new TextInputComponent(
      ...views,
      ContainedTextInputController.create(views[1]),
      defaultValue
    ).init();
  }

  public static createView(label: string, value: string) {
    let inputRef = new Ref<HTMLInputElement>();
    let body = E.div(
      {
        class: "text-input-container",
        style: `display: flex; flex-flow: row nowrap; justify-content: space-between; align-items: center; ${ENTRY_MARGIN_TOP_STYLE}`,
      },
      E.div(
        { class: "text-input-label", style: LABEL_STYLE, title: label },
        E.text(label)
      ),
      E.inputRef(inputRef, {
        class: "text-input",
        style: TEXT_INPUT_STYLE,
        value: value,
      })
    );
    return [body, inputRef.val] as const;
  }

  public init(): this {
    this.textInputController.on("enter", () => this.changeValue());
    this.input.addEventListener("blur", () => this.changeValue());
    return this;
  }

  private changeValue(): void {
    if (!this.input.value) {
      this.input.value = this.defaultValue;
    }
    this.emit("change", this.input.value);
  }

  public reset(): string {
    this.input.value = this.defaultValue;
    return this.defaultValue;
  }
}
