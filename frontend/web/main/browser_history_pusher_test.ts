import { BrowserHistoryPusher } from "./browser_history_pusher";
import { State } from "./state";
import { Counter } from "@selfage/counter";
import { assertThat, eq } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";

PUPPETEER_TEST_RUNNER.run({
  name: "BrowserHistoryPusherTest",
  cases: [
    {
      name: "Push",
      execute: async () => {
        // Prepare
        let state = new State();
        state.showHome = true;
        let counter = new Counter<string>();
        let historyMock = new (class {
          public pushState(state: any, title: any, url: string) {
            counter.increment("pushState");
            assertThat(
              url,
              eq(
                "http://www.example.com/?somekey=1&q=%7B%22showHome%22%3Atrue%7D"
              ),
              "url"
            );
          }
        })();
        let pusher = new BrowserHistoryPusher(state, "q", {
          location: {
            href: "http://www.example.com/?somekey=1&q=123123",
          },
          history: historyMock,
        } as any);

        // Execute
        pusher.push();

        // Verify
        assertThat(counter.get("pushState"), eq(1), "pushState called");
      },
    },
  ],
});
