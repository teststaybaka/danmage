import { ColorScheme } from "../../../color_scheme";
import { FONT_M } from "../../../font_sizes";

export let ENTRY_PADDING_TOP_STYLE = `padding-top: .5rem;`;
export let LABEL_STYLE = `font-size: ${FONT_M}rem; line-height: 120%; font-family: initial !important; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: ${ColorScheme.getContent()};`;
export let INPUT_WIDTH = 2.5;
export let INPUT_WIDTH_STYLE = `width: ${INPUT_WIDTH}rem;`;
export let TEXT_INPUT_STYLE = `padding: 0; margin: 0; outline: none; border: 0; background-color: initial; border-bottom: .0625rem solid ${ColorScheme.getInputBorder()}; ${INPUT_WIDTH_STYLE} font-size: ${FONT_M}rem; font-family: initial !important; line-height: 140%; text-align: center; color: ${ColorScheme.getContent()};`;
