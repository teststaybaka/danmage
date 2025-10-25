import { normalizeBody } from "../../body_normalizer";
import { HomePage } from "./home_page";
import { setViewport } from "@selfage/puppeteer_test_executor_api";
import { TEST_RUNNER, TestCase } from "@selfage/puppeteer_test_runner";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";

normalizeBody();

TEST_RUNNER.run({
  name: "HomePageTest",
  cases: [
    new (class implements TestCase {
      public name = "Render";
      private cut: HomePage;
      public async execute() {
        // Prepare
        await setViewport(1300, 1000);

        // Execute
        this.cut = new HomePage();
        document.body.appendChild(this.cut.body);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/home_page.png",
          __dirname + "/golden/home_page.png",
          __dirname + "/home_page_diff.png",
          {
            fullPage: true,
            excludedAreas: [
              {
                x: 36,
                y: 16,
                width: 1226,
                height: 692,
              },
              {
                x: 36,
                y: 1024,
                width: 1226,
                height: 692,
              },
              {
                x: 36,
                y: 1815,
                width: 1226,
                height: 692,
              },
              {
                x: 36,
                y: 2746,
                width: 1226,
                height: 692,
              },
            ],
          },
        );

        // Execute
        await setViewport(900, 1000);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/home_page_narrow.png",
          __dirname + "/golden/home_page_narrow.png",
          __dirname + "/home_page_narrow_diff.png",
          {
            fullPage: true,
            excludedAreas: [
              {
                x: 36,
                y: 16,
                width: 826,
                height: 466,
              },
              {
                x: 36,
                y: 820,
                width: 826,
                height: 466,
              },
              {
                x: 36,
                y: 1413,
                width: 826,
                height: 466,
              },
              {
                x: 36,
                y: 2140,
                width: 826,
                height: 466,
              },
            ],
          },
        );
      }
      public tearDown() {
        this.cut.remove();
      }
    })(),
  ],
});
