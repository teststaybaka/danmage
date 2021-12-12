import { ChatEntry } from "../../../interface/chat_entry";
import { StructuredChatPool } from "./chat_pool";
import { MockBlockPatternTester } from "./common/mocks";
import { assertThat, eq, eqArray } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";

PUPPETEER_TEST_RUNNER.run({
  name: "ChatPoolTests",
  cases: [
    {
      name: "FillAndRead",
      execute: () => {
        // Prepare
        let blockPatternTester = new (class extends MockBlockPatternTester {
          public test(chatEntry: ChatEntry) {
            assertThat(chatEntry.timestamp, eq(10), "tested entry");
            return false;
          }
        })();
        let chatPool = new StructuredChatPool(blockPatternTester);
        let chatEntry = { timestamp: 10 };

        // Execute
        chatPool.fill([chatEntry]);
        let readed = chatPool.read(20);

        // Verify
        assertThat(readed, eqArray([eq(chatEntry)]), "read chat entries.");
      },
    },
    {
      name: "FillAndReadNothing",
      execute: () => {
        // Prepare
        let blockPatternTester = new MockBlockPatternTester();
        let chatPool = new StructuredChatPool(blockPatternTester);
        let chatEntry = { timestamp: 10 };

        // Execute
        chatPool.fill([chatEntry]);
        let readed = chatPool.read(10);

        // Verify
        assertThat(readed, eqArray([]), "read chat entries");
      },
    },
    {
      name: "FillAndReadBlocked",
      execute: () => {
        // Prepare
        let blockPatternTester = new (class extends MockBlockPatternTester {
          public test(chatEntry: ChatEntry) {
            assertThat(chatEntry.content, eq("blocked"), "blocked content");
            return true;
          }
        })();
        let chatPool = new StructuredChatPool(blockPatternTester);
        let chatEntry = { timestamp: 10, content: "blocked" };

        // Execute
        chatPool.fill([chatEntry]);
        let readed = chatPool.read(20);

        // Verify
        assertThat(readed, eqArray([]), "read chat entries");
      },
    },
    {
      name: "FillTwoAndReadTwice",
      execute: () => {
        // Prepare
        let blockPatternTester = new (class extends MockBlockPatternTester {
          public test() {
            return false;
          }
        })();
        let chatPool = new StructuredChatPool(blockPatternTester);
        let chatEntry = { timestamp: 30 };

        // Execute
        chatPool.fill([{ timestamp: 10 }, chatEntry]);
        chatPool.read(20);
        let readed = chatPool.read(40);

        // Verify
        assertThat(readed, eqArray([eq(chatEntry)]), "read chat entries");
      },
    },
    {
      name: "FillUnorderedTwoAndRead",
      execute: () => {
        // Prepare
        let blockPatternTester = new (class extends MockBlockPatternTester {
          public test() {
            return false;
          }
        })();
        let chatPool = new StructuredChatPool(blockPatternTester);
        let chatEntry = { timestamp: 10 };
        let chatEntry2 = { timestamp: 30 };

        // Execute
        chatPool.fill([chatEntry2, chatEntry]);
        let readed = chatPool.read(40);

        // Verify
        assertThat(
          readed,
          eqArray([eq(chatEntry), eq(chatEntry2)]),
          "read chat entries"
        );
      },
    },
    {
      name: "FillMoreUnorderedAndRead",
      execute: () => {
        // Prepare
        let blockPatternTester = new (class extends MockBlockPatternTester {
          public test() {
            return false;
          }
        })();
        let chatPool = new StructuredChatPool(blockPatternTester);
        let chatEntry = { timestamp: 10 };
        let chatEntry2 = { timestamp: 30 };
        let chatEntry3 = { timestamp: 30 };
        let chatEntry4 = { timestamp: 50 };
        let chatEntry5 = { timestamp: 100 };

        // Execute
        chatPool.fill([
          chatEntry2,
          chatEntry4,
          chatEntry,
          chatEntry3,
          chatEntry5,
        ]);
        let readed = chatPool.read(200);

        // Verify
        assertThat(
          readed,
          eqArray([
            eq(chatEntry),
            eq(chatEntry2),
            eq(chatEntry3),
            eq(chatEntry4),
            eq(chatEntry5),
          ]),
          "read chat entries"
        );
      },
    },
    {
      name: "FillTwiceUnorderedAndRead",
      execute: () => {
        // Prepare
        let blockPatternTester = new (class extends MockBlockPatternTester {
          public test() {
            return false;
          }
        })();
        let chatPool = new StructuredChatPool(blockPatternTester);
        let chatEntry = { timestamp: 10 };
        let chatEntry2 = { timestamp: 30 };
        let chatEntry3 = { timestamp: 30 };
        let chatEntry4 = { timestamp: 30 };
        let chatEntry5 = { timestamp: 50 };
        let chatEntry6 = { timestamp: 100 };

        // Execute
        chatPool.fill([chatEntry2, chatEntry5]);
        chatPool.fill([chatEntry3, chatEntry, chatEntry4, chatEntry6]);
        let readed = chatPool.read(200);

        // Verify
        assertThat(
          readed,
          eqArray([
            eq(chatEntry),
            eq(chatEntry2),
            eq(chatEntry3),
            eq(chatEntry4),
            eq(chatEntry5),
            eq(chatEntry6),
          ]),
          "read chat entries"
        );
      },
    },
    {
      name: "FillAndJumpAndRead",
      execute: () => {
        // Prepare
        let blockPatternTester = new (class extends MockBlockPatternTester {
          public test() {
            return false;
          }
        })();
        let chatPool = new StructuredChatPool(blockPatternTester);
        let chatEntry = { timestamp: 20 };
        let chatEntry2 = { timestamp: 30 };
        let chatEntry3 = { timestamp: 30 };
        let chatEntry4 = { timestamp: 50 };

        // Execute
        chatPool.fill([chatEntry, chatEntry2, chatEntry3, chatEntry4]);
        chatPool.start(30);
        let readed = chatPool.read(40);

        // Verify
        assertThat(
          readed,
          eqArray([eq(chatEntry2), eq(chatEntry3)]),
          "read chat entries"
        );
      },
    },
    {
      name: "FillAndJumpToEndAndRead",
      execute: () => {
        // Prepare
        let blockPatternTester = new MockBlockPatternTester();
        let chatPool = new StructuredChatPool(blockPatternTester);
        let chatEntry = { timestamp: 20 };
        let chatEntry2 = { timestamp: 30 };
        let chatEntry3 = { timestamp: 30 };

        // Execute
        chatPool.fill([chatEntry, chatEntry2, chatEntry3]);
        chatPool.start(50);
        let readed = chatPool.read(60);

        // Verify
        assertThat(readed, eqArray([]), "read chat entries");
      },
    },
  ],
});
