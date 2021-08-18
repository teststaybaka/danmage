import { ColorScheme } from "../../../color_scheme";

export let ENTRY_MARGIN_TOP_STYLE = `margin-top: .7rem;`;
export let LABEL_STYLE =
  `flex-basis: 0; font-size: 1.4rem; font-family: initial !important; ` +
  `text-overflow: ellipsis; color: ${ColorScheme.getContent()};`;
export let INPUT_WIDTH = 4;
export let INPUT_WIDTH_STYLE = `width: ${INPUT_WIDTH}rem;`;
export let TEXT_INPUT_STYLE =
  `padding: 0; margin: 0; outline: none; border: 0; ` +
  `background-color: initial; ` +
  `border-bottom: .1rem solid ${ColorScheme.getInputBorder()}; ` +
  `${INPUT_WIDTH_STYLE} font-size: 1.4rem; font-family: initial !important; ` +
  `line-height: 2.4rem; color: ${ColorScheme.getContent()};`;
