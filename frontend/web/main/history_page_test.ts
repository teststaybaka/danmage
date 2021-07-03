import { HostApp } from "../../../interface/chat_entry";
import {
  GET_CHAT_HISTORY,
  GetChatHistoryRequest,
  GetChatHistoryResponse,
} from "../../../interface/service";
import { TextButton } from "../../button";
import { HistoryPage } from "./history_page";
import { Counter } from "@selfage/counter";
import { Button } from "@selfage/element/button";
import { ServiceClient } from "@selfage/service_client";
import {
  AuthedServiceDescriptor,
  WithSession,
} from "@selfage/service_descriptor";
import { assertThat, eq } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_executor_api";

document.documentElement.style.fontSize = "62.5%";
document.body.style.margin = "0";
document.body.style.fontSize = "0";

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
          document.body,
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
                    `first cursor`
                  );
                  return ({
                    chatEntries: [
                      {
                        hostApp: HostApp.YouTube,
                        hostContentId: "piavxf",
                        timestamp: 80000,
                        content: "Chashu!",
                        created: 100000,
                      },
                    ],
                    cursor: "new cursor",
                  } as GetChatHistoryResponse) as any;
                case 2:
                  assertThat(
                    (request as GetChatHistoryRequest).cursor,
                    eq(`new cursor`),
                    `second cursor`
                  );
                  return ({
                    chatEntries: [
                      {
                        hostApp: HostApp.Crunchyroll,
                        hostContentId: "pacmxz",
                        timestamp: 81000,
                        content: "Miso soup!",
                        created: 110000,
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

        await globalThis.setViewport(1600, 400);
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(__dirname + "/history_page.png", {
              delay: 500,
              fullPage: true,
            }),
            globalThis.readFile(__dirname + "/golden/history_page.png"),
          ]);
          assertThat(rendered, eq(golden), "screenshot");
        }

        // Cleanup
        await globalThis.deleteFile(__dirname + "/history_page.png");
      },
    },
  ],
});
