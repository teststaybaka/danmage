import { STATE, State } from "./state";
import { parseMessage } from "@selfage/message/parser";

export class StateLoader {
  private defaultState = new State();
  public state = new State();

  public constructor(private queryParamKey: string, private window: Window) {
    this.defaultState.showHome = true;
  }

  public static create(queryParamKey: string): StateLoader {
    return new StateLoader(queryParamKey, window).init();
  }

  public init(): this {
    this.load();
    this.window.onpopstate = () => this.load();
    return this;
  }

  private load(): void {
    let stateStr = new URLSearchParams(this.window.location.search).get(
      this.queryParamKey
    );
    parseMessage(this.parseJsonState(stateStr), STATE, this.state);
  }

  private parseJsonState(stateStr: string): any {
    if (stateStr) {
      try {
        return JSON.parse(stateStr);
      } catch (e) {
        return this.defaultState;
      }
    } else {
      return this.defaultState;
    }
  }
}
