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
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { ServiceClientMock } from "@selfage/service_client/mocks";
import { assertThat, eq, eqArray } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER, TestCase } from "@selfage/test_runner";

PUPPETEER_TEST_RUNNER.run({
  name: "HistoryComponentTest",
  environment: {
    setUp: () => normalizeBody(),
  },
  cases: [
    new (class implements TestCase {
      public name = "ShowAndShowAgainAndClickWithNoMore";
      private historyComponent: HistoryComponent;
      public async execute() {
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
        this.historyComponent = new HistoryComponent(
          ...HistoryComponent.createView(button),
          serviceClient
        ).init();
        document.body.appendChild(this.historyComponent.body);
        await this.historyComponent.show();

        // Verify
        assertThat(counter.get("click"), eq(1), "click called");
        assertThat(counter.get("fetchAuthed"), eq(1), `fetchAuthed called`);
        await asyncAssertScreenshot(
          __dirname + "/history_component_show.png",
          __dirname + "/golden/history_component_show.png",
          __dirname + "/history_component_show_diff.png",
          { fullPage: true }
        );

        // Execute
        await this.historyComponent.show();

        // Verify
        assertThat(counter.get("click"), eq(2), "2nd click called");
        assertThat(counter.get("fetchAuthed"), eq(2), `2nd fetchAuthed called`);
        await asyncAssertScreenshot(
          __dirname + "/history_component_show_again.png",
          __dirname + "/golden/history_component_show_again.png",
          __dirname + "/history_component_show_again_diff.png",
          { fullPage: true }
        );

        // Execute
        await button.click();

        // Verify
        assertThat(counter.get("fetchAuthed"), eq(3), `2nd fetchAuthed called`);
        await asyncAssertScreenshot(
          __dirname + "/history_component_no_more.png",
          __dirname + "/golden/history_component_no_more.png",
          __dirname + "/history_component_no_more_diff.png",
          { fullPage: true }
        );
      }
      public tearDown() {
        this.historyComponent.remove();
      }
    })(),
  ],
});
