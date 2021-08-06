import { normalizeBody } from "../../body_normalizer";
import { TextButtonComponentMock } from "../../mocks";
import { HomeView } from "./home_view";
import {
  BrowserHistoryPusherMock,
  FeedbackComponentMock,
  HistoryComponentMock,
  NicknameComponentMock,
} from "./mocks";
import { PageShellComponent } from "./page_shell_component";
import { State } from "./state";
import { Counter } from "@selfage/counter";
import { E } from "@selfage/element/factory";
import { LocalSessionStorage } from "@selfage/service_client/local_session_storage";
import { assertThat, eq, eqArray } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_executor_api";

normalizeBody();

PUPPETEER_TEST_RUNNER.run({
  name: "PageShellComponentTest",
  cases: [
    {
      name: "RenderHomeAndTermsAndPrivacyAndFeedback",
      execute: async () => {
        // Prepare
        let counter = new Counter<string>();
        let nicknameButton = new TextButtonComponentMock(E.text("Nickname"));
        let historyButton = new TextButtonComponentMock(E.text("History"));
        let signOutButton = new TextButtonComponentMock(E.text("Sign out"));
        let termsButton = new TextButtonComponentMock(
          E.text("Terms and Conditions")
        );
        let privacyButton = new TextButtonComponentMock(
          E.text("Privacy policy")
        );
        let feedbackButton = new TextButtonComponentMock(E.text("Feedback"));
        let nicknameComponent = new NicknameComponentMock();
        let historyComponent = new HistoryComponentMock();
        let feedbackComponent = new FeedbackComponentMock();
        let browserHistoryPusher = new (class extends BrowserHistoryPusherMock {
          public constructor() {
            super();
          }
          public push() {
            counter.increment("push");
          }
        })();
        let sessionStorage = new LocalSessionStorage();
        let state = new State();
        state.showHome = true;
        let windowMock = { location: {} } as any;
        await globalThis.setViewport(1280, 600);

        // Execute
        let pageShellComponent = new PageShellComponent(
          ...PageShellComponent.createView(
            nicknameButton,
            historyButton,
            signOutButton,
            termsButton,
            privacyButton,
            feedbackButton
          ),
          () => HomeView.create(),
          () => nicknameComponent,
          () => historyComponent,
          () => feedbackComponent,
          state,
          browserHistoryPusher,
          sessionStorage,
          windowMock
        ).init();
        document.body.appendChild(pageShellComponent.body);

        // Verify
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(
              __dirname + "/page_shell_component_home.png",
              {
                delay: 500,
                fullPage: true,
              }
            ),
            globalThis.readFile(
              __dirname + "/golden/page_shell_component_home.png"
            ),
          ]);
          assertThat(rendered, eq(golden), "home screenshot");
        }

        // Execute
        let keepDisables = await Promise.all(
          termsButton.listeners("click").map((callback) => callback())
        );

        // Verify
        assertThat(
          keepDisables,
          eqArray([eq(undefined)]),
          "terms button enabled"
        );
        assertThat(windowMock.location.href, eq("/terms"), "goto /terms");

        // Execute
        let keepDisables2 = await Promise.all(
          privacyButton.listeners("click").map((callback) => callback())
        );

        // Verify
        assertThat(
          keepDisables2,
          eqArray([eq(undefined)]),
          "privacy button enabled"
        );
        assertThat(windowMock.location.href, eq("/privacy"), "goto /privacy");

        // Execute
        let keepDisables3 = await Promise.all(
          feedbackButton.listeners("click").map((callback) => callback())
        );

        // Verify
        assertThat(
          keepDisables3,
          eqArray([eq(undefined)]),
          "feedback button enabled"
        );
        assertThat(state.showFeedback, eq(true), "show feedback");
        assertThat(state.showHome, eq(undefined), "hide home");
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(
              __dirname + "/page_shell_component_feedback.png",
              {
                delay: 500,
                fullPage: true,
              }
            ),
            globalThis.readFile(
              __dirname + "/golden/page_shell_component_feedback.png"
            ),
          ]);
          assertThat(rendered, eq(golden), "feedback screenshot");
        }

        // Cleanup
        await Promise.all([
          globalThis.deleteFile(__dirname + "/page_shell_component_home.png"),
          globalThis.deleteFile(
            __dirname + "/page_shell_component_feedback.png"
          ),
        ]);
        pageShellComponent.body.remove();
      },
    },
  ],
});
