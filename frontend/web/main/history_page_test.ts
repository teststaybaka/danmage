import {
  GET_CHAT_HISTORY,
  GetChatHistoryRequest,
  GetChatHistoryResponse,
} from "../../../interface/service";
import { TextButton } from "../../button";
import { HistoryPage } from "./history_page";
import { Counter } from "@selfage/counter";
import { Button } from "@selfage/element/button";
import { E } from "@selfage/element/factory";
import { ServiceClient } from "@selfage/service_client";
import {
  AuthedServiceDescriptor,
  WithSession,
} from "@selfage/service_descriptor";
import { assertThat, eq } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_executor_api";

PUPPETEER_TEST_RUNNER.run({
  name: "HistoryPageTest",
  cases: [
    {
      name: "Render",
      execute: async () => {
        // Prepare
        let counter = new Counter<string>();
        let button = new (class extends TextButton {
          constructor() {
            super(
              new (class extends Button {
                constructor() {
                  super(undefined);
                }
                public hide() {
                  counter.increment("hide");
                }
              })()
            );
          }
        })();
        new HistoryPage(
          undefined,
          E.div(""),
          button,
          new (class extends ServiceClient {
            constructor() {
              super(undefined, undefined);
            }
            public async fetchAuthed<
              ServiceRequest extends WithSession,
              ServiceResponse
            >(
              request: ServiceRequest,
              serviceDescriptor: AuthedServiceDescriptor<
                ServiceRequest,
                ServiceResponse
              >
            ): Promise<ServiceResponse> {
              counter.increment("fetchAuthed");
              assertThat(
                serviceDescriptor,
                eq(GET_CHAT_HISTORY),
                "service descriptor"
              );
              switch (counter.get("fetchAuthed")) {
                case 1:
                  assertThat(
                    (request as GetChatHistoryRequest).cursor,
                    eq(undefined),
                    `no cursor`
                  );
                  return ({
                    chatEntries: [
                      {
                        timestamp: 80000,
                        created: 100000,
                      },
                    ],
                    cursor: "new cursor",
                  } as GetChatHistoryResponse) as any;
                case 2:
                  assertThat(
                    (request as GetChatHistoryRequest).cursor,
                    eq(`new cursor`),
                    `no cursor`
                  );
                  return ({
                    chatEntries: [
                      {
                        timestamp: 80000,
                        created: 100000,
                      },
                    ],
                  } as GetChatHistoryResponse) as any;
                default:
                  return {} as any;
              }
            }
          })()
        ).init();

        // Execute
        await button.click();

        // Verify
        assertThat(counter.get("fetchAuthed"), eq(1), `fetchAuthed called`);

        // Execute
        await button.click();

        // Verify
        assertThat(
          counter.get("fetchAuthed"),
          eq(2),
          `second fetchAuthed called`
        );
        assertThat(counter.get("hide"), eq(1), `hide button called`);
      },
    },
  ],
});
