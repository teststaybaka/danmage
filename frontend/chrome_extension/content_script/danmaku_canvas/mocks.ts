import {
  DanmakuElementComponent,
  DanmakuElementCustomizer,
} from "./danmaku_element_component";

export class MockDanmakuElementCustomizer implements DanmakuElementCustomizer {
  public render() {}
}

export class MockDanmakuElementComponent extends DanmakuElementComponent {
  public constructor(body: HTMLDivElement) {
    super(body, undefined, undefined, undefined);
  }
}
