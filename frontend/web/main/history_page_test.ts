import { HostApp } from "../../../interface/chat_entry";
import {
  GET_CHAT_HISTORY,
  GET_CHAT_HISTORY_REQUEST,
  GetChatHistoryResponse,
} from "../../../interface/service";
import { normalizeBody } from "../../body_normalizer";
import { HistoryPage } from "./history_page";
import { eqMessage } from "@selfage/message/test_matcher";
import { setViewport } from "@selfage/puppeteer_test_executor_api";
import { TEST_RUNNER, TestCase } from "@selfage/puppeteer_test_runner";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { assertThat, eq } from "@selfage/test_matcher";
import { WebServiceClientMock } from "@selfage/web_service_client/client_mock";

normalizeBody();

TEST_RUNNER.run({
  name: "HistoryPageTest",
  cases: [
    new (class implements TestCase {
      public name = "ShowAndShowAgainAndClickWithNoMore";
      private cut: HistoryPage;
      public async execute() {
        // Prepare
        await setViewport(1600, 400);
        let counter = 0;
        let serviceClient = new (class extends WebServiceClientMock {
          public async send(request: any): Promise<any> {
            assertThat(request.descriptor, eq(GET_CHAT_HISTORY), "service");
            counter++;
            switch (counter) {
              case 1:
                assertThat(
                  request.body,
                  eqMessage({}, GET_CHAT_HISTORY_REQUEST),
                  `1st cursor`,
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
                  request.body,
                  eqMessage(
                    {
                      cursor: "a cursor",
                    },
                    GET_CHAT_HISTORY_REQUEST,
                  ),
                  `2nd cursor`,
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
                  request.body,
                  eqMessage(
                    {
                      cursor: "new cursor",
                    },
                    GET_CHAT_HISTORY_REQUEST,
                  ),
                  `3rd cursor`,
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
        this.cut = new HistoryPage(serviceClient);
        document.body.appendChild(this.cut.body);
        await new Promise<void>((resolve) => this.cut.once("loaded", resolve));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/history_page_show.png",
          __dirname + "/golden/history_page_show.png",
          __dirname + "/history_page_show_diff.png",
          { fullPage: true },
        );

        // Execute
        this.cut.showMoreButton.val.click();
        await new Promise<void>((resolve) => this.cut.once("loaded", resolve));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/history_page_show_again.png",
          __dirname + "/golden/history_page_show_again.png",
          __dirname + "/history_page_show_again_diff.png",
          { fullPage: true },
        );

        // Execute
        this.cut.showMoreButton.val.click();
        await new Promise<void>((resolve) => this.cut.once("loaded", resolve));

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/history_page_show_no_more.png",
          __dirname + "/golden/history_page_show_no_more.png",
          __dirname + "/history_page_show_no_more_diff.png",
          { fullPage: true },
        );
      }
      public tearDown() {
        this.cut.remove();
      }
    })(),
  ],
});
