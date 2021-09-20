import EventEmitter = require("events");
import { ColorScheme } from "../../../color_scheme";
import { NumberRange } from "../number_range";
import {
  ENTRY_MARGIN_TOP_STYLE,
  LABEL_STYLE,
  TEXT_INPUT_STYLE,
} from "./common";
import { E } from "@selfage/element/factory";
import { TextInputController } from "@selfage/element/text_input_controller";
import { Ref } from "@selfage/ref";

export interface DragBarComponent {
  on(event: "change", listener: (value: number) => void): this;
}

export class DragBarComponent extends EventEmitter {
  public constructor(
    public body: HTMLDivElement,
    private valueInput: HTMLInputElement,
    private barWrapper: HTMLDivElement,
    private cursor: HTMLDivElement,
    private textInputController: TextInputController,
    private numberRange: NumberRange
  ) {
    super();
  }

  public static create(
    label: string,
    numberRange: NumberRange,
    value: number
  ): DragBarComponent {
    let views = DragBarComponent.createView(label, numberRange, value);
    return new DragBarComponent(
      ...views,
      TextInputController.create(views[1]),
      numberRange
    ).init();
  }

  public static createView(
    label: string,
    numberRange: NumberRange,
    value: number
  ) {
    let valueInputRef = new Ref<HTMLInputElement>();
    let barWrapperRef = new Ref<HTMLDivElement>();
    let cursorRef = new Ref<HTMLDivElement>();
    let body = E.div(
      `class="drab-bar-container" style="${ENTRY_MARGIN_TOP_STYLE}"`,
      E.div(
        `class="drag-bar-input-line" style="display: flex; ` +
          `flex-flow: row nowrap; justify-content: space-between; ` +
          `align-items: center;"`,
        E.div(
          `class="drag-bar-label" style="${LABEL_STYLE}" title="${label}"`,
          E.text(label)
        ),
        E.inputRef(
          valueInputRef,
          `class="drag-bar-value-input" style="${TEXT_INPUT_STYLE}" ` +
            `value="${value}"`
        )
      ),
      E.div(
        `class="drag-bar-bar-line" style="display: flex; ` +
          `flex-flow: row nowrap; align-items: center;"`,
        E.div(
          `class="drag-bar-min-value-label" style="font-size: 1.4rem; ` +
            `margin-right: 1rem; font-family: initial !important; ` +
            `color: ${ColorScheme.getContent()};"`,
          E.text(`${numberRange.minValue}`)
        ),
        E.divRef(
          barWrapperRef,
          `class="drag-bar-bar-wrapper" style="position: relative; ` +
            `flex-grow: 1; cursor: pointer; user-select: none;"`,
          E.div(
            `class="drag-bar-bar" style="height: .4rem; margin: 1rem 0;` +
              `background-color: ${ColorScheme.getInputBorder()};` +
              `border-radius: .2rem;"`
          ),
          E.divRef(
            cursorRef,
            `class="drag-bar-cursor" style="position: absolute; width: 1rem;` +
              `height: 1rem; border-radius: 50%; left: -.5rem; top: .7rem;` +
              `background-color: ${ColorScheme.getBackground()};` +
              `border: .1rem solid ${ColorScheme.getInputBorder()};` +
              `pointer-events: none;"`
          )
        ),
        E.div(
          `class="drag-bar-min-value-label" style="font-size: 1.4rem; ` +
            `margin-left: 1rem; font-family: initial !important;` +
            `color: ${ColorScheme.getContent()};"`,
          E.text(`${numberRange.maxValue}`)
        )
      )
    );
    return [body, valueInputRef.val, barWrapperRef.val, cursorRef.val] as const;
  }

  public init(): this {
    let value = parseInt(this.valueInput.value);
    this.moveCursor(value);

    this.barWrapper.addEventListener("mousedown", (event) =>
      this.startMove(event)
    );
    this.barWrapper.addEventListener("mouseup", () => this.stopMove());
    this.barWrapper.addEventListener("mouseleave", () => this.stopMove());
    this.barWrapper.addEventListener("dragstart", (event) =>
      event.preventDefault()
    );
    this.textInputController.on("enter", () => this.changeByInput());
    this.valueInput.addEventListener("blur", () => this.changeByInput());
    return this;
  }

  private startMove(event: MouseEvent): void {
    this.barWrapper.addEventListener("mousemove", this.changeByCursor);
    this.changeByCursor(event);
  }

  private changeByCursor = (event: MouseEvent): void => {
    let rect = this.barWrapper.getBoundingClientRect();
    let pos = new NumberRange(rect.width, 0).getValidValue(
      event.clientX - rect.left
    );
    let percent = pos / rect.width;
    let value =
      this.numberRange.minValue +
      Math.round(
        (this.numberRange.maxValue - this.numberRange.minValue) * percent
      );
    this.moveCursor(value);

    let valueStr = `${value}`;
    if (this.valueInput.value === valueStr) {
      return;
    }
    this.valueInput.value = valueStr;
    this.emit("change", value);
  };

  private moveCursor(value: number): void {
    this.cursor.style.marginLeft = `${
      ((value - this.numberRange.minValue) /
        (this.numberRange.maxValue - this.numberRange.minValue)) *
      100
    }%`;
  }

  private stopMove(): void {
    this.barWrapper.removeEventListener("mousemove", this.changeByCursor);
  }

  private changeByInput(): void {
    if (!this.valueInput.value) {
      this.valueInput.value = `${this.numberRange.defaultValue}`;
    }
    let value = parseInt(this.valueInput.value);
    this.moveCursor(value);
    this.emit("change", value);
  }

  public reset(): number {
    this.valueInput.value = `${this.numberRange.defaultValue}`;
    this.moveCursor(this.numberRange.defaultValue);
    return this.numberRange.defaultValue;
  }
}
