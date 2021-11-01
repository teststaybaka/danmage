import { ColorScheme } from "../../color_scheme";

export let SIDE_PADDING = 5; // rem
export let LABEL_STYLE =
  `font-size: 1.4rem; width: 10rem; ` + `color: ${ColorScheme.getContent()};`;
export let INPUT_STYLE =
  `padding: 0; margin: 0; outline: none; border: 0; ` +
  `background-color: initial; flex: 3; font-size: 1.4rem; `+
  `font-family: initial; `+
  `border-bottom: .1rem solid ${ColorScheme.getInputBorder()};`;
