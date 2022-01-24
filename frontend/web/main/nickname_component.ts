import { GET_USER, UPDATE_NICKNAME } from "../../../interface/service";
import { FillButtonComponent } from "../../button_component";
import { INPUT_STYLE, LABEL_STYLE } from "./common_style";
import { LOCALIZED_TEXT } from "./locales/localized_text";
import { SERVICE_CLIENT } from "./service_client";
import { E } from "@selfage/element/factory";
import { TextInputController } from "@selfage/element/text_input_controller";
import { Ref } from "@selfage/ref";
import { ServiceClient } from "@selfage/service_client";

export class NicknameComponent {
  public body: HTMLDivElement;
  public input: HTMLInputElement;
  private inputController: TextInputController;

  public constructor(
    private setButton: FillButtonComponent,
    private inputControllerFactoryFn: (
      input: HTMLInputElement
    ) => TextInputController,
    private serviceClient: ServiceClient
  ) {
    let inputRef = new Ref<HTMLInputElement>();
    this.body = E.div(
      {
        class: "nickname-container",
        style: `display: flex; flex-flow: column nowrap; width: 100%; align-items: center; padding: 5rem; box-sizing: border-box;`,
      },
      E.div(
        {
          class: "nickname-input-line",
          style: `display: flex; flex-flow: row nowrap; width: 100%; align-items: center; justify-content: center; padding-bottom: 6rem;`,
        },
        E.div({ style: "flex: 2;" }),
        E.div(
          { class: "nickname-label", style: LABEL_STYLE },
          E.text(LOCALIZED_TEXT.nicknameInputLabel)
        ),
        E.inputRef(inputRef, {
          class: "nickname-input",
          placeholder: "You can only set it once.",
          style: INPUT_STYLE,
        }),
        E.div({ style: "flex: 2;" })
      ),
      setButton.body
    );
    this.input = inputRef.val;
  }

  public static create(): NicknameComponent {
    return new NicknameComponent(
      FillButtonComponent.create(E.text(LOCALIZED_TEXT.setNicknameButton)),
      TextInputController.create,
      SERVICE_CLIENT
    ).init();
  }

  public init(): this {
    this.inputController = this.inputControllerFactoryFn(this.input);
    this.setButton.on("click", () => this.updateNickname());
    this.inputController.on("enter", () => this.setButton.click());
    return this;
  }

  public async updateNickname(): Promise<void> {
    await this.serviceClient.fetchAuthed(
      { newName: this.input.value },
      UPDATE_NICKNAME
    );
    this.input.readOnly = true;
    this.setButton.hide();
  }

  public async show(): Promise<void> {
    let response = await this.serviceClient.fetchAuthed({}, GET_USER);
    if (response.user.nickname === undefined) {
      return;
    }

    this.input.value = response.user.nickname;
    this.input.readOnly = true;
    this.setButton.hide();
  }

  public remove(): void {
    this.body.remove();
  }
}
