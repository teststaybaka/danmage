import { SIGN_IN } from "../../../interface/service";
import { TextButtonComponent } from "../../button_component";
import { BLUE, ColorScheme, ORANGE } from "../../color_scheme";
import { BodyState, Page } from "./body_state";
import { SIDE_PADDING } from "./common_style";
import { FeedbackComponent } from "./feedback_component";
import { HistoryComponent } from "./history_component";
import { HomeComponent } from "./home_component";
import { LOCAL_SESSION_STORAGE } from "./local_session_storage";
import { LOCALIZED_TEXT } from "./locales/localized_text";
import { NicknameComponent } from "./nickname_component";
import { SERVICE_CLIENT } from "./service_client";
import { E } from "@selfage/element/factory";
import { HideableElementController } from "@selfage/element/hideable_element_controller";
import { Ref } from "@selfage/ref";
import { ServiceClient } from "@selfage/service_client";
import { LocalSessionStorage } from "@selfage/service_client/local_session_storage";
import { HistoryUpdater } from "@selfage/stateful_navigator/history_updater";
import { TabsSwitcher } from "@selfage/tabs";

export class BodyComponent {
  public body: HTMLDivElement;
  private logo: HTMLDivElement;
  public signInButton: HTMLDivElement;
  private signedInButtonsContainer: HTMLDivElement;
  private tabsContainer: HTMLDivElement;
  private pageSwitcher = TabsSwitcher.create();
  private signInButtonsSwitcher = TabsSwitcher.create();
  private hideableSignInButton: HideableElementController;
  private hideableSignedInButtonsContainer: HideableElementController;
  private homeComponent: HomeComponent;
  private nicknameComponent: NicknameComponent;
  private historyComponent: HistoryComponent;
  private feedbackComponent: FeedbackComponent;

