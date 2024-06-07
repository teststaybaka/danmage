import EventEmitter = require("events");
import { TEXT_BUTTON_STYLE } from "../../button_styles";
import { signIn } from "../../client_requests";
import { BLUE, ColorScheme, ORANGE } from "../../color_scheme";
import {
  GOOGLE_BUTTON_BACKGROUND_COLOR,
  GOOGLE_BUTTON_TEXT_COLOR,
  createGoogleIcon,
} from "../../common/google_button";
import { getGoogleOauthUrl } from "../../common/oauth_helper";
import { FONT_M } from "../../font_sizes";
import { BodyState, Page } from "./body_state";
import { SIDE_PADDING } from "./common_style";
import { FeedbackPage } from "./feedback_page";
import { HistoryPage } from "./history_page";
import { HomePage } from "./home_page";
import { LOCAL_SESSION_STORAGE } from "./local_session_storage";
import { LOCALIZED_TEXT } from "./locales/localized_text";
import { NicknamePage } from "./nickname_page";
import { SERVICE_CLIENT } from "./service_client";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";
import { TabNavigator } from "@selfage/tabs/navigator";
import { WebServiceClient } from "@selfage/web_service_client";
import { LocalSessionStorage } from "@selfage/web_service_client/local_session_storage";

export interface BodyComponent {
  on(event: "newState", listener: (newState: BodyState) => void): this;
}

