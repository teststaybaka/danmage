import { SIGN_IN } from "../../../interface/service";
import { normalizeBody } from "../../body_normalizer";
import { TextButtonComponentMock } from "../../mocks";
import { BodyComponent } from "./body_component";
import {
  FeedbackComponentMock,
  HistoryComponentMock,
  HomeComponentMock,
  NicknameComponentMock,
} from "./mocks";
import { State } from "./state";
import { Counter } from "@selfage/counter";
import { E } from "@selfage/element/factory";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { LocalSessionStorage } from "@selfage/service_client/local_session_storage";
import { ServiceClientMock } from "@selfage/service_client/mocks";
import { BrowserHistoryPusher } from "@selfage/stateful_navigator/browser_history_pusher";
import { assertThat, eq, eqArray } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER, TestCase } from "@selfage/test_runner";

export class BrowserHistoryPusherMock extends BrowserHistoryPusher {
  public constructor() {
    super(undefined, undefined, undefined);
  }
}

PUPPETEER_TEST_RUNNER.run({
  name: "BodyComponentTest",
  environment: {
    setUp: () => normalizeBody(),
  },
  cases: [
    new (class implements TestCase {
      public name = "WithoutSignInRenderHomeAndFeedback";
      private bodyComponent: BodyComponent;
      public async execute() {
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
        let homeComponent = new HomeComponentMock();
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
        let serviceClient = new ServiceClientMock();
        let windowMock = new (class {
          public location = {};
          public addEventListener() {}
        })() as any;
        await globalThis.setViewport(1280, 600);

        // Execute
        this.bodyComponent = new BodyComponent(
          ...BodyComponent.createView(
            nicknameButton,
            historyButton,
            signOutButton,
            termsButton,
            privacyButton,
            feedbackButton
          ),
          () => homeComponent,
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
        document.body.appendChild(this.bodyComponent.body);
        state.showHome = true;

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/body_component_home.png",
          __dirname + "/golden/body_component_home.png",
          __dirname + "/body_component_home_diff.png",
          { fullPage: true }
        );

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
        await asyncAssertScreenshot(
          __dirname + "/body_component_feedback.png",
          __dirname + "/golden/body_component_feedback.png",
          __dirname + "/body_component_feedback_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.bodyComponent.body.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "WithSignedInRenderHomeAndNicknameAndHistory";
      private bodyComponent: BodyComponent;
      public async execute() {
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
        let homeComponent = new HomeComponentMock();
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
        let serviceClient = new ServiceClientMock();
        let windowMock = new (class {
          public location = {};
          public addEventListener() {}
        })() as any;
        await globalThis.setViewport(1280, 600);

        // Execute
        this.bodyComponent = new BodyComponent(
          ...BodyComponent.createView(
            nicknameButton,
            historyButton,
            signOutButton,
            termsButton,
            privacyButton,
            feedbackButton
          ),
          () => homeComponent,
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
        document.body.appendChild(this.bodyComponent.body);
        state.showHome = true;

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/body_component_home_signed_in.png",
          __dirname + "/golden/body_component_home_signed_in.png",
          __dirname + "/body_component_home_signed_in_diff.png",
          { fullPage: true }
        );

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
        await asyncAssertScreenshot(
          __dirname + "/body_component_nickname.png",
          __dirname + "/golden/body_component_nickname.png",
          __dirname + "/body_component_nickname_diff.png",
          { fullPage: true }
        );

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
        await asyncAssertScreenshot(
          __dirname + "/body_component_history.png",
          __dirname + "/golden/body_component_history.png",
          __dirname + "/body_component_history_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.bodyComponent.body.remove();
      }
    })(),
    new (class implements TestCase {
      public name =
        "SignInFailedAndSignInSuccessAndSignOutAndHandleUnauthError";
      private bodyComponent: BodyComponent;
      public async execute() {
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
        let homeComponent = new HomeComponentMock();
        let nicknameComponent = new NicknameComponentMock();
        let historyComponent = new HistoryComponentMock();
        let feedbackComponent = new FeedbackComponentMock();
        let browserHistoryPusher = new BrowserHistoryPusherMock();
        let sessionStorage = new LocalSessionStorage();
        let state = new State();
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
        this.bodyComponent = new BodyComponent(
          ...views,
          () => homeComponent,
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
        document.body.appendChild(this.bodyComponent.body);
        state.showFeedback = true;
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
        await asyncAssertScreenshot(
          __dirname + "/body_component_signed_in.png",
          __dirname + "/golden/body_component_signed_in.png",
          __dirname + "/body_component_signed_in_diff.png",
          { fullPage: true }
        );

        // Execute
        await Promise.all(
          signOutButton.listeners("click").map((callback) => callback())
        );

        // Verify
        assertThat(sessionStorage.read(), eq(null), "session cleared");
        await asyncAssertScreenshot(
          __dirname + "/body_component_signed_out.png",
          __dirname + "/golden/body_component_signed_out.png",
          __dirname + "/body_component_signed_out_diff.png",
          { fullPage: true }
        );

        // Prepare
        await windowMock.callback({
          data: "some token",
          origin: "http://some.origin.com",
        });

        // Execute
        serviceClient.emit("unauthenticated");

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/body_component_handle_unauth.png",
          __dirname + "/golden/body_component_handle_unauth.png",
          __dirname + "/body_component_handle_unauth_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.bodyComponent.body.remove();
      }
    })(),
  ],
});
