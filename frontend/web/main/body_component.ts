import EventEmitter = require("events");
import { ENV_VARS } from "../../../env_vars";
import { TEXT_BUTTON_STYLE } from "../../button_styles";
import { newSignInRequest } from "../../client_requests";
import { BLUE, ColorScheme, ORANGE } from "../../color_scheme";
import {
  GOOGLE_BUTTON_BACKGROUND_COLOR,
  GOOGLE_BUTTON_TEXT_COLOR,
  createGoogleIcon,
} from "../../common/google_button";
import { getGoogleOauthUrl } from "../../common/oauth_helper";
import { FONT_M } from "../../font_sizes";
import { BodyRl, Page } from "./body_rl";
import { SIDE_PADDING } from "./common_style";
import { HistoryPage } from "./history_page";
import { HomePage } from "./home_page";
import { LOCAL_SESSION_STORAGE } from "./local_session_storage";
import { LOCALIZED_TEXT } from "./locales/localized_text";
import { NicknamePage } from "./nickname_page";
import { SERVICE_CLIENT } from "./service_client";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { TabsSwitcher } from "@selfage/tabs/switcher";
import { WebServiceClient } from "@selfage/web_service_client";
import { LocalSessionStorage } from "@selfage/web_service_client/local_session_storage";

export interface BodyComponent {
  on(event: "newRl", listener: (newRl: BodyRl) => void): this;
}

export class BodyComponent extends EventEmitter {
  public static create(): BodyComponent {
    return new BodyComponent(
      HomePage.create,
      NicknamePage.create,
      HistoryPage.create,
      LOCAL_SESSION_STORAGE,
      SERVICE_CLIENT,
      window,
    );
  }

  public body: HTMLDivElement;
  private logo = new Ref<HTMLDivElement>();
  public signInButton = new Ref<HTMLDivElement>();
  private signedInButtonsContainer = new Ref<HTMLDivElement>();
  public nicknameButton = new Ref<HTMLDivElement>();
  public historyButton = new Ref<HTMLDivElement>();
  public signOutButton = new Ref<HTMLDivElement>();
  private tabsContainer = new Ref<HTMLDivElement>();
  private pageSwitcher = new TabsSwitcher();
  private homePage: HomePage;
  private nicknamePage: NicknamePage;
  private historyPage: HistoryPage;

  public constructor(
    private createHomagePage: () => HomePage,
    private createNicknamePage: () => NicknamePage,
    private createHistoryPage: () => HistoryPage,
    private localSessionStorage: LocalSessionStorage,
    private serviceClient: WebServiceClient,
    private window: Window,
  ) {
    super();
    this.body = E.div(
      {
        class: "body",
        style: `display: flex; flex-flow: column nowrap; min-height: 100vh; background-color: ${ColorScheme.getBackground()};`,
      },
      E.div(
        {
          class: "body-header",
          style: `display: flex; flex-flow: row nowrap; align-items: center; padding: .5rem ${SIDE_PADDING}rem; border-bottom: .0625rem solid ${ColorScheme.getBlockSeparator()};`,
        },
        E.div(
          {
            ref: this.logo,
            class: "body-logo",
            style: `font-size: 2rem; font-weight: bold; font-family: Comic Sans MS, cursive, sans-serif; cursor: pointer;`,
          },
          E.div(
            {
              class: "body-logo-left",
              style: `display: inline; color: ${ORANGE};`,
            },
            E.text("Dan"),
          ),
          E.div(
            {
              class: "body-logo-right",
              style: `display: inline; color: ${BLUE};`,
            },
            E.text("Mage"),
          ),
        ),
        E.div({ style: `flex: 1;` }),
        E.div(
          {
            ref: this.signInButton,
            class: "body-header-sign-in-button",
            style: `display: flex; flex-flow: row nowrap; align-items: center; background-color: ${GOOGLE_BUTTON_BACKGROUND_COLOR}; cursor: pointer;`,
          },
          createGoogleIcon(),
          E.div(
            {
              class: "body-header-sign-in-text",
              style: `padding: 0 .5rem; font-size: ${FONT_M}rem; color: ${GOOGLE_BUTTON_TEXT_COLOR};`,
            },
            E.text(LOCALIZED_TEXT.signInButton),
          ),
        ),
        E.div(
          {
            ref: this.signedInButtonsContainer,
            class: "body-header-signed-in-tab-buttons-container",
            style: `display: flex; flex-flow: row nowrap; align-items: center;`,
          },
          E.div(
            {
              ref: this.nicknameButton,
              class: "body-header-nickname-button",
              style: `${TEXT_BUTTON_STYLE} margin-right: 1.25rem;`,
            },
            E.text(LOCALIZED_TEXT.nicknameTab),
          ),
          E.div(
            {
              ref: this.historyButton,
              class: "body-header-history-button",
              style: `${TEXT_BUTTON_STYLE} margin-right: 1.25rem;`,
            },
            E.text(LOCALIZED_TEXT.historyTab),
          ),
          E.div(
            {
              ref: this.signOutButton,
              class: "body-header-sign-out-button",
              style: TEXT_BUTTON_STYLE,
            },
            E.text(LOCALIZED_TEXT.signOutButton),
          ),
        ),
      ),
      E.div({
        ref: this.tabsContainer,
        class: "body-tab-container",
        style: "flex: 1;",
      }),
      E.div(
        {
          class: "body-footer",
          style: `display: flex; flex-flow: row nowrap; align-items: center; justify-content: center; padding: 1.25rem 0; border-top: .0625rem solid ${ColorScheme.getBlockSeparator()};`,
        },
        E.a(
          {
            class: "body-terms-button",
            style: `${TEXT_BUTTON_STYLE} color: ${ColorScheme.getContent()};`,
            href: "/terms",
            target: "_blank",
          },
          E.text(LOCALIZED_TEXT.termsTab),
        ),
        E.div({
          style: `height: 1.25rem; margin: 0 .125rem; width: .0625rem; background-color: ${ColorScheme.getBlockSeparator()}`,
        }),
        E.a(
          {
            class: "body-privacy-button",
            style: `${TEXT_BUTTON_STYLE} color: ${ColorScheme.getContent()};`,
            href: "/privacy",
            target: "_blank",
          },
          E.text(LOCALIZED_TEXT.privacyTab),
        ),
        E.div({
          style: `height: 1.25rem; margin: 0 .125rem; width: .0625rem; background-color: ${ColorScheme.getBlockSeparator()};`,
        }),
        E.a(
          {
            class: "body-feedback-button",
            style: `${TEXT_BUTTON_STYLE} color: ${ColorScheme.getContent()};`,
            href: ENV_VARS.feedbackLink,
            target: "_blank",
          },
          E.text(LOCALIZED_TEXT.feedbackTab),
        ),
      ),
    );
    if (!this.localSessionStorage.read()) {
      this.showSignInButton();
    } else {
      this.showSignedInButtonsContainer();
    }

    this.logo.val.addEventListener("click", () =>
      this.pushRl({ page: Page.HOME }),
    );
    this.nicknameButton.val.addEventListener("click", () =>
      this.pushRl({
        page: Page.NICKNAME,
      }),
    );
    this.historyButton.val.addEventListener("click", () =>
      this.pushRl({ page: Page.HISTORY }),
    );

    this.signInButton.val.addEventListener("click", () => this.signIn());
    this.signOutButton.val.addEventListener("click", () => this.signOut());

    this.window.addEventListener("message", (event) =>
      this.handleMessage(event),
    );
    this.serviceClient.on("unauthenticated", () => this.showSignInButton());
  }

