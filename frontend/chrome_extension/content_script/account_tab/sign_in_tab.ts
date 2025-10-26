import EventEmitter = require("events");
import { ENV_VARS } from "../../../../env_vars";
import { BlockingButton } from "../../../blocking_button";
import { newSignInRequest } from "../../../client_requests";
import { ColorScheme } from "../../../color_scheme";
import { FONT_M } from "../../../font_sizes";
import { GET_AUTH_TOKEN_RESPONSE } from "../../interface/background_service";
import {
  BACKGROUND_SERVICE_CLIENT,
  BackgroungServiceClient,
} from "../common/background_service_client";
import { LOCAL_SESSION_STORAGE } from "../common/local_session_storage";
import { SERVICE_CLIENT } from "../common/service_client";
import { GoogleSignInBlockingButton } from "./google_sign_in_blocking_button";
import { E } from "@selfage/element/factory";
import { parseMessage } from "@selfage/message/parser";
import { Ref, assign } from "@selfage/ref";
import { WebServiceClient } from "@selfage/web_service_client";
import { LocalSessionStorage } from "@selfage/web_service_client/local_session_storage";

export interface SignInTab {
  on(event: "checkStatus", listener: () => void): this;
}

export class SignInTab extends EventEmitter {
  public static create(): SignInTab {
    return new SignInTab(
      SERVICE_CLIENT,
      LOCAL_SESSION_STORAGE,
      BACKGROUND_SERVICE_CLIENT,
    );
  }

  public body: HTMLDivElement;
  private signInButton = new Ref<BlockingButton>();

  public constructor(
    private serviceClient: WebServiceClient,
    private localSessionStorage: LocalSessionStorage,
    private backgroundServiceClient: BackgroungServiceClient,
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
          style: `font-size: ${FONT_M}px; line-height: 140%; font-family: initial !important; text-align: center; margin-bottom: 20px; color: ${ColorScheme.getContent()};`,
        },
        E.text(chrome.i18n.getMessage("firstSignInReminder")),
        E.a(
          {
            class: "sign-in-link",
            style: `color: ${ColorScheme.getLinkContent()};`,
            href: ENV_VARS.externalOrigin,
            target: "_blank",
          },
          E.text(ENV_VARS.externalDomain),
        ),
        E.text(chrome.i18n.getMessage("secondSignInReminder")),
      ),
      assign(this.signInButton, GoogleSignInBlockingButton.create().enable())
        .body,
    );

    this.signInButton.val.on("action", () => this.signIn());
  }

  private async signIn(): Promise<void> {
    let response = await this.backgroundServiceClient.send({
      getAuthTokenRequest: {},
    });
    let getAuthTokenResponse = parseMessage(response, GET_AUTH_TOKEN_RESPONSE);
    if (!getAuthTokenResponse.accessToken) {
      return;
    }

    let signInResponse = await this.serviceClient.send(
      newSignInRequest({
        googleAccessToken: getAuthTokenResponse.accessToken,
      }),
    );
    this.localSessionStorage.save(signInResponse.signedSession);
    this.emit("checkStatus");
  }

  public remove(): void {
    this.body.remove();
  }
}
