import { HomeView } from "./home_view";
import { assertThat, eq } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_executor_api";

document.documentElement.style.fontSize = "62.5%";
document.body.style.margin = "0";
document.body.style.fontSize = "0";

PUPPETEER_TEST_RUNNER.run({
  name: "HomeViewTest",
  cases: [
    {
      name: "Render",
      execute: async () => {
        // Execute
        let homeView = HomeView.create();
        document.body.appendChild(homeView);

        // Verify
        {
          await globalThis.setViewport(1300, 1000);
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(__dirname + "/home_view.png", {
              delay: 500,
              fullPage: true,
            }),
            globalThis.readFile(__dirname + "/golden/home_view.png"),
          ]);
          assertThat(rendered, eq(golden), "screenshot");
        }

        {
          await globalThis.setViewport(900, 1000);
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(__dirname + "/home_view_narrow.png", {
              delay: 500,
              fullPage: true,
            }),
            globalThis.readFile(__dirname + "/golden/home_view_narrow.png"),
          ]);
          assertThat(rendered, eq(golden), "narrow screenshot");
        }

        // Cleanup
        await Promise.all([
          globalThis.deleteFile(__dirname + "/home_view.png"),
          globalThis.deleteFile(__dirname + "/home_view_narrow.png"),
        ]);
        homeView.remove();
      },
    },
  ],
});
