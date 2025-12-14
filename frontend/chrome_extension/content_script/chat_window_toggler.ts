import { DisplaySettings } from "../../../interface/player_settings";

export interface ChatWindowToggler {
  updateDisplaySettings(): void;
  remove(): void;
}

export class YouTubeChatWindowToggler implements ChatWindowToggler {
  public static create(
    containers: Array<HTMLElement>,
    displaySettings: DisplaySettings,
  ): YouTubeChatWindowToggler {
    return new YouTubeChatWindowToggler(window, containers, displaySettings);
  }

  public constructor(
    private window: Window,
    private containers: Array<HTMLElement>,
    private displaySettings: DisplaySettings,
  ) {
    this.updateDisplaySettings();
  }

  public updateDisplaySettings() {
    if (this.displaySettings.showChatWindow) {
      this.show();
    } else {
      this.hide();
    }
  }

  private show(): void {
    this.containers.forEach((container) => {
      if (container.style.display === "none") {
        container.style.display = "";
      }
    });
    this.window.dispatchEvent(new Event("resize"));
  }

  private hide(): void {
    this.containers.forEach((container) => {
      if (container.style.display !== "none") {
        container.style.display = "none";
      }
    });
    this.window.dispatchEvent(new Event("resize"));
  }

  public remove(): void {
    this.show();
  }
}

export class NoopChatWindowToggler implements ChatWindowToggler {
  public static create(): NoopChatWindowToggler {
    return new NoopChatWindowToggler();
  }

  public updateDisplaySettings(): void {
    // No operation
  }

  public remove(): void {
    // No operation
  }
}
