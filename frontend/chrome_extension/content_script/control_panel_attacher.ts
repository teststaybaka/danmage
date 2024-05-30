export interface ControlPanelAttacher {
  start(): void;
  stop(): void;
}

export class ControlPanelOneTimePrepender implements ControlPanelAttacher {
  public static create(
    controlPanelBody: HTMLElement,
    anchorButtonElement: Element,
  ): ControlPanelOneTimePrepender {
    return new ControlPanelOneTimePrepender(
      controlPanelBody,
      anchorButtonElement,
    );
  }

  public constructor(
    private controlPanelBody: HTMLElement,
    private anchorButtonElement: Element,
  ) {}

  public start(): void {
    this.anchorButtonElement.parentElement.insertBefore(
      this.controlPanelBody,
      this.anchorButtonElement,
    );
  }

  public stop(): void {}
}

export class ControlPanelPeriodicPrepender implements ControlPanelAttacher {
  public static create(
    controlPanelBody: HTMLElement,
    anchorButtonSelector: string,
  ): ControlPanelPeriodicPrepender {
    return new ControlPanelPeriodicPrepender(
      controlPanelBody,
      anchorButtonSelector,
      document,
      window,
    );
  }

  private static INTERVAL = 100; // ms

  private lastAnchorButtonElement: Element;
  private cycleId: number;

  public constructor(
    private controlPanelBody: HTMLElement,
    private anchorButtonSelector: string,
    private document: Document,
    private window: Window,
  ) {}

  public start(): void {
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
          this.controlPanelBody,
          anchorButtonElement,
        );
      }
    }
    this.cycleId = this.window.setTimeout(
      this.cycle,
      ControlPanelPeriodicPrepender.INTERVAL,
    );
  };

  public stop(): void {
    this.window.clearTimeout(this.cycleId);
  }
}
