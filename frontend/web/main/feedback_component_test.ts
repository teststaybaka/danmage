import {
  REPORT_USER_ISSUE,
  REPORT_USER_ISSUE_REQUEST,
} from "../../../interface/service";
import { normalizeBody } from "../../body_normalizer";
import { FillButtonComponentMock } from "../../mocks";
import { FeedbackComponent } from "./feedback_component";
import { Counter } from "@selfage/counter";
import { E } from "@selfage/element/factory";
import { eqMessage } from "@selfage/message/test_matcher";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { ServiceClientMock } from "@selfage/service_client/mocks";
import { assertThat, eq, eqArray } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER, TestCase } from "@selfage/test_runner";

PUPPETEER_TEST_RUNNER.run({
  name: "FeedbackComponentTest",
  environment: {
    setUp: () => normalizeBody(),
  },
  cases: [
    new (class implements TestCase {
      public name = "RenderAndSubmit";
      private feedbackComponent: FeedbackComponent;
      public async execute() {
        // Prepare
        let counter = new Counter<string>();
        let [body, textarea, input, button] = FeedbackComponent.createView(
          new FillButtonComponentMock(E.text("Submit"))
        );
        let serviceClient = new (class extends ServiceClientMock {
          public fetchUnauthedAny(request: any, serviceDescriptor: any): any {
            counter.increment("fetchUnauthed");
            assertThat(
              serviceDescriptor,
              eq(REPORT_USER_ISSUE),
              `service descriptor`
            );
            assertThat(
              request,
              eqMessage(
                {
                  userIssue: {
                    email: "some email",
                    description: "some description",
                  },
                },
                REPORT_USER_ISSUE_REQUEST
              ),
              `request`
            );
            return {} as any;
          }
        })();

        // Execute
        this.feedbackComponent = new FeedbackComponent(
          body,
          textarea,
          input,
          button,
          serviceClient
        ).init();
        document.body.appendChild(this.feedbackComponent.body);

        // Verify
        await globalThis.setViewport(1280, 600);
        await asyncAssertScreenshot(
          __dirname + "/feedback_component.png",
          __dirname + "/golden/feedback_component.png",
          __dirname + "/feedback_component_diff.png",
          { fullPage: true }
        );

        // Prepare
        textarea.value = "some description";
        input.value = "some email";

        // Execute
        let keepDisableds = await Promise.all(
          button.listeners("click").map((callback) => callback())
        );

        // Verify
        assertThat(counter.get("fetchUnauthed"), eq(1), `fetchUnauthed called`);
        assertThat(textarea.value, eq(""), `textarea cleared`);
        assertThat(input.value, eq(""), `input cleared`);
        assertThat(keepDisableds, eqArray([eq(undefined)]), `enable button`);
      }
      public tearDown() {
        this.feedbackComponent.body.remove();
      }
    })(),
  ],
});
