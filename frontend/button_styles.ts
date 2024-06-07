import { ColorScheme } from "./color_scheme";
import { FONT_M } from "./font_sizes";

export let BUTTON_BORDER_RADIUS = `.5rem`;
export let NULLIFIED_BUTTON_STYLE = `outline: none; border: 0; flex: 0 0 auto; background-color: initial;`;
// !important since some website will override it.
// Missing color, background-color, and border-color.
export let COMMON_BUTTON_STYLE = `${NULLIFIED_BUTTON_STYLE} font-family: initial !important; font-size: ${FONT_M}rem; line-height: 100%; border-radius: ${BUTTON_BORDER_RADIUS}; padding: .8rem 1.2rem; border: .1rem solid transparent; cursor: pointer;`
export let FILLED_BUTTON_STYLE = `${COMMON_BUTTON_STYLE} color: ${ColorScheme.getPrimaryButtonContent()}; background-color: ${ColorScheme.getPrimaryButtonBackground()};`;
export let TEXT_BUTTON_STYLE = COMMON_BUTTON_STYLE;
