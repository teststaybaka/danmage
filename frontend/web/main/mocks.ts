import { FillButtonComponentMock, TextButtonComponentMock } from "../../mocks";
import { FeedbackComponent } from "./feedback_component";
import { HistoryComponent } from "./history_component";
import { HomeComponent } from "./home_component";
import { NicknameComponent } from "./nickname_component";
import { E } from "@selfage/element/factory";

export class HomeComponentMock extends HomeComponent {
  public constructor() {
    super();
  }
}

export class FeedbackComponentMock extends FeedbackComponent {
  public constructor() {
    super(new FillButtonComponentMock(E.text("Submit")), undefined);
  }
}

export class HistoryComponentMock extends HistoryComponent {
  public constructor() {
    super(new TextButtonComponentMock(E.text("Show more")), undefined);
  }
}

export class NicknameComponentMock extends NicknameComponent {
  public constructor() {
    super(new FillButtonComponentMock(E.text("Set")), undefined, undefined);
  }
}
