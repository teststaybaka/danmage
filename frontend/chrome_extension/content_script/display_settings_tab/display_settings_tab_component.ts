import EventEmitter = require("events");
import {
  DisplaySettings,
  DistributionStyle,
} from "../../../../interface/player_settings";
import { ColorScheme } from "../../../color_scheme";
import {
  BOTTOM_MARGIN_RANGE,
  DISTRIBUTION_STYLE_DEFAULT,
  ENABLE_CHAT_SCROLLING_DEFAULT,
  FONT_FAMILY_DEFAULT,
  FONT_SIZE_RANGE,
  NUM_LIMIT_RANGE,
  OPACITY_RANGE,
  SHOW_USER_NAME_DEFAULT,
  SPEED_RANGE,
  TOP_MARGIN_RANGE,
} from "../common/defaults";
import { TAB_SIDE_PADDING } from "../common/styles";
import { DragBarComponent } from "./drag_bar_component";
import { DropdownComponent } from "./dropdown_component";
import { ENTRY_PADDING_TOP_STYLE, INPUT_WIDTH, LABEL_STYLE } from "./styles";
import { SwitchCheckboxComponent } from "./switch_checkbox_component";
import { TextInputComponent } from "./text_input_component";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";

export interface DisplaySettingsTabComponent {
  on(event: "update", listener: () => void): this;
}

export class DisplaySettingsTabComponent extends EventEmitter {
  public body: HTMLDivElement;
  private resetButton: HTMLDivElement;
  private displayStyle: string;

  public constructor(
    private opacityComponent: DragBarComponent,
    private fontSizeComponent: DragBarComponent,
    private numLimitComponent: DragBarComponent,
    private speedComponent: DragBarComponent,
    private topMarginComponent: DragBarComponent,
    private bottomMarginComponent: DragBarComponent,
    private fontFamilyComponent: TextInputComponent,
    private enableComponent: SwitchCheckboxComponent,
    private showUserNameComponent: SwitchCheckboxComponent,
    private distributionStyleComponent: DropdownComponent<DistributionStyle>,
    private displaySettings: DisplaySettings
  ) {
    super();
    let resetButtonRef = new Ref<HTMLDivElement>();
    this.body = E.div(
      {
        class: "display-settings-tab-container",
        style: `padding: 0 ${TAB_SIDE_PADDING} 1rem; box-sizing: border-box; height: 100%; overflow-y: auto;`,
      },
      enableComponent.body,
      opacityComponent.body,
      speedComponent.body,
      fontSizeComponent.body,
      numLimitComponent.body,
      topMarginComponent.body,
      bottomMarginComponent.body,
      fontFamilyComponent.body,
      distributionStyleComponent.body,
      showUserNameComponent.body,
      E.div(
        {
          class: "display-settings-tab-reset-entry",
          style: `display: flex; flex-flow: row nowrap; justify-content: space-between; align-items: center; ${ENTRY_PADDING_TOP_STYLE}`,
        },
        E.div(
          {
            class: "display-settings-tab-reset-label",
            style: LABEL_STYLE,
            title: chrome.i18n.getMessage("resetOption"),
          },
          E.text(chrome.i18n.getMessage("resetOption"))
        ),
        E.divRef(
          resetButtonRef,
          {
            class: "display-settings-tab-reset-button",
            style: `width: 1.8rem; height: 1.8rem; padding: 0 ${
              (INPUT_WIDTH - 1.8) / 2
            }rem; box-sizing: content-box; cursor: pointer;`,
          },
          E.svg(
            {
              class: "display-settings-tab-reset-button-svg",
              style: `display: block; width: 100%; height: 100%; fill: ${ColorScheme.getSvgContent()};`,
              viewBox: "0 0 200 200",
            },
            E.path({
              class: "display-settings-tab-reset-button-path",
              d: "M0 49 L56 0 L56 31 L131 31 A69 69 0 0 1 131 169 L40 169 L40 136 L131 136 A33 33 0 0 0 131 64 L56 64 L56 98 z",
            })
          )
        )
      )
    );
    this.resetButton = resetButtonRef.val;
  }

