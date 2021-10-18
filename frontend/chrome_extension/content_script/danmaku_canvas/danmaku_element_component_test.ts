import { DanmakuElementComponent } from "./danmaku_element_component";
import { MockDanmakuElementContentBuilder } from "./mocks";
import { Counter } from "@selfage/counter";
import { assertThat, eq, eqArray } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";

PUPPETEER_TEST_RUNNER.run({
  name: "DanmakuElementComponentTest",
  cases: [
    {
      name: "StartAndEnd",
      execute: () => {
        // Prepare
        let mockElement = new (class {
          public offsetWidth = 11;
          public offsetHeight = 22;
          public style: any = { setProperty: () => {} };
        })() as any;
        let mockWindow = new (class {
          public callbacks = new Array<[Function, number]>();
          public setTimeout(callback: Function, time: number) {
            this.callbacks.push([callback, time]);
          }
          public getComputedStyle() {
            return { transform: "matrix(1,0,0,1,10,0)" };
          }
        })() as any;
        let counter = new Counter<string>();
        let danmakuElementComponent = new DanmakuElementComponent(
          mockElement,
          { speed: 10 },
          undefined,
          new MockDanmakuElementContentBuilder(),
          mockWindow
        );
        danmakuElementComponent.on("occupationEnded", () => {
          counter.increment("occupationEnded");
        });
        danmakuElementComponent.on("displayEnded", () => {
          counter.increment("displayEnded");
        });

        // Execute
        danmakuElementComponent.setContent({});

        // Verify
        assertThat(
          danmakuElementComponent.heightOriginal,
          eq(22),
          "rendered height"
        );

        // Execute
        danmakuElementComponent.setStartPosition(100);

        // Verify
        assertThat(
          danmakuElementComponent.posYOriginal,
          eq(100),
          "original posY"
        );
        assertThat(
          mockElement.style.transform,
          eq("translate3d(11px, 100px, 0)"),
          "target transform"
        );
        assertThat(
          mockElement.style.transition,
          eq("none"),
          "transition at start"
        );
        assertThat(mockElement.style.visibility, eq("visible"), "visible");

        // Execute
        danmakuElementComponent.play(200);

        // Verify
        assertThat(
          mockElement.style.transition,
          eq("transform 21s linear"),
          "started transition"
        );
        assertThat(
          mockElement.style.transform,
          eq("translate3d(-200px, 100px, 0)"),
          "target transform"
        );
        assertThat(
          mockWindow.callbacks[0][1],
          eq(1000),
          "time to end occupation"
        );
        assertThat(
          mockWindow.callbacks[1][1],
          eq(21000),
          "time to end display"
        );
        assertThat(
          counter.get("occupationEnded"),
          eq(0),
          "occupation not ended"
        );
        assertThat(counter.get("displayEnded"), eq(0), "display not ended");

        // Execute
        mockWindow.callbacks[0][0]();

        // Verify
        assertThat(counter.get("occupationEnded"), eq(1), "occupation ended");
        assertThat(counter.get("displayEnded"), eq(0), "display not ended");

        // Execute
        mockWindow.callbacks[1][0]();

        // Verify
        assertThat(mockElement.style.visibility, eq("hidden"), "not visible");
        assertThat(
          counter.get("occupationEnded"),
          eq(1),
          "occupation already ended"
        );
        assertThat(counter.get("displayEnded"), eq(1), "display ended");
      },
    },
    {
      name: "StartAndPauseAndEndAndClear",
      execute: () => {
        // Prepare
        let mockElement = new (class {
          public offsetWidth = 11;
          public offsetHeight = 22;
          public style: any = { setProperty: () => {} };
        })() as any;
        let mockWindow = new (class {
          public id = 0;
          public callbacks = new Array<[Function, number]>();
          public setTimeout(callback: Function, time: number) {
            this.callbacks.push([callback, time]);
            this.id++;
            return this.id;
          }
          public clearedIds = new Array<number>();
          public clearTimeout(id: number) {
            this.clearedIds.push(id);
          }
          public posX = 10;
          public getComputedStyle() {
            return { transform: `matrix(1,0,0,1,${this.posX},0)` };
          }
        })() as any;
        let counter = new Counter<string>();
        let danmakuElementComponent = new DanmakuElementComponent(
          mockElement,
          { speed: 10 },
          undefined,
          new MockDanmakuElementContentBuilder(),
          mockWindow
        );
        danmakuElementComponent.on("occupationEnded", () => {
          counter.increment("occupationEnded");
        });
        danmakuElementComponent.on("displayEnded", () => {
          counter.increment("displayEnded");
        });
        danmakuElementComponent.setContent({});
        danmakuElementComponent.setStartPosition(100);
        danmakuElementComponent.play(200);
        mockWindow.posX = -250;

        // Execute
        danmakuElementComponent.pause();

        // Verify
        assertThat(
          mockWindow.clearedIds,
          eqArray([eq(1), eq(2)]),
          "cleared ids when paused"
        );
        assertThat(
          mockElement.style.transition,
          eq("none"),
          "paused transition"
        );
        assertThat(
          mockElement.style.transform,
          eq("translate3d(-250px, 100px, 0)"),
          "paused transform"
        );
        assertThat(
          counter.get("occupationEnded"),
          eq(0),
          "occupation not ended"
        );
        assertThat(counter.get("displayEnded"), eq(0), "display not ended");

        // Execute
        danmakuElementComponent.play(220);

        // Verify
        assertThat(counter.get("occupationEnded"), eq(1), "occupation ended");
        assertThat(counter.get("displayEnded"), eq(1), "display ended");

        // Execute
        danmakuElementComponent.clear();

        // Verify
        assertThat(
          counter.get("occupationEnded"),
          eq(1),
          "occupation already ended"
        );
        assertThat(counter.get("displayEnded"), eq(1), "display already ended");
      },
    },
  ],
});
