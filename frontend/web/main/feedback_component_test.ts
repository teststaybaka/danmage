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
import { ServiceClient } from "@selfage/service_client";
import { UnauthedServiceDescriptor } from "@selfage/service_descriptor";
import { assertThat, eq, eqArray } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_executor_api";

normalizeBody();

PUPPETEER_TEST_RUNNER.run({
  name: "FeedbackComponentTest",
  cases: [
    {
      name: "RenderAndSubmit",
      execute: async () => {
        // Prepare
        let counter = new Counter<string>();
        let [body, textarea, input] = FeedbackComponent.createView();
        let button = new FillButtonComponentMock(E.text("Submit"));
        let serviceClient = new (class extends ServiceClient {
          public constructor() {
            super(undefined, undefined);
          }
          public async fetchUnauthed<ServiceRequest, ServiceResponse>(
            request: ServiceRequest,
            serviceDescriptor: UnauthedServiceDescriptor<
              ServiceRequest,
              ServiceResponse
            >
          ): Promise<ServiceResponse> {
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
        let feedbackComponent = new FeedbackComponent(
          body,
          textarea,
          input,
          button,
          serviceClient
        ).init();
        document.body.appendChild(feedbackComponent.body);

        // Verify
        await globalThis.setViewport(1280, 600);
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(__dirname + "/feedback_component.png", {
              delay: 500,
              fullPage: true,
            }),
            globalThis.readFile(__dirname + "/golden/feedback_component.png"),
          ]);
          assertThat(rendered, eq(golden), "screenshot");
        }

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

        // Cleanup
        await globalThis.deleteFile(__dirname + "/feedback_component.png");
        feedbackComponent.body.remove();
      },
    },
  ],
});
