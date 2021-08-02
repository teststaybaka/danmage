import EventEmitter = require("events");
import { BrowserHistoryPusher } from "./browser_history_pusher";

interface Button {
  on(
    event: "click",
    listener: () => Promise<boolean | void> | boolean | void
  ): this;
}

interface Hideable {
  body: HTMLElement;
  show(): void;
  hide(): void;
}

export class TabsNavigationController<State extends EventEmitter> {
  private fieldToTabFactoryFns = new Map<string, () => Hideable>();
  private fieldToTabs = new Map<string, Hideable>();
  private previousField: string;

  public constructor(
    private tabsContainer: HTMLElement,
    private state: State,
    private browserHistoryPusher: BrowserHistoryPusher
  ) {}

  public init(): this {
    (this.state as any).triggerInitialEvents();
    return this;
  }

  public addWithButton(
    fieldName: string,
    button: Button,
    tabFactoryFn: () => HTMLElement
  ): this {
    this.fieldToTabFactoryFns.set(
      fieldName,
      () => new HideableController(tabFactoryFn())
    );
    this.state.on(fieldName, (newValue) =>
      this.handleStateChange(fieldName, newValue)
    );
    button.on("click", () => this.handleClick(fieldName));
    return this;
  }

  public addWithHTMLButton(
    fieldName: string,
    button: HTMLElement,
    tabFactoryFn: () => HTMLElement
  ): this {
    this.fieldToTabFactoryFns.set(
      fieldName,
      () => new HideableController(tabFactoryFn())
    );
    this.state.on(fieldName, (newValue) =>
      this.handleStateChange(fieldName, newValue)
    );
    button.addEventListener("click", () => this.handleClick(fieldName));
    return this;
  }

  public addWithHideable(
    fieldName: string,
    button: Button,
    tabFactoryFn: () => Hideable
  ): this {
    this.fieldToTabFactoryFns.set(fieldName, tabFactoryFn);
    this.state.on(fieldName, (newValue) =>
      this.handleStateChange(fieldName, newValue)
    );
    button.on("click", () => this.handleClick(fieldName));
    return this;
  }

  private handleStateChange(fieldName: string, newValue: boolean): void {
    if (newValue) {
      if (this.previousField) {
        (this.state as any)[this.previousField] = undefined;
      }
      this.previousField = fieldName;
      let tab = this.fieldToTabs.get(fieldName);
      if (!tab) {
        let tabFactoryFn = this.fieldToTabFactoryFns.get(fieldName);
        tab = tabFactoryFn();
        this.fieldToTabs.set(fieldName, tab);
        this.tabsContainer.appendChild(tab.body);
      } else {
        tab.show();
      }
      this.browserHistoryPusher.push();
    } else {
      this.fieldToTabs.get(fieldName).hide();
    }
  }

  private handleClick(fieldName: string): void {
    (this.state as any)[fieldName] = true;
  }
}

export class HideableController {
  private displayStyle: string;

  public constructor(public body: HTMLElement) {}

  public hide(): void {
    this.displayStyle = this.body.style.display;
    this.body.style.display = "none";
    this.body.hidden = true;
  }

  public show(): void {
    if (this.displayStyle) {
      this.body.style.display = this.displayStyle;
    }
    this.body.hidden = false;
  }
}
