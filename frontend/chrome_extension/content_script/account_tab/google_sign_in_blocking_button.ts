import { BlockingButton } from "../../../blocking_button";
import { NULLIFIED_BUTTON_STYLE } from "../../../button_styles";
import { ColorScheme } from "../../../color_scheme";
import {
  GOOGLE_BUTTON_BACKGROUND_COLOR,
  GOOGLE_BUTTON_TEXT_COLOR,
  createGoogleIcon,
} from "../../../common/google_button";
import { FONT_M } from "../../../font_sizes";
import { E } from "@selfage/element/factory";

export class GoogleSignInBlockingButton extends BlockingButton {
  public static create(): GoogleSignInBlockingButton {
    return new GoogleSignInBlockingButton();
  }

  public constructor() {
    super(
      `${NULLIFIED_BUTTON_STYLE} padding: 0; display: flex; flex-flow: row nowrap; align-items: center; cursor: pointer;`,
    );
    this.append(
      createGoogleIcon(),
      E.div(
        {
          class: "body-header-sign-in-text",
          style: `font-family: initial !important; padding: 0 .8rem; font-size: ${FONT_M}rem; color: ${GOOGLE_BUTTON_TEXT_COLOR};`,
        },
        E.text(chrome.i18n.getMessage("signInButton")),
      ),
    );
  }

  protected enableOverride(): void {
    this.body.style.backgroundColor = GOOGLE_BUTTON_BACKGROUND_COLOR;
  }

  protected disableOverride(): void {
    this.body.style.backgroundColor =
      ColorScheme.getDisabledPrimaryButtonBackground();
  }
}
