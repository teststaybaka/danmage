import { GET_USER, UPDATE_NICKNAME } from "../../../interface/service";
import { FillButtonComponent } from "../../button_component";
import { INPUT_STYLE, LABEL_STYLE } from "./common_style";
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
    let views = NicknameComponent.createView();
    return new NicknameComponent(
      ...views,
      new TextInputController(views[1]),
      FillButtonComponent.create(E.text("Set")),
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
          `justify-content: center; padding-bottom: 6rem;"`,
        E.div(`style="flex: 2;"`),
        E.div(
          `class="nickname-label" style="${LABEL_STYLE}"`,
          E.text("Nickname")
        ),
        E.inputRef(
          input,
          `class="nickname-input" placeholder="You can only set it once."` +
            `style="${INPUT_STYLE}"`
        ),
        E.div(`style="flex: 2;"`)
      )
    );
    return [body, input.val] as const;
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
    this.input.readOnly = true;
  }

  public async show(): Promise<void> {
    this.body.style.display = this.displayStyle;
    let response = await this.serviceClient.fetchAuthed({}, GET_USER);
    if (response.user.nickname === undefined) {
      return;
    }

    this.input.value = response.user.nickname;
    this.input.readOnly = true;
    this.setButton.forceDisable();
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
