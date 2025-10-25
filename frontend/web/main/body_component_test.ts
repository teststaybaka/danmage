import {
  SIGN_IN,
  SIGN_IN_REQUEST_BODY,
  SignInResponse,
} from "../../../interface/service";
import { normalizeBody } from "../../body_normalizer";
import { BodyComponent } from "./body_component";
import { BodyRl, Page } from "./body_rl";
import { LOCAL_SESSION_STORAGE } from "./local_session_storage";
import { HistoryPageMock, HomePageMock, NicknamePageMock } from "./mocks";
import { eqMessage } from "@selfage/message/test_matcher";
import { setViewport } from "@selfage/puppeteer_test_executor_api";
import { TEST_RUNNER, TestCase } from "@selfage/puppeteer_test_runner";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { assertThat, containStr, eq } from "@selfage/test_matcher";
import { WebServiceClientMock } from "@selfage/web_service_client/client_mock";

normalizeBody();

TEST_RUNNER.run({
  name: "BodyComponentTest",
  cases: [
    new (class implements TestCase {
      public name = "WithoutSignInRenderHomeAndFeedback";
      private cut: BodyComponent;
      public async execute() {
        // Prepare
        await setViewport(1280, 600);
        let windowMock = new (class {
          public origin = "http://random.origin.com";
          public location = {};
          public addEventListener() {}
        })() as any;

        // Execute
        this.cut = new BodyComponent(
          () => new HomePageMock(),
          () => new NicknamePageMock(),
          () => new HistoryPageMock(),
          LOCAL_SESSION_STORAGE,
          new WebServiceClientMock(),
          windowMock,
        );
        document.body.appendChild(this.cut.body);
        this.cut.applyRl();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/body_component_home.png",
          __dirname + "/golden/body_component_home.png",
          __dirname + "/body_component_home_diff.png",
          {
            fullPage: true,
            excludedAreas: [
              {
                x: 36,
                y: 74,
                width: 1226,
                height: 692,
              },
              {
                x: 36,
                y: 1069,
                width: 1226,
                height: 692,
              },
              {
                x: 36,
                y: 1852,
                width: 1226,
                height: 692,
              },
              {
                x: 36,
                y: 2769,
                width: 1226,
                height: 692,
              },
            ],
          },
        );
      }
      public tearDown() {
        this.cut.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "WithSignedInRenderHomeAndNicknameAndHistory";
      private cut: BodyComponent;
      public async execute() {
        // Prepare
        await setViewport(1280, 600);
        LOCAL_SESSION_STORAGE.save("some signed session");
        let windowMock = new (class {
          public origin = "http://random.origin.com";
          public location = {};
          public addEventListener() {}
        })() as any;

        // Execute
        this.cut = new BodyComponent(
          () => new HomePageMock(),
          () => new NicknamePageMock(),
          () => new HistoryPageMock(),
          LOCAL_SESSION_STORAGE,
          new WebServiceClientMock(),
          windowMock,
        );
        let rl: BodyRl;
        this.cut.on("newRl", (newRl) => (rl = newRl));
        document.body.appendChild(this.cut.body);
        this.cut.applyRl();

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/body_component_home_signed_in.png",
          __dirname + "/golden/body_component_home_signed_in.png",
          __dirname + "/body_component_home_signed_in_diff.png",
          {
            fullPage: true,
            excludedAreas: [
              {
                x: 36,
                y: 74,
                width: 1226,
                height: 692,
              },
              {
                x: 36,
                y: 1067,
                width: 1226,
                height: 692,
              },
              {
                x: 36,
                y: 1850,
                width: 1226,
                height: 692,
              },
              {
                x: 36,
                y: 2767,
                width: 1226,
                height: 692,
              },
            ],
          },
        );

        // Execute
        this.cut.nicknameButton.val.click();

        // Verify
        assertThat(rl.page, eq(Page.NICKNAME), "show nickname");
        await asyncAssertScreenshot(
          __dirname + "/body_component_nickname.png",
          __dirname + "/golden/body_component_nickname.png",
          __dirname + "/body_component_nickname_diff.png",
          { fullPage: true },
        );

        // Execute
        this.cut.historyButton.val.click();

        // Verify
        assertThat(rl.page, eq(Page.HISTORY), "show history");
        await asyncAssertScreenshot(
          __dirname + "/body_component_history.png",
          __dirname + "/golden/body_component_history.png",
          __dirname + "/body_component_history_diff.png",
          { fullPage: true },
        );
      }
      public tearDown() {
        this.cut.remove();
        LOCAL_SESSION_STORAGE.clear();
      }
    })(),
    new (class implements TestCase {
      public name =
        "SignInFailedAndSignInSuccessAndSignOutAndHandleUnauthError";
      private cut: BodyComponent;
      public async execute() {
        // Prepare
        await setViewport(1280, 600);
        let serviceClient = new (class extends WebServiceClientMock {
          public async send(request: any): Promise<any> {
            assertThat(request.descriptor, eq(SIGN_IN), "sign in");
            assertThat(
              request.body,
              eqMessage(
                {
                  googleAccessToken: "some token",
                },
                SIGN_IN_REQUEST_BODY,
              ),
              "access token",
            );
            return { signedSession: "some session" } as SignInResponse;
          }
        })();
        let opened = false;
        let windowMock = new (class {
          public origin = "http://some.origin.com";
          public callback: Function;
          public location = {};
          public open(url: string) {
            opened = true;
            assertThat(url, containStr("oauth_callback"), "open url");
          }
          public addEventListener(event: string, callback: Function) {
            this.callback = callback;
          }
        })() as any;

        // Execute
        this.cut = new BodyComponent(
          () => new HomePageMock(),
          () => new NicknamePageMock(),
          () => new HistoryPageMock(),
          LOCAL_SESSION_STORAGE,
          serviceClient,
          windowMock,
        );
        document.body.appendChild(this.cut.body);
        this.cut.applyRl({
          page: Page.NICKNAME,
        });
        this.cut.signInButton.val.click();

        // Verify
        assertThat(opened, eq(true), "url opened");

        // Execute
        await windowMock.callback({
          data: "a token",
          origin: "http://other.com",
        });

        // Verify
        assertThat(LOCAL_SESSION_STORAGE.read(), eq(null), "not sign in");

        // Execute
        await windowMock.callback({
          data: "some token",
          origin: "http://some.origin.com",
        });

        // Verify
        assertThat(
          LOCAL_SESSION_STORAGE.read(),
          eq("some session"),
          "signed in",
        );
        await asyncAssertScreenshot(
          __dirname + "/body_component_signed_in.png",
          __dirname + "/golden/body_component_signed_in.png",
          __dirname + "/body_component_signed_in_diff.png",
          { fullPage: true },
        );

        // Execute
        this.cut.signOutButton.val.click();

        // Verify
        assertThat(LOCAL_SESSION_STORAGE.read(), eq(null), "session cleared");
        await asyncAssertScreenshot(
          __dirname + "/body_component_signed_out.png",
          __dirname + "/golden/body_component_signed_out.png",
          __dirname + "/body_component_signed_out_diff.png",
          { fullPage: true },
        );

        // Prepare by signing in
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
          { fullPage: true },
        );
      }
      public tearDown() {
        this.cut.remove();
      }
    })(),
  ],
});
