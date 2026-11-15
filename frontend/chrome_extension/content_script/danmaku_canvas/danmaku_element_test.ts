import { DanmakuElement } from "./danmaku_element";
import { MockBlockPatternTester } from "../common/mocks";
import { TEST_RUNNER } from "@selfage/puppeteer_test_runner";
import { assertThat, eq, ge, le } from "@selfage/test_matcher";

const SPEED = 200; // px/s

class Fixture {
  public time = 0;
  public canvas = document.createElement("div");
  public element: DanmakuElement;
  public displayEnded = 0;
  public startPosX: number;
  private timers = new Map<number, { at: number; callback: () => void }>();
  private nextTimerId = 1;

  public constructor(canvasWidth: number) {
    document.body.innerHTML = "";
    this.canvas.style.cssText = `position: relative; width: ${canvasWidth}px; height: 300px;`;
    document.body.appendChild(this.canvas);
    // The clock and the timeouts are faked; the transitions stay real.
    let fakeWindow = {
      setTimeout: (callback: () => void, delay: number) => {
        this.timers.set(this.nextTimerId, {
          at: this.time + delay,
          callback,
        });
        return this.nextTimerId++;
      },
      clearTimeout: (id: number) => this.timers.delete(id),
      getComputedStyle: window.getComputedStyle.bind(window),
      performance: { now: () => this.time },
    } as unknown as Window;
    this.element = new DanmakuElement(
      fakeWindow,
      new MockBlockPatternTester(),
      {
        extractContent: (content: string) => content,
        build: () => "<span>danmaku</span>",
      },
      { speed: SPEED },
      {},
    );
    this.element.on("displayEnded", () => this.displayEnded++);
    this.canvas.appendChild(this.element.body);
    this.element.setReadyToPlay(0, canvasWidth);
    this.startPosX = this.element.body.offsetWidth;
    this.element.play();
  }

  // Moves the clock forward and runs the timeouts that are due, in order.
  public advanceTo(time: number): void {
    this.time = time;
    [...this.timers.entries()]
      .filter(([, timer]) => timer.at <= time)
      .sort(([, left], [, right]) => left.at - right.at)
      .forEach(([id, timer]) => {
        if (this.timers.delete(id)) {
          timer.callback();
        }
      });
  }

  // What the browser does to a transition when YouTube moves the player.
  public reparent(): void {
    this.canvas.appendChild(this.element.body);
  }

  public visualPosX(): number {
    return new DOMMatrix(getComputedStyle(this.element.body).transform).m41;
  }

  public dispose(): void {
    this.element.remove();
    document.body.innerHTML = "";
  }
}

TEST_RUNNER.run({
  name: "DanmakuElementTest",
  cases: [
    {
      name: "ResizeAfterTheBrowserCancelledTheTransitionKeepsThePosition",
      execute: () => {
        // Prepare
        let fixture = new Fixture(800);
        fixture.time = 1000;
        fixture.reparent();
        let visualPosXAfterReparent = fixture.visualPosX();

        // Execute
        fixture.element.updateCanvasSize(900);

        // Verify
        let expectedPosX = fixture.startPosX - SPEED;
        assertThat(
          Math.round(visualPosXAfterReparent),
          eq(-800),
          "visual position right after reparenting (the browser jumped it)",
        );
        assertThat(
          fixture.visualPosX(),
          ge(expectedPosX - 5),
          "position after resize, lower bound",
        );
        assertThat(
          fixture.visualPosX(),
          le(expectedPosX + 5),
          "position after resize, upper bound",
        );
        fixture.dispose();
      },
    },
    {
      name: "ShrinkingBelowTheJumpedPositionDoesNotEndTheDisplay",
      execute: () => {
        // Prepare
        let fixture = new Fixture(1396);
        fixture.time = 1500;
        fixture.reparent();

        // Execute
        fixture.element.updateCanvasSize(1333);

        // Verify
        assertThat(fixture.displayEnded, eq(0), "displayEnded count");
        fixture.dispose();
      },
    },
    {
      name: "PauseHoldsThePositionOfTheTimeElapsed",
      execute: () => {
        // Prepare
        let fixture = new Fixture(800);
        fixture.time = 1000;

        // Execute
        fixture.element.pause();

        // Verify
        let expectedPosX = fixture.startPosX - SPEED;
        assertThat(
          fixture.visualPosX(),
          ge(expectedPosX - 1),
          "paused position, lower bound",
        );
        assertThat(
          fixture.visualPosX(),
          le(expectedPosX + 1),
          "paused position, upper bound",
        );
        fixture.dispose();
      },
    },
    {
      name: "DisplayEndsOnceItHasCrossedTheCanvas",
      execute: () => {
        // Prepare
        let fixture = new Fixture(800);
        let crossingTime = ((800 + fixture.startPosX) / SPEED) * 1000;

        // Execute
        fixture.advanceTo(crossingTime - 1);
        let displayEndedBefore = fixture.displayEnded;
        fixture.advanceTo(crossingTime + 1);

        // Verify
        assertThat(displayEndedBefore, eq(0), "displayEnded count before");
        assertThat(fixture.displayEnded, eq(1), "displayEnded count after");
        fixture.dispose();
      },
    },
    {
      name: "PlayingAgainWhileMovingLeavesNoStaleTimeouts",
      execute: () => {
        // Prepare
        let fixture = new Fixture(800);
        fixture.advanceTo(1000);
        fixture.element.play();
        fixture.advanceTo(1500);

        // Execute
        fixture.element.pause();
        fixture.advanceTo(20000);

        // Verify
        assertThat(fixture.displayEnded, eq(0), "displayEnded count");
        fixture.dispose();
      },
    },
    {
      name: "RemovedElementDoesNotEmitLater",
      execute: () => {
        // Prepare
        let fixture = new Fixture(800);
        fixture.advanceTo(1000);

        // Execute
        fixture.element.remove();
        fixture.advanceTo(20000);

        // Verify
        assertThat(fixture.displayEnded, eq(0), "displayEnded count");
        fixture.dispose();
      },
    },
    {
      name: "PlayingAgainWhileMovingDoesNotJumpBack",
      execute: () => {
        // Prepare
        let fixture = new Fixture(800);
        fixture.time = 1000;

        // Execute
        fixture.element.play();
        fixture.time = 1500;
        fixture.element.pause();

        // Verify
        let expectedPosX = fixture.startPosX - SPEED * 1.5;
        assertThat(
          fixture.visualPosX(),
          ge(expectedPosX - 1),
          "paused position, lower bound",
        );
        assertThat(
          fixture.visualPosX(),
          le(expectedPosX + 1),
          "paused position, upper bound",
        );
        fixture.dispose();
      },
    },
  ],
});
