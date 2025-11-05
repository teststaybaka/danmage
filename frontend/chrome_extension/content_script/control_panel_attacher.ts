import { ControlPanel } from "./control_panel";

export interface ControlPanelAttacher {
  start(): void;
  stop(): void;
}

export class ControlPanelOneTimeAttacher implements ControlPanelAttacher {
  public static create(
    controlPanel: ControlPanel,
    anchorButtonElement: Element,
  ): ControlPanelOneTimeAttacher {
    return new ControlPanelOneTimeAttacher(
      document,
      controlPanel,
      anchorButtonElement,
    );
  }

  public constructor(
    private document: Document,
    private controlPanel: ControlPanel,
    private anchorButtonElement: Element,
  ) {}

  public start(): void {
    this.document.body.appendChild(this.controlPanel.panel);
    this.anchorButtonElement.before(
      this.controlPanel.button,
      this.anchorButtonElement,
    );
  }

  public stop(): void {}
}

export class ControlPanelPeriodicAttacher implements ControlPanelAttacher {
  public static create(
    controlPanel: ControlPanel,
    anchorElementSelectFn: () => HTMLElement,
  ): ControlPanelPeriodicAttacher {
    return new ControlPanelPeriodicAttacher(
      document,
      window,
      controlPanel,
      anchorElementSelectFn,
    );
  }

  private static INTERVAL = 100; // ms

  private lastAnchorElement: Element;
  private cycleId: number;

  public constructor(
    private document: Document,
    private window: Window,
    private controlPanel: ControlPanel,
    private anchorElementSelectFn: () => HTMLElement,
  ) {}

  public start(): void {
    this.document.body.appendChild(this.controlPanel.panel);
    this.cycle();
  }

  private cycle = (): void => {
    let anchorElement = this.anchorElementSelectFn();
    if (this.lastAnchorElement !== anchorElement) {
      this.lastAnchorElement = anchorElement;
      if (anchorElement) {
        anchorElement.before(this.controlPanel.button, anchorElement);
      }
    }
    this.cycleId = this.window.setTimeout(
      this.cycle,
      ControlPanelPeriodicAttacher.INTERVAL,
    );
  };

  public stop(): void {
    this.window.clearTimeout(this.cycleId);
  }
}
