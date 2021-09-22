import EventEmitter = require("events");
import { ColorScheme } from "../../../color_scheme";
import {
  ENTRY_MARGIN_TOP_STYLE,
  INPUT_WIDTH_STYLE,
  LABEL_STYLE,
} from "./common";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";

export interface SwitchCheckboxComponent {
  on(event: "change", listener: (value: boolean) => void): this;
}

export class SwitchCheckboxComponent extends EventEmitter {
  private static RADIUS = ".9rem";
  private static TRANSITION_DURATION = ".3s";

  public constructor(
    public body: HTMLDivElement,
    private switchBarWrapper: HTMLDivElement,
    private switchBarLeft: HTMLDivElement,
    private switchBarRight: HTMLDivElement,
    private switchCircle: HTMLDivElement,
    private defaultValue: boolean,
    private value: boolean
  ) {
    super();
  }

  public static create(
    label: string,
    defaultValue: boolean,
    value: boolean
  ): SwitchCheckboxComponent {
    return new SwitchCheckboxComponent(
      ...SwitchCheckboxComponent.createView(label),
      defaultValue,
      value
    ).init();
  }

  public static createView(label: string) {
    let switchBarWrapperRef = new Ref<HTMLDivElement>();
    let switchBarLeftRef = new Ref<HTMLDivElement>();
    let switchBarRightRef = new Ref<HTMLDivElement>();
    let switchCircleRef = new Ref<HTMLDivElement>();
    let body = E.div(
      {
        class: "switch-checkbox-container",
        style: `display: flex; flex-flow: row nowrap; justify-content: space-between; align-items: center; ${ENTRY_MARGIN_TOP_STYLE}`,
      },
      E.div(
        { class: "switch-checkbox-label", style: LABEL_STYLE, title: label },
        E.text(label)
      ),
      E.divRef(
        switchBarWrapperRef,
        {
          class: "switch-checkbox-wrapper",
          style: `position: relative; ${INPUT_WIDTH_STYLE} cursor: pointer;`,
        },
        E.divRef(switchBarLeftRef, {
          class: "switch-checkbox-bar-left",
          style: `display: inline-block; height: 1.8rem; border-radius: ${
            SwitchCheckboxComponent.RADIUS
          } 0 0 ${
            SwitchCheckboxComponent.RADIUS
          }; background-color: ${ColorScheme.getSwitchOffBackground()}; transition: width ${
            SwitchCheckboxComponent.TRANSITION_DURATION
          };`,
        }),
        E.divRef(switchBarRightRef, {
          class: "switch-checkbox-bar-right",
          style: `display: inline-block; height: 1.8rem; border-radius: 0 ${
            SwitchCheckboxComponent.RADIUS
          } ${
            SwitchCheckboxComponent.RADIUS
          } 0; background-color: ${ColorScheme.getSwitchOnBackground()}; transition: width ${
            SwitchCheckboxComponent.TRANSITION_DURATION
          };`,
        }),
        E.divRef(switchCircleRef, {
          class: "switch-checkbox-circle",
          style: `position: absolute; height: 1.8rem; width: 1.8rem; box-sizing: border-box; top: 0; left: -${
            SwitchCheckboxComponent.RADIUS
          }; background-color: ${ColorScheme.getBackground()}; border: .1rem solid ${ColorScheme.getInputBorder()}; border-radius: 50%; transition: margin-left ${
            SwitchCheckboxComponent.TRANSITION_DURATION
          };`,
        })
      )
    );
    return [
      body,
      switchBarWrapperRef.val,
      switchBarLeftRef.val,
      switchBarRightRef.val,
      switchCircleRef.val,
    ] as const;
  }

  public init(): this {
    this.setValue(this.value);
    this.switchBarWrapper.addEventListener("click", () => this.toggleSwitch());
    return this;
  }

  private setValue(value: boolean): void {
    this.value = value;
    if (this.value) {
      this.switchBarLeft.style.width = SwitchCheckboxComponent.RADIUS;
      this.switchBarRight.style.width = `calc(100% - ${SwitchCheckboxComponent.RADIUS})`;
      this.switchCircle.style.marginLeft = SwitchCheckboxComponent.RADIUS;
    } else {
      this.switchBarLeft.style.width = `calc(100% - ${SwitchCheckboxComponent.RADIUS})`;
      this.switchBarRight.style.width = SwitchCheckboxComponent.RADIUS;
      this.switchCircle.style.marginLeft = `calc(100% - ${SwitchCheckboxComponent.RADIUS})`;
    }
  }

  private toggleSwitch(): void {
    this.setValue(!this.value);
    this.emit("change", this.value);
  }

  public reset(): boolean {
    this.setValue(this.defaultValue);
    return this.value;
  }
}
