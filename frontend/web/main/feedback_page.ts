import { FilledBlockingButton } from "../../blocking_button";
import { reportUserIssue } from "../../client_requests";
import { ColorScheme } from "../../color_scheme";
import { FONT_M } from "../../font_sizes";
import { INPUT_STYLE, LABEL_STYLE } from "./common_style";
import { LOCALIZED_TEXT } from "./locales/localized_text";
import { SERVICE_CLIENT } from "./service_client";
import { E } from "@selfage/element/factory";
import { Ref, assign } from "@selfage/ref";
import { WebServiceClient } from "@selfage/web_service_client";

export class FeedbackPage {
  public static create(): FeedbackPage {
    return new FeedbackPage(SERVICE_CLIENT);
  }

  public body: HTMLDivElement;
  public textarea = new Ref<HTMLTextAreaElement>();
  public input = new Ref<HTMLInputElement>();
  public submitButton = new Ref<FilledBlockingButton>();

  public constructor(private serviceClient: WebServiceClient) {
    this.body = E.div(
      {
        class: "feedback-body",
        style: `display: flex; flex-flow: column nowrap; width: 100%; align-items: center; padding: 5rem; box-sizing: border-box;`,
      },
      E.div(
        {
          class: "feedback-line",
          style: `width: 100%; padding-bottom: 6rem; font-size: ${FONT_M}rem; color: ${ColorScheme.getContent()}; text-align: center;`,
        },
        E.text(LOCALIZED_TEXT.directFeedbackSuggestion),
      ),
      E.div(
        {
          class: "feedback-line",
          style: `display: flex; flex-flow: row nowrap; width: 100%; justify-content: center; padding-bottom: 6rem;`,
        },
        E.div({ style: "flex: 2;" }),
        E.div(
          { class: "feedback-label", style: LABEL_STYLE },
          E.text(LOCALIZED_TEXT.feedbackInputLabel),
        ),
        E.textareaRef(this.textarea, {
          class: "feedback-textarea",
          style: `${INPUT_STYLE} min-height: 3rem; resize: vertical;`,
        }),
        E.div({ style: "flex: 2;" }),
      ),
      E.div(
        {
          class: "feedback-line",
          style: `display: flex; flex-flow: row nowrap; width: 100%; align-items: center; justify-content: center; padding-bottom: 6rem;`,
        },
        E.div({ style: "flex: 2;" }),
        E.div(
          { class: "feedback-label", style: LABEL_STYLE },
          E.text(LOCALIZED_TEXT.emailInputLabel),
        ),
        E.inputRef(this.input, {
          class: "feedback-input",
          placeholder: LOCALIZED_TEXT.emailInputPlaceholder,
          style: INPUT_STYLE,
        }),
        E.div({ style: "flex: 2;" }),
      ),
      assign(
        this.submitButton,
        FilledBlockingButton.create("")
          .append(E.text(LOCALIZED_TEXT.submitFeedbackButton))
          .enable(),
      ).body,
    );

    this.submitButton.val.on("action", () => this.submit());
  }

  private async submit(): Promise<void> {
    await reportUserIssue(this.serviceClient, {
      userIssue: {
        email: this.input.val.value,
        description: this.textarea.val.value,
      },
    });
  }

  public remove(): void {
    this.body.remove();
  }
}
