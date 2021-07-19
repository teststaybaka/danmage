import {
  GET_USER,
  GetUserResponse,
  UPDATE_NICKNAME,
  UpdateNicknameRequest,
} from "../../../interface/service";
import { FillButtonComponent } from "../../button_component";
import { NicknameComponent } from "./nickname_component";
import { Counter } from "@selfage/counter";
import { E } from "@selfage/element/factory";
import { TextInputController } from "@selfage/element/text_input_controller";
import { ServiceClient } from "@selfage/service_client";
import {
  AuthedServiceDescriptor,
  WithSession,
} from "@selfage/service_descriptor";
import { assertThat, eq, eqArray } from "@selfage/test_matcher";
import { PUPPETEER_TEST_RUNNER } from "@selfage/test_runner";
import "@selfage/puppeteer_executor_api";

document.documentElement.style.fontSize = "62.5%";
document.body.style.margin = "0";
document.body.style.fontSize = "0";

PUPPETEER_TEST_RUNNER.run({
  name: "NicknameComponentTest",
  cases: [
    {
      name: "RenderWithoutNameThenClickToUpdate",
      execute: async () => {
        // Prepare
        let counter = new Counter<string>();
        let [body, input] = NicknameComponent.createView();
        let inputController = new (class extends TextInputController {
          public constructor() {
            super(undefined);
          }
        })();
        let setButton = new (class extends FillButtonComponent {
          public constructor() {
            super(FillButtonComponent.createView(E.text("Set")), undefined);
          }
        })();
        let serviceClient = new (class extends ServiceClient {
          public constructor() {
            super(undefined, undefined);
          }
          public async fetchAuthed<
            ServiceRequest extends WithSession,
            ServiceResponse
          >(
            request: ServiceRequest,
            serviceDescriptor: AuthedServiceDescriptor<
              ServiceRequest,
              ServiceResponse
            >
          ): Promise<ServiceResponse> {
            counter.increment("fetchAuthed");
            switch (counter.get("fetchAuthed")) {
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
        let nicknameComponent = new NicknameComponent(
          body,
          input,
          inputController,
          setButton,
          serviceClient
        ).init();
        document.body.appendChild(nicknameComponent.body);
        await nicknameComponent.show();

        // Verify
        assertThat(
          counter.get("fetchAuthed"),
          eq(1),
          `first fetchAuthed called`
        );

        await globalThis.setViewport(1600, 400);
        {
          let [rendered, golden] = await Promise.all([
            globalThis.screenshot(__dirname + "/nickname_component.png", {
              delay: 500,
              fullPage: true,
            }),
            globalThis.readFile(__dirname + "/golden/nickname_component.png"),
          ]);
          assertThat(rendered, eq(golden), "screenshot");
        }

        // Prepare
        input.value = "new name";

        // Execute
        let toEnables = await Promise.all(
          setButton.listeners("click").map((callback) => callback())
        );

        // Verify
        assertThat(
          counter.get("fetchAuthed"),
          eq(2),
          `second fetchAuthed called`
        );
        assertThat(toEnables, eqArray([eq(false)]), "enable button");

        // Cleanup
        await globalThis.deleteFile(__dirname + "/nickname_component.png");
        nicknameComponent.body.remove();
      },
    },
    {
      name: "RenderWithName",
      execute: async () => {
        // Prepare
        let counter = new Counter<string>();
        let input = E.input("");
        let inputController = new (class extends TextInputController {
          public constructor() {
            super(undefined);
          }
        })();
        let setButton = new (class extends FillButtonComponent {
          public constructor() {
            super(E.button(""), undefined);
          }
          public triggerDisable() {
            counter.increment("triggerDisable");
          }
        })();
        let serviceClient = new (class extends ServiceClient {
          public constructor() {
            super(undefined, undefined);
          }
          public async fetchAuthed<
            ServiceRequest extends WithSession,
            ServiceResponse
          >(
            request: ServiceRequest,
            serviceDescriptor: AuthedServiceDescriptor<
              ServiceRequest,
              ServiceResponse
            >
          ): Promise<ServiceResponse> {
            counter.increment("fetchAuthed");
            switch (counter.get("fetchAuthed")) {
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
          E.div(""),
          input,
          inputController,
          setButton,
          serviceClient
        ).init();
        await nicknameComponent.show();

        // Verify
        assertThat(counter.get("fetchAuthed"), eq(1), `fetchAuthed called`);
        assertThat(
          counter.get("triggerDisable"),
          eq(1),
          `triggerDisable called`
        );
        assertThat(input.value, eq("some name"), `input value`);
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
        let setButton = new (class extends FillButtonComponent {
          public constructor() {
            super(E.button(""), undefined);
          }
          public async triggerClick() {
            counter.increment("triggerClick");
          }
        })();
        let serviceClient = new (class extends ServiceClient {
          public constructor() {
            super(undefined, undefined);
          }
        })();

        // Execute
        new NicknameComponent(
          E.div(""),
          undefined,
          inputController,
          setButton,
          serviceClient
        ).init();
        await inputController.enter();

        // Verify
        assertThat(counter.get("triggerClick"), eq(1), `triggerClick called`);
      },
    },
  ],
});
