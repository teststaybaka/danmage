import { FillButtonComponent, TextButtonComponent } from "./button_component";
import { E } from "@selfage/element/factory";
import { Ref, assign } from "@selfage/ref";
import { assertThat, eq } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_executor_api";

document.documentElement.style.fontSize = "62.5%";
document.body.style.margin = "0";
document.body.style.fontSize = "0";

PUPPETEER_TEST_RUNNER.run({
  name: "ButtonComponentTest",
  cases: [
    {
      name: "FillButtonRender",
      execute: async () => {
        // Prepare
        await globalThis.setViewport(300, 100);

        // Execute
        let button = new Ref<FillButtonComponent>();
        document.body.appendChild(
          assign(
            button,
            new FillButtonComponent(
              FillButtonComponent.createView(E.text("Primary")),
              undefined
            )
          ).body
        );
        button.val.enable();

        // Verify
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(__dirname + "/button_component_fill.png", {
              delay: 500,
              fullPage: true,
            }),
            globalThis.readFile(
              __dirname + "/golden/button_component_fill.png"
            ),
          ]);
          assertThat(rendered, eq(golden), "screenshot");
        }

        // Cleanup
        await globalThis.deleteFile(__dirname + "/button_component_fill.png");
        document.body.removeChild(document.body.lastChild);
      },
    },
    {
      name: "TextButtonRender",
      execute: async () => {
        // Prepare
        await globalThis.setViewport(300, 100);

        // Execute
        let button = new Ref<TextButtonComponent>();
        document.body.appendChild(
          assign(
            button,
            new TextButtonComponent(
              TextButtonComponent.createView(E.text("Text")),
              undefined
            )
          ).body
        );
        button.val.enable();

        // Verify
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(__dirname + "/button_component_text.png", {
              delay: 500,
              fullPage: true,
            }),
            globalThis.readFile(
              __dirname + "/golden/button_component_text.png"
            ),
          ]);
          assertThat(rendered, eq(golden), "screenshot");
        }

        // Cleanup
        await globalThis.deleteFile(__dirname + "/button_component_text.png");
        document.body.removeChild(document.body.lastChild);
      },
    },
  ],
});
