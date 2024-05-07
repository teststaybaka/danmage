import { ORIGIN_LOCAL, ORIGIN_PROD } from "../../../common";
import { normalizeBody } from "../../body_normalizer";
import { BodyComponent } from "./body_component";
import { BODY_STATE } from "./body_state";
import { HistoryTracker } from "./history_tracker";
import { LOCALIZED_TEXT } from "./locales/localized_text";
import { SERVICE_CLIENT } from "./service_client";
import "../../../environment";

function main(): void {
  normalizeBody();

  document.title = LOCALIZED_TEXT.title;
  let viewPortMeta = document.createElement("meta");
  viewPortMeta.name = "viewport";
  viewPortMeta.content = "width=device-width, initial-scale=1";
  document.head.appendChild(viewPortMeta);

  let origin = "";
  if (globalThis.ENVIRONMENT === "prod") {
    origin = ORIGIN_PROD;
  } else if (globalThis.ENVIRONMENT === "local") {
    origin = ORIGIN_LOCAL;
  } else {
    throw new Error("Unsupported environment.");
  }
  SERVICE_CLIENT.baseUrl = origin;

  let bodyComponent = BodyComponent.create(origin);
  document.body.append(bodyComponent.body);
  let queryParamKey = "s";
  let historyTracker = HistoryTracker.create(BODY_STATE, queryParamKey);
  historyTracker.on("update", (newState) =>
    bodyComponent.updateState(newState),
  );
  bodyComponent.on("newState", (newState) => historyTracker.push(newState));
  historyTracker.parse();
}

main();
