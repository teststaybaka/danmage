import {
  DanmakuElementComponent,
  DanmakuElementContentBuilder,
} from "./danmaku_element_component";

export class MockDanmakuElementContentBuilder
  implements DanmakuElementContentBuilder
{
  public build() {
    return "";
  }
}

export class MockDanmakuElementComponent extends DanmakuElementComponent {
  public constructor(body: HTMLDivElement) {
    super(body, undefined, undefined, undefined);
  }
}
