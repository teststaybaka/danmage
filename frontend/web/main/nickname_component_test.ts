import {
  GET_USER,
  GetUserResponse,
  UPDATE_NICKNAME,
  UpdateNicknameRequest,
} from "../../../interface/service";
import { normalizeBody } from "../../body_normalizer";
import { FillButtonComponentMock } from "../../mocks";
import { NicknameComponent } from "./nickname_component";
import { Counter } from "@selfage/counter";
import { E } from "@selfage/element/factory";
import { TextInputController } from "@selfage/element/text_input_controller";
import { asyncAssertScreenshot } from "@selfage/screenshot_test_matcher";
import { ServiceClientMock } from "@selfage/service_client/mocks";
import { assertThat, eq, eqArray } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER, TestCase } from "@selfage/test_runner";

PUPPETEER_TEST_RUNNER.run({
  name: "NicknameComponentTest",
  environment: {
    setUp: () => normalizeBody(),
  },
  cases: [
    new (class implements TestCase {
      public name = "RenderWithoutNameThenClickToUpdate";
      private nicknameComponent: NicknameComponent;
      public async execute() {
        // Prepare
        let counter = new Counter<string>();
        let setButton = new (class extends FillButtonComponentMock {
          public constructor() {
            super(E.text("Set"));
          }
          public hide() {
            counter.increment("hide");
          }
        })();
        let inputController = new (class extends TextInputController {
          public constructor() {
            super(undefined);
          }
        })();
        let serviceClient = new (class extends ServiceClientMock {
          public fetchAuthedAny(request: any, serviceDescriptor: any): any {
            switch (counter.increment("fetchAuthed")) {
              case 1:
                assertThat(
                  serviceDescriptor,
                  eq(GET_USER),
                  "first service descriptor"
                );
                return {
                  user: {},
                } as GetUserResponse as any;
              case 2:
                assertThat(
                  serviceDescriptor,
                  eq(UPDATE_NICKNAME),
                  "second service descriptor"
                );
                assertThat(
                  (request as UpdateNicknameRequest).newName,
                  eq(`new name`),
                  `new name`
                );
                return {} as any;
              default:
                return {} as any;
            }
          }
        })();

        // Execute
        this.nicknameComponent = new NicknameComponent(
          setButton,
          () => inputController,
          serviceClient
        ).init();
        document.body.appendChild(this.nicknameComponent.body);
        await this.nicknameComponent.show();

        // Verify
        assertThat(
          counter.get("fetchAuthed"),
          eq(1),
          `first fetchAuthed called`
        );
        await globalThis.setViewport(1600, 400);
        await asyncAssertScreenshot(
          __dirname + "/nickname_component.png",
          __dirname + "/golden/nickname_component.png",
          __dirname + "/nickname_component_diff.png"
        );

        // Prepare
        this.nicknameComponent.input.value = "new name";

        // Execute
        let keepDisableds = await Promise.all(
          setButton.listeners("click").map((callback) => callback())
        );

        // Verify
        assertThat(
          counter.get("fetchAuthed"),
          eq(2),
          `second fetchAuthed called`
        );
        assertThat(keepDisableds, eqArray([eq(undefined)]), "enable button");
        assertThat(counter.get("hide"), eq(1), "hide button");
      }
      public tearDown() {
        this.nicknameComponent.remove();
      }
    })(),
    {
      name: "RenderWithName",
      execute: async () => {
        // Prepare
        let counter = new Counter<string>();
        let inputController = new (class extends TextInputController {
          public constructor() {
            super(undefined);
          }
        })();
        let setButton = new (class extends FillButtonComponentMock {
          public hide() {
            counter.increment("hide");
          }
        })();
        let serviceClient = new (class extends ServiceClientMock {
          public fetchAuthedAny(request: any, serviceDescriptor: any): any {
            switch (counter.increment("fetchAuthed")) {
              case 1:
                assertThat(
                  serviceDescriptor,
                  eq(GET_USER),
                  "service descriptor"
                );
                return {
                  user: { nickname: "some name" },
                } as GetUserResponse as any;
              default:
                return {} as any;
            }
          }
        })();

        // Execute
        let nicknameComponent = new NicknameComponent(
          setButton,
          () => inputController,
          serviceClient
        ).init();
        await nicknameComponent.show();

        // Verify
        assertThat(counter.get("fetchAuthed"), eq(1), `fetchAuthed called`);
        assertThat(counter.get("hide"), eq(1), `hide called`);
        assertThat(
          nicknameComponent.input.value,
          eq("some name"),
          `input value`
        );
      },
    },
    {
      name: "EnterToTriggerClick",
      execute: async () => {
        // Prepare
        let counter = new Counter<string>();
        let inputController = new (class extends TextInputController {
          public constructor() {
            super(undefined);
          }
        })();
        let setButton = new (class extends FillButtonComponentMock {
          public async click() {
            counter.increment("click");
          }
        })();
        let serviceClient = new ServiceClientMock();

        // Execute
        new NicknameComponent(
          setButton,
          () => inputController,
          serviceClient
        ).init();
        await inputController.enter();

        // Verify
        assertThat(counter.get("click"), eq(1), `click called`);
      },
    },
  ],
});
