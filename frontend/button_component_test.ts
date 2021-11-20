import { normalizeBody } from "./body_normalizer";
import { FillButtonComponent, TextButtonComponent } from "./button_component";
import { ButtonController } from "@selfage/element/button_controller";
import { E } from "@selfage/element/factory";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";

PUPPETEER_TEST_RUNNER.run({
  name: "ButtonComponentTest",
  environment: {
    setUp: () => normalizeBody(),
  },
  cases: [
    {
      name: "FillButtonRender",
      execute: async () => {
        // Prepare
        await globalThis.setViewport(300, 100);
        let button = new (class extends ButtonController {
          constructor() {
            super(undefined);
          }
        })();

        // Execute
        document.body.appendChild(
          new FillButtonComponent(
            FillButtonComponent.createView(E.text("Primary")),
            button
          ).init().body
        );

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/button_component_fill.png",
          __dirname + "/golden/button_component_fill.png",
          __dirname + "/button_component_fill_diff.png",
          { fullPage: true }
        );
      },
      tearDown: () => {
        if (document.body.lastChild) {
          document.body.removeChild(document.body.lastChild);
        }
      },
    },
    {
      name: "TextButtonRender",
      execute: async () => {
        // Prepare
        await globalThis.setViewport(300, 100);
        let button = new (class extends ButtonController {
          constructor() {
            super(undefined);
          }
        })();

        // Execute
        document.body.appendChild(
          new TextButtonComponent(
            TextButtonComponent.createView(E.text("Text")),
            button
          ).init().body
        );

        // Verify
        await asyncAssertScreenshot(
          __dirname + "/button_component_text.png",
          __dirname + "/golden/button_component_text.png",
          __dirname + "/button_component_text_diff.png",
          { fullPage: true }
        );
      },
      tearDown: () => {
        if (document.body.lastChild) {
          document.body.removeChild(document.body.lastChild);
        }
      },
    },
  ],
});
