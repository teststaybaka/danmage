import EventEmitter = require("events");
import {
  GET_USER,
  GetUserRequest,
  GetUserResponse,
} from "../../../../interface/service";
import { FillButtonComponent } from "../../../button_component";
import { ColorScheme } from "../../../color_scheme";
import {
  CHROME_SESSION_STORAGE,
  ChromeSessionStorage,
} from "../../common/chrome_session_storage";
import { SERVICE_CLIENT } from "../../common/service_client";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { ServiceClient } from "@selfage/service_client";

export interface WelcomeComponent {
  on(event: "signOut", listener: () => Promise<void> | void): this;
}

export class WelcomeComponent extends EventEmitter {
  public body: HTMLDivElement;
  private welcomeText: Text;
  private displayStyle: string;

  public constructor(
    private signOutButton: FillButtonComponent,
    private serviceClient: ServiceClient,
    private chromeSessionStorage: ChromeSessionStorage
  ) {
    super();
    let welcomeTextRef = new Ref<Text>();
    this.body = E.div(
      {
        class: "welcome-container",
        style: `display: flex; flex-flow: column nowrap; justify-content: center; align-items: center; width: 100%; height: 100%;`,
      },
      E.div(
        {
          class: "welcome-text",
          style: `font-size: 1.4rem; line-height: 140%; font-family: initial !important; margin-bottom: 2rem; color: ${ColorScheme.getContent()}; text-align: center;`,
        },
        E.textRef(welcomeTextRef)
      ),
      E.div(
        {
          class: "welcome-promo",
          style: `font-size: 1.4rem; line-height: 140%; font-family: initial !important; margin-bottom: 2rem; color: ${ColorScheme.getContent()}; text-align: center;`,
        },
        E.text(chrome.i18n.getMessage("firstExplanation")),
        E.a(
          {
            class: "weclome-promo-link",
            style: `color: ${ColorScheme.getLinkContent()};`,
            href: "https://www.danmage.com",
            target: "_blank",
          },
          E.text("www.danmage.com")
        ),
        E.text(chrome.i18n.getMessage("secondExplanation"))
      ),
      signOutButton.body
    );
    this.welcomeText = welcomeTextRef.val;
  }

  public static create(): WelcomeComponent {
    return new WelcomeComponent(
      FillButtonComponent.create(
        E.text(chrome.i18n.getMessage("signOutButton"))
      ),
      SERVICE_CLIENT,
      CHROME_SESSION_STORAGE
    ).init();
  }

  public init(): this {
    this.displayStyle = this.body.style.display;
    this.signOutButton.on("click", () => this.signOut());
    return this;
  }

  private async signOut(): Promise<void> {
    await this.chromeSessionStorage.clear();
    await Promise.all(this.listeners("signOut").map((callback) => callback()));
  }

  public async show(): Promise<void> {
    this.body.style.display = this.displayStyle;
    this.welcomeText.textContent = chrome.i18n.getMessage("welcomeMessage");
    let response = await this.serviceClient.fetchAuthed<
      GetUserRequest,
      GetUserResponse
    >({}, GET_USER);
    if (response.user.nickname) {
      this.welcomeText.textContent =
        chrome.i18n.getMessage("welcomeWithNameMessage") +
        response.user.nickname +
        chrome.i18n.getMessage("welcomeWithNameEndingMessage");
    }
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
