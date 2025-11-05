import { DisplaySettings } from "../../../interface/player_settings";

export interface ChatWindowToggler {
  updateDisplaySettings(): void;
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
      this.containers.forEach((container) => {
        container.style.display = "block";
      });
    } else {
      this.containers.forEach((container) => {
        container.style.display = "none";
      });
    }
    this.window.dispatchEvent(new Event("resize"));
  }
}

export class NoopChatWindowToggler implements ChatWindowToggler {
  public static create(): NoopChatWindowToggler {
    return new NoopChatWindowToggler();
  }

  public updateDisplaySettings(): void {
    // No operation
  }
}
