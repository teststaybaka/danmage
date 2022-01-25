import {
  BackgroundRequest,
  GET_SESSION_RESPONSE,
} from "../../interface/background_service";
import { ChromeRuntime } from "../common/chrome_runtime";
import { SERVICE_CLIENT } from "../common/service_client";
import { TAB_SIDE_PADDING } from "../common/styles";
import { SignInComponent } from "./sign_in_component";
import { WelcomeComponent } from "./welcome_component";
import { E } from "@selfage/element/factory";
import { parseMessage } from "@selfage/message/parser";
import { ServiceClient } from "@selfage/service_client";

export class AccountTabComponent {
  public body: HTMLDivElement;

  public constructor(
    private signInComponent: SignInComponent,
    private welcomeComponent: WelcomeComponent,
    private chromeRuntime: ChromeRuntime,
    private serviceClient: ServiceClient
  ) {
    this.body = E.div(
      {
        class: "account-tab",
        style: `padding: 0 ${TAB_SIDE_PADDING}; box-sizing: border-box; width: 100%; height: 100%;`,
      },
      signInComponent.body,
      welcomeComponent.body
    );
  }

  public static create(): AccountTabComponent {
    return new AccountTabComponent(
      SignInComponent.create(),
      WelcomeComponent.create(),
      ChromeRuntime.create(),
      SERVICE_CLIENT
    ).init();
  }

  public init(): this {
    this.signInComponent.on("checkStatus", () => this.checkStatus());
    this.welcomeComponent.on("signOut", () => this.showSignIn());
    this.serviceClient.on("unauthenticated", () => this.showSignIn());
    return this;
  }

  private async checkStatus(): Promise<void> {
    this.signInComponent.hide();
    this.welcomeComponent.hide();
    let request: BackgroundRequest = { getSessionRequest: {} };
    let rawResponse = await this.chromeRuntime.sendMessage(request);
    let response = parseMessage(rawResponse, GET_SESSION_RESPONSE);
    if (!response.signedSession) {
      this.signInComponent.show();
    } else {
      await this.welcomeComponent.show();
    }
  }

  private showSignIn(): void {
    this.welcomeComponent.hide();
    this.signInComponent.show();
  }

  public async show(): Promise<void> {
    await this.checkStatus();
    this.body.style.display = "block";
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
