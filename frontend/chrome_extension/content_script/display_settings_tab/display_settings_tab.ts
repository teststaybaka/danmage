import EventEmitter = require("events");
import {
  DisplaySettings,
  DistributionStyle,
} from "../../../../interface/player_settings";
import { ColorScheme } from "../../../color_scheme";
import {
  BOTTOM_MARGIN_RANGE,
  DENSITY_RANGE,
  DISTRIBUTION_STYLE_DEFAULT,
  ENABLE_CHAT_INTERACTION_DEFAULT,
  ENABLE_CHAT_SCROLLING_DEFAULT,
  FONT_FAMILY_DEFAULT,
  FONT_SIZE_RANGE,
  OPACITY_RANGE,
  SHOW_USER_NAME_DEFAULT,
  SPEED_RANGE,
  TOP_MARGIN_RANGE,
} from "../common/defaults";
import { TAB_SIDE_PADDING } from "../common/styles";
import { Dropdown } from "./dropdown";
import { Slider } from "./slider";
import { ENTRY_PADDING_TOP_STYLE, INPUT_WIDTH, LABEL_STYLE } from "./styles";
import { SwitchCheckbox } from "./switch_checkbox";
import { TextInput } from "./text_input";
import { E } from "@selfage/element/factory";
import { Ref, assign } from "@selfage/ref";

export interface DisplaySettingsTab {
  on(event: "update", listener: () => void): this;
}

export class DisplaySettingsTab extends EventEmitter {
  public static create(displaySettings: DisplaySettings): DisplaySettingsTab {
    return new DisplaySettingsTab(displaySettings);
  }

  public body: HTMLDivElement;
  private enableOption = new Ref<SwitchCheckbox>();
  private enableInteractionOption = new Ref<SwitchCheckbox>();
  private opacityOption = new Ref<Slider>();
  private speedOption = new Ref<Slider>();
  private fontSizeOption = new Ref<Slider>();
  private densityOption = new Ref<Slider>();
  private topMarginOption = new Ref<Slider>();
  private bottomMarginOption = new Ref<Slider>();
  private fontFamilyOption = new Ref<TextInput>();
  private distributionOption = new Ref<Dropdown<DistributionStyle>>();
  private showUsernameOption = new Ref<SwitchCheckbox>();
  private resetButton = new Ref<HTMLDivElement>();

