import EventEmitter = require("events");
import { BrowserHistoryPusher } from "./browser_history_pusher";
import { HideableElementController } from "@selfage/element/hideable_element_controller";

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

  public addWithHTMLButton(
    fieldName: string,
    button: HTMLElement,
    tabFactoryFn: () => HTMLElement
  ): this {
    this.fieldToTabFactoryFns.set(
      fieldName,
      () => new HideableWithBody(tabFactoryFn())
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
      }
      tab.show();
    } else {
      this.fieldToTabs.get(fieldName).hide();
    }
  }

  private handleClick(fieldName: string): void {
    (this.state as any)[fieldName] = true;
    this.browserHistoryPusher.push();
  }
}

export class HideableWithBody {
  private hideableElementController: HideableElementController;

  public constructor(public body: HTMLElement) {
    this.hideableElementController = new HideableElementController(body);
  }

  public show(): void {
    this.hideableElementController.show();
  }

  public hide(): void {
    this.hideableElementController.hide();
  }
}
