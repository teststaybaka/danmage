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
  public constructor(
    public body: HTMLDivElement,
    private input: HTMLInputElement,
    private setButton: FillButtonComponent,
    private inputController: TextInputController,
    private serviceClient: ServiceClient
  ) {}

  public static create(): NicknameComponent {
    let views = NicknameComponent.createView(
      FillButtonComponent.create(E.text(LOCALIZED_TEXT.setNicknameButton))
    );
    return new NicknameComponent(
      ...views,
      new TextInputController(views[1]),
      SERVICE_CLIENT
    ).init();
  }

  public static createView(setButton: FillButtonComponent) {
    let input = new Ref<HTMLInputElement>();
    let body = E.div(
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
        E.inputRef(input, {
          class: "nickname-input",
          placeholder: "You can only set it once.",
          style: INPUT_STYLE,
        }),
        E.div({ style: "flex: 2;" })
      ),
      setButton.body
    );
    return [body, input.val, setButton] as const;
  }

  public init(): this {
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