  public constructor(private displaySettings: DisplaySettings) {
    super();
    this.body = E.div(
      {
        class: "display-settings-tab-container",
        style: `padding: 0 ${TAB_SIDE_PADDING} 1rem; box-sizing: border-box; height: 100%; overflow-y: auto;`,
      },
      assign(
        this.enableOption,
        SwitchCheckbox.create(
          chrome.i18n.getMessage("enableScrollingOption"),
          ENABLE_CHAT_SCROLLING_DEFAULT,
          displaySettings.enable,
        ),
      ).body,
      assign(
        this.enableInteractionOption,
        SwitchCheckbox.create(
          chrome.i18n.getMessage("enableInteractionOption"),
          ENABLE_CHAT_INTERACTION_DEFAULT,
          displaySettings.enableInteraction,
        ),
      ).body,
      assign(
        this.opacityOption,
        Slider.create(
          chrome.i18n.getMessage("opacityOption"),
          OPACITY_RANGE,
          displaySettings.opacity,
        ),
      ).body,
      assign(
        this.speedOption,
        Slider.create(
          chrome.i18n.getMessage("speedOption"),
          SPEED_RANGE,
          displaySettings.speed,
        ),
      ).body,
      assign(
        this.fontSizeOption,
        Slider.create(
          chrome.i18n.getMessage("fontSizeOption"),
          FONT_SIZE_RANGE,
          displaySettings.fontSize,
        ),
      ).body,
      assign(
        this.densityOption,
        Slider.create(
          chrome.i18n.getMessage("densityOption"),
          DENSITY_RANGE,
          displaySettings.density,
        ),
      ).body,
      assign(
        this.topMarginOption,
        Slider.create(
          chrome.i18n.getMessage("topMarginOption"),
          TOP_MARGIN_RANGE,
          displaySettings.topMargin,
        ),
      ).body,
      assign(
        this.bottomMarginOption,
        Slider.create(
          chrome.i18n.getMessage("bottomMarginOption"),
          BOTTOM_MARGIN_RANGE,
          displaySettings.bottomMargin,
        ),
      ).body,
      assign(
        this.fontFamilyOption,
        TextInput.create(
          chrome.i18n.getMessage("fontFamilyOption"),
          FONT_FAMILY_DEFAULT,
          displaySettings.fontFamily,
        ),
      ).body,
      assign(
        this.distributionOption,
        Dropdown.create(
          chrome.i18n.getMessage("distributionStyleOption"),
          [
            {
              kind: DistributionStyle.RandomDistributionStyle,
              localizedMsg: chrome.i18n.getMessage(
                DistributionStyle[DistributionStyle.RandomDistributionStyle],
              ),
            },
            {
              kind: DistributionStyle.TopDownDistributionStyle,
              localizedMsg: chrome.i18n.getMessage(
                DistributionStyle[DistributionStyle.TopDownDistributionStyle],
              ),
            },
          ],
          DISTRIBUTION_STYLE_DEFAULT,
          displaySettings.distributionStyle,
        ),
      ).body,
      assign(
        this.showUsernameOption,
        SwitchCheckbox.create(
          chrome.i18n.getMessage("userNameOption"),
          SHOW_USER_NAME_DEFAULT,
          displaySettings.showUserName,
        ),
      ).body,
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
          E.text(chrome.i18n.getMessage("resetOption")),
        ),
        E.divRef(
          this.resetButton,
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
            }),
          ),
        ),
      ),
    );
    this.enableOption.val.on("change", (value) => this.enableChange(value));
    this.enableInteractionOption.val.on("change", (value) =>
      this.enableInteractionChange(value),
    );
    this.opacityOption.val.on("change", (value) => this.opacityChange(value));
    this.fontSizeOption.val.on("change", (value) => this.fontSizeChange(value));
    this.densityOption.val.on("change", (value) => this.densityChange(value));
    this.speedOption.val.on("change", (value) => this.speedChange(value));
    this.topMarginOption.val.on("change", (value) =>
      this.topMarginChange(value),
    );
    this.bottomMarginOption.val.on("change", (value) =>
      this.bottomMarginChange(value),
    );
    this.fontFamilyOption.val.on("change", (value) =>
      this.fontFamilyChange(value),
    );
    this.showUsernameOption.val.on("change", (value) =>
      this.showUserNameChange(value),
    );
    this.distributionOption.val.on("change", (value) =>
      this.distributionStyleChange(value),
    );
    this.resetButton.val.addEventListener("click", () => this.resetSettings());
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

  public densityChange(value: number): void {
    this.displaySettings.density = value;
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

  public enableInteractionChange(value: boolean): void {
    this.displaySettings.enableInteraction = value;
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

  public toggleEnableChange(): void {
    this.enableOption.val.toggleSwitch();
  }

  public resetSettings(): void {
    this.displaySettings.opacity = this.opacityOption.val.reset();
    this.displaySettings.fontSize = this.fontSizeOption.val.reset();
    this.displaySettings.density = this.densityOption.val.reset();
    this.displaySettings.speed = this.speedOption.val.reset();
    this.displaySettings.topMargin = this.topMarginOption.val.reset();
    this.displaySettings.bottomMargin = this.bottomMarginOption.val.reset();
    this.displaySettings.fontFamily = this.fontFamilyOption.val.reset();
    this.displaySettings.enable = this.enableOption.val.reset();
    this.displaySettings.showUserName = this.showUsernameOption.val.reset();
    this.displaySettings.distributionStyle =
      this.distributionOption.val.reset();
    this.emit("update");
  }

  public show(): this {
    this.body.style.display = "block";
    return this;
  }

  public hide(): this {
    this.body.style.display = "none";
    return this;
  }
}
