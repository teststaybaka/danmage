import {
  CHROME_SESSION_STORAGE,
  ChromeSessionStorage,
} from "../../common/chrome_session_storage";
import { SERVICE_CLIENT } from "../../common/service_client";
import { TAB_SIDE_PADDING } from "../common/styles";
import { SignInComponent } from "./sign_in_component";
import { WelcomeComponent } from "./welcome_component";
import { E } from "@selfage/element/factory";
import { ServiceClient } from "@selfage/service_client";

export class AccountTabComponent {
  public body: HTMLDivElement;

  public constructor(
    private signInComponent: SignInComponent,
    private welcomeComponent: WelcomeComponent,
    private serviceClient: ServiceClient,
    private chromeSessionStorage: ChromeSessionStorage
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
      SERVICE_CLIENT,
      CHROME_SESSION_STORAGE
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

    let session = await this.chromeSessionStorage.read();
    if (!session) {
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
