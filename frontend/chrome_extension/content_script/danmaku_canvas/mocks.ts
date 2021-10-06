import { DanmakuElementComponent } from "./danmaku_element_component";
import { DanmakuElementContentBuilder } from "./danmaku_element_content_builder";

export class MockDanmakuElementContentBuilder
  implements DanmakuElementContentBuilder
{
  public build() {
    return "";
  }
}

export class MockDanmakuElementComponent extends DanmakuElementComponent {
  public constructor(body: HTMLDivElement) {
    super(body, undefined, undefined, undefined, undefined);
  }
}
