import { ChatEntry } from "../../../../interface/chat_entry";
import { PlayerSettings } from "../../../../interface/player_settings";
import { DanmakuCanvasController } from "./danmaku_canvas_controller";
import { MockDanmakuElementComponent } from "./mocks";
import { Counter } from "@selfage/counter";
import { E } from "@selfage/element/factory";
import { assertThat, eq } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";

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
            public setTimeout() {}
          })() as any
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
    {
      name: "AddSeveralToExhaustSpaceAndIdleElements",
      execute: () => {
        // Prepare
        let counter = new Counter<string>();
        let chatEntry: ChatEntry = { content: "anything" };
        let danmakuElementComponent =
          new (class extends MockDanmakuElementComponent {
            public constructor() {
              super(E.div({}));
              this.heightOriginal = 10;
            }
            public setContent(entry: ChatEntry) {
              counter.increment("setContent");
              assertThat(entry, eq(chatEntry), "chatEntry");
            }
            public setStartPosition(posY: number) {
              counter.increment("setStartPosition");
              assertThat(posY, eq(0), "posY");
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
              this.heightOriginal = 10;
            }
            public setContent(entry: ChatEntry) {
              counter.increment("setContent2");
              assertThat(entry, eq(chatEntry2), "chatEntry2");
            }
            public setStartPosition(posY: number) {
              counter.increment("setStartPosition2");
              assertThat(posY, eq(10), "posY2");
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
            public setContent(entry: ChatEntry) {
              switch (counter.increment("setContent3")) {
                case 1:
                  this.heightOriginal = 10;
                  assertThat(entry, eq(chatEntry3), "chatEntry3");
                  break;
                case 2:
                  this.heightOriginal = 5;
                  assertThat(entry, eq(chatEntry4), "chatEntry4");
                  break;
                default:
                  throw new Error("Unexpected");
              }
            }
            public setStartPosition(posY: number) {
              counter.increment("setStartPosition3");
              assertThat(posY, eq(20), "posY3");
            }
            public play() {
              counter.increment("play3");
            }
            public clear() {
              counter.increment("clear3");
            }
          })();
        let canvas = E.div({ style: "width: 1000px; height: 25px;" });
        document.body.appendChild(canvas);
        let playerSettings: PlayerSettings = {
          displaySettings: { enable: true, numLimit: 3 },
        };
        let danmakuCanvasController = new DanmakuCanvasController(
          canvas,
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
            public setTimeout() {}
          })() as any
        ).init();
        danmakuCanvasController.play();

        // Execute
        danmakuCanvasController.addEntries([chatEntry, chatEntry2]);

        // Verify
        assertThat(counter.get("setContent"), eq(1), "setContent called");
        assertThat(
          counter.get("setStartPosition"),
          eq(1),
          "setStartPosition called"
        );
        assertThat(counter.get("play"), eq(1), "play called");
        assertThat(counter.get("setContent2"), eq(1), "setContent2 called");
        assertThat(
          counter.get("setStartPosition2"),
          eq(1),
          "setStartPosition2 called"
        );
        assertThat(counter.get("play2"), eq(1), "play2 called");

        // Execute
        danmakuCanvasController.addEntries([chatEntry3]);

        // Verify
        assertThat(counter.get("setContent3"), eq(1), "setContent3 called");
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
        assertThat(counter.get("setContent3"), eq(2), "setContent3 called");
        assertThat(
          counter.get("setStartPosition3"),
          eq(1),
          "setStartPosition3 called"
        );
        assertThat(counter.get("play3"), eq(1), "play3 called");

        // Execute
        danmakuCanvasController.addEntries([{}]);

        // Verify
        assertThat(counter.get("setContent"), eq(1), "setContent not called");
        assertThat(counter.get("setContent2"), eq(1), "setContent2 not called");
        assertThat(counter.get("setContent3"), eq(2), "setContent3 not called");

        // Cleanup
        canvas.remove();
      },
    },
    {
      name: "AddOneWithLowCanvasHeight",
      execute: () => {
        // Prepare
        let counter = new Counter<string>();
        let chatEntry: ChatEntry = { content: "anything" };
        let danmakuElementComponent =
          new (class extends MockDanmakuElementComponent {
            public constructor() {
              super(E.div({}));
              this.heightOriginal = 10;
            }
            public setContent(entry: ChatEntry) {
              counter.increment("setContent");
              assertThat(entry, eq(chatEntry), "chatEntry");
            }
            public setStartPosition(posY: number) {
              counter.increment("setStartPosition");
              assertThat(posY, eq(0), "posY");
            }
            public play() {
              counter.increment("play");
            }
          })();
        let canvas = E.div({ style: "height: 5px;" });
        document.body.appendChild(canvas);
        let playerSettings: PlayerSettings = {
          displaySettings: { enable: true, numLimit: 1 },
        };
        let danmakuCanvasController = new DanmakuCanvasController(
          canvas,
          playerSettings,
          () => danmakuElementComponent,
          new (class {
            public setTimeout() {}
          })() as any
        ).init();
        danmakuCanvasController.play();

        // Execute
        danmakuCanvasController.addEntries([chatEntry]);

        // Verify
        assertThat(counter.get("setContent"), eq(1), "setContent called");
        assertThat(
          counter.get("setStartPosition"),
          eq(1),
          "setStartPosition called"
        );
        assertThat(counter.get("play"), eq(1), "play called");

        // Cleanup
        canvas.remove();
      },
    },
    {
      name: "MoveOneElementToEndAndFillGap",
      execute: () => {
        // Prepare
        let counter = new Counter<string>();
        let chatEntry: ChatEntry = { content: "anything" };
        let danmakuElementComponent =
          new (class extends MockDanmakuElementComponent {
            public constructor() {
              super(E.div({}));
              this.heightOriginal = 10;
            }
            public setContent(entry: ChatEntry) {
              if (counter.increment("setContent") === 2) {
                assertThat(entry, eq(chatEntry), "chatEntry");
              }
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
              this.posYOriginal = posY;
            }
            public play() {}
          })();
        let danmakuElementComponent2 =
          new (class extends MockDanmakuElementComponent {
            public constructor() {
              super(E.div({}));
              this.heightOriginal = 10;
            }
            public setContent(entry: ChatEntry) {}
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
              this.heightOriginal = 10;
            }
            public setContent(entry: ChatEntry) {}
            public setStartPosition(posY: number) {
              counter.increment("setStartPosition3");
              assertThat(posY, eq(0), "posY3");
            }
            public play() {}
          })();
        let canvas = E.div({ style: "height: 30px; width: 30px;" });
        document.body.appendChild(canvas);
        let playerSettings: PlayerSettings = {
          displaySettings: { enable: true, numLimit: 3 },
        };
        let danmakuCanvasController = new DanmakuCanvasController(
          canvas,
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
            public setTimeout() {}
          })() as any
        ).init();
        danmakuCanvasController.play();
        danmakuCanvasController.addEntries([{}, {}]);
        assertThat(
          counter.get("setContent"),
          eq(1),
          "setContent called for preparation"
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
          counter.get("setContent"),
          eq(2),
          "setContent called when reused"
        );
        assertThat(
          counter.get("setStartPosition"),
          eq(2),
          "setStartPosition called when reused"
        );

        // Cleanup
        canvas.remove();
      },
    },
  ],
});
