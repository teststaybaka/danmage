import { ChatEntry } from "../../../../interface/chat_entry";
import {
  DistributionStyle,
  PlayerSettings,
} from "../../../../interface/player_settings";
import { DanmakuCanvasController } from "./danmaku_canvas_controller";
import { MockDanmakuElementComponent } from "./mocks";
import { Counter } from "@selfage/counter";
import { E } from "@selfage/element/factory";
import { assertThat, eq } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER, TestCase } from "@selfage/test_runner";

PUPPETEER_TEST_RUNNER.run({
  name: "DanmakuCanvasControllerTest",
  cases: [
    {
      name: "PrepareIdleElements",
      execute: () => {
        // Prepare
        let counter = new Counter<string>();
        let canvas = E.div({});
        let playerSettings: PlayerSettings = {
          displaySettings: { numLimit: 10 },
        };
        let mockDanmakuElementComponentFactoryFn = (
          settings: PlayerSettings
        ) => {
          counter.increment("danmakuElementComponentFactoryFn");
          assertThat(settings, eq(playerSettings), "playerSettings");
          return new MockDanmakuElementComponent(E.div({}));
        };

        // Execute
        let danmakuCanvasController = new DanmakuCanvasController(
          canvas,
          playerSettings,
          mockDanmakuElementComponentFactoryFn,
          new (class {
            public setInterval() {}
          })() as any,
          () => {
            return 0;
          }
        ).init();

        // Verify
        assertThat(
          counter.get("danmakuElementComponentFactoryFn"),
          eq(10),
          "elements inited"
        );
        assertThat(canvas.childElementCount, eq(10), "elements inited count");

        // Execute
        playerSettings.displaySettings.numLimit = 20;
        danmakuCanvasController.refreshDisplay();

        // Verify
        assertThat(
          counter.get("danmakuElementComponentFactoryFn"),
          eq(20),
          "elements refreshed"
        );
        assertThat(
          canvas.childElementCount,
          eq(20),
          "elements refreshed count"
        );

        // Execute
        playerSettings.displaySettings.numLimit = 10;
        danmakuCanvasController.refreshDisplay();

        // Verify
        assertThat(
          counter.get("danmakuElementComponentFactoryFn"),
          eq(20),
          "elements refreshed unchange"
        );
        assertThat(
          canvas.childElementCount,
          eq(20),
          "elements refreshed unchange"
        );
      },
    },
    new (class implements TestCase {
      public name = "AddSeveralToExhaustSpaceAndIdleElements";
      private canvas: HTMLDivElement;
      public execute() {
        // Prepare
        let counter = new Counter<string>();
        let chatEntry: ChatEntry = { content: "anything" };
        let danmakuElementComponent =
          new (class extends MockDanmakuElementComponent {
            public constructor() {
              super(E.div({}));
            }
            public setContentAndGetHeight(entry: ChatEntry) {
              counter.increment("setContentAndGetHeight");
              assertThat(entry, eq(chatEntry), "chatEntry");
              return 10;
            }
            public setStartPosition(posY: number) {
              counter.increment("setStartPosition");
              assertThat(posY, eq(15), "posY");
            }
            public play(canvasWidth: number) {
              counter.increment("play");
              assertThat(canvasWidth, eq(1000), "canvasWidth");
            }
          })();
        let chatEntry2: ChatEntry = { content: "anything2" };
        let danmakuElementComponent2 =
          new (class extends MockDanmakuElementComponent {
            public constructor() {
              super(E.div({}));
            }
            public setContentAndGetHeight(entry: ChatEntry) {
              counter.increment("setContentAndGetHeight2");
              assertThat(entry, eq(chatEntry2), "chatEntry2");
              return 10;
            }
            public setStartPosition(posY: number) {
              counter.increment("setStartPosition2");
              assertThat(posY, eq(5), "posY2");
            }
            public play() {
              counter.increment("play2");
            }
          })();
        let chatEntry3: ChatEntry = { content: "anything3" };
        let chatEntry4: ChatEntry = { content: "anything4" };
        let danmakuElementComponent3 =
          new (class extends MockDanmakuElementComponent {
            public constructor() {
              super(E.div({}));
            }
            public setContentAndGetHeight(entry: ChatEntry) {
              switch (counter.increment("setContentAndGetHeight3")) {
                case 1:
                  assertThat(entry, eq(chatEntry3), "chatEntry3");
                  return 20;
                case 2:
                  assertThat(entry, eq(chatEntry4), "chatEntry4");
                  return 15;
                default:
                  throw new Error("Unexpected");
              }
            }
            public setStartPosition(posY: number) {
              counter.increment("setStartPosition3");
              assertThat(posY, eq(25), "posY3");
            }
            public play() {
              counter.increment("play3");
            }
            public clear() {
              counter.increment("clear3");
            }
          })();
        this.canvas = E.div({ style: "width: 1000px; height: 50px;" });
        document.body.appendChild(this.canvas);
        let playerSettings: PlayerSettings = {
          displaySettings: {
            enable: true,
            numLimit: 3,
            topMargin: 10,
            bottomMargin: 20,
            distributionStyle: DistributionStyle.RandomDistributionStyle,
          },
        };
        let danmakuCanvasController = new DanmakuCanvasController(
          this.canvas,
          playerSettings,
          () => {
            // Elements popped in the reverse order.
            switch (counter.increment("create element")) {
              case 1:
                return danmakuElementComponent3;
              case 2:
                return danmakuElementComponent2;
              case 3:
                return danmakuElementComponent;
              default:
                throw new Error("Not exepcted.");
            }
          },
          new (class {
            public setInterval() {}
          })() as any,
          () => {
            switch (counter.increment("random")) {
              case 1:
                return 10 / 25;
              case 2:
                return 8 / 25;
              case 3:
                return 15 / 15;
              case 4:
                return 18 / 20;
              default:
                throw new Error("Not expected.");
            }
          }
        ).init();
        danmakuCanvasController.play();

        // Execute
        danmakuCanvasController.addEntries([chatEntry, chatEntry2]);

        // Verify
        assertThat(
          counter.get("setContentAndGetHeight"),
          eq(1),
          "setContentAndGetHeight called"
        );
        assertThat(
          counter.get("setStartPosition"),
          eq(1),
          "setStartPosition called"
        );
        assertThat(counter.get("play"), eq(1), "play called");
        assertThat(
          counter.get("setContentAndGetHeight2"),
          eq(1),
          "setContentAndGetHeight2 called"
        );
        assertThat(
          counter.get("setStartPosition2"),
          eq(1),
          "setStartPosition2 called"
        );
        assertThat(counter.get("play2"), eq(1), "play2 called");

        // Execute
        danmakuCanvasController.addEntries([chatEntry3]);

        // Verify
        assertThat(
          counter.get("setContentAndGetHeight3"),
          eq(1),
          "setContentAndGetHeight3 called"
        );
        assertThat(
          counter.get("setStartPosition3"),
          eq(0),
          "setStartPosition3 not called"
        );
        assertThat(counter.get("play3"), eq(0), "play3 not called");
        assertThat(counter.get("clear3"), eq(1), "clear3 called");

        // Execute
        danmakuCanvasController.addEntries([chatEntry4]);

        // Verify
        assertThat(
          counter.get("setContentAndGetHeight3"),
          eq(2),
          "setContentAndGetHeight3 called"
        );
        assertThat(
          counter.get("setStartPosition3"),
          eq(1),
          "setStartPosition3 called"
        );
        assertThat(counter.get("play3"), eq(1), "play3 called");

        // Execute
        danmakuCanvasController.addEntries([{}]);

        // Verify
        assertThat(
          counter.get("setContentAndGetHeight"),
          eq(1),
          "setContentAndGetHeight not called"
        );
        assertThat(
          counter.get("setContentAndGetHeight2"),
          eq(1),
          "setContentAndGetHeight2 not called"
        );
        assertThat(
          counter.get("setContentAndGetHeight3"),
          eq(2),
          "setContentAndGetHeight3 not called"
        );
      }
      public tearDown() {
        this.canvas.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "AddOneWithLowCanvasHeight";
      private canvas: HTMLDivElement;
      public execute() {
        // Prepare
        let counter = new Counter<string>();
        let chatEntry: ChatEntry = { content: "anything" };
        let danmakuElementComponent =
          new (class extends MockDanmakuElementComponent {
            public constructor() {
              super(E.div({}));
            }
            public setContentAndGetHeight(entry: ChatEntry) {
              counter.increment("setContentAndGetHeight");
              assertThat(entry, eq(chatEntry), "chatEntry");
              return 10;
            }
            public setStartPosition(posY: number) {
              counter.increment("setStartPosition");
              assertThat(posY, eq(5), "posY");
            }
            public play() {
              counter.increment("play");
            }
          })();
        this.canvas = E.div({ style: "height: 10px;" });
        document.body.appendChild(this.canvas);
        let playerSettings: PlayerSettings = {
          displaySettings: {
            enable: true,
            numLimit: 1,
            topMargin: 50,
            bottomMargin: 0,
            distributionStyle: DistributionStyle.TopDownDistributionStyle,
          },
        };
        let danmakuCanvasController = new DanmakuCanvasController(
          this.canvas,
          playerSettings,
          () => danmakuElementComponent,
          new (class {
            public setInterval() {}
          })() as any,
          () => {
            throw new Error("Not expected!");
          }
        ).init();
        danmakuCanvasController.play();

        // Execute
        danmakuCanvasController.addEntries([chatEntry]);

        // Verify
        assertThat(
          counter.get("setContentAndGetHeight"),
          eq(1),
          "setContentAndGetHeight called"
        );
        assertThat(
          counter.get("setStartPosition"),
          eq(1),
          "setStartPosition called"
        );
        assertThat(counter.get("play"), eq(1), "play called");
      }
      public tearDown() {
        this.canvas.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "MoveOneElementToEndAndFillGap";
      private canvas: HTMLDivElement;
      public execute() {
        // Prepare
        let counter = new Counter<string>();
        let chatEntry: ChatEntry = { content: "anything" };
        let danmakuElementComponent =
          new (class extends MockDanmakuElementComponent {
            public constructor() {
              super(E.div({}));
            }
            public setContentAndGetHeight(entry: ChatEntry) {
              if (counter.increment("setContentAndGetHeight") === 2) {
                assertThat(entry, eq(chatEntry), "chatEntry");
              }
              return 10;
            }
            public setStartPosition(posY: number) {
              switch (counter.increment("setStartPosition")) {
                case 1:
                  assertThat(posY, eq(0), "posY");
                  break;
                case 2:
                  assertThat(posY, eq(20), "2nd posY");
                  break;
                default:
                  throw new Error("Unexpected");
              }
            }
            public play() {}
          })();
        let danmakuElementComponent2 =
          new (class extends MockDanmakuElementComponent {
            public constructor() {
              super(E.div({}));
            }
            public setContentAndGetHeight(entry: ChatEntry) {
              return 10;
            }
            public setStartPosition(posY: number) {
              counter.increment("setStartPosition2");
              assertThat(posY, eq(10), "posY2");
            }
            public play() {}
          })();
        let danmakuElementComponent3 =
          new (class extends MockDanmakuElementComponent {
            public constructor() {
              super(E.div({}));
            }
            public setContentAndGetHeight(entry: ChatEntry) {
              return 10;
            }
            public setStartPosition(posY: number) {
              counter.increment("setStartPosition3");
              assertThat(posY, eq(0), "posY3");
            }
            public play() {}
          })();
        this.canvas = E.div({ style: "height: 30px; width: 30px;" });
        document.body.appendChild(this.canvas);
        let playerSettings: PlayerSettings = {
          displaySettings: {
            enable: true,
            numLimit: 3,
            topMargin: 0,
            bottomMargin: 0,
            distributionStyle: DistributionStyle.RandomDistributionStyle,
          },
        };
        let danmakuCanvasController = new DanmakuCanvasController(
          this.canvas,
          playerSettings,
          () => {
            switch (counter.increment("danmakuElementComponentFactoryFn")) {
              case 1:
                return danmakuElementComponent3;
              case 2:
                return danmakuElementComponent2;
              case 3:
                return danmakuElementComponent;
              default:
                throw new Error("Not expected");
            }
          },
          new (class {
            public setInterval() {}
          })() as any,
          () => {
            switch (counter.increment("random")) {
              case 1:
                return 0;
              case 2:
                return 5 / 20;
              case 3:
                return 5 / 20;
              case 4:
                return 10 / 20;
              default:
                throw new Error("Not expected");
            }
          }
        ).init();
        danmakuCanvasController.play();
        danmakuCanvasController.addEntries([{}, {}]);
        assertThat(
          counter.get("setContentAndGetHeight"),
          eq(1),
          "setContentAndGetHeight called for preparation"
        );
        assertThat(
          counter.get("setStartPosition"),
          eq(1),
          "setStartPosition called for preparation"
        );
        assertThat(
          counter.get("setStartPosition2"),
          eq(1),
          "setStartPosition2 called for preparation"
        );

        // Execute
        danmakuElementComponent.emit("occupationEnded");

        // Verify
        danmakuCanvasController.addEntries([{}]);
        assertThat(
          counter.get("setStartPosition3"),
          eq(1),
          "setStartPosition3 called"
        );

        // Execute
        danmakuElementComponent.emit("displayEnded");

        // Verify
        danmakuCanvasController.addEntries([chatEntry]);
        assertThat(
          counter.get("setContentAndGetHeight"),
          eq(2),
          "setContentAndGetHeight called when reused"
        );
        assertThat(
          counter.get("setStartPosition"),
          eq(2),
          "setStartPosition called when reused"
        );
      }
      public tearDown() {
        this.canvas.remove();
      }
    })(),
  ],
});
