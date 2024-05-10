import EventEmitter = require("events");
import { ColorScheme } from "../../../color_scheme";
import {
  ENTRY_PADDING_TOP_STYLE,
  INPUT_WIDTH_STYLE,
  LABEL_STYLE,
} from "./styles";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";

export interface SwitchCheckbox {
  on(event: "change", listener: (value: boolean) => void): this;
}

export class SwitchCheckbox extends EventEmitter {
  public static create(
    label: string,
    defaultValue: boolean,
    value: boolean,
  ): SwitchCheckbox {
    return new SwitchCheckbox(label, defaultValue, value);
  }

  private static RADIUS = ".9rem";
  private static TRANSITION_DURATION = ".3s";

  public body: HTMLDivElement;
  private switchBarWrapper = new Ref<HTMLDivElement>();
  private switchBarLeft = new Ref<HTMLDivElement>();
  private switchBarRight = new Ref<HTMLDivElement>();
  private switchCircle = new Ref<HTMLDivElement>();

  public constructor(
    label: string,
    private defaultValue: boolean,
    private value: boolean,
  ) {
    super();
    this.body = E.div(
      {
        class: "switch-checkbox-container",
        style: `display: flex; flex-flow: row nowrap; justify-content: space-between; align-items: center; ${ENTRY_PADDING_TOP_STYLE}`,
      },
      E.div(
        { class: "switch-checkbox-label", style: LABEL_STYLE, title: label },
        E.text(label),
      ),
      E.divRef(
        this.switchBarWrapper,
        {
          class: "switch-checkbox-wrapper",
          style: `position: relative; ${INPUT_WIDTH_STYLE} cursor: pointer;`,
        },
        E.divRef(this.switchBarLeft, {
          class: "switch-checkbox-bar-left",
          style: `display: inline-block; height: 1.8rem; border-radius: ${
            SwitchCheckbox.RADIUS
          } 0 0 ${
            SwitchCheckbox.RADIUS
          }; background-color: ${ColorScheme.getSwitchOffBackground()}; transition: width ${
            SwitchCheckbox.TRANSITION_DURATION
          };`,
        }),
        E.divRef(this.switchBarRight, {
          class: "switch-checkbox-bar-right",
          style: `display: inline-block; height: 1.8rem; border-radius: 0 ${
            SwitchCheckbox.RADIUS
          } ${
            SwitchCheckbox.RADIUS
          } 0; background-color: ${ColorScheme.getSwitchOnBackground()}; transition: width ${
            SwitchCheckbox.TRANSITION_DURATION
          };`,
        }),
        E.divRef(this.switchCircle, {
          class: "switch-checkbox-circle",
          style: `position: absolute; height: 1.8rem; width: 1.8rem; box-sizing: border-box; top: 0; left: -${
            SwitchCheckbox.RADIUS
          }; background-color: ${ColorScheme.getBackground()}; border: .1rem solid ${ColorScheme.getInputBorder()}; border-radius: 50%; transition: margin-left ${
            SwitchCheckbox.TRANSITION_DURATION
          };`,
        }),
      ),
    );
    this.setValue(this.value);

    this.switchBarWrapper.val.addEventListener("click", () =>
      this.toggleSwitch(),
    );
  }

  private setValue(value: boolean): void {
    this.value = value;
    if (this.value) {
      this.switchBarLeft.val.style.width = SwitchCheckbox.RADIUS;
      this.switchBarRight.val.style.width = `calc(100% - ${SwitchCheckbox.RADIUS})`;
      this.switchCircle.val.style.marginLeft = SwitchCheckbox.RADIUS;
    } else {
      this.switchBarLeft.val.style.width = `calc(100% - ${SwitchCheckbox.RADIUS})`;
      this.switchBarRight.val.style.width = SwitchCheckbox.RADIUS;
      this.switchCircle.val.style.marginLeft = `calc(100% - ${SwitchCheckbox.RADIUS})`;
    }
  }

  public toggleSwitch(): void {
    this.setValue(!this.value);
    this.emit("change", this.value);
  }

  public reset(): boolean {
    this.setValue(this.defaultValue);
    return this.value;
  }
}
