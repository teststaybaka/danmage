import EventEmitter = require("events");
import { FilledBlockingButton } from "../../blocking_button";
import { getUser, updateNickname } from "../../client_requests";
import { INPUT_STYLE, LABEL_STYLE, SIDE_PADDING } from "./common_style";
import { LOCALIZED_TEXT } from "./locales/localized_text";
import { SERVICE_CLIENT } from "./service_client";
import { E } from "@selfage/element/factory";
import { Ref, assign } from "@selfage/ref";
import { WebServiceClient } from "@selfage/web_service_client";

export interface NicknamePage {
  on(event: "loaded", listener: () => void): this;
}

export class NicknamePage extends EventEmitter {
  public static create(): NicknamePage {
    return new NicknamePage(SERVICE_CLIENT);
  }

  public body: HTMLDivElement;
  public input = new Ref<HTMLInputElement>();
  public setButton = new Ref<FilledBlockingButton>();

  public constructor(private serviceClient: WebServiceClient) {
    super();
    this.body = E.div(
      {
        class: "nickname-page",
        style: `display: flex; flex-flow: column nowrap; width: 100%; align-items: center; padding: ${SIDE_PADDING}rem; box-sizing: border-box;`,
      },
      E.div(
        {
          class: "nickname-input-line",
          style: `display: flex; flex-flow: row nowrap; width: 100%; align-items: center; justify-content: center; padding-bottom: 6rem;`,
        },
        E.div({ style: "flex: 2;" }),
        E.div(
          { class: "nickname-label", style: LABEL_STYLE },
          E.text(LOCALIZED_TEXT.nicknameInputLabel),
        ),
        E.inputRef(this.input, {
          class: "nickname-input",
          placeholder: "You can only set it once.",
          style: INPUT_STYLE,
        }),
        E.div({ style: "flex: 2;" }),
      ),
      assign(
        this.setButton,
        FilledBlockingButton.create("")
          .append(E.text(LOCALIZED_TEXT.setNicknameButton))
          .enable(),
      ).body,
    );
    this.load();

    this.setButton.val.on("action", () => this.updateNickname());
    this.input.val.addEventListener("keypress", (event) => this.enter(event));
  }

  public async load(): Promise<void> {
    let response = await getUser(this.serviceClient, {});
    if (response.user.nickname === undefined) {
      this.emit("loaded");
      return;
    }

    this.input.val.value = response.user.nickname;
    this.input.val.readOnly = true;
    this.setButton.val.hide();
    this.emit("loaded");
  }

  private enter(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      this.setButton.val.click();
    }
  }

  public async updateNickname(): Promise<void> {
    await updateNickname(this.serviceClient, {
      newName: this.input.val.value,
    });

    this.input.val.readOnly = true;
    this.setButton.val.hide();
  }

  public remove(): void {
    this.body.remove();
  }
}
