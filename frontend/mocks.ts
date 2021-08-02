import { FillButtonComponent, TextButtonComponent } from "./button_component";

export class FillButtonComponentMock extends FillButtonComponent {
  public constructor(...childNodes: Array<Node>) {
    super(FillButtonComponent.createView(...childNodes), undefined);
  }
}

export class TextButtonComponentMock extends TextButtonComponent {
  public constructor(...childNodes: Array<Node>) {
    super(TextButtonComponent.createView(...childNodes), undefined);
  }
}
