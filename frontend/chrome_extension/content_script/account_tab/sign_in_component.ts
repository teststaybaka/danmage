import EventEmitter = require("events");
import { FillButtonComponent } from "../../../button_component";
import { ColorScheme } from "../../../color_scheme";
import { BackgroundRequest } from "../../interface/background_service";
import { ChromeRuntime } from "../chrome_runtime";
import { E } from "@selfage/element/factory";

export interface SignInComponent {
  on(event: "checkStatus", listener: () => Promise<void> | void): this;
}

export class SignInComponent extends EventEmitter {
  private displayStyle: string;

  public constructor(
    public body: HTMLDivElement,
    private button: FillButtonComponent,
    private chromeRuntime: ChromeRuntime
  ) {
    super();
  }

  public static create(): SignInComponent {
    let button = FillButtonComponent.create(E.text("Sign in"));
    return new SignInComponent(
      ...SignInComponent.createView(button),
      ChromeRuntime.create()
    ).init();
  }

  public static createView(button: FillButtonComponent) {
    let body = E.div(
      `class="sign-in-container" style="display: flex; ` +
        `flex-flow: column nowrap; justify-content: center; ` +
        `align-items: center; height: 100%;"`,
      E.div(
        `class="sign-in-text" style="font-size: 1.4rem; line-height: 120%; ` +
          `font-family: initial !important; text-align: center; ` +
          `margin-bottom: 2rem; color: ${ColorScheme.getContent()};"`,
        E.text("Sign in "),
        E.a(
          `class="sign-in-link" style="` +
            `color: ${ColorScheme.getLinkContent()};" ` +
            `href="https://www.danmage.com" target="_blank"`,
          E.text("www.danmage.com")
        ),
        E.text(
          " with your Chrome/Google account to be able to sync settings " +
            "cross devices and post chats on certain video sites."
        )
      ),
      button.body
    );
    return [body, button] as const;
  }

  public init(): this {
    this.displayStyle = this.body.style.display;
    this.button.on("click", () => this.signIn());
    return this;
  }

  private async signIn(): Promise<void> {
    let request: BackgroundRequest = { signInRequest: {} };
    await this.chromeRuntime.sendMessage(request);
    await Promise.all(this.listeners("click").map((callback) => callback()));
  }

  public show(): void {
    this.body.style.display = this.displayStyle;
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
