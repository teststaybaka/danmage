import EventEmitter = require("events");
import { TEXT_BUTTON_STYLE } from "../../button_styles";
import { signIn } from "../../client_requests";
import { BLUE, ColorScheme, ORANGE } from "../../color_scheme";
import { FONT_M } from "../../font_sizes";
import { PageNavigator } from "../../page_navigator";
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
  private pageNavigator: PageNavigator<Page>;
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
    let googleIconSvgRef = new Ref<SVGSVGElement>();
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
            style: `display: flex; flex-flow: row nowrap; align-items: center; background-color: #4285F4; cursor: pointer;`,
          },
          E.svgRef(googleIconSvgRef, {
            class: "body-header-google-icon",
            style: `width: 4rem; height: 4rem; background-color: white;`,
            viewBox: "3 3 40 40",
          }),
          E.div(
            {
              class: "body-header-sign-in-text",
              style: `padding: 0 .8rem; font-size: ${FONT_M}rem; color: white;`,
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
    googleIconSvgRef.val.innerHTML = `<!-- Generator: Sketch 3.3.3 (12081) - http://www.bohemiancoding.com/sketch -->
    <title>btn_google_dark_normal_ios</title>
    <desc>Created with Sketch.</desc>
    <defs>
        <filter x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox" id="filter-1">
            <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/>
            <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"/>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.168 0" in="shadowBlurOuter1" type="matrix" result="shadowMatrixOuter1"/>
            <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter2"/>
            <feGaussianBlur stdDeviation="0.5" in="shadowOffsetOuter2" result="shadowBlurOuter2"/>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.084 0" in="shadowBlurOuter2" type="matrix" result="shadowMatrixOuter2"/>
            <feMerge>
                <feMergeNode in="shadowMatrixOuter1"/>
                <feMergeNode in="shadowMatrixOuter2"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        <rect id="path-2" x="0" y="0" width="40" height="40" rx="2"/>
        <rect id="path-3" x="5" y="5" width="38" height="38" rx="1"/>
    </defs>
    <g id="Google-Button" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
        <g id="9-PATCH" sketch:type="MSArtboardGroup" transform="translate(-608.000000, -219.000000)"/>
        <g id="btn_google_dark_normal" sketch:type="MSArtboardGroup" transform="translate(-1.000000, -1.000000)">
            <g id="button" sketch:type="MSLayerGroup" transform="translate(4.000000, 4.000000)" filter="url(#filter-1)">
                <g id="button-bg">
                    <use fill="#4285F4" fill-rule="evenodd" sketch:type="MSShapeGroup" xlink:href="#path-2"/>
                    <use fill="none" xlink:href="#path-2"/>
                    <use fill="none" xlink:href="#path-2"/>
                    <use fill="none" xlink:href="#path-2"/>
                </g>
            </g>
            <g id="button-bg-copy">
                <use fill="#FFFFFF" fill-rule="evenodd" sketch:type="MSShapeGroup" xlink:href="#path-3"/>
                <use fill="none" xlink:href="#path-3"/>
                <use fill="none" xlink:href="#path-3"/>
                <use fill="none" xlink:href="#path-3"/>
            </g>
            <g id="logo_googleg_48dp" sketch:type="MSLayerGroup" transform="translate(15.000000, 15.000000)">
                <path d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z" id="Shape" fill="#4285F4" sketch:type="MSShapeGroup"/>
                <path d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z" id="Shape" fill="#34A853" sketch:type="MSShapeGroup"/>
                <path d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z" id="Shape" fill="#FBBC05" sketch:type="MSShapeGroup"/>
                <path d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z" id="Shape" fill="#EA4335" sketch:type="MSShapeGroup"/>
                <path d="M0,0 L18,0 L18,18 L0,18 L0,0 Z" id="Shape" sketch:type="MSShapeGroup"/>
            </g>
            <g id="handles_square" sketch:type="MSLayerGroup"/>
        </g>
    </g>`;

    this.pageNavigator = new PageNavigator(
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
    this.window.open("/oauth_start");
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
