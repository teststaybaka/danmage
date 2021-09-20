import EventEmitter = require("events");
import {
  GET_USER,
  GetUserRequest,
  GetUserResponse,
} from "../../../../interface/service";
import { FillButtonComponent } from "../../../button_component";
import { ColorScheme } from "../../../color_scheme";
import { BackgroundRequest } from "../../interface/background_service";
import { ChromeRuntime } from "../chrome_runtime";
import { SERVICE_CLIENT } from "../service_client";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { ServiceClient } from "@selfage/service_client";

export interface WelcomeComponent {
  on(event: "signOut", listener: () => Promise<void> | void): this;
}

export class WelcomeComponent extends EventEmitter {
  private displayStyle: string;

  public constructor(
    public body: HTMLDivElement,
    private welcomeText: Text,
    private signOutButton: FillButtonComponent,
    private chromeRuntime: ChromeRuntime,
    private serviceClient: ServiceClient
  ) {
    super();
  }

  public static create(): WelcomeComponent {
    return new WelcomeComponent(
      ...WelcomeComponent.createView(
        FillButtonComponent.create(E.text("Sign out"))
      ),
      ChromeRuntime.create(),
      SERVICE_CLIENT
    ).init();
  }

  public static createView(signOutButton: FillButtonComponent) {
    let welcomeTextRef = new Ref<Text>();
    let body = E.div(
      `class="welcome-container" style="display: flex; ` +
        `flex-flow: column nowrap; justify-content: center; ` +
        `align-items: center; width: 100%; height: 100%;"`,
      E.div(
        `class="welcome-text" style="font-size: 1.4rem; ` +
          `font-family: initial !important; margin-bottom: 2rem; ` +
          `color: ${ColorScheme.getContent()};"`,
        E.textRef(welcomeTextRef)
      ),
      E.div(
        `class="welcome-promo" style="font-size: 1.4rem; ` +
          `font-family: initial !important; margin-bottom: 2rem; ` +
          `color: ${ColorScheme.getContent()};"`,
        E.text("Your settings are being synced via "),
        E.a(
          `class="weclome-promo-link" style="` +
            `color: ${ColorScheme.getLinkContent()};" ` +
            `href="https://www.danmage.com" target="_blank"`,
          E.text("www.danmage.com")
        ),
        E.text(".")
      ),
      signOutButton.body
    );
    return [body, welcomeTextRef.val, signOutButton] as const;
  }

  public init(): this {
    this.displayStyle = this.body.style.display;
    this.signOutButton.on("click", () => this.signOut());
    return this;
  }

  private async signOut(): Promise<void> {
    let request: BackgroundRequest = { signOutRequest: {} };
    await this.chromeRuntime.sendMessage(request);
    await Promise.all(this.listeners("signOut").map((callback) => callback()));
  }

  public async show(): Promise<void> {
    this.body.style.display = this.displayStyle;
    let response = await this.serviceClient.fetchAuthed<
      GetUserRequest,
      GetUserResponse
    >({}, GET_USER);
    if (response.user.nickname) {
      this.welcomeText.textContent = `Welcome, ${response.user.nickname}!`;
    } else {
      this.welcomeText.textContent = "Welcome!";
    }
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
