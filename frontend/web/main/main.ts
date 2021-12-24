import { ORIGIN_LOCAL, ORIGIN_PROD } from "../../../common";
import { normalizeBody } from "../../body_normalizer";
import { BodyComponent } from "./body_component";
import { SERVICE_CLIENT } from "./service_client";
import { STATE, State } from "./state";
import { createTrackerAndPusher } from "@selfage/stateful_navigator";
import "../../../environment";

function main(): void {
  normalizeBody();
  document.title =
    "DanMage - Bring NicoNico-style chats to Twitch, YouTube and Crunchyroll";

  let origin = "";
  if (globalThis.ENVIRONMENT === "prod") {
    origin = ORIGIN_PROD;
  } else if (globalThis.ENVIRONMENT === "local") {
    origin = ORIGIN_LOCAL;
  } else {
    throw new Error("Unsupported environment.");
  }
  SERVICE_CLIENT.origin = origin;

  let defaultState = new State();
  defaultState.showHome = true;
  let queryParamKeyForState = "q";
  let [browserHistoryTracker, browserHistoryPusher] = createTrackerAndPusher(
    defaultState,
    STATE,
    queryParamKeyForState
  );
  document.body.appendChild(
    BodyComponent.create(
      browserHistoryTracker.state,
      browserHistoryPusher,
      origin
    ).body
  );
  browserHistoryTracker.initLoad();
}

main();
