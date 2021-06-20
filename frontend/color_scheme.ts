export let ORANGE = "rgb(255, 118, 35)";
let DARKER_GREY = "rgb(50, 50, 50)";
let DARK_GREY = "rgb(120, 120, 120)";
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
  CONTENT,
  ERROR_CONTENT,
  HIGHLIGHT_CONTENT,
  HINT_CONTENT,
  BLOCK_SEPARATOR,
  INPUT_BORDER, // Includes button/dropdown/text input
  PRESSED_BUTTON_CONTENT,
  PRESSED_BUTTON_BORDER,
  DISABLED_BUTTON_CONTENT,
  DISABLED_BUTTON_BORDER,
  IMPORTANT_BUTTON_CONTENT,
  IMPORTANT_BUTTON_BACKGROUND,
  PRESSED_IMPORTANT_BUTTON_BACKGROUND,
  DISABLED_IMPORTANT_BUTTON_BACKGROUND,
  SWITCH_OFF_BACKGROUND,
  SWITCH_ON_BACKGROUND,
  POPUP_SHADOW,
}

export class ColorScheme {
  public static SCHEME: Map<Purpose, string>;

  public static getBackground(): string {
    return ColorScheme.SCHEME.get(Purpose.BACKGROUND);
  }

  public static getAlternativeBackground(): string {
    return ColorScheme.SCHEME.get(Purpose.ALTERNATIVE_BACKGROUND);
  }

  public static getContent(): string {
    return ColorScheme.SCHEME.get(Purpose.CONTENT);
  }

  public static getErrorContent(): string {
    return ColorScheme.SCHEME.get(Purpose.ERROR_CONTENT);
  }

  public static getHighlightContent(): string {
    return ColorScheme.SCHEME.get(Purpose.HIGHLIGHT_CONTENT);
  }

  public static getHintContent(): string {
    return ColorScheme.SCHEME.get(Purpose.HINT_CONTENT);
  }

  public static getBlockSeparator(): string {
    return ColorScheme.SCHEME.get(Purpose.BLOCK_SEPARATOR);
  }

  public static getInputBorder(): string {
    return ColorScheme.SCHEME.get(Purpose.INPUT_BORDER);
  }

  public static getPressedButtonContent(): string {
    return ColorScheme.SCHEME.get(Purpose.PRESSED_BUTTON_CONTENT);
  }

  public static getPressedButtonBorder(): string {
    return ColorScheme.SCHEME.get(Purpose.PRESSED_BUTTON_BORDER);
  }

  public static getDisabledButtonContent(): string {
    return ColorScheme.SCHEME.get(Purpose.DISABLED_BUTTON_CONTENT);
  }

  public static getDisabledButtonBorder(): string {
    return ColorScheme.SCHEME.get(Purpose.DISABLED_BUTTON_BORDER);
  }

  public static getImportantButtonContent(): string {
    return ColorScheme.SCHEME.get(Purpose.IMPORTANT_BUTTON_CONTENT);
  }

  public static getImportantButtonBackground(): string {
    return ColorScheme.SCHEME.get(Purpose.IMPORTANT_BUTTON_BACKGROUND);
  }

  public static getPressedImportantButtonBackground(): string {
    return ColorScheme.SCHEME.get(Purpose.PRESSED_IMPORTANT_BUTTON_BACKGROUND);
  }

  public static getDisabledImportantButtonBackground(): string {
    return ColorScheme.SCHEME.get(Purpose.DISABLED_IMPORTANT_BUTTON_BACKGROUND);
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

export let CLASSIC_COLOR_SCHEME: Map<Purpose, string> = new Map([
  [Purpose.BACKGROUND, WHITE],
  [Purpose.ALTERNATIVE_BACKGROUND, LIGHT_GREY],
  [Purpose.CONTENT, DARKER_GREY],
  [Purpose.ERROR_CONTENT, RED],
  [Purpose.HIGHLIGHT_CONTENT, BLUE],
  [Purpose.HINT_CONTENT, DARK_GREY],
  [Purpose.BLOCK_SEPARATOR, DARK_GREY],
  [Purpose.INPUT_BORDER, GREY],
  [Purpose.PRESSED_BUTTON_CONTENT, BLUE],
  [Purpose.PRESSED_BUTTON_BORDER, LIGHT_BLUE],
  [Purpose.DISABLED_BUTTON_CONTENT, LIGHT_BLUE],
  [Purpose.DISABLED_BUTTON_BORDER, LIGHT_BLUE],
  [Purpose.IMPORTANT_BUTTON_CONTENT, WHITE],
  [Purpose.IMPORTANT_BUTTON_BACKGROUND, BLUE],
  [Purpose.PRESSED_IMPORTANT_BUTTON_BACKGROUND, LIGHT_BLUE],
  [Purpose.DISABLED_IMPORTANT_BUTTON_BACKGROUND, LIGHT_BLUE],
  [Purpose.SWITCH_OFF_BACKGROUND, GREY],
  [Purpose.SWITCH_ON_BACKGROUND, GREEN],
  [Purpose.POPUP_SHADOW, DARKER_GREY],
]);
