import { FillButtonComponentMock, TextButtonComponentMock } from "../../mocks";
import { FeedbackComponent } from "./feedback_component";
import { HistoryComponent } from "./history_component";
import { HomeComponent } from "./home_component";
import { NicknameComponent } from "./nickname_component";
import { E } from "@selfage/element/factory";

export class HomeComponentMock extends HomeComponent {
  public constructor() {
    super(HomeComponent.createView());
  }
}

export class FeedbackComponentMock extends FeedbackComponent {
  public constructor() {
    super(
      ...FeedbackComponent.createView(
        new FillButtonComponentMock(E.text("Submit"))
      ),
      undefined
    );
  }
}

export class HistoryComponentMock extends HistoryComponent {
  public constructor() {
    super(
      ...HistoryComponent.createView(
        new TextButtonComponentMock(E.text("Show more"))
      ),
      undefined
    );
  }
}

export class NicknameComponentMock extends NicknameComponent {
  public constructor() {
    super(
      ...NicknameComponent.createView(
        new FillButtonComponentMock(E.text("Set"))
      ),
      undefined,
      undefined
    );
  }
}
