import { normalizeBody } from "../../body_normalizer";
import { HomeView } from "./home_view";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { PUPPETEER_TEST_RUNNER, TestCase } from "@selfage/test_runner";

PUPPETEER_TEST_RUNNER.run({
  name: "HomeViewTest",
  environment: {
    setUp: () => normalizeBody(),
  },
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private homeView: HTMLDivElement;
      public async execute() {
        // Execute
        this.homeView = HomeView.create();
        document.body.appendChild(this.homeView);

        // Verify
        await globalThis.setViewport(1300, 1000);
        await asyncAssertScreenshot(
          __dirname + "/home_view.png",
          __dirname + "/golden/home_view.png",
          __dirname + "/home_view_diff.png",
          { fullPage: true }
        );
        await globalThis.setViewport(900, 1000);
        await asyncAssertScreenshot(
          __dirname + "/home_view_narrow.png",
          __dirname + "/golden/home_view_narrow.png",
          __dirname + "/home_view_narrow_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.homeView.remove();
      }
    })(),
  ],
});
