import { FillButtonComponent, TextButtonComponent } from "./button_component";

export class FillButtonComponentMock extends FillButtonComponent {
  public constructor(...childNodes: Array<Node>) {
    super(childNodes, undefined);
  }
}

export class TextButtonComponentMock extends TextButtonComponent {
  public constructor(...childNodes: Array<Node>) {
    super(childNodes, undefined);
  }
}
