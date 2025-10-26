import { ColorScheme } from "./color_scheme";
import { FONT_M } from "./font_sizes";

export let BUTTON_BORDER_RADIUS = `4px`;
export let NULLIFIED_BUTTON_STYLE = `padding: 0; margin: 0; outline: none; border: 0; background-color: initial; text-decoration: none;`;
// !important since some website will override it.
// Missing color, background-color, and border-color.
export let COMMON_BUTTON_STYLE = `${NULLIFIED_BUTTON_STYLE} flex: 0 0 auto; font-family: initial !important; font-size: ${FONT_M}px; line-height: 100%; border-radius: ${BUTTON_BORDER_RADIUS}; padding: 8px 12px; border: 1px solid transparent; cursor: pointer;`
export let FILLED_BUTTON_STYLE = `${COMMON_BUTTON_STYLE} color: ${ColorScheme.getPrimaryButtonContent()}; background-color: ${ColorScheme.getPrimaryButtonBackground()};`;
export let TEXT_BUTTON_STYLE = COMMON_BUTTON_STYLE;
