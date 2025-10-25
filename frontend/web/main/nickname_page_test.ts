import {
  GetUserResponse,
  UPDATE_NICKNAME_REQUEST_BODY,
  UpdateNicknameResponse,
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
import { assertThat } from "@selfage/test_matcher";
import { WebServiceClientMock } from "@selfage/web_service_client/client_mock";

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
        let serviceClientMock = new WebServiceClientMock();
        serviceClientMock.response = {
          user: {},
        } as GetUserResponse;

        // Execute
        this.cut = new NicknamePage(serviceClientMock);
        document.body.appendChild(this.cut.body);
        await new Promise<void>((resolve) => this.cut.once("loaded", resolve));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/nickname_page.png",
          __dirname + "/golden/nickname_page.png",
          __dirname + "/nickname_page_diff.png",
        );

        // Prepare
        serviceClientMock.response = {} as UpdateNicknameResponse;
        this.cut.input.val.value = "new name";

        // Execute
        this.cut.setButton.val.click();

        // Verified
        assertThat(
          serviceClientMock.request.body,
          eqMessage(
            {
              newName: "new name",
            },
            UPDATE_NICKNAME_REQUEST_BODY,
          ),
          "update request",
        );
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
        let serviceClientMock = new WebServiceClientMock();
        serviceClientMock.response = {
          user: { nickname: "some name" },
        } as GetUserResponse;

        // Execute
        this.cut = new NicknamePage(serviceClientMock);
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
        let serviceClientMock = new WebServiceClientMock();
        serviceClientMock.response = {
          user: {},
        } as GetUserResponse;
        this.cut = new NicknamePage(serviceClientMock);
        document.body.append(this.cut.body);
        await new Promise<void>((resolve) => this.cut.once("loaded", resolve));
        serviceClientMock.response = {} as UpdateNicknameResponse;

        // Execute
        this.cut.input.val.value = "new name";
        this.cut.input.val.focus();
        await keyboardDown("Enter");

        // Verify
        assertThat(
          serviceClientMock.request.body,
          eqMessage({ newName: "new name" }, UPDATE_NICKNAME_REQUEST_BODY),
          `click called`,
        );
      }
      public tearDown() {
        this.cut.remove();
      }
    })(),
  ],
});
