import { ChatEntry } from "../../../../interface/chat_entry";
import { PlayerSettings } from "../../../../interface/player_settings";
import { DanmakuCanvasController } from "./danmaku_canvas_controller";
import { MoveResult } from "./danmaku_element_component";
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
        let canvas = E.div("");
        let playerSettings: PlayerSettings = {
          displaySettings: { numLimit: 10 },
        };
        let mockDanmakuElementComponentFactoryFn = (
          settings: PlayerSettings
        ) => {
          counter.increment("danmakuElementComponentFactoryFn");
          assertThat(settings, eq(playerSettings), "playerSettings");
          return new MockDanmakuElementComponent(E.div(""));
        };

        // Execute
        let danmakuCanvasController = new DanmakuCanvasController(
          canvas,
          playerSettings,
          mockDanmakuElementComponentFactoryFn
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
      name: "AddSeveralWithOverlappingAndOverLimit",
      execute: () => {
        // Prepare
        let counter = new Counter<string>();
        let chatEntry: ChatEntry = { content: "anything" };
        let danmakuElementComponent =
          new (class extends MockDanmakuElementComponent {
            public height = 10;
            public constructor() {
              super(E.div(``));
            }
            public setContent(entry: ChatEntry) {
              counter.increment("setContent");
              assertThat(entry, eq(chatEntry), "chatEntry");
            }
            public startMoving(posY: number) {
              counter.increment("startMoving");
              assertThat(posY, eq(0), "posY");
            }
          })();
        let chatEntry2: ChatEntry = { content: "anything2" };
        let danmakuElementComponent2 =
          new (class extends MockDanmakuElementComponent {
            public height = 10;
            public constructor() {
              super(E.div(``));
            }
            public setContent(entry: ChatEntry) {
              counter.increment("setContent2");
              assertThat(entry, eq(chatEntry2), "chatEntry2");
            }
            public startMoving(posY: number) {
              counter.increment("startMoving2");
              assertThat(posY, eq(10), "posY2");
            }
          })();
        let chatEntry3: ChatEntry = { content: "anything3" };
        let danmakuElementComponent3 =
          new (class extends MockDanmakuElementComponent {
            public height = 25;
            public constructor() {
              super(E.div(``));
            }
            public setContent(entry: ChatEntry) {
              counter.increment("setContent3");
              assertThat(entry, eq(chatEntry3), "chatEntry3");
            }
            public startMoving(posY: number) {
              counter.increment("startMoving3");
              assertThat(posY, eq(5), "posY3");
            }
          })();
        let chatEntry4: ChatEntry = { content: "anything4" };
        let danmakuElementComponent4 =
          new (class extends MockDanmakuElementComponent {
            public height = 15;
            public constructor() {
              super(E.div(``));
            }
            public setContent(entry: ChatEntry) {
              counter.increment("setContent4");
              assertThat(entry, eq(chatEntry4), "chatEntry4");
            }
            public startMoving(posY: number) {
              counter.increment("startMoving4");
              assertThat(posY, eq(15), "posY4");
            }
          })();
        let canvas = E.div(`style="height: 30px;"`);
        document.body.appendChild(canvas);
        let playerSettings: PlayerSettings = {
          displaySettings: { enable: true, numLimit: 4 },
        };
        let danmakuCanvasController = new DanmakuCanvasController(
          canvas,
          playerSettings,
          () => {
            // Elements popped in the reverse order.
            switch (counter.increment("create element")) {
              case 1:
                return danmakuElementComponent4;
              case 2:
                return danmakuElementComponent3;
              case 3:
                return danmakuElementComponent2;
              case 4:
                return danmakuElementComponent;
              default:
                throw new Error("Not exepcted.");
            }
          }
        ).init();

        // Execute
        danmakuCanvasController.addPerCycle([chatEntry]);

        // Verify
        assertThat(counter.get("setContent"), eq(1), "setContent called");
        assertThat(counter.get("startMoving"), eq(1), "startMoving called");

        // Execute
        danmakuCanvasController.addPerCycle([chatEntry2]);

        // Verify
        assertThat(counter.get("setContent2"), eq(1), "setContent2 called");
        assertThat(counter.get("startMoving2"), eq(1), "startMoving2 called");

        // Execute
        danmakuCanvasController.addPerCycle([chatEntry3]);

        // Verify
        assertThat(counter.get("setContent3"), eq(1), "setContent3 called");
        assertThat(counter.get("startMoving3"), eq(1), "startMoving3 called");

        // Execute
        danmakuCanvasController.addPerCycle([chatEntry4]);

        // Verify
        assertThat(counter.get("setContent4"), eq(1), "setContent4 called");
        assertThat(counter.get("startMoving4"), eq(1), "startMoving4 called");

        // Execute
        danmakuCanvasController.addPerCycle([{}]);

        // Verify
        assertThat(counter.get("setContent"), eq(1), "setContent not called");
        assertThat(counter.get("setContent2"), eq(1), "setContent2 not called");
        assertThat(counter.get("setContent3"), eq(1), "setContent3 not called");
        assertThat(counter.get("setContent4"), eq(1), "setContent4 not called");

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
            public height = 10;
            public constructor() {
              super(E.div(``));
            }
            public setContent(entry: ChatEntry) {
              counter.increment("setContent");
              assertThat(entry, eq(chatEntry), "chatEntry");
            }
            public startMoving(posY: number) {
              counter.increment("startMoving");
              assertThat(posY, eq(0), "posY");
            }
          })();
        let canvas = E.div(`style="height: 5px;"`);
        document.body.appendChild(canvas);
        let playerSettings: PlayerSettings = {
          displaySettings: { enable: true, numLimit: 1 },
        };
        let danmakuCanvasController = new DanmakuCanvasController(
          canvas,
          playerSettings,
          () => danmakuElementComponent
        ).init();

        // Execute
        danmakuCanvasController.addPerCycle([chatEntry]);

        // Verify
        assertThat(counter.get("setContent"), eq(1), "setContent called");
        assertThat(counter.get("startMoving"), eq(1), "startMoving called");

        // Cleanup
        canvas.remove();
      },
    },
    {
      name: "MoveOneElementToEndWith4FramesWhileChangingCanvasWidth",
      execute: () => {
        // Prepare
        let counter = new Counter<string>();
        let chatEntry: ChatEntry = { content: "anything" };
        let danmakuElementComponent =
          new (class extends MockDanmakuElementComponent {
            public height = 10;
            public posY: number;
            public constructor() {
              super(E.div(``));
            }
            public setContent(entry: ChatEntry) {
              if (counter.increment("setContent") === 2) {
                assertThat(entry, eq(chatEntry), "chatEntry");
              }
            }
            public startMoving(posY: number) {
              if (counter.increment("startMoving") === 2) {
                assertThat(posY, eq(10), "posY");
              }
              this.posY = posY;
            }
            public moveOneFrame(deltaTime: number, canvasWidth: number) {
              switch (counter.increment("moveOneFrame")) {
                case 1:
                  assertThat(deltaTime, eq(400), "move frame 1st delta");
                  assertThat(canvasWidth, eq(30), "1st canvas width");
                  return MoveResult.OccupyAndDisplay;
                case 2:
                  assertThat(deltaTime, eq(500), "move frame 2nd delta");
                  assertThat(canvasWidth, eq(30), "2nd canvas width");
                  return MoveResult.Display;
                case 3:
                  assertThat(deltaTime, eq(600), "move frame 3rd delta");
                  assertThat(canvasWidth, eq(40), "3rd canvas width");
                  return MoveResult.Display;
                case 4:
                  assertThat(deltaTime, eq(700), "move frame 4th delta");
                  assertThat(canvasWidth, eq(40), "4th canvas width");
                  return MoveResult.End;
                default:
                  throw new Error("Not expected");
              }
            }
            public hide() {
              counter.increment("hide");
            }
          })();
        let danmakuElementComponent2 =
          new (class extends MockDanmakuElementComponent {
            public height = 10;
            public constructor() {
              super(E.div(``));
            }
            public setContent(entry: ChatEntry) {}
            public startMoving(posY: number) {
              counter.increment("startMoving2");
              assertThat(posY, eq(0), "posY");
            }
            public moveOneFrame(deltaTime: number, canvasWidth: number) {
              return MoveResult.OccupyAndDisplay;
            }
          })();
        let canvas = E.div(`style="height: 30px; width: 30px;"`);
        document.body.appendChild(canvas);
        let playerSettings: PlayerSettings = {
          displaySettings: { enable: true, numLimit: 2 },
        };
        let danmakuCanvasController = new DanmakuCanvasController(
          canvas,
          playerSettings,
          () => {
            switch (counter.increment("danmakuElementComponentFactoryFn")) {
              case 1:
                return danmakuElementComponent2;
              case 2:
                return danmakuElementComponent;
              default:
                throw new Error("Not expected");
            }
          }
        ).init();
        danmakuCanvasController.addPerCycle([{}]);
        assertThat(
          counter.get("setContent"),
          eq(1),
          "setContent called for preparation"
        );
        assertThat(
          counter.get("startMoving"),
          eq(1),
          "startMoving called for preparation"
        );

        // Execute
        danmakuCanvasController.moveOneFrame(400);

        // Verify
        assertThat(counter.get("moveOneFrame"), eq(1), "1st move");
        assertThat(counter.get("hide"), eq(0), "no hide after 1st move");

        // Execute
        danmakuCanvasController.moveOneFrame(500);

        // Verify
        assertThat(counter.get("moveOneFrame"), eq(2), "2nd move");
        assertThat(counter.get("hide"), eq(0), "no hide after 2nd move");

        danmakuCanvasController.addPerCycle([{}]);
        assertThat(counter.get("startMoving2"), eq(1), "startMoving2 called");

        // Prepare
        canvas.style.width = "40px";
        danmakuCanvasController.addPerCycle([]);

        // Execute
        danmakuCanvasController.moveOneFrame(600);

        // Verify
        assertThat(counter.get("moveOneFrame"), eq(3), "3rd move");
        assertThat(counter.get("hide"), eq(0), "no hide after 3rd move");

        // Execute
        danmakuCanvasController.moveOneFrame(700);

        // Verify
        assertThat(counter.get("moveOneFrame"), eq(4), "4th move");
        assertThat(counter.get("hide"), eq(1), "hide after 4th move");

        danmakuCanvasController.addPerCycle([chatEntry]);
        assertThat(
          counter.get("setContent"),
          eq(2),
          "setContent called after ended"
        );
        assertThat(
          counter.get("startMoving"),
          eq(2),
          "startMoving called after ended"
        );

        // Cleanup
        canvas.remove();
      },
    },
    {
      name: "MoveOneElementToEndWithOneFrame",
      execute: () => {
        // Prepare
        let counter = new Counter<string>();
        let chatEntry: ChatEntry = { content: "anything" };
        let danmakuElementComponent =
          new (class extends MockDanmakuElementComponent {
            public height = 10;
            public posY: number;
            public constructor() {
              super(E.div(``));
            }
            public setContent(entry: ChatEntry) {
              if (counter.increment("setContent") === 2) {
                assertThat(entry, eq(chatEntry), "chatEntry");
              }
            }
            public startMoving(posY: number) {
              if (counter.increment("startMoving") === 2) {
                assertThat(posY, eq(0), "posY");
              }
              this.posY = posY;
            }
            public moveOneFrame(deltaTime: number, canvasWidth: number) {
              switch (counter.increment("moveOneFrame")) {
                case 1:
                  return MoveResult.End;
                default:
                  throw new Error("Not expected");
              }
            }
            public hide() {
              counter.increment("hide");
            }
          })();
        let canvas = E.div(`style="height: 30px; width: 30px;"`);
        document.body.appendChild(canvas);
        let playerSettings: PlayerSettings = {
          displaySettings: { enable: true, numLimit: 1 },
        };
        let danmakuCanvasController = new DanmakuCanvasController(
          canvas,
          playerSettings,
          () => danmakuElementComponent
        ).init();
        danmakuCanvasController.addPerCycle([{}]);

        // Execute
        danmakuCanvasController.moveOneFrame(400);

        // Verify
        assertThat(counter.get("moveOneFrame"), eq(1), "1st move");
        assertThat(counter.get("hide"), eq(1), "hide after 1st move");

        danmakuCanvasController.addPerCycle([chatEntry]);
        assertThat(
          counter.get("setContent"),
          eq(2),
          "setContent called after ended"
        );
        assertThat(
          counter.get("startMoving"),
          eq(2),
          "startMoving called after ended"
        );

        // Cleanup
        canvas.remove();
      },
    },
    {
      name: "DisableDanmakuInTheMiddle",
      execute: () => {
        // Prepare
        let counter = new Counter<string>();
        let chatEntry: ChatEntry = { content: "anything" };
        let danmakuElementComponent =
          new (class extends MockDanmakuElementComponent {
            public height = 10;
            public constructor() {
              super(E.div(``));
            }
            public setContent(entry: ChatEntry) {
              if (counter.increment("setContent") === 2) {
                assertThat(entry, eq(chatEntry), "chatEntry");
              }
            }
            public startMoving(posY: number) {
              if (counter.increment("startMoving") === 2) {
                assertThat(posY, eq(10), "posY");
              }
            }
            public moveOneFrame(deltaTime: number, canvasWidth: number) {
              return MoveResult.OccupyAndDisplay;
            }
            public render() {
              counter.increment("render");
            }
            public hide() {
              counter.increment("hide");
            }
          })();
        let chatEntry2: ChatEntry = { content: "anything2" };
        let danmakuElementComponent2 =
          new (class extends MockDanmakuElementComponent {
            public height = 10;
            public constructor() {
              super(E.div(``));
            }
            public setContent(entry: ChatEntry) {
              if (counter.increment("setContent2") === 2) {
                assertThat(entry, eq(chatEntry2), "chatEntry2");
              }
            }
            public startMoving(posY: number) {
              if (counter.increment("startMoving2") === 2) {
                assertThat(posY, eq(0), "posY2");
              }
            }
            public moveOneFrame(deltaTime: number, canvasWidth: number) {
              return MoveResult.Display;
            }
            public render() {
              counter.increment("render2");
            }
            public hide() {
              counter.increment("hide2");
            }
          })();
        let canvas = E.div(`style="height: 30px; width: 30px;"`);
        document.body.appendChild(canvas);
        let playerSettings: PlayerSettings = {
          displaySettings: { enable: true, numLimit: 2 },
        };
        let danmakuCanvasController = new DanmakuCanvasController(
          canvas,
          playerSettings,
          () => {
            switch (counter.increment("danmakuElementComponentFactoryFn")) {
              case 1:
                return danmakuElementComponent;
              case 2:
                return danmakuElementComponent2;
              default:
                throw new Error("Not expected");
            }
          }
        ).init();
        danmakuCanvasController.addPerCycle([{}, {}]);
        danmakuCanvasController.moveOneFrame(400);

        // Execute
        danmakuCanvasController.refreshDisplay();

        // Verify
        assertThat(counter.get("render"), eq(1), "render called");
        assertThat(counter.get("render2"), eq(1), "render2 called");
        assertThat(counter.get("hide"), eq(0), "not hide");
        assertThat(counter.get("hide2"), eq(0), "not hide2");

        // Prepare
        playerSettings.displaySettings.enable = false;

        // Execute
        danmakuCanvasController.refreshDisplay();

        // Verify
        assertThat(counter.get("hide"), eq(1), "hide called");
        assertThat(counter.get("hide2"), eq(1), "hide2 called");

        // Execute
        danmakuCanvasController.addPerCycle([chatEntry2, chatEntry]);
        assertThat(
          counter.get("setContent"),
          eq(1),
          "setContent not called after disabled"
        );
        assertThat(
          counter.get("startMoving"),
          eq(1),
          "startMoving not called after disabled"
        );
        assertThat(
          counter.get("setContent2"),
          eq(1),
          "setContent2 not called after disabled"
        );
        assertThat(
          counter.get("startMoving2"),
          eq(1),
          "startMoving2 not called after disabled"
        );

        // Prepare
        playerSettings.displaySettings.enable = true;

        // Execute
        danmakuCanvasController.refreshDisplay();
        danmakuCanvasController.addPerCycle([chatEntry2, chatEntry]);

        // Verify
        assertThat(
          counter.get("setContent"),
          eq(2),
          "setContent called after re-enabled"
        );
        assertThat(
          counter.get("startMoving"),
          eq(2),
          "startMoving called after re-enabled"
        );
        assertThat(
          counter.get("setContent2"),
          eq(2),
          "setContent2 called after re-enabled"
        );
        assertThat(
          counter.get("startMoving2"),
          eq(2),
          "startMoving2 called after re-enabled"
        );

        // Cleanup
        canvas.remove();
      },
    },
    {
      name: "RefreshBlocked",
      execute: () => {
        // Prepare
        let counter = new Counter<string>();
        let chatEntry: ChatEntry = { content: "anything" };
        let danmakuElementComponent =
          new (class extends MockDanmakuElementComponent {
            public height = 10;
            public posY: number;
            public constructor() {
              super(E.div(``));
            }
            public setContent(entry: ChatEntry) {
              if (counter.increment("setContent") === 2) {
                assertThat(entry, eq(chatEntry), "chatEntry");
              }
            }
            public startMoving(posY: number) {
              if (counter.increment("startMoving") === 2) {
                assertThat(posY, eq(10), "posY");
              }
              this.posY = posY;
            }
            public moveOneFrame(deltaTime: number, canvasWidth: number) {
              return MoveResult.OccupyAndDisplay;
            }
            public isBlocked() {
              counter.increment("isBlocked");
              return true;
            }
            public hide() {
              counter.increment("hide");
            }
          })();
        let chatEntry2: ChatEntry = { content: "anything2" };
        let danmakuElementComponent2 =
          new (class extends MockDanmakuElementComponent {
            public height = 10;
            public posY: number;
            public constructor() {
              super(E.div(``));
            }
            public setContent(entry: ChatEntry) {
              if (counter.increment("setContent2") === 2) {
                assertThat(entry, eq(chatEntry2), "chatEntry2");
              }
            }
            public startMoving(posY: number) {
              if (counter.increment("startMoving2") === 2) {
                assertThat(posY, eq(0), "posY2");
              }
              this.posY = posY;
            }
            public moveOneFrame(deltaTime: number, canvasWidth: number) {
              return MoveResult.Display;
            }
            public isBlocked() {
              counter.increment("isBlocked2");
              return true;
            }
            public hide() {
              counter.increment("hide2");
            }
          })();
        let canvas = E.div(`style="height: 30px; width: 30px;"`);
        document.body.appendChild(canvas);
        let playerSettings: PlayerSettings = {
          displaySettings: { enable: true, numLimit: 2 },
        };
        let danmakuCanvasController = new DanmakuCanvasController(
          canvas,
          playerSettings,
          () => {
            switch (counter.increment("danmakuElementComponentFactoryFn")) {
              case 1:
                return danmakuElementComponent;
              case 2:
                return danmakuElementComponent2;
              default:
                throw new Error("Not expected");
            }
          }
        ).init();
        danmakuCanvasController.addPerCycle([{}, {}]);
        danmakuCanvasController.moveOneFrame(400);

        // Execute
        danmakuCanvasController.refreshBlocked();

        // Verify
        assertThat(counter.get("isBlocked"), eq(1), "isBlocked called");
        assertThat(counter.get("isBlocked2"), eq(1), "isBlocked2 called");
        assertThat(counter.get("hide"), eq(1), "hide called");
        assertThat(counter.get("hide2"), eq(1), "hide2 called");
        danmakuCanvasController.addPerCycle([chatEntry2, chatEntry]);
        assertThat(
          counter.get("setContent"),
          eq(2),
          "setContent called after cleared"
        );
        assertThat(
          counter.get("startMoving"),
          eq(2),
          "startMoving called after cleared"
        );
        assertThat(
          counter.get("setContent2"),
          eq(2),
          "setContent2 called after cleared"
        );
        assertThat(
          counter.get("startMoving2"),
          eq(2),
          "startMoving2 called after cleared"
        );

        // Cleanup
        canvas.remove();
      },
    },
  ],
});
