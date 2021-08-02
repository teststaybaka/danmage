import { BrowserHistoryPusher } from "./browser_history_pusher";
import { FeedbackComponent } from "./feedback_component";
import { HistoryComponent } from "./history_component";
import { NicknameComponent } from "./nickname_component";

export class BrowserHistoryPusherMock extends BrowserHistoryPusher {
  public constructor() {
    super(undefined, undefined, undefined);
  }
}

export class FeedbackComponentMock extends FeedbackComponent {
  public constructor() {
    super(...FeedbackComponent.createView(), undefined, undefined);
  }
}

export class HistoryComponentMock extends HistoryComponent {
  public constructor() {
    super(...HistoryComponent.createView(), undefined, undefined);
  }
}

export class NicknameComponentMock extends NicknameComponent {
  public constructor() {
    super(...NicknameComponent.createView(), undefined, undefined, undefined);
  }
}
