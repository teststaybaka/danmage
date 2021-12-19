import { REPORT_USER_ISSUE } from "../../../interface/service";
import { FillButtonComponent } from "../../button_component";
import { INPUT_STYLE, LABEL_STYLE } from "./common_style";
import { LOCALIZED_TEXT } from "./localized_text";
import { SERVICE_CLIENT } from "./service_client";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { ServiceClient } from "@selfage/service_client";

export class FeedbackComponent {
  private displayStyle: string;

  public constructor(
    public body: HTMLDivElement,
    private textarea: HTMLTextAreaElement,
    private input: HTMLInputElement,
    private button: FillButtonComponent,
    private serviceClient: ServiceClient
  ) {}

  public static create(): FeedbackComponent {
    return new FeedbackComponent(
      ...FeedbackComponent.createView(
        FillButtonComponent.create(E.text(LOCALIZED_TEXT.submitFeedbackButton))
      ),
      SERVICE_CLIENT
    ).init();
  }

  public static createView(button: FillButtonComponent) {
    let textareaRef = new Ref<HTMLTextAreaElement>();
    let inputRef = new Ref<HTMLInputElement>();
    let body = E.div(
      {
        class: "feedback-body",
        style: `display: flex; flex-flow: column nowrap; width: 100%; align-items: center; padding: 5rem; box-sizing: border-box;`,
      },
      E.div(
        {
          class: "feedback-line",
          style: `display: flex; flex-flow: row nowrap; width: 100%; justify-content: center; padding-bottom: 6rem;`,
        },
        E.div({ style: "flex: 2;" }),
        E.div(
          { class: "feedback-label", style: LABEL_STYLE },
          E.text(LOCALIZED_TEXT.feedbackInputLabel)
        ),
        E.textareaRef(textareaRef, {
          class: "feedback-textarea",
          style: `${INPUT_STYLE} min-height: 3rem; resize: vertical;`,
        }),
        E.div({ style: "flex: 2;" })
      ),
      E.div(
        {
          class: "feedback-line",
          style: `display: flex; flex-flow: row nowrap; width: 100%; align-items: center; justify-content: center; padding-bottom: 6rem;`,
        },
        E.div({ style: "flex: 2;" }),
        E.div(
          { class: "feedback-label", style: LABEL_STYLE },
          E.text(LOCALIZED_TEXT.emailInputLabel)
        ),
        E.inputRef(inputRef, {
          class: "feedback-input",
          placeholder: LOCALIZED_TEXT.emailInputPlaceholder,
          style: INPUT_STYLE,
        }),
        E.div({ style: "flex: 2;" })
      ),
      button.body
    );
    return [body, textareaRef.val, inputRef.val, button] as const;
  }

  public init(): this {
    this.displayStyle = this.body.style.display;
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

  public show(): void {
    this.body.style.display = this.displayStyle;
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
