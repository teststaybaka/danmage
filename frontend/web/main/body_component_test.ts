import { SIGN_IN } from "../../../interface/service";
import { normalizeBody } from "../../body_normalizer";
import { TextButtonComponentMock } from "../../mocks";
import { BodyComponent } from "./body_component";
import { HomeView } from "./home_view";
import {
  BrowserHistoryPusherMock,
  FeedbackComponentMock,
  HistoryComponentMock,
  NicknameComponentMock,
} from "./mocks";
import { State } from "./state";
import { Counter } from "@selfage/counter";
import { E } from "@selfage/element/factory";
import { LocalSessionStorage } from "@selfage/service_client/local_session_storage";
import { ServiceClientMock } from "@selfage/service_client/mocks";
import { assertThat, eq, eqArray } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_executor_api";

normalizeBody();

PUPPETEER_TEST_RUNNER.run({
  name: "BodyComponentTest",
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
          public push() {
            counter.increment("push");
          }
        })();
        let sessionStorage = new LocalSessionStorage();
        let state = new State();
        state.showHome = true;
        let serviceClient = new ServiceClientMock();
        let windowMock = new (class {
          public location = {};
          public addEventListener() {}
        })() as any;
        await globalThis.setViewport(1280, 600);

        // Execute
        let bodyComponent = new BodyComponent(
          ...BodyComponent.createView(
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
        document.body.appendChild(bodyComponent.body);

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
        let termsKeepDisables = await Promise.all(
          termsButton.listeners("click").map((callback) => callback())
        );

        // Verify
        assertThat(
          termsKeepDisables,
          eqArray([eq(undefined)]),
          "terms button enabled"
        );
        assertThat(windowMock.location.href, eq("/terms"), "goto /terms");

        // Execute
        let privacyKeepDisables = await Promise.all(
          privacyButton.listeners("click").map((callback) => callback())
        );

        // Verify
        assertThat(
          privacyKeepDisables,
          eqArray([eq(undefined)]),
          "privacy button enabled"
        );
        assertThat(windowMock.location.href, eq("/privacy"), "goto /privacy");

        // Execute
        let feedbackKeepDisables = await Promise.all(
          feedbackButton.listeners("click").map((callback) => callback())
        );

        // Verify
        assertThat(
          feedbackKeepDisables,
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
        bodyComponent.body.remove();
      },
    },
    {
      name: "WithSignedInRenderHomeAndNicknameAndHistory",
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
        let nicknameComponent = new (class extends NicknameComponentMock {
          public show() {
            return Promise.resolve();
          }
        })();
        let historyComponent = new (class extends HistoryComponentMock {
          public show() {
            return Promise.resolve();
          }
        })();
        let feedbackComponent = new FeedbackComponentMock();
        let browserHistoryPusher = new (class extends BrowserHistoryPusherMock {
          public push() {
            counter.increment("push");
          }
        })();
        let sessionStorage = new LocalSessionStorage();
        sessionStorage.save("some signed session");
        let state = new State();
        state.showHome = true;
        let serviceClient = new ServiceClientMock();
        let windowMock = new (class {
          public location = {};
          public addEventListener() {}
        })() as any;
        await globalThis.setViewport(1280, 600);

        // Execute
        let bodyComponent = new BodyComponent(
          ...BodyComponent.createView(
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
        document.body.appendChild(bodyComponent.body);

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
        let nicknameKeepDisables = await Promise.all(
          nicknameButton.listeners("click").map((callback) => callback())
        );

        // Verify
        assertThat(
          nicknameKeepDisables,
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
        let historyKeepDisables = await Promise.all(
          historyButton.listeners("click").map((callback) => callback())
        );

        // Verify
        assertThat(
          historyKeepDisables,
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
        ]);
        bodyComponent.body.remove();
      },
    },
    {
      name: "SignInFailedAndSignInSuccessAndSignOutAndHandleUnauthError",
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
        let browserHistoryPusher = new BrowserHistoryPusherMock();
        let sessionStorage = new LocalSessionStorage();
        let state = new State();
        state.showFeedback = true;
        let serviceClient = new (class extends ServiceClientMock {
          public fetchUnauthedAny(request: any, serviceDescriptor: any): any {
            counter.increment("fetchUnauthed");
            assertThat(serviceDescriptor, eq(SIGN_IN), "sign in");
            assertThat(
              request.googleAccessToken,
              eq("some token"),
              "access token"
            );
            return { signedSession: "some session" };
          }
        })();
        let windowMock = new (class {
          public callback: Function;
          public location = {};
          public open(url: string) {
            counter.increment("open");
            assertThat(url, eq("/oauth_start"), "open url");
          }
          public addEventListener(event: string, callback: Function) {
            this.callback = callback;
          }
        })() as any;
        await globalThis.setViewport(1280, 600);

        // Execute
        let views = BodyComponent.createView(
          nicknameButton,
          historyButton,
          signOutButton,
          termsButton,
          privacyButton,
          feedbackButton
        );
        let signInButton = views[2];
        let bodyComponent = new BodyComponent(
          ...views,
          () => HomeView.create(),
          () => nicknameComponent,
          () => historyComponent,
          () => feedbackComponent,
          state,
          browserHistoryPusher,
          "http://some.origin.com",
          sessionStorage,
          serviceClient,
          windowMock
        ).init();
        document.body.appendChild(bodyComponent.body);
        signInButton.click();

        // Verify
        assertThat(counter.get("open"), eq(1), "open called");

        // Execute
        await windowMock.callback({
          data: "a token",
          origin: "http://other.com",
        });

        // Verify
        assertThat(counter.get("fetchUnauthed"), eq(0), "not sign in");

        // Execute
        await windowMock.callback({
          data: "some token",
          origin: "http://some.origin.com",
        });

        // Verify
        assertThat(counter.get("fetchUnauthed"), eq(1), "sign in called");
        assertThat(sessionStorage.read(), eq("some session"), "session stored");
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(
              __dirname + "/page_shell_component_signed_in.png",
              {
                delay: 500,
                fullPage: true,
              }
            ),
            globalThis.readFile(
              __dirname + "/golden/page_shell_component_signed_in.png"
            ),
          ]);
          assertThat(rendered, eq(golden), "successfuly signed in screenshot");
        }

        // Execute
        await Promise.all(
          signOutButton.listeners("click").map((callback) => callback())
        );

        // Verify
        assertThat(sessionStorage.read(), eq(null), "session cleared");
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(
              __dirname + "/page_shell_component_signed_out.png",
              {
                delay: 500,
                fullPage: true,
              }
            ),
            globalThis.readFile(
              __dirname + "/golden/page_shell_component_signed_out.png"
            ),
          ]);
          assertThat(rendered, eq(golden), "successfuly signed out screenshot");
        }

        // Prepare
        await windowMock.callback({
          data: "some token",
          origin: "http://some.origin.com",
        });

        // Execute
        serviceClient.emit("unauthenticated");

        // Verify
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(
              __dirname + "/page_shell_component_handle_unauth.png",
              {
                delay: 500,
                fullPage: true,
              }
            ),
            globalThis.readFile(
              __dirname + "/golden/page_shell_component_handle_unauth.png"
            ),
          ]);
          assertThat(rendered, eq(golden), "handle unauth error screenshot");
        }

        // Cleanup
        await Promise.all([
          globalThis.deleteFile(
            __dirname + "/page_shell_component_signed_in.png"
          ),
          globalThis.deleteFile(
            __dirname + "/page_shell_component_signed_out.png"
          ),
          globalThis.deleteFile(
            __dirname + "/page_shell_component_handle_unauth.png"
          ),
        ]);
        bodyComponent.body.remove();
      },
    },
  ],
});
