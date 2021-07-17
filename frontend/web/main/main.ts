import { BrowserHistoryPusher } from "./browser_history_pusher";
import { StateLoader } from "./state_loader";

let QUERY_PARAM_KEY_FOR_STATE = "q";

function main(): void {
  document.documentElement.style.fontSize = "62.5%";
  document.body.style.margin = "0";
  document.body.style.fontSize = "0";

  let state = StateLoader.create(QUERY_PARAM_KEY_FOR_STATE).state;
  let historyPusher = BrowserHistoryPusher.create(
    state,
    QUERY_PARAM_KEY_FOR_STATE
  );
}

main();
