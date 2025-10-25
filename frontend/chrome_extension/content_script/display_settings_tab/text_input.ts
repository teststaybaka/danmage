import EventEmitter = require("events");
import { CustomTextInputController } from "../common/custom_text_input_controller";
import {
  ENTRY_PADDING_TOP_STYLE,
  LABEL_STYLE,
  TEXT_INPUT_STYLE,
} from "./styles";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";

export interface TextInput {
  on(event: "change", listener: (value: string) => void): this;
}

export class TextInput extends EventEmitter {
  public static create(
    label: string,
    defaultValue: string,
    value: string,
  ): TextInput {
    return new TextInput(label, defaultValue, value);
  }

  public body: HTMLDivElement;
  private input = new Ref<HTMLInputElement>();
  private textInputController: CustomTextInputController;

  public constructor(
    label: string,
    private defaultValue: string,
    value: string,
  ) {
    super();
    this.body = E.div(
      {
        class: "text-input-container",
        style: `display: flex; flex-flow: row nowrap; justify-content: space-between; align-items: center; ${ENTRY_PADDING_TOP_STYLE}`,
      },
      E.div(
        { class: "text-input-label", style: LABEL_STYLE, title: label },
        E.text(label),
      ),
      E.input({
        ref: this.input,
        class: "text-input",
        style: TEXT_INPUT_STYLE,
        value: value,
      }),
    );
    this.textInputController = CustomTextInputController.create(this.input.val);

    this.textInputController.on("enter", () => this.changeValue());
    this.input.val.addEventListener("blur", () => this.changeValue());
  }

  private changeValue(): void {
    if (!this.input.val.value) {
      this.input.val.value = this.defaultValue;
    }
    this.emit("change", this.input.val.value);
  }

  public reset(): string {
    this.input.val.value = this.defaultValue;
    return this.defaultValue;
  }
}
