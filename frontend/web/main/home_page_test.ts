import { HomePage } from "./home_page";
import { assertThat, eq } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_executor_api";

document.documentElement.style.fontSize = "62.5%";
document.body.style.margin = "0";
document.body.style.fontSize = "0";

PUPPETEER_TEST_RUNNER.run({
  name: "HomeTest",
  cases: [
    {
      name: "Render",
      execute: async () => {
        // Execute
        document.body.appendChild(HomePage.create());

        // Verify
        {
          await globalThis.setViewport(1300, 1000);
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(__dirname + "/home_page.png", {
              delay: 500,
              fullPage: true,
            }),
            globalThis.readFile(__dirname + "/golden/home_page.png"),
          ]);
          assertThat(rendered, eq(golden), "screenshot");
        }

        {
          await globalThis.setViewport(900, 1000);
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(__dirname + "/home_page_narrow.png", {
              delay: 500,
              fullPage: true,
            }),
            globalThis.readFile(__dirname + "/golden/home_page_narrow.png"),
          ]);
          assertThat(rendered, eq(golden), "narrow screenshot");
        }

        // Cleanup
        await Promise.all([
          globalThis.deleteFile(__dirname + "/home_page.png"),
          globalThis.deleteFile(__dirname + "/home_page_narrow.png"),
        ]);
      },
    },
  ],
});
