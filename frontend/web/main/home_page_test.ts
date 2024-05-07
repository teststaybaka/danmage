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
                x: 45,
                y: 21,
                width: 1207,
                height: 681,
              },
              {
                x: 45,
                y: 960,
                width: 1207,
                height: 681,
              },
              {
                x: 45,
                y: 1757,
                width: 1207,
                height: 681,
              },
              {
                x: 45,
                y: 2703,
                width: 1207,
                height: 681,
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
                x: 47,
                y: 22,
                width: 805,
                height: 453,
              },
              {
                x: 47,
                y: 761,
                width: 805,
                height: 453,
              },
              {
                x: 47,
                y: 1354,
                width: 805,
                height: 453,
              },
              {
                x: 47,
                y: 2098,
                width: 805,
                height: 453,
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
