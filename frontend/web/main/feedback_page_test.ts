import {
  REPORT_USER_ISSUE,
  REPORT_USER_ISSUE_REQUEST,
} from "../../../interface/service";
import { normalizeBody } from "../../body_normalizer";
import { FeedbackPage } from "./feedback_page";
import { eqMessage } from "@selfage/message/test_matcher";
import { setViewport } from "@selfage/puppeteer_test_executor_api";
import { TEST_RUNNER, TestCase } from "@selfage/puppeteer_test_runner";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { assertThat, eq } from "@selfage/test_matcher";
import { WebServiceClientMock } from "@selfage/web_service_client/client_mock";

TEST_RUNNER.run({
  name: "FeedbackPageTest",
  environment: {
    setUp: () => normalizeBody(),
  },
  cases: [
    new (class implements TestCase {
      public name = "RenderAndSubmit";
      private cut: FeedbackPage;
      public async execute() {
        // Prepare
        await setViewport(1280, 600);
        let sent = false;
        let serviceClient = new (class extends WebServiceClientMock {
          public async send(request: any): Promise<any> {
            sent = true;
            assertThat(
              request.descriptor,
              eq(REPORT_USER_ISSUE),
              `service descriptor`,
            );
            assertThat(
              request.body,
              eqMessage(
                {
                  userIssue: {
                    email: "some email",
                    description: "some description",
                  },
                },
                REPORT_USER_ISSUE_REQUEST,
              ),
              `request`,
            );
            return {} as any;
          }
        })();

        // Execute
        this.cut = new FeedbackPage(serviceClient);
        document.body.appendChild(this.cut.body);

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/feedback_page.png",
          __dirname + "/golden/feedback_page.png",
          __dirname + "/feedback_page_diff.png",
          { fullPage: true },
        );

        // Prepare
        this.cut.textarea.val.value = "some description";
        this.cut.input.val.value = "some email";

        // Execute
        this.cut.submitButton.val.click();

        // Verify
        assertThat(sent, eq(true), "sent");
      }
      public tearDown() {
        this.cut.remove();
      }
    })(),
  ],
});
