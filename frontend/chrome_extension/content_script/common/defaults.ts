import { DistributionStyle } from "../../../../interface/player_settings";
import { NumberRange } from "./number_range";

export let SPEED_RANGE = new NumberRange(500, 100, 200);
export let OPACITY_RANGE = new NumberRange(100, 0, 80);
export let FONT_SIZE_RANGE = new NumberRange(40, 10, 25);
export let DENSITY_RANGE = new NumberRange(100, 0, 100);
export let TOP_MARGIN_RANGE = new NumberRange(100, 0, 1);
export let BOTTOM_MARGIN_RANGE = new NumberRange(100, 0, 1);
export let FONT_FAMILY_DEFAULT = "Arial";
export let ENABLE_CHAT_SCROLLING_DEFAULT = true;
export let SHOW_USER_NAME_DEFAULT = false;
export let DISTRIBUTION_STYLE_DEFAULT =
  DistributionStyle.RandomDistributionStyle;