  public constructor(
    private nicknameButton: TextButtonComponent,
    private historyButton: TextButtonComponent,
    private signOutButton: TextButtonComponent,
    private termsButton: TextButtonComponent,
    private privacyButton: TextButtonComponent,
    private feedbackButton: TextButtonComponent,
    private homeComponentFactoryFn: () => HomeComponent,
    private nicknameComponentFactoryFn: () => NicknameComponent,
    private historyComponentFactoryFn: () => HistoryComponent,
    private feedbackComponentFactoryFn: () => FeedbackComponent,
    private bodyState: BodyState,
    private historyUpdater: HistoryUpdater,
    private origin: string,
    private localSessionStorage: LocalSessionStorage,
    private serviceClient: ServiceClient,
    private window: Window
  ) {
    let logoRef = new Ref<HTMLDivElement>();
    let signInButtonRef = new Ref<HTMLDivElement>();
    let googleIconSvgRef = new Ref<SVGSVGElement>();
    let signedInButtonsContainerRef = new Ref<HTMLDivElement>();
    let tabsContainerRef = new Ref<HTMLDivElement>();
    this.body = E.div(
      {
        class: "body",
        style: `display: flex; flex-flow: column nowrap; min-height: 100vh; overflow-y: auto;`,
      },
      E.div(
        {
          class: "body-header",
          style: `display: flex; flex-flow: row nowrap; align-items: center; padding: 1rem ${SIDE_PADDING}rem; border-bottom: .1rem solid ${ColorScheme.getBlockSeparator()};`,
        },
        E.divRef(
          logoRef,
          {
            class: "body-logo",
            style: `font-size: 3rem; font-weight: bold; font-family: Comic Sans MS, cursive, sans-serif; cursor: pointer;`,
          },
          E.div(
            {
              class: "body-logo-left",
              style: `display: inline; color: ${ORANGE};`,
            },
            E.text("Dan")
          ),
          E.div(
            {
              class: "body-logo-right",
              style: `display: inline; color: ${BLUE};`,
            },
            E.text("Mage")
          )
        ),
        E.div({ style: `flex: 1;` }),
        E.divRef(
          signInButtonRef,
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
              style: `padding: 0 .8rem; font-size: 1.4rem; color: white;`,
            },
            E.text(LOCALIZED_TEXT.signInButton)
          )
        ),
        E.divRef(
          signedInButtonsContainerRef,
          {
            class: "body-header-signed-in-tab-buttons-container",
            style: `display: flex; flex-flow: row nowrap; align-items: center;`,
          },
          E.div(
            {
              class: "body-header-nickname-button-wrapper",
              style: `margin-right: 2rem;`,
            },
            nicknameButton.body
          ),
          E.div(
            {
              class: "body-header-history-button-wrapper",
              style: `margin-right: 2rem;`,
            },
            historyButton.body
          ),
          E.div(
            { class: "body-heaer-history-button-wrapper" },
            signOutButton.body
          )
        )
      ),
      E.divRef(tabsContainerRef, {
        class: "body-tab-container",
        style: "flex: 1;",
      }),
      E.div(
        {
          class: "body-footer",
          style: `display: flex; flex-flow: row nowrap; align-items: center; justify-content: center; padding: 2rem 0; border-top: .1rem solid ${ColorScheme.getBlockSeparator()};`,
        },
        termsButton.body,
        E.div({
          style: `height: 2rem; margin: 0 .2rem; width: .1rem; background-color: ${ColorScheme.getBlockSeparator()}`,
        }),
        privacyButton.body,
        E.div({
          style: `height: 2rem; margin: 0 .2rem; width: .1rem; background-color: ${ColorScheme.getBlockSeparator()};`,
        }),
        feedbackButton.body
      )
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
    this.logo = logoRef.val;
    this.signInButton = signInButtonRef.val;
    this.signedInButtonsContainer = signedInButtonsContainerRef.val;
    this.tabsContainer = tabsContainerRef.val;
  }

  public static create(
    bodyState: BodyState,
    historyUpdater: HistoryUpdater,
    origin: string
  ): BodyComponent {
    return new BodyComponent(
      TextButtonComponent.create(E.text(LOCALIZED_TEXT.nicknameTab)),
      TextButtonComponent.create(E.text(LOCALIZED_TEXT.historyTab)),
      TextButtonComponent.create(E.text(LOCALIZED_TEXT.signOutButton)),
      TextButtonComponent.create(E.text(LOCALIZED_TEXT.termsTab)),
      TextButtonComponent.create(E.text(LOCALIZED_TEXT.privacyTab)),
      TextButtonComponent.create(E.text(LOCALIZED_TEXT.feedbackTab)),
      () => HomeComponent.create(),
      () => NicknameComponent.create(),
      () => HistoryComponent.create(),
      () => FeedbackComponent.create(),
      bodyState,
      historyUpdater,
      origin,
      LOCAL_SESSION_STORAGE,
      SERVICE_CLIENT,
      window
    ).init();
  }

  public init(): this {
    this.showPage(this.bodyState.page);
    this.bodyState.on("page", (value) => this.showPage(value));

    this.logo.addEventListener("click", () => this.gotoPage(Page.HOME));
    this.nicknameButton.on("click", () => this.gotoPage(Page.NICKNAME));
    this.historyButton.on("click", () => this.gotoPage(Page.HISTORY));
    this.feedbackButton.on("click", () => this.gotoPage(Page.FEEDBACK));
    this.termsButton.on("click", () => this.gotoTerms());
    this.privacyButton.on("click", () => this.gotoPrivacy());

    this.hideableSignInButton = new HideableElementController(
      this.signInButton
    );
    this.hideableSignInButton.hide();
    this.hideableSignedInButtonsContainer = new HideableElementController(
      this.signedInButtonsContainer
    );
    this.hideableSignedInButtonsContainer.hide();
    if (!this.localSessionStorage.read()) {
      this.showSignInButton();
    } else {
      this.showSignedInButtonsContainer();
    }
    this.signInButton.addEventListener("click", () => this.signIn());
    this.signOutButton.on("click", () => this.signOut());

    this.window.addEventListener("message", (event) =>
      this.handleMessage(event)
    );
    this.serviceClient.on("unauthenticated", () => this.showSignInButton());
    return this;
  }

  private showPage(page: Page): void {
    if (!page || page === Page.HOME) {
      this.pageSwitcher.show(
        () => {
          this.homeComponent = this.homeComponentFactoryFn();
          this.tabsContainer.appendChild(this.homeComponent.body);
        },
        () => {
          this.homeComponent.remove();
        }
      );
    } else if (page === Page.NICKNAME) {
      this.pageSwitcher.show(
        async () => {
          this.nicknameComponent = this.nicknameComponentFactoryFn();
          this.tabsContainer.appendChild(this.nicknameComponent.body);
          await this.nicknameComponent.show();
        },
        () => {
          this.nicknameComponent.remove();
        }
      );
    } else if (page === Page.HISTORY) {
      this.pageSwitcher.show(
        async () => {
          this.historyComponent = this.historyComponentFactoryFn();
          this.tabsContainer.appendChild(this.historyComponent.body);
          await this.historyComponent.show();
        },
        () => {
          this.historyComponent.remove();
        }
      );
    } else if (page === Page.FEEDBACK) {
      this.pageSwitcher.show(
        () => {
          this.feedbackComponent = this.feedbackComponentFactoryFn();
          this.tabsContainer.appendChild(this.feedbackComponent.body);
        },
        () => {
          this.feedbackComponent.remove();
        }
      );
    }
  }

  private gotoPage(page: Page): void {
    this.bodyState.page = page;
    this.historyUpdater.push();
  }

  private gotoTerms(): void {
    this.window.location.href = "/terms";
  }

  private gotoPrivacy(): void {
    this.window.location.href = "/privacy";
  }

  private showSignInButton(): void {
    this.signInButtonsSwitcher.show(
      () => {
        this.hideableSignInButton.show();
      },
      () => {
        this.hideableSignInButton.hide();
      }
    );
  }

  private showSignedInButtonsContainer(): void {
    this.signInButtonsSwitcher.show(
      () => {
        this.hideableSignedInButtonsContainer.show();
      },
      () => {
        this.hideableSignedInButtonsContainer.hide();
      }
    );
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
    let response = await this.serviceClient.fetchUnauthed(
      { googleAccessToken: accessToken },
      SIGN_IN
    );
    this.localSessionStorage.save(response.signedSession);
    this.showSignedInButtonsContainer();
  }
}
