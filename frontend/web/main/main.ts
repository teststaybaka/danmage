import { normalizeBody } from "../../body_normalizer";
import { BrowserHistoryPusher } from "./browser_history_pusher";
import { PageShellComponent } from "./page_shell_component";
import { StateLoader } from "./state_loader";

function main(): void {
  normalizeBody();

  let queryParamKeyForState = "q";
  let state = StateLoader.create(queryParamKeyForState).state;
  let historyPusher = BrowserHistoryPusher.create(state, queryParamKeyForState);
  document.body.appendChild(
    PageShellComponent.create(state, historyPusher).body
  );
}

main();