  public static create(
    displaySettings: DisplaySettings
  ): DisplaySettingsTabComponent {
    return new DisplaySettingsTabComponent(
      DragBarComponent.create(
        chrome.i18n.getMessage("opacityOption"),
        OPACITY_RANGE,
        displaySettings.opacity
      ),
      DragBarComponent.create(
        chrome.i18n.getMessage("fontSizeOption"),
        FONT_SIZE_RANGE,
        displaySettings.fontSize
      ),
      DragBarComponent.create(
        chrome.i18n.getMessage("maxNumOption"),
        NUM_LIMIT_RANGE,
        displaySettings.numLimit
      ),
      DragBarComponent.create(
        chrome.i18n.getMessage("speedOption"),
        SPEED_RANGE,
        displaySettings.speed
      ),
      DragBarComponent.create(
        chrome.i18n.getMessage("topMarginOption"),
        TOP_MARGIN_RANGE,
        displaySettings.topMargin
      ),
      DragBarComponent.create(
        chrome.i18n.getMessage("bottomMarginOption"),
        BOTTOM_MARGIN_RANGE,
        displaySettings.bottomMargin
      ),
      TextInputComponent.create(
        chrome.i18n.getMessage("fontFamilyOption"),
        FONT_FAMILY_DEFAULT,
        displaySettings.fontFamily
      ),
      SwitchCheckboxComponent.create(
        chrome.i18n.getMessage("enableScrollingOption"),
        ENABLE_CHAT_SCROLLING_DEFAULT,
        displaySettings.enable
      ),
      SwitchCheckboxComponent.create(
        chrome.i18n.getMessage("userNameOption"),
        SHOW_USER_NAME_DEFAULT,
        displaySettings.showUserName
      ),
      DropdownComponent.create(
        chrome.i18n.getMessage("distributionStyleOption"),
        {
          kind: DISTRIBUTION_STYLE_DEFAULT,
          localizedMsg: chrome.i18n.getMessage(
            DistributionStyle[DISTRIBUTION_STYLE_DEFAULT]
          ),
        },
        {
          kind: displaySettings.distributionStyle,
          localizedMsg: chrome.i18n.getMessage(
            DistributionStyle[displaySettings.distributionStyle]
          ),
        },
        [
          {
            kind: DistributionStyle.RandomDistributionStyle,
            localizedMsg: chrome.i18n.getMessage(
              DistributionStyle[DistributionStyle.RandomDistributionStyle]
            ),
          },
          {
            kind: DistributionStyle.TopDownDistributionStyle,
            localizedMsg: chrome.i18n.getMessage(
              DistributionStyle[DistributionStyle.TopDownDistributionStyle]
            ),
          },
        ]
      ),
      displaySettings
    ).init();
  }

  public init(): this {
    this.displayStyle = this.body.style.display;
    this.opacityComponent.on("change", (value) => this.opacityChange(value));
    this.fontSizeComponent.on("change", (value) => this.fontSizeChange(value));
    this.numLimitComponent.on("change", (value) => this.numLimitChange(value));
    this.speedComponent.on("change", (value) => this.speedChange(value));
    this.topMarginComponent.on("change", (value) =>
      this.topMarginChange(value)
    );
    this.bottomMarginComponent.on("change", (value) =>
      this.bottomMarginChange(value)
    );
    this.fontFamilyComponent.on("change", (value) =>
      this.fontFamilyChange(value)
    );
    this.enableComponent.on("change", (value) => this.enableChange(value));
    this.showUserNameComponent.on("change", (value) =>
      this.showUserNameChange(value)
    );
    this.distributionStyleComponent.on("change", (value) =>
      this.distributionStyleChange(value)
    );
    this.resetButton.addEventListener("click", () => this.resetSettings());
    return this;
  }

  public opacityChange(value: number): void {
    this.displaySettings.opacity = value;
    this.emit("update");
  }

  public fontSizeChange(value: number): void {
    this.displaySettings.fontSize = value;
    this.emit("update");
  }

  public numLimitChange(value: number): void {
    this.displaySettings.numLimit = value;
    this.emit("update");
  }

  public speedChange(value: number): void {
    this.displaySettings.speed = value;
    this.emit("update");
  }

  public topMarginChange(value: number): void {
    this.displaySettings.topMargin = value;
    this.emit("update");
  }

  public bottomMarginChange(value: number): void {
    this.displaySettings.bottomMargin = value;
    this.emit("update");
  }

  public fontFamilyChange(value: string): void {
    this.displaySettings.fontFamily = value;
    this.emit("update");
  }

  public enableChange(value: boolean): void {
    this.displaySettings.enable = value;
    this.emit("update");
  }

  public showUserNameChange(value: boolean): void {
    this.displaySettings.showUserName = value;
    this.emit("update");
  }

  public distributionStyleChange(value: DistributionStyle): void {
    this.displaySettings.distributionStyle = value;
    this.emit("update");
  }

  public resetSettings(): void {
    this.displaySettings.opacity = this.opacityComponent.reset();
    this.displaySettings.fontSize = this.fontSizeComponent.reset();
    this.displaySettings.numLimit = this.numLimitComponent.reset();
    this.displaySettings.speed = this.speedComponent.reset();
    this.displaySettings.topMargin = this.topMarginComponent.reset();
    this.displaySettings.bottomMargin = this.bottomMarginComponent.reset();
    this.displaySettings.fontFamily = this.fontFamilyComponent.reset();
    this.displaySettings.enable = this.enableComponent.reset();
    this.displaySettings.showUserName = this.showUserNameComponent.reset();
    this.displaySettings.distributionStyle =
      this.distributionStyleComponent.reset();
    this.emit("update");
  }

  public show(): void {
    this.body.style.display = this.displayStyle;
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
