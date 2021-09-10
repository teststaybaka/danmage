import { BlockPatternTester, ContentExtractor } from "./block_pattern_tester";
import { assertThat, eq } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";

PUPPETEER_TEST_RUNNER.run({
  name: "BlockPatternTesterTest",
  cases: [
    {
      name: "BlockKeywords",
      execute: () => {
        // Prepare
        let contentExtractor = new (class implements ContentExtractor {
          public extract(content: string) {
            assertThat(content, eq("test content"), "content");
            return "Contains a key!";
          }
        })();
        let blockPatternTester = new BlockPatternTester(
          {
            blockPatterns: [{ kind: 1, content: "key" }],
          },
          contentExtractor
        );

        // Execute
        let blocked = blockPatternTester.test({ content: "test content" });

        // Verify
        assertThat(blocked, eq(true), "blocked");
      },
    },
    {
      name: "BlockRegex",
      execute: () => {
        // Prepare
        let contentExtractor = new (class implements ContentExtractor {
          public extract(content: string) {
            return "Has a regex.";
          }
        })();
        let blockPatternTester = new BlockPatternTester(
          {
            blockPatterns: [{ kind: 3, content: "^Has.*?reg.*?$" }],
          },
          contentExtractor
        );

        // Execute
        let blocked = blockPatternTester.test({});

        // Verify
        assertThat(blocked, eq(true), "blocked");
      },
    },
    {
      name: "NotBlocked",
      execute: () => {
        // Prepare
        let contentExtractor = new (class implements ContentExtractor {
          public extract(content: string) {
            return "OK.";
          }
        })();
        let blockPatternTester = new BlockPatternTester(
          {
            blockPatterns: [
              { kind: 1, content: "key" },
              { kind: 3, content: "^Has.*?reg.*?$" },
            ],
          },
          contentExtractor
        );

        // Execute
        let blocked = blockPatternTester.test({});

        // Verify
        assertThat(blocked, eq(false), "not blocked");
      },
    },
  ],
});
