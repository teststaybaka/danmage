import EventEmitter = require("events");
import { CustomTextInputController } from "../common/custom_text_input_controller";
import {
  ENTRY_PADDING_TOP_STYLE,
  LABEL_STYLE,
  TEXT_INPUT_STYLE,
} from "./styles";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";

export interface TextInputComponent {
  on(event: "change", listener: (value: string) => void): this;
}

export class TextInputComponent extends EventEmitter {
  public body: HTMLDivElement;
  private input: HTMLInputElement;
  private textInputController: CustomTextInputController;

  public constructor(
    label: string,
    private defaultValue: string,
    value: string,
    private textInputControllerFactoryFn: (
      input: HTMLInputElement
    ) => CustomTextInputController
  ) {
    super();
    let inputRef = new Ref<HTMLInputElement>();
    this.body = E.div(
      {
        class: "text-input-container",
        style: `display: flex; flex-flow: row nowrap; justify-content: space-between; align-items: center; ${ENTRY_PADDING_TOP_STYLE}`,
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
    this.input = inputRef.val;
  }

  public static create(
    label: string,
    defaultValue: string,
    value: string
  ): TextInputComponent {
    return new TextInputComponent(
      label,
      defaultValue,
      value,
      CustomTextInputController.create
    ).init();
  }

  public init(): this {
    this.textInputController = this.textInputControllerFactoryFn(this.input);
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
