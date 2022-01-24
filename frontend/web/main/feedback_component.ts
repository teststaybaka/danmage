import { REPORT_USER_ISSUE } from "../../../interface/service";
import { FillButtonComponent } from "../../button_component";
import { ColorScheme } from "../../color_scheme";
import { INPUT_STYLE, LABEL_STYLE } from "./common_style";
import { LOCALIZED_TEXT } from "./locales/localized_text";
import { SERVICE_CLIENT } from "./service_client";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { ServiceClient } from "@selfage/service_client";

export class FeedbackComponent {
  public body: HTMLDivElement;
  public textarea: HTMLTextAreaElement;
  public input: HTMLInputElement;

  public constructor(
    private button: FillButtonComponent,
    private serviceClient: ServiceClient
  ) {
    let textareaRef = new Ref<HTMLTextAreaElement>();
    let inputRef = new Ref<HTMLInputElement>();
    this.body = E.div(
      {
        class: "feedback-body",
        style: `display: flex; flex-flow: column nowrap; width: 100%; align-items: center; padding: 5rem; box-sizing: border-box;`,
      },
      E.div(
        {
          class: "feedback-line",
          style: `width: 100%; padding-bottom: 6rem; font-size: 1.4rem; color: ${ColorScheme.getContent()}; text-align: center;`,
        },
        E.text(LOCALIZED_TEXT.directFeedbackSuggestion)
      ),
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
    this.textarea = textareaRef.val;
    this.input = inputRef.val;
  }

  public static create(): FeedbackComponent {
    return new FeedbackComponent(
      FillButtonComponent.create(E.text(LOCALIZED_TEXT.submitFeedbackButton)),
      SERVICE_CLIENT
    ).init();
  }

  public init(): this {
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

  public remove(): void {
    this.body.remove();
  }
}
