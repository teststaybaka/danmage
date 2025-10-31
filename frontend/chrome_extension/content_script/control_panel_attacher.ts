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
    this.anchorButtonElement.parentElement.insertBefore(
      this.controlPanel.button,
      this.anchorButtonElement,
    );
  }

  public stop(): void {}
}

export class ControlPanelPeriodicAttacher implements ControlPanelAttacher {
  public static create(
    controlPanel: ControlPanel,
    anchorButtonSelector: string,
  ): ControlPanelPeriodicAttacher {
    return new ControlPanelPeriodicAttacher(
      controlPanel,
      anchorButtonSelector,
      document,
      window,
    );
  }

  private static INTERVAL = 100; // ms

  private lastAnchorButtonElement: Element;
  private cycleId: number;

  public constructor(
    private controlPanel: ControlPanel,
    private anchorButtonSelector: string,
    private document: Document,
    private window: Window,
  ) {}

  public start(): void {
    this.document.body.appendChild(this.controlPanel.panel);
    this.cycle();
  }

  private cycle = (): void => {
    let anchorButtonElement = this.document.querySelector(
      this.anchorButtonSelector,
    );
    if (this.lastAnchorButtonElement !== anchorButtonElement) {
      this.lastAnchorButtonElement = anchorButtonElement;
      if (anchorButtonElement) {
        anchorButtonElement.parentElement.insertBefore(
          this.controlPanel.button,
          anchorButtonElement,
        );
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
