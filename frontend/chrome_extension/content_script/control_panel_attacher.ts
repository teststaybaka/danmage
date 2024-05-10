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

  private lastAnchorButtonElement: Element;
  private cycleId: number;

  public constructor(
    private controlPanelBody: HTMLElement,
    private anchorButtonSelector: string,
    private document: Document,
    private window: Window,
  ) {}

  public start(): void {
    this.cycleId = this.window.setInterval(() => this.cycle(), 100);
  }

  private cycle(): void {
    let anchorButtonElement = this.document.querySelector(
      this.anchorButtonSelector,
    );
    if (
      anchorButtonElement &&
      this.lastAnchorButtonElement !== anchorButtonElement
    ) {
      anchorButtonElement.parentElement.insertBefore(
        this.controlPanelBody,
        anchorButtonElement,
      );
      this.lastAnchorButtonElement = anchorButtonElement;
    }
  }

  public stop(): void {
    this.window.clearInterval(this.cycleId);
  }
}
