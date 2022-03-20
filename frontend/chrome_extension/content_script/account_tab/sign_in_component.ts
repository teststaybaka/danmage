import EventEmitter = require("events");
import { SIGN_IN } from "../../../../interface/service";
import { FillButtonComponent } from "../../../button_component";
import { ColorScheme } from "../../../color_scheme";
import {
  CHROME_SESSION_STORAGE,
  ChromeSessionStorage,
} from "../../common/chrome_session_storage";
import { SERVICE_CLIENT } from "../../common/service_client";
import { GET_AUTH_TOKEN_RESPONSE } from "../../interface/background_service";
import {
  BACKGROUND_SERVICE_CLIENT,
  BackgroungServiceClient,
} from "../common/background_service_client";
import { E } from "@selfage/element/factory";
import { parseMessage } from "@selfage/message/parser";
import { ServiceClient } from "@selfage/service_client";

export interface SignInComponent {
  on(event: "checkStatus", listener: () => Promise<void> | void): this;
}

export class SignInComponent extends EventEmitter {
  public body: HTMLDivElement;
  private displayStyle: string;

  public constructor(
    private button: FillButtonComponent,
    private serviceClient: ServiceClient,
    private chromeSessionStoroage: ChromeSessionStorage,
    private backgroundServiceClient: BackgroungServiceClient
  ) {
    super();
    this.body = E.div(
      {
        class: "sign-in-container",
        style: `display: flex; flex-flow: column nowrap; justify-content: center; align-items: center; height: 100%;`,
      },
      E.div(
        {
          class: "sign-in-text",
          style: `font-size: 1.4rem; line-height: 140%; font-family: initial !important; text-align: center; margin-bottom: 2rem; color: ${ColorScheme.getContent()};`,
        },
        E.text(chrome.i18n.getMessage("firstSignInReminder")),
        E.a(
          {
            class: "sign-in-link",
            style: `color: ${ColorScheme.getLinkContent()};`,
            href: "https://www.danmage.com",
            target: "_blank",
          },
          E.text("www.danmage.com")
        ),
        E.text(chrome.i18n.getMessage("secondSignInReminder"))
      ),
      button.body
    );
  }

  public static create(): SignInComponent {
    return new SignInComponent(
      FillButtonComponent.create(
        E.text(chrome.i18n.getMessage("signInButton"))
      ),
      SERVICE_CLIENT,
      CHROME_SESSION_STORAGE,
      BACKGROUND_SERVICE_CLIENT
    ).init();
  }

  public init(): this {
    this.displayStyle = this.body.style.display;
    this.button.on("click", () => this.signIn());
    return this;
  }

  private async signIn(): Promise<void> {
    let response = await this.backgroundServiceClient.send({
      getAuthTokenRequest: {},
    });
    let getAuthTokenResponse = parseMessage(response, GET_AUTH_TOKEN_RESPONSE);
    if (!getAuthTokenResponse.accessToken) {
      return;
    }

    let signInResponse = await this.serviceClient.fetchUnauthed(
      { googleAccessToken: getAuthTokenResponse.accessToken },
      SIGN_IN
    );
    await this.chromeSessionStoroage.save(signInResponse.signedSession);
    await Promise.all(
      this.listeners("checkStatus").map((callback) => callback())
    );
  }

  public show(): void {
    this.body.style.display = this.displayStyle;
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
