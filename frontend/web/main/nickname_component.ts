import { GET_USER, UPDATE_NICKNAME } from "../../../interface/service";
import { FillButtonComponent } from "../../button_component";
import { ColorScheme } from "../../color_scheme";
import { SERVICE_CLIENT } from "./service_client";
import { E } from "@selfage/element/factory";
import { TextInputController } from "@selfage/element/text_input_controller";
import { Ref } from "@selfage/ref";
import { ServiceClient } from "@selfage/service_client";

export class NicknameComponent {
  private displayStyle: string;

  public constructor(
    public body: HTMLDivElement,
    private input: HTMLInputElement,
    private inputController: TextInputController,
    private setButton: FillButtonComponent,
    private serviceClient: ServiceClient
  ) {}

  public static create(): NicknameComponent {
    let { body, input } = NicknameComponent.createView();
    let inputController = new TextInputController(input);
    let setButton = FillButtonComponent.create(E.text("Set"));
    return new NicknameComponent(
      body,
      input,
      inputController,
      setButton,
      SERVICE_CLIENT
    ).init();
  }

  public static createView() {
    let input = new Ref<HTMLInputElement>();
    let body = E.div(
      `class="nickname-container" style="display: flex; ` +
        `flex-flow: column nowrap; width: 100%; align-items: center; ` +
        `padding: 5rem;"`,
      E.div(
        `class="nickname-input-line" style="display: flex; ` +
          `flex-flow: row nowrap; width: 100%; align-items: center; ` +
          `justify-content: center; padding-bottom: 2rem;"`,
        E.div(`style="flex: 2;"`),
        E.div(
          `class="nickname-label" style="font-size: 1.4rem; ` +
            `color: ${ColorScheme.getContent()}; padding-right: 1rem;"`,
          E.text("Nickname")
        ),
        E.inputRef(
          input,
          `class="nickname-input" placeholder="You can only set it once."` +
            `style="padding: 0; margin: 0; outline: none; border: 0; ` +
            `background-color: initial; flex: 3; font-size: 1.4rem; ` +
            `border-bottom: .1rem solid ${ColorScheme.getInputBorder()};"`
        ),
        E.div(`style="flex: 2;"`)
      )
    );
    return { body, input: input.val };
  }

  public init(): this {
    this.displayStyle = this.body.style.display;
    this.body.appendChild(this.setButton.body);
    this.setButton.on("click", () => this.updateNickname());
    this.inputController.on("enter", () => this.setButton.triggerClick());
    return this;
  }

  public async updateNickname(): Promise<void> {
    await this.serviceClient.fetchAuthed(
      { newName: this.input.value },
      UPDATE_NICKNAME
    );
    this.setButton.forceDisable();
  }

  public async show(): Promise<void> {
    this.body.style.display = this.displayStyle;
    let response = await this.serviceClient.fetchAuthed({}, GET_USER);
    if (response.user.nickname === undefined) {
      return;
    }

    this.input.value = response.user.nickname;
    this.setButton.forceDisable();
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
