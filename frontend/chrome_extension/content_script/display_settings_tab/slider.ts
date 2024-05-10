import EventEmitter = require("events");
import { ColorScheme } from "../../../color_scheme";
import { FONT_M } from "../../../font_sizes";
import { NumberRange } from "../common/number_range";
import { CustomTextInputController } from "../common/custom_text_input_controller";
import {
  ENTRY_PADDING_TOP_STYLE,
  LABEL_STYLE,
  TEXT_INPUT_STYLE,
} from "./styles";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";

export interface Slider {
  on(event: "change", listener: (value: number) => void): this;
}

export class Slider extends EventEmitter {
  public static create(
    label: string,
    numberRange: NumberRange,
    value: number,
  ): Slider {
    return new Slider(label, numberRange, value);
  }

  public body: HTMLDivElement;
  private valueInput = new Ref<HTMLInputElement>();
  private barWrapper = new Ref<HTMLDivElement>();
  private cursor = new Ref<HTMLDivElement>();
  private textInputController: CustomTextInputController;

  public constructor(
    label: string,
    private numberRange: NumberRange,
    value: number,
  ) {
    super();
    this.body = E.div(
      { class: "slider-container", style: ENTRY_PADDING_TOP_STYLE },
      E.div(
        {
          class: "slider-input-line",
          style: `display: flex; flex-flow: row nowrap; justify-content: space-between; align-items: center;`,
        },
        E.div(
          { class: "slider-label", style: LABEL_STYLE, title: label },
          E.text(label),
        ),
        E.inputRef(this.valueInput, {
          class: "slider-value-input",
          style: TEXT_INPUT_STYLE,
          value: `${value}`,
        }),
      ),
      E.div(
        {
          class: "slider-bar-line",
          style: `display: flex; flex-flow: row nowrap; align-items: center;`,
        },
        E.div(
          {
            class: "slider-min-value-label",
            style: `font-size: ${FONT_M}rem; line-height: 100%; font-family: initial !important; margin-right: 1rem; color: ${ColorScheme.getContent()};`,
          },
          E.text(`${numberRange.minValue}`),
        ),
        E.divRef(
          this.barWrapper,
          {
            class: "slider-bar-wrapper",
            style: `position: relative; flex-grow: 1; cursor: pointer; user-select: none;`,
          },
          E.div({
            class: "slider-bar",
            style: `height: .4rem; margin: 1rem 0; background-color: ${ColorScheme.getInputBorder()}; border-radius: .2rem;`,
          }),
          E.divRef(this.cursor, {
            class: "slider-cursor",
            style: `position: absolute; width: 1rem; height: 1rem; border-radius: 50%; left: -.5rem; top: .7rem; background-color: ${ColorScheme.getBackground()}; border: .1rem solid ${ColorScheme.getInputBorder()}; pointer-events: none;`,
          }),
        ),
        E.div(
          {
            class: "slider-min-value-label",
            style: `font-size: ${FONT_M}rem; line-height: 100%; font-family: initial !important; margin-left: 1rem; color: ${ColorScheme.getContent()};`,
          },
          E.text(`${numberRange.maxValue}`),
        ),
      ),
    );
    this.textInputController = CustomTextInputController.create(
      this.valueInput.val,
    );
    this.moveCursor(value);

    this.barWrapper.val.addEventListener("pointerdown", (event) =>
      this.startMove(event),
    );
    this.barWrapper.val.addEventListener("pointerup", (event) =>
      this.stopMove(event),
    );
    this.barWrapper.val.addEventListener("dragstart", (event) =>
      event.preventDefault(),
    );
    this.textInputController.on("enter", () => this.changeByInput());
    this.valueInput.val.addEventListener("blur", () => this.changeByInput());
    return this;
  }

  private startMove(event: PointerEvent): void {
    this.barWrapper.val.addEventListener("pointermove", this.changeByCursor);
    this.barWrapper.val.setPointerCapture(event.pointerId);
    this.changeByCursor(event);
  }

  private changeByCursor = (event: PointerEvent): void => {
    let rect = this.barWrapper.val.getBoundingClientRect();
    let pos = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    let percent = pos / rect.width;
    let value =
      this.numberRange.minValue +
      Math.round(
        (this.numberRange.maxValue - this.numberRange.minValue) * percent,
      );
    this.moveCursor(value);

    let valueStr = `${value}`;
    if (this.valueInput.val.value === valueStr) {
      return;
    }
    this.valueInput.val.value = valueStr;
    this.emit("change", value);
  };

  private moveCursor(value: number): void {
    this.cursor.val.style.marginLeft = `${
      ((value - this.numberRange.minValue) /
        (this.numberRange.maxValue - this.numberRange.minValue)) *
      100
    }%`;
  }

  private stopMove(event: PointerEvent): void {
    this.barWrapper.val.removeEventListener("pointermove", this.changeByCursor);
    this.barWrapper.val.releasePointerCapture(event.pointerId);
    this.changeByCursor(event);
  }

  private changeByInput(): void {
    let value = this.numberRange.getValidValue(
      parseInt(this.valueInput.val.value),
    );
    this.valueInput.val.value = `${value}`;
    this.moveCursor(value);
    this.emit("change", value);
  }

  public reset(): number {
    this.valueInput.val.value = `${this.numberRange.defaultValue}`;
    this.moveCursor(this.numberRange.defaultValue);
    return this.numberRange.defaultValue;
  }
}
