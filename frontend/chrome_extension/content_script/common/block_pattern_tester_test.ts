import { BlockPatternTester, ContentExtractor } from "./block_pattern_tester";
import { TEST_RUNNER } from "@selfage/puppeteer_test_runner";
import { assertThat, eq } from "@selfage/test_matcher";

TEST_RUNNER.run({
  name: "BlockPatternTesterTest",
  cases: [
    {
      name: "BlockKeywords",
      execute: () => {
        // Prepare
        let contentExtractor = new (class implements ContentExtractor {
          public extract(content: string) {
            assertThat(content, eq("test content"), "content");
            return "Contains a Key!";
          }
        })();
        let blockPatternTester = new BlockPatternTester(
          {
            blockPatterns: [{ kind: 1, content: "KEY" }],
          },
          contentExtractor,
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
          contentExtractor,
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
              { kind: 1, content: "KEY" },
              { kind: 3, content: "^Has.*?reg.*?$" },
            ],
          },
          contentExtractor,
        );

        // Execute
        let blocked = blockPatternTester.test({});

        // Verify
        assertThat(blocked, eq(false), "not blocked");
      },
    },
  ],
});
