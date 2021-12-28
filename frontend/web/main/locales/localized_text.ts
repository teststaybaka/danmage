import DefaultText from "./default/text";
import TextJa from "./ja/text";
import TextZh from "./zh/text";
import TextZhTw from "./zh_TW/text";
import { findClosestLocalizedText } from "@selfage/closest_locale_finder";

export let LOCALIZED_TEXT = findClosestLocalizedText(
  [navigator.language],
  new Map(
    [new DefaultText(), new TextZh(), new TextZhTw(), new TextJa()].map(
      (text) => {
        return [text.locale, text];
      }
    )
  ),
  new DefaultText()
);