  private pushRl(rl: BodyRl): void {
    this.emit("newRl", rl);
    this.applyRl(rl);
  }

  public applyRl(newRl?: BodyRl): void {
    if (!newRl) {
      newRl = {};
    }
    if (!newRl.page) {
      newRl.page = Page.HOME;
    }
    switch (newRl.page) {
      case Page.HOME:
        if (!this.homePage) {
          this.pageSwitcher.show(
            () => this.addHomePage(),
            () => this.removeHomePage(),
          );
        }
        break;
      case Page.NICKNAME:
        if (!this.nicknamePage) {
          this.pageSwitcher.show(
            () => this.addNicknamePage(),
            () => this.removeNicknamePage(),
          );
        }
        break;
      case Page.HISTORY:
        if (!this.historyPage) {
          this.pageSwitcher.show(
            () => this.addHistoryPage(),
            () => this.removeHistoryPage(),
          );
        }
        break;
    }
  }

  private addHomePage(): void {
    this.homePage = this.createHomagePage();
    this.tabsContainer.val.append(this.homePage.body);
  }

  private removeHomePage(): void {
    this.homePage.remove();
    this.homePage = undefined;
  }

  private addNicknamePage(): void {
    this.nicknamePage = this.createNicknamePage();
    this.tabsContainer.val.append(this.nicknamePage.body);
  }

  private removeNicknamePage(): void {
    this.nicknamePage.remove();
    this.nicknamePage = undefined;
  }

  private addHistoryPage(): void {
    this.historyPage = this.createHistoryPage();
    this.tabsContainer.val.append(this.historyPage.body);
  }

  private removeHistoryPage(): void {
    this.historyPage.remove();
    this.historyPage = undefined;
  }

  private showSignInButton(): void {
    this.signInButton.val.style.display = "flex";
    this.signedInButtonsContainer.val.style.display = "none";
  }

  private showSignedInButtonsContainer(): void {
    this.signInButton.val.style.display = "none";
    this.signedInButtonsContainer.val.style.display = "flex";
  }

  private signIn(): void {
    this.window.open(getGoogleOauthUrl(`${this.window.origin}/oauth_callback`));
  }

  private signOut(): void {
    this.localSessionStorage.clear();
    this.showSignInButton();
  }

  private async handleMessage(event: MessageEvent): Promise<void> {
    if (event.origin !== this.window.origin || !event.data) {
      return;
    }

    let accessToken = event.data;
    let response = await this.serviceClient.send(
      newSignInRequest({
        googleAccessToken: accessToken,
      }),
    );
    this.localSessionStorage.save(response.signedSession);
    this.showSignedInButtonsContainer();
  }

  public remove(): void {
    this.body.remove();
  }
}
