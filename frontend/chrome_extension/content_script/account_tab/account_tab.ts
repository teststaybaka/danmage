import { LOCAL_SESSION_STORAGE } from "../../common/local_session_storage";
import { TAB_SIDE_PADDING } from "../common/styles";
import { SignInTab } from "./sign_in_tab";
import { WelcomeTab } from "./welcome_tab";
import { E } from "@selfage/element/factory";
import { LocalSessionStorage } from "@selfage/web_service_client/local_session_storage";

export class AccountTab {
  public static create(): AccountTab {
    return new AccountTab(
      () => SignInTab.create(),
      () => WelcomeTab.create(),
      LOCAL_SESSION_STORAGE,
    );
  }

  public body: HTMLDivElement;
  private signInTab: SignInTab;
  private welcomeTab: WelcomeTab;

  public constructor(
    private createSignInTab: () => SignInTab,
    private createWelcomeTab: () => WelcomeTab,
    private localSessionStorage: LocalSessionStorage,
  ) {
    this.body = E.div({
      class: "account-tab",
      style: `padding: 0 ${TAB_SIDE_PADDING}; box-sizing: border-box; width: 100%; height: 100%;`,
    });
    this.checkStatus();
  }

  private checkStatus(): void {
    let session = this.localSessionStorage.read();
    if (!session) {
      this.signInTab = this.createSignInTab().on("checkStatus", () =>
        this.checkStatus(),
      );
      this.body.append(this.signInTab.body);
      if (this.welcomeTab) {
        this.welcomeTab.remove();
      }
    } else {
      this.welcomeTab = this.createWelcomeTab().on("signOut", () =>
        this.signOut(),
      );
      this.body.append(this.welcomeTab.body);
      if (this.signInTab) {
        this.signInTab.remove();
      }
    }
  }

  private signOut(): void {
    this.localSessionStorage.clear();
    this.checkStatus();
  }

  public show(): this {
    this.body.style.display = "block";
    return this;
  }

  public hide(): this {
    this.body.style.display = "none";
    return this;
  }
}
