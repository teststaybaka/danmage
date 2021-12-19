import { TextEn } from "./locales/en/text";
import { TextJa } from "./locales/ja/text";
import { TextZh } from "./locales/zh/text";
import { TextZhTw } from "./locales/zh_TW/text";
import { findClosestLocalizedText } from "@selfage/closest_locale_finder";

export let LOCALIZED_TEXT = findClosestLocalizedText(
  [navigator.language],
  new Map(
    [new TextEn(), new TextZh(), new TextZhTw(), new TextJa()].map((text) => {
      return [text.locale, text];
    })
  ),
  new TextEn()
);
