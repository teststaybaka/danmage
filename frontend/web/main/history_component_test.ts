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
      name: "Render",
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
          public hide() {
            counter.increment("hide");
          }
        })();
        let serviceClient = new (class extends ServiceClientMock {
          public fetchAuthedAny(request: any, serviceDescriptor: any): any {
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
                  cursor: "new cursor",
                } as GetChatHistoryResponse as any;
              case 2:
                assertThat(
                  (request as GetChatHistoryRequest).cursor,
                  eq(`new cursor`),
                  `second cursor`
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

        // Execute
        let historyComponent = new HistoryComponent(
          ...HistoryComponent.createView(button),
          serviceClient
        ).init();
        document.body.appendChild(historyComponent.body);
        await historyComponent.show();

        // Verify
        assertThat(counter.get("fetchAuthed"), eq(1), `fetchAuthed called`);
        assertThat(counter.get("click"), eq(1), "click called");

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
            globalThis.screenshot(__dirname + "/history_component.png", {
              delay: 500,
              fullPage: true,
            }),
            globalThis.readFile(__dirname + "/golden/history_component.png"),
          ]);
          assertThat(rendered, eq(golden), "screenshot");
        }

        // Cleanup
        await globalThis.deleteFile(__dirname + "/history_component.png");
        historyComponent.body.remove();
      },
    },
  ],
});
