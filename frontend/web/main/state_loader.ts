import { STATE, State } from "./state";
import { parseMessage } from "@selfage/message/parser";

export class StateLoader {
  public state: State;

  public constructor(private queryParamKey: string, private window: Window) {}

  public static create(queryParamKey: string): StateLoader {
    return new StateLoader(queryParamKey, window).init();
  }

  public init(): this {
    this.state = new State();
    this.state.showHome = true;
    this.load();
    this.window.onpopstate = () => this.load();
    return this;
  }

  private load(): void {
    let stateStr = new URLSearchParams(this.window.location.search).get(
      this.queryParamKey
    );
    if (stateStr) {
      parseMessage(JSON.parse(stateStr), STATE, this.state);
    }
  }
}
