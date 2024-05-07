import {
  GET_USER,
  GetUserResponse,
  UPDATE_NICKNAME,
  UPDATE_NICKNAME_REQUEST,
} from "../../../interface/service";
import { normalizeBody } from "../../body_normalizer";
import { NicknamePage } from "./nickname_page";
import { eqMessage } from "@selfage/message/test_matcher";
import {
  keyboardDown,
  setViewport,
} from "@selfage/puppeteer_test_executor_api";
import { TEST_RUNNER, TestCase } from "@selfage/puppeteer_test_runner";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { assertThat, eq } from "@selfage/test_matcher";
import { WebServiceClient } from "@selfage/web_service_client";

normalizeBody();

TEST_RUNNER.run({
  name: "NicknamePageTest",
  cases: [
    new (class implements TestCase {
      public name = "RenderWithoutNameThenClickToUpdate";
      private cut: NicknamePage;
      public async execute() {
        // Prepare
        await setViewport(1600, 400);
        let serviceClient = new (class extends WebServiceClient {
          public constructor() {
            super(undefined, undefined);
          }
          public async send(request: any): Promise<any> {
            if (request.descriptor === GET_USER) {
              return {
                user: {},
              } as GetUserResponse as any;
            } else if (request.descriptor === UPDATE_NICKNAME) {
              assertThat(
                request.body,
                eqMessage(
                  {
                    newName: "new name",
                  },
                  UPDATE_NICKNAME_REQUEST,
                ),
                `new name`,
              );
              return {} as any;
            }
          }
        })();

        // Execute
        this.cut = new NicknamePage(serviceClient);
        document.body.appendChild(this.cut.body);
        await new Promise<void>((resolve) => this.cut.once("loaded", resolve));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/nickname_page.png",
          __dirname + "/golden/nickname_page.png",
          __dirname + "/nickname_page_diff.png",
        );

        // Prepare
        this.cut.input.val.value = "new name";

        // Execute
        this.cut.setButton.val.click();

        // Verified by service client mock.
        await asyncAssertScreenshot(
          __dirname + "/nickname_page_updated.png",
          __dirname + "/golden/nickname_page_updated.png",
          __dirname + "/nickname_page_updated_diff.png",
        );
      }
      public tearDown() {
        this.cut.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "RenderWithName";
      private cut: NicknamePage;
      public async execute() {
        // Prepare
        await setViewport(1600, 400);
        let serviceClient = new (class extends WebServiceClient {
          public constructor() {
            super(undefined, undefined);
          }
          public async send(request: any): Promise<any> {
            assertThat(request.descriptor, eq(GET_USER), "service descriptor");
            return {
              user: { nickname: "some name" },
            } as GetUserResponse as any;
          }
        })();

        // Execute
        this.cut = new NicknamePage(serviceClient);
        await new Promise<void>((resolve) => this.cut.once("loaded", resolve));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/nickname_page_with_name.png",
          __dirname + "/golden/nickname_page_with_name.png",
          __dirname + "/nickname_page_with_name_diff.png",
        );
      }
      public tearDown() {
        this.cut.remove();
      }
    })(),
    new (class implements TestCase {
      public name = "EnterToTriggerClick";
      private cut: NicknamePage;
      public async execute() {
        // Prepare
        await setViewport(1600, 400);
        let updateRequested = false;
        let serviceClient = new (class extends WebServiceClient {
          public constructor() {
            super(undefined, undefined);
          }
          public async send(request: any): Promise<any> {
            if (request.descriptor === GET_USER) {
              return {
                user: {},
              } as GetUserResponse as any;
            } else {
              updateRequested = true;
              assertThat(
                request.descriptor,
                eq(UPDATE_NICKNAME),
                "update service",
              );
            }
          }
        })();

        // Execute
        this.cut = new NicknamePage(serviceClient);
        document.body.append(this.cut.body);
        await new Promise<void>((resolve) => this.cut.once("loaded", resolve));
        this.cut.input.val.focus();
        await keyboardDown("Enter");

        // Verify
        assertThat(updateRequested, eq(true), `click called`);
      }
      public tearDown() {
        this.cut.remove();
      }
    })(),
  ],
});
