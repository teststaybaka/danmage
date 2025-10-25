import { normalizeBody } from "../../body_normalizer";
import { BodyComponent } from "./body_component";
import { BODY_RL } from "./body_rl";
import { HistoryTracker } from "./history_tracker";
import { LOCALIZED_TEXT } from "./locales/localized_text";
import { E } from "@selfage/element/factory";

function main(): void {
  normalizeBody();

  document.title = LOCALIZED_TEXT.title;
  document.head.appendChild(
    E.meta({
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    }),
  );

  let bodyComponent = BodyComponent.create();
  document.body.append(bodyComponent.body);
  let queryParamKey = "s";
  let historyTracker = HistoryTracker.create(BODY_RL, queryParamKey);
  historyTracker.on("update", (newRl) => bodyComponent.applyRl(newRl));
  bodyComponent.on("newRl", (newRl) => historyTracker.push(newRl));
  historyTracker.parse();
}

main();
