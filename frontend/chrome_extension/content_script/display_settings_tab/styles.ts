import { ColorScheme } from "../../../color_scheme";

export let ENTRY_PADDING_TOP_STYLE = `padding-top: .7rem;`;
export let LABEL_STYLE = `font-size: 1.4rem; line-height: 120%; font-family: initial !important; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: ${ColorScheme.getContent()};`;
export let INPUT_WIDTH = 4;
export let INPUT_WIDTH_STYLE = `width: ${INPUT_WIDTH}rem;`;
export let TEXT_INPUT_STYLE = `padding: 0; margin: 0; outline: none; border: 0; background-color: initial; border-bottom: .1rem solid ${ColorScheme.getInputBorder()}; ${INPUT_WIDTH_STYLE} font-size: 1.4rem; font-family: initial !important; line-height: 2.4rem; text-align: center; color: ${ColorScheme.getContent()};`;
