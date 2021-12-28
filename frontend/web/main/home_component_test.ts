import { normalizeBody } from "../../body_normalizer";
import { HomeComponent } from "./home_component";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { PUPPETEER_TEST_RUNNER, TestCase } from "@selfage/test_runner";

PUPPETEER_TEST_RUNNER.run({
  name: "HomeComponentTest",
  environment: {
    setUp: () => normalizeBody(),
  },
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private homeComponent: HomeComponent;
      public async execute() {
        // Execute
        this.homeComponent = HomeComponent.create();
        document.body.appendChild(this.homeComponent.body);

        // Verify
        await globalThis.setViewport(1300, 1000);
        await asyncAssertScreenshot(
          __dirname + "/home_component.png",
          __dirname + "/golden/home_component.png",
          __dirname + "/home_component_diff.png",
          { fullPage: true }
        );
        await globalThis.setViewport(900, 1000);
        await asyncAssertScreenshot(
          __dirname + "/home_component_narrow.png",
          __dirname + "/golden/home_component_narrow.png",
          __dirname + "/home_component_narrow_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.homeComponent.remove();
      }
    })(),
  ],
});
