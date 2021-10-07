import { HostApp } from "../../../interface/chat_entry";
import {
  GET_CHAT_HISTORY,
  GetChatHistoryRequest,
  GetChatHistoryResponse,
} from "../../../interface/service";
import { normalizeBody } from "../../body_normalizer";
import { TextButtonComponentMock } from "../../mocks";
import { HistoryComponent } from "./history_component";
import { Counter } from "@selfage/counter";
import { E } from "@selfage/element/factory";
import { ServiceClientMock } from "@selfage/service_client/mocks";
import { assertThat, eq, eqArray } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_executor_api";

normalizeBody();

PUPPETEER_TEST_RUNNER.run({
  name: "HistoryComponentTest",
  cases: [
    {
      name: "ShowAndShowAgainAndClickWithNoMore",
      execute: async () => {
        // Prepare
        let counter = new Counter<string>();
        let button = new (class extends TextButtonComponentMock {
          public constructor() {
            super(E.text("Show more"));
          }
          public async click() {
            counter.increment("click");
            assertThat(
              await Promise.all(
                this.listeners("click").map((callback) => callback())
              ),
              eqArray([eq(undefined)]),
              `enable button`
            );
          }
        })();
        let serviceClient = new (class extends ServiceClientMock {
          public fetchAuthedAny(request: any, serviceDescriptor: any): any {
            assertThat(
              serviceDescriptor,
              eq(GET_CHAT_HISTORY),
              "service descriptor"
            );
            switch (counter.increment("fetchAuthed")) {
              case 1:
                assertThat(
                  (request as GetChatHistoryRequest).cursor,
                  eq(undefined),
                  `1st cursor`
                );
                return {
                  chatEntries: [
                    {
                      hostApp: HostApp.YouTube,
                      hostContentId: "piavxf",
                      timestamp: 80000,
                      content: "Chashu!",
                      created: 100000,
                    },
                  ],
                  cursor: "a cursor",
                } as GetChatHistoryResponse as any;
              case 2:
                assertThat(
                  (request as GetChatHistoryRequest).cursor,
                  eq(undefined),
                  `2nd cursor`
                );
                return {
                  chatEntries: [
                    {
                      hostApp: HostApp.YouTube,
                      hostContentId: "loaca",
                      timestamp: 90000,
                      content: "Ramen!",
                      created: 120000,
                    },
                  ],
                  cursor: "new cursor",
                } as GetChatHistoryResponse as any;
              case 3:
                assertThat(
                  (request as GetChatHistoryRequest).cursor,
                  eq(`new cursor`),
                  `3rd cursor`
                );
                return {
                  chatEntries: [
                    {
                      hostApp: HostApp.Crunchyroll,
                      hostContentId: "pacmxz",
                      timestamp: 81000,
                      content: "Miso soup!",
                      created: 110000,
                    },
                  ],
                } as GetChatHistoryResponse as any;
              default:
                return {} as any;
            }
          }
        })();
        await globalThis.setViewport(1600, 400);

        // Execute
        let historyComponent = new HistoryComponent(
          ...HistoryComponent.createView(button),
          serviceClient
        ).init();
        document.body.appendChild(historyComponent.body);
        await historyComponent.show();

        // Verify
        assertThat(counter.get("click"), eq(1), "click called");
        assertThat(counter.get("fetchAuthed"), eq(1), `fetchAuthed called`);
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(__dirname + "/history_component_show.png", {
              delay: 500,
              fullPage: true,
            }),
            globalThis.readFile(
              __dirname + "/golden/history_component_show.png"
            ),
          ]);
          assertThat(rendered, eq(golden), "show screenshot");
        }

        // Execute
        await historyComponent.show();

        // Verify
        assertThat(counter.get("click"), eq(2), "2nd click called");
        assertThat(counter.get("fetchAuthed"), eq(2), `2nd fetchAuthed called`);
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(
              __dirname + "/history_component_show_again.png",
              {
                delay: 500,
                fullPage: true,
              }
            ),
            globalThis.readFile(
              __dirname + "/golden/history_component_show_again.png"
            ),
          ]);
          assertThat(rendered, eq(golden), "show again screenshot");
        }

        // Execute
        await button.click();

        // Verify
        assertThat(counter.get("fetchAuthed"), eq(3), `2nd fetchAuthed called`);
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(
              __dirname + "/history_component_no_more.png",
              {
                delay: 500,
                fullPage: true,
              }
            ),
            globalThis.readFile(
              __dirname + "/golden/history_component_no_more.png"
            ),
          ]);
          assertThat(rendered, eq(golden), "screenshot");
        }

        // Cleanup
        await Promise.all([
          globalThis.deleteFile(__dirname + "/history_component_show.png"),
          globalThis.deleteFile(
            __dirname + "/history_component_show_again.png"
          ),
          globalThis.deleteFile(__dirname + "/history_component_no_more.png"),
        ]);
        historyComponent.body.remove();
      },
    },
  ],
});
