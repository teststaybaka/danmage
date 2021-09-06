import {
  DanmakuCustomizer,
  DanmakuElementComponent,
  MoveResult,
  reverseColorAsTextShadow,
} from "./danmaku_element_component";
import { assertThat, eq } from "@selfage/test_matcher";
import { NODE_TEST_RUNNER } from "@selfage/test_runner";

class MockElement {
  public style: any = { setProperty: () => {} };
  public offsetWidth: any;
}

class MockDanmakuCustomizer implements DanmakuCustomizer {
  public render() {}
}

NODE_TEST_RUNNER.run({
  name: "DanmakuElementComponentTest",
  cases: [
    {
      name: "ReverseForBlackBorder",
      execute: () => {
        // Execute
        let textShadow = reverseColorAsTextShadow(119, 120, 122);

        // Verify
        assertThat(
          textShadow,
          eq("-.2rem 0 black, 0 .2rem black, .2rem 0 black, 0 -.2rem black"),
          "shadow"
        );
      },
    },
    {
      name: "ReverseForWhiteBorder",
      execute: () => {
        // Execute
        let textShadow = reverseColorAsTextShadow(119, 121, 120);

        // Verify
        assertThat(
          textShadow,
          eq("-.2rem 0 white, 0 .2rem white, .2rem 0 white, 0 -.2rem white"),
          "shadow"
        );
      },
    },
    {
      name: "MoveToEnd",
      execute: () => {
        // Prepare
        let element = new MockElement();
        element.offsetWidth = 40;
        let danmakuElementComponent = new DanmakuElementComponent(
          element as any,
          { speed: 10 },
          undefined,
          new MockDanmakuCustomizer()
        );
        danmakuElementComponent.setContent({});

        {
          // Execute
          danmakuElementComponent.startMoving(20);

          // Verify
          assertThat(
            element.style.transform,
            eq("translate(40px, 20px)"),
            "transform 1"
          );
        }

        {
          // Execute
          let res = danmakuElementComponent.moveOneFrame(500, 30);

          // Verify
          assertThat(
            element.style.transform,
            eq("translate(35px, 20px)"),
            "transform 2"
          );
          assertThat(res, eq(MoveResult.OccupyAndDisplay), "move result 2");
        }

        {
          // Execute
          let res = danmakuElementComponent.moveOneFrame(1000, 30);

          // Verify
          assertThat(
            element.style.transform,
            eq("translate(25px, 20px)"),
            "transform 3"
          );
          assertThat(res, eq(MoveResult.OccupyAndDisplay), "move result 3");
        }

        {
          // Execute
          let res = danmakuElementComponent.moveOneFrame(3000, 30);

          // Verify
          assertThat(
            element.style.transform,
            eq("translate(-5px, 20px)"),
            "transform 4"
          );
          assertThat(res, eq(MoveResult.Display), "move result 4");
        }

        {
          // Execute
          let res = danmakuElementComponent.moveOneFrame(3000, 30);

          // Verify
          assertThat(
            element.style.transform,
            eq("translate(-35px, 20px)"),
            "transform 5"
          );
          assertThat(res, eq(MoveResult.End), "move result 5");
        }
      },
    },
    {
      name: "ChangeSpeedAfterStartedMoving",
      execute: () => {
        // Prepare
        let element = new MockElement();
        element.offsetWidth = 40;
        let settings = {
          speed: 10,
        };
        let danmakuElementComponent = new DanmakuElementComponent(
          element as any,
          settings,
          undefined,
          new MockDanmakuCustomizer()
        );
        danmakuElementComponent.setContent({});
        danmakuElementComponent.startMoving(20);
        settings.speed = 20;

        // Execute
        danmakuElementComponent.render();
        let res = danmakuElementComponent.moveOneFrame(1100, 30);

        // Verify
        assertThat(
          element.style.transform,
          eq("translate(18px, 20px)"),
          "transform"
        );
        assertThat(res, eq(MoveResult.OccupyAndDisplay), "move result");
      },
    },
  ],
});
