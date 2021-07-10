import { REPORT_USER_ISSUE } from "../../../interface/service";
import { FillButtonComponent } from "../../button_component";
import { INPUT_STYLE, LABEL_STYLE } from "./common_style";
import { SERVICE_CLIENT } from "./service_client";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { ServiceClient } from "@selfage/service_client";

export class FeedbackComponent {
  public constructor(
    public body: HTMLDivElement,
    private textarea: HTMLTextAreaElement,
    private input: HTMLInputElement,
    private button: FillButtonComponent,
    private serviceClient: ServiceClient
  ) {}

  public static create(): FeedbackComponent {
    let { body, textarea, input } = FeedbackComponent.createView();
    let button = FillButtonComponent.create(E.text("Submit"));
    return new FeedbackComponent(
      body,
      textarea,
      input,
      button,
      SERVICE_CLIENT
    ).init();
  }

  public static createView() {
    let textareaRef = new Ref<HTMLTextAreaElement>();
    let inputRef = new Ref<HTMLInputElement>();
    let body = E.div(
      `class="feedback-body" style="display: flex; ` +
        `flex-flow: column nowrap; width: 100%; align-items: center; ` +
        `padding: 5rem;"`,
      E.div(
        `class="feedback-line" style="display: flex; flex-flow: row nowrap; ` +
          `width: 100%; justify-content: center; padding-bottom: 6rem;"`,
        E.div(`style="flex: 2;"`),
        E.div(
          `class="feedback-label" style="${LABEL_STYLE}"`,
          E.text("Description")
        ),
        E.textareaRef(
          textareaRef,
          `class="feedback-textarea" style="${INPUT_STYLE} min-height: 3rem; ` +
            `resize: vertical;"`
        ),
        E.div(`style="flex: 2;"`)
      ),
      E.div(
        `class="feedback-line" style="display: flex; flex-flow: row nowrap; ` +
          `width: 100%; align-items: center; justify-content: center; ` +
          `padding-bottom: 6rem;"`,
        E.div(`style="flex: 2;"`),
        E.div(`class="feedback-label" style="${LABEL_STYLE}"`, E.text("Email")),
        E.inputRef(
          inputRef,
          `class="feedback-input" ` +
            `placeholder="Leave your email if you want to hear back."` +
            `style="${INPUT_STYLE}"`
        ),
        E.div(`style="flex: 2;"`)
      )
    );
    return { body, textarea: textareaRef.val, input: inputRef.val };
  }

  public init(): this {
    this.body.appendChild(this.button.body);
    this.button.on("click", () => this.submit());
    return this;
  }

  private async submit(): Promise<void> {
    await this.serviceClient.fetchUnauthed(
      {
        userIssue: {
          email: this.input.value,
          description: this.textarea.value,
        },
      },
      REPORT_USER_ISSUE
    );
    this.input.value = "";
    this.textarea.value = "";
  }
}
