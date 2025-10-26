import EventEmitter = require("events");
import { ENV_VARS } from "../../../../env_vars";
import { FILLED_BUTTON_STYLE } from "../../../button_styles";
import { newGetUserRequest } from "../../../client_requests";
import { ColorScheme } from "../../../color_scheme";
import { FONT_M } from "../../../font_sizes";
import { SERVICE_CLIENT } from "../common/service_client";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { WebServiceClient } from "@selfage/web_service_client";

export interface WelcomeTab {
  on(event: "signOut", listener: () => void): this;
}

export class WelcomeTab extends EventEmitter {
  public static create(): WelcomeTab {
    return new WelcomeTab(SERVICE_CLIENT);
  }

  public body: HTMLDivElement;
  private welcomeText = new Ref<HTMLDivElement>();
  public signOutButton = new Ref<HTMLDivElement>();

  public constructor(private serviceClient: WebServiceClient) {
    super();
    this.body = E.div(
      {
        class: "welcome-container",
        style: `display: flex; flex-flow: column nowrap; justify-content: center; align-items: center; width: 100%; height: 100%;`,
      },
      E.div({
        ref: this.welcomeText,
        class: "welcome-text",
        style: `font-size: ${FONT_M}px; line-height: 140%; font-family: initial !important; margin-bottom: 20px; color: ${ColorScheme.getContent()}; text-align: center;`,
      }),
      E.div(
        {
          class: "welcome-promo",
          style: `font-size: ${FONT_M}px; line-height: 140%; font-family: initial !important; margin-bottom: 20px; color: ${ColorScheme.getContent()}; text-align: center;`,
        },
        E.text(chrome.i18n.getMessage("firstExplanation")),
        E.a(
          {
            class: "weclome-promo-link",
            style: `color: ${ColorScheme.getLinkContent()};`,
            href: ENV_VARS.externalOrigin,
            target: "_blank",
          },
          E.text(ENV_VARS.externalDomain),
        ),
        E.text(chrome.i18n.getMessage("secondExplanation")),
      ),
      E.div(
        {
          ref: this.signOutButton,
          class: "welcome-sign-out",
          style: FILLED_BUTTON_STYLE,
        },
        E.text(chrome.i18n.getMessage("signOutButton")),
      ),
    );
    this.load();

    this.signOutButton.val.addEventListener("click", () =>
      this.emit("signOut"),
    );
  }

  private async load(): Promise<void> {
    this.welcomeText.val.textContent = chrome.i18n.getMessage("welcomeMessage");
    let response = await this.serviceClient.send(newGetUserRequest({}));
    if (response.user.nickname) {
      this.welcomeText.val.textContent =
        chrome.i18n.getMessage("welcomeWithNameMessage") +
        response.user.nickname +
        chrome.i18n.getMessage("welcomeWithNameEndingMessage");
    }
  }

  public remove(): void {
    this.body.remove();
  }
}
