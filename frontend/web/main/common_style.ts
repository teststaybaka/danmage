import { ColorScheme } from "../../color_scheme";
import { FONT_M } from "../../font_sizes";

export let SIDE_PADDING = 40; // px
export let LABEL_STYLE = `font-size: ${FONT_M}px; width: 96px; color: ${ColorScheme.getContent()};`;
export let INPUT_STYLE = `padding: 0; margin: 0; outline: none; border: 0; background-color: initial; flex: 3; font-size: ${FONT_M}px; font-family: initial; color: ${ColorScheme.getContent()}; border-bottom: 1px solid ${ColorScheme.getInputBorder()};`;
