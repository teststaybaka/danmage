import EventEmitter = require("events");
import { MessageDescriptor } from "@selfage/message/descriptor";
import { parseMessage } from "@selfage/message/parser";

export interface HistoryTracker<T> {
  on(event: "update", listener: (newState: T) => void): this;
}

export class HistoryTracker<T> extends EventEmitter {
  public static create<T>(
    stateDescriptor: MessageDescriptor<T>,
    queryParamKey: string
  ): HistoryTracker<T> {
    return new HistoryTracker(stateDescriptor, queryParamKey, window);
  }

  public constructor(
    private stateDescriptor: MessageDescriptor<T>,
    private queryParamKey: string,
    private window: Window
  ) {
    super();
    this.window.addEventListener("popstate", () => this.parse());
  }

  public parse(): void {
    let stateStr = new URLSearchParams(this.window.location.search).get(
      this.queryParamKey
    );
    let stateObj: any;
    if (stateStr) {
      try {
        stateObj = JSON.parse(stateStr);
      } catch (e) {
        // Ignore
      }
    }
    let newState = parseMessage(stateObj, this.stateDescriptor);
    this.emit("update", newState);
  }

  public push(newState: T): void {
    let url = new URL(this.window.location.href);
    url.searchParams.set(this.queryParamKey, JSON.stringify(newState));
    this.window.history.pushState(undefined, "", url.href);
  }
}
