import { State } from "./state";

export class BrowserHistoryPusher {
  public constructor(
    private state: State,
    private queryParamKey: string,
    private window: Window
  ) {}

  public push(): void {
    let url = new URL(this.window.location.href);
    url.searchParams.set(this.queryParamKey, JSON.stringify(this.state));
    this.window.history.pushState(undefined, "", url.href);
  }
}
