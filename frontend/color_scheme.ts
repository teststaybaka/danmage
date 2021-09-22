export let ORANGE = "rgb(255, 118, 35)";
let DARKER_GREY = "rgb(50, 50, 50)";
let DARK_GREY = "rgb(120, 120, 120)";
let DARK_GREY_TRANSPARENT = "rgba(120, 120, 120, .5)";
let GREY = "rgb(200, 200, 200)";
let LIGHT_GREY = "rgb(245, 245, 245)";
export let BLUE = "rgb(0, 174, 239)";
let LIGHT_BLUE = "rgb(200, 247, 255)";
let RED = "rgb(255, 100, 100)";
let GREEN = "rgb(10, 210, 50)";
let WHITE = "white";

// Keep values of Purpose and values of schemes in the same order.
enum Purpose {
  BACKGROUND,
  ALTERNATIVE_BACKGROUND,
  POPUP_BACKGROUND,
  CONTENT,
  HIGHLIGH_CONTENT,
  ERROR_CONTENT,
  LINK_CONTENT,
  SVG_CONTENT,
  BLOCK_SEPARATOR,
  INPUT_BORDER, // Includes button/dropdown/text input
  DISABLED_INPUT_CONTENT,
  PRESSED_BUTTON_BACKGROUND,
  PRIMARY_BUTTON_CONTENT,
  PRIMARY_BUTTON_BACKGROUND,
  PRESSED_PRIMARY_BUTTON_BACKGROUND,
  DISABLED_PRIMARY_BUTTON_BACKGROUND,
  SWITCH_OFF_BACKGROUND,
  SWITCH_ON_BACKGROUND,
  POPUP_SHADOW,
}

export let CLASSIC_COLOR_SCHEME: Map<Purpose, string> = new Map([
  [Purpose.BACKGROUND, WHITE],
  [Purpose.ALTERNATIVE_BACKGROUND, LIGHT_GREY],
  [Purpose.POPUP_BACKGROUND, DARK_GREY_TRANSPARENT],
  [Purpose.CONTENT, DARKER_GREY],
  [Purpose.HIGHLIGH_CONTENT, BLUE],
  [Purpose.ERROR_CONTENT, RED],
  [Purpose.LINK_CONTENT, BLUE],
  [Purpose.SVG_CONTENT, DARK_GREY],
  [Purpose.BLOCK_SEPARATOR, DARK_GREY],
  [Purpose.INPUT_BORDER, GREY],
  [Purpose.DISABLED_INPUT_CONTENT, LIGHT_GREY],
  [Purpose.PRESSED_BUTTON_BACKGROUND, GREY],
  [Purpose.PRIMARY_BUTTON_CONTENT, WHITE],
  [Purpose.PRIMARY_BUTTON_BACKGROUND, BLUE],
  [Purpose.PRESSED_PRIMARY_BUTTON_BACKGROUND, LIGHT_BLUE],
  [Purpose.DISABLED_PRIMARY_BUTTON_BACKGROUND, LIGHT_BLUE],
  [Purpose.SWITCH_OFF_BACKGROUND, GREY],
  [Purpose.SWITCH_ON_BACKGROUND, GREEN],
  [Purpose.POPUP_SHADOW, DARKER_GREY],
]);

export class ColorScheme {
  public static SCHEME = CLASSIC_COLOR_SCHEME;

  public static getBackground(): string {
    return ColorScheme.SCHEME.get(Purpose.BACKGROUND);
  }

  public static getAlternativeBackground(): string {
    return ColorScheme.SCHEME.get(Purpose.ALTERNATIVE_BACKGROUND);
  }

  public static getPopupBackground(): string {
    return ColorScheme.SCHEME.get(Purpose.POPUP_BACKGROUND);
  }

  public static getContent(): string {
    return ColorScheme.SCHEME.get(Purpose.CONTENT);
  }

  public static getHighlightContent(): string {
    return ColorScheme.SCHEME.get(Purpose.HIGHLIGH_CONTENT);
  }

  public static getErrorContent(): string {
    return ColorScheme.SCHEME.get(Purpose.ERROR_CONTENT);
  }

  public static getLinkContent(): string {
    return ColorScheme.SCHEME.get(Purpose.LINK_CONTENT);
  }

  public static getSvgContent(): string {
    return ColorScheme.SCHEME.get(Purpose.SVG_CONTENT);
  }

  public static getBlockSeparator(): string {
    return ColorScheme.SCHEME.get(Purpose.BLOCK_SEPARATOR);
  }

  public static getInputBorder(): string {
    return ColorScheme.SCHEME.get(Purpose.INPUT_BORDER);
  }

  public static getDisabledInputContent(): string {
    return ColorScheme.SCHEME.get(Purpose.DISABLED_INPUT_CONTENT);
  }

  public static getPressedButtonBackground(): string {
    return ColorScheme.SCHEME.get(Purpose.PRESSED_BUTTON_BACKGROUND);
  }

  public static getPrimaryButtonContent(): string {
    return ColorScheme.SCHEME.get(Purpose.PRIMARY_BUTTON_CONTENT);
  }

  public static getPrimaryButtonBackground(): string {
    return ColorScheme.SCHEME.get(Purpose.PRIMARY_BUTTON_BACKGROUND);
  }

  public static getPressedPrimaryButtonBackground(): string {
    return ColorScheme.SCHEME.get(Purpose.PRESSED_PRIMARY_BUTTON_BACKGROUND);
  }

  public static getDisabledPrimaryButtonBackground(): string {
    return ColorScheme.SCHEME.get(Purpose.DISABLED_PRIMARY_BUTTON_BACKGROUND);
  }

  public static getSwitchOffBackground(): string {
    return ColorScheme.SCHEME.get(Purpose.SWITCH_OFF_BACKGROUND);
  }

  public static getSwitchOnBackground(): string {
    return ColorScheme.SCHEME.get(Purpose.SWITCH_ON_BACKGROUND);
  }

  public static getPopupShadow(): string {
    return ColorScheme.SCHEME.get(Purpose.POPUP_SHADOW);
  }
}