export class BodyComponent extends EventEmitter {
  public static create(origin: string): BodyComponent {
    return new BodyComponent(
      HomePage.create,
      NicknamePage.create,
      HistoryPage.create,
      FeedbackPage.create,
      origin,
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
  public termsButton = new Ref<HTMLDivElement>();
  public privacyButton = new Ref<HTMLDivElement>();
  public feedbackButton = new Ref<HTMLDivElement>();
  private homePage: HomePage;
  private nicknamePage: NicknamePage;
  private historyPage: HistoryPage;
  private feedbackPage: FeedbackPage;
  private pageNavigator: TabNavigator<Page>;
  private bodyState: BodyState;

  public constructor(
    private createHomagePage: () => HomePage,
    private createNicknamePage: () => NicknamePage,
    private createHistoryPage: () => HistoryPage,
    private createFeedbackPage: () => FeedbackPage,
    private origin: string,
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
          style: `display: flex; flex-flow: row nowrap; align-items: center; padding: 1rem ${SIDE_PADDING}rem; border-bottom: .1rem solid ${ColorScheme.getBlockSeparator()};`,
        },
        E.divRef(
          this.logo,
          {
            class: "body-logo",
            style: `font-size: 3rem; font-weight: bold; font-family: Comic Sans MS, cursive, sans-serif; cursor: pointer;`,
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
        E.divRef(
          this.signInButton,
          {
            class: "body-header-sign-in-button",
            style: `display: flex; flex-flow: row nowrap; align-items: center; background-color: ${GOOGLE_BUTTON_BACKGROUND_COLOR}; cursor: pointer;`,
          },
          createGoogleIcon(),
          E.div(
            {
              class: "body-header-sign-in-text",
              style: `padding: 0 .8rem; font-size: ${FONT_M}rem; color: ${GOOGLE_BUTTON_TEXT_COLOR};`,
            },
            E.text(LOCALIZED_TEXT.signInButton),
          ),
        ),
        E.divRef(
          this.signedInButtonsContainer,
          {
            class: "body-header-signed-in-tab-buttons-container",
            style: `display: flex; flex-flow: row nowrap; align-items: center;`,
          },
          E.divRef(
            this.nicknameButton,
            {
              class: "body-header-nickname-button",
              style: `${TEXT_BUTTON_STYLE} margin-right: 2rem;`,
            },
            E.text(LOCALIZED_TEXT.nicknameTab),
          ),
          E.divRef(
            this.historyButton,
            {
              class: "body-header-history-button",
              style: `${TEXT_BUTTON_STYLE} margin-right: 2rem;`,
            },
            E.text(LOCALIZED_TEXT.historyTab),
          ),
          E.divRef(
            this.signOutButton,
            {
              class: "body-heaer-history-button-wrapper",
              style: TEXT_BUTTON_STYLE,
            },
            E.text(LOCALIZED_TEXT.signOutButton),
          ),
        ),
      ),
      E.divRef(this.tabsContainer, {
        class: "body-tab-container",
        style: "flex: 1;",
      }),
      E.div(
        {
          class: "body-footer",
          style: `display: flex; flex-flow: row nowrap; align-items: center; justify-content: center; padding: 2rem 0; border-top: .1rem solid ${ColorScheme.getBlockSeparator()};`,
        },
        E.divRef(
          this.termsButton,
          {
            class: "body-terms-button",
            style: TEXT_BUTTON_STYLE,
          },
          E.text(LOCALIZED_TEXT.termsTab),
        ),
        E.div({
          style: `height: 2rem; margin: 0 .2rem; width: .1rem; background-color: ${ColorScheme.getBlockSeparator()}`,
        }),
        E.divRef(
          this.privacyButton,
          {
            class: "body-privacy-button",
            style: TEXT_BUTTON_STYLE,
          },
          E.text(LOCALIZED_TEXT.privacyTab),
        ),
        E.div({
          style: `height: 2rem; margin: 0 .2rem; width: .1rem; background-color: ${ColorScheme.getBlockSeparator()};`,
        }),
        E.divRef(
          this.feedbackButton,
          {
            class: "body-feedback-button",
            style: TEXT_BUTTON_STYLE,
          },
          E.text(LOCALIZED_TEXT.feedbackTab),
        ),
      ),
    );
    this.pageNavigator = new TabNavigator(
      (page) => this.addPage(page),
      (page) => this.removePage(page),
    );
    if (!this.localSessionStorage.read()) {
      this.showSignInButton();
    } else {
      this.showSignedInButtonsContainer();
    }

    this.logo.val.addEventListener("click", () => this.gotoPage(Page.HOME));
    this.nicknameButton.val.addEventListener("click", () =>
      this.gotoPage(Page.NICKNAME),
    );
    this.historyButton.val.addEventListener("click", () =>
      this.gotoPage(Page.HISTORY),
    );
    this.feedbackButton.val.addEventListener("click", () =>
      this.gotoPage(Page.FEEDBACK),
    );
    this.termsButton.val.addEventListener("click", () => this.gotoTerms());
    this.privacyButton.val.addEventListener("click", () => this.gotoPrivacy());

    this.signInButton.val.addEventListener("click", () => this.signIn());
    this.signOutButton.val.addEventListener("click", () => this.signOut());

    this.window.addEventListener("message", (event) =>
      this.handleMessage(event),
    );
    this.serviceClient.on("unauthenticated", () => this.showSignInButton());
  }

  private addPage(page: Page): void {
    switch (page) {
      case Page.HOME:
        this.homePage = this.createHomagePage();
        this.tabsContainer.val.append(this.homePage.body);
        break;
      case Page.NICKNAME:
        this.nicknamePage = this.createNicknamePage();
        this.tabsContainer.val.append(this.nicknamePage.body);
        break;
      case Page.HISTORY:
        this.historyPage = this.createHistoryPage();
        this.tabsContainer.val.append(this.historyPage.body);
        break;
      case Page.FEEDBACK:
        this.feedbackPage = this.createFeedbackPage();
        this.tabsContainer.val.append(this.feedbackPage.body);
        break;
    }
  }

  private removePage(page: Page): void {
    switch (page) {
      case Page.HOME:
        this.homePage.remove();
        break;
      case Page.NICKNAME:
        this.nicknamePage.remove();
        break;
      case Page.HISTORY:
        this.historyPage.remove();
        break;
      case Page.FEEDBACK:
        this.feedbackPage.remove();
        break;
    }
  }

  public updateState(newState?: BodyState): void {
    if (!newState) {
      newState = {};
    }
    if (!newState.page) {
      newState.page = Page.HOME;
    }
    this.bodyState = newState;
    this.pageNavigator.goTo(this.bodyState.page);
  }

  private gotoPage(page: Page): void {
    this.bodyState.page = page;
    this.pageNavigator.goTo(this.bodyState.page);
    this.emit("newState", this.bodyState);
  }

  private gotoTerms(): void {
    this.window.location.href = "/terms";
  }

  private gotoPrivacy(): void {
    this.window.location.href = "/privacy";
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
    if (event.origin !== this.origin || !event.data) {
      return;
    }

    let accessToken = event.data;
    let response = await signIn(this.serviceClient, {
      googleAccessToken: accessToken,
    });
    this.localSessionStorage.save(response.signedSession);
    this.showSignedInButtonsContainer();
  }

  public remove(): void {
    this.body.remove();
  }
}
