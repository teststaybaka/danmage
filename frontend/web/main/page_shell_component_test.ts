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
import { ServiceClient } from "@selfage/service_client";
import { LocalSessionStorage } from "@selfage/service_client/local_session_storage";
import { assertThat, eq, eqArray } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_executor_api";

normalizeBody();

PUPPETEER_TEST_RUNNER.run({
  name: "PageShellComponentTest",
  cases: [
    {
      name: "WithoutSignInRenderHomeAndFeedback",
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
        let serviceClient = new (class extends ServiceClient {
          public constructor() {
            super(undefined, undefined);
          }
        })();
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
          "http://random.origin.com",
          sessionStorage,
          serviceClient,
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
    {
      name: "WithSignedInRenderHomeAndNicknameAndHistoryAndSignout",
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
        sessionStorage.save("some signed session");
        let state = new State();
        state.showHome = true;
        let serviceClient = new (class extends ServiceClient {
          public constructor() {
            super(undefined, undefined);
          }
        })();
        let windowMock = {} as any;
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
          "http://random.origin.com",
          sessionStorage,
          serviceClient,
          windowMock
        ).init();
        document.body.appendChild(pageShellComponent.body);

        // Verify
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(
              __dirname + "/page_shell_component_home_signed_in.png",
              {
                delay: 500,
                fullPage: true,
              }
            ),
            globalThis.readFile(
              __dirname + "/golden/page_shell_component_home_signed_in.png"
            ),
          ]);
          assertThat(rendered, eq(golden), "home screenshot");
        }

        // Execute
        let keepDisables = await Promise.all(
          nicknameButton.listeners("click").map((callback) => callback())
        );

        // Verify
        assertThat(
          keepDisables,
          eqArray([eq(undefined)]),
          "nickname button enabled"
        );
        assertThat(state.showNickname, eq(true), "show nickname");
        assertThat(state.showHome, eq(undefined), "hide home");
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(
              __dirname + "/page_shell_component_nickname.png",
              {
                delay: 500,
                fullPage: true,
              }
            ),
            globalThis.readFile(
              __dirname + "/golden/page_shell_component_nickname.png"
            ),
          ]);
          assertThat(rendered, eq(golden), "nickname screenshot");
        }

        // Execute
        let keepDisables2 = await Promise.all(
          historyButton.listeners("click").map((callback) => callback())
        );

        // Verify
        assertThat(
          keepDisables2,
          eqArray([eq(undefined)]),
          "history button enabled"
        );
        assertThat(state.showHistory, eq(true), "show history");
        assertThat(state.showNickname, eq(undefined), "hide nickname");
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(
              __dirname + "/page_shell_component_history.png",
              {
                delay: 500,
                fullPage: true,
              }
            ),
            globalThis.readFile(
              __dirname + "/golden/page_shell_component_history.png"
            ),
          ]);
          assertThat(rendered, eq(golden), "history screenshot");
        }

        // Execute
        let keepDisables3 = await Promise.all(
          signOutButton.listeners("click").map((callback) => callback())
        );

        // Verify
        assertThat(
          keepDisables3,
          eqArray([eq(undefined)]),
          "signOut button enabled"
        );
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(
              __dirname + "/page_shell_component_history_signed_out.png",
              {
                delay: 500,
                fullPage: true,
              }
            ),
            globalThis.readFile(
              __dirname + "/golden/page_shell_component_history_signed_out.png"
            ),
          ]);
          assertThat(rendered, eq(golden), "history signed-out screenshot");
        }

        // Cleanup
        await Promise.all([
          globalThis.deleteFile(
            __dirname + "/page_shell_component_home_signed_in.png"
          ),
          globalThis.deleteFile(
            __dirname + "/page_shell_component_nickname.png"
          ),
          globalThis.deleteFile(
            __dirname + "/page_shell_component_history.png"
          ),
          globalThis.deleteFile(
            __dirname + "/page_shell_component_history_signed_out.png"
          ),
        ]);
        pageShellComponent.body.remove();
      },
    },
  ],
});
