import { ORIGIN_LOCAL, ORIGIN_PROD } from "../../../common";
import { normalizeBody } from "../../body_normalizer";
import { BodyComponent } from "./body_component";
import { BrowserHistoryPusher } from "./browser_history_pusher";
import { SERVICE_CLIENT } from "./service_client";
import { StateLoader } from "./state_loader";
import "../../../environment";

function main(): void {
  normalizeBody();
  document.title = "DanMage";

  let origin = "";
  if (globalThis.ENVIRONMENT === "prod") {
    origin = ORIGIN_PROD;
  } else if (globalThis.ENVIRONMENT === "local") {
    origin = ORIGIN_LOCAL;
  } else {
    throw new Error("Unsupported environment.");
  }

  SERVICE_CLIENT.origin = origin;
  let queryParamKeyForState = "q";
  let state = StateLoader.create(queryParamKeyForState).state;
  let historyPusher = BrowserHistoryPusher.create(state, queryParamKeyForState);
  document.body.appendChild(
    BodyComponent.create(state, historyPusher, origin).body
  );
}

main();
