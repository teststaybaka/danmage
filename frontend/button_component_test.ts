import { FillButtonComponent, TextButtonComponent } from "./button_component";
import { ButtonController } from "@selfage/element/button_controller";
import { E } from "@selfage/element/factory";
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
        let button = new (class extends ButtonController {
          constructor() {
            super(undefined);
          }
        })();
        document.body.appendChild(
          new FillButtonComponent(
            FillButtonComponent.createView(E.text("Primary")),
            button
          ).init().body
        );

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
        let button = new (class extends ButtonController {
          constructor() {
            super(undefined);
          }
        })();
        document.body.appendChild(
          new TextButtonComponent(
            TextButtonComponent.createView(E.text("Text")),
            button
          ).init().body
        );

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
