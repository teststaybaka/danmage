export interface ControlPanelDocker {
  remove(): void;
}

export class ControlPanelOneTimePrepender implements ControlPanelDocker {
  public constructor(
    private controlPanelBody: HTMLElement,
    private anchorButtonElement: Element
  ) {}

  public static create(
    controlPanelBody: HTMLElement,
    anchorButtonElement: Element
  ): ControlPanelOneTimePrepender {
    return new ControlPanelOneTimePrepender(
      controlPanelBody,
      anchorButtonElement
    ).init();
  }

  public init(): this {
    this.anchorButtonElement.parentElement.insertBefore(
      this.controlPanelBody,
      this.anchorButtonElement
    );
    return this;
  }

  public remove(): void {
    this.controlPanelBody.remove();
  }
}

export class ControlPanelPeriodicPrepender implements ControlPanelDocker {
  private lastAnchorButtonElement: Element;
  private cycleId: number;

  public constructor(
    private controlPanelBody: HTMLElement,
    private anchorButtonSelector: string,
    private document: Document,
    private window: Window
  ) {}

  public static create(
    controlPanelBody: HTMLElement,
    anchorButtonSelector: string
  ): ControlPanelPeriodicPrepender {
    return new ControlPanelPeriodicPrepender(
      controlPanelBody,
      anchorButtonSelector,
      document,
      window
    ).init();
  }

  public init(): this {
    this.cycleId = this.window.setInterval(this.cycle, 100);
    return this;
  }

  private cycle = (): void => {
    let anchorButtonElement = this.document.querySelector(
      this.anchorButtonSelector
    );
    if (
      anchorButtonElement &&
      this.lastAnchorButtonElement !== anchorButtonElement
    ) {
      anchorButtonElement.parentElement.insertBefore(
        this.controlPanelBody,
        anchorButtonElement
      );
      this.lastAnchorButtonElement = anchorButtonElement;
    }
  };

  public remove(): void {
    this.window.clearInterval(this.cycleId);
    this.controlPanelBody.remove();
  }
}
