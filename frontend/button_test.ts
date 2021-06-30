import { FillButton, TextButton } from "./button";
import { E } from "@selfage/element/factory";
import { assertThat, eq } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_executor_api";

document.documentElement.style.fontSize = "62.5%";
document.body.style.margin = "0";
document.body.style.fontSize = "0";

PUPPETEER_TEST_RUNNER.run({
  name: "ButtonTest",
  cases: [
    {
      name: "FillButtonRender",
      execute: async () => {
        // Prepare
        await globalThis.setViewport(300, 100);

        // Execute
        document.body.appendChild(
          FillButton.create(E.text("Primary")).button.ele
        );

        // Verify
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(__dirname + "/button_fill.png", {
              delay: 500,
              fullPage: true,
            }),
            globalThis.readFile(__dirname + "/golden/button_fill.png"),
          ]);
          assertThat(rendered, eq(golden), "screenshot");
        }

        // Cleanup
        await globalThis.deleteFile(__dirname + "/button_fill.png");
        document.body.removeChild(document.body.lastChild);
      },
    },
    {
      name: "TextButtonRender",
      execute: async () => {
        // Prepare
        await globalThis.setViewport(300, 100);

        // Execute
        document.body.appendChild(
          TextButton.create(E.text("Text")).button.ele
        );

        // Verify
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(__dirname + "/button_text.png", {
              delay: 500,
              fullPage: true,
            }),
            globalThis.readFile(__dirname + "/golden/button_text.png"),
          ]);
          assertThat(rendered, eq(golden), "screenshot");
        }

        // Cleanup
        await globalThis.deleteFile(__dirname + "/button_text.png");
        document.body.removeChild(document.body.lastChild);
      },
    },
  ],
});
