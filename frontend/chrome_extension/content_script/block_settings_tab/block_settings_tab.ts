import EventEmitter = require("events");
import {
  BlockKind,
  BlockPattern,
  BlockSettings,
} from "../../../../interface/player_settings";
import { FILLED_BUTTON_STYLE } from "../../../button_styles";
import { ColorScheme } from "../../../color_scheme";
import { FONT_M } from "../../../font_sizes";
import { CustomTextInputController } from "../common/custom_text_input_controller";
import { DropdownList } from "../common/dropdown_list";
import { TAB_SIDE_PADDING } from "../common/styles";
import { BlockEntry } from "./block_entry";
import { E } from "@selfage/element/factory";
import { Ref, assign } from "@selfage/ref";

export interface BlockSettingsTab {
  on(event: "update", listener: () => void): this;
}

export class BlockSettingsTab extends EventEmitter {
  public static create(blockSettings: BlockSettings): BlockSettingsTab {
    return new BlockSettingsTab(blockSettings);
  }

  public body: HTMLDivElement;
  private dropdownList = new Ref<DropdownList<BlockKind>>();
  private patternInput = new Ref<HTMLInputElement>();
  private submitButton = new Ref<HTMLDivElement>();
  private blockEntryList = new Ref<HTMLInputElement>();
  private patternInputController: CustomTextInputController;

  public constructor(private blockSettings: BlockSettings) {
    super();
    this.body = E.div(
      {
        class: "block-settings-tab-container",
        style: `display: flex; flex-flow: column nowrap; height: 100%;`,
      },
      E.div(
        {
          class: "block-settings-tab-input-container",
          style: `display: flex; flex-flow: row nowrap; align-items: center; margin-top: .5rem; padding: 0 ${TAB_SIDE_PADDING}; box-sizing: border-box; width: 100%;`,
        },
        assign(
          this.dropdownList,
          DropdownList.create(
            ".5rem",
            [
              {
                kind: BlockKind.KeywordBlockKind,
                localizedMsg: chrome.i18n.getMessage(
                  BlockKind[BlockKind.KeywordBlockKind],
                ),
              },
              {
                kind: BlockKind.RegExpBlockKind,
                localizedMsg: chrome.i18n.getMessage(
                  BlockKind[BlockKind.RegExpBlockKind],
                ),
              },
            ],
            BlockKind.KeywordBlockKind,
            BlockKind.KeywordBlockKind,
          ),
        ).body,
        E.input({
          ref: this.patternInput,
          class: "block-settings-tab-pattern-input",
          style: `padding: 0; margin: 0; outline: none; border: 0; min-width: 0; flex-grow: 1; margin: 0 .75rem; line-height: 2rem; font-size: ${FONT_M}rem; font-family: initial !important; color: ${ColorScheme.getContent()}; border-bottom: .0625rem solid ${ColorScheme.getInputBorder()};`,
          placeHolder: chrome.i18n.getMessage("blockRuleInputPlaceHolder"),
        }),
        E.div(
          {
            ref: this.submitButton,
            class: "block-settings-tab-pattern-submit",
            style: FILLED_BUTTON_STYLE,
          },
          E.text(chrome.i18n.getMessage("addBlockRuleButton")),
        ),
      ),
      E.div({
        ref: this.blockEntryList,
        class: "block-settings-tab-block-entry-list",
        style: `flex-grow: 1; width: 100%; margin-top: .5rem; padding: 0 ${TAB_SIDE_PADDING}; box-sizing: border-box; overflow-y: auto;`,
      }),
    );
    this.patternInputController = CustomTextInputController.create(
      this.patternInput.val,
    );
    for (let blockPattern of this.blockSettings.blockPatterns) {
      this.addBlockEntry(blockPattern);
    }

    this.patternInputController.on("enter", () => this.enterPattern());
    this.submitButton.val.addEventListener("click", () => this.submitPattern());
    return this;
  }

  private addBlockEntry(blockPattern: BlockPattern): void {
    let entry = BlockEntry.create(blockPattern);
    this.blockEntryList.val.appendChild(entry.body);
    entry.on("remove", (pattern) => this.removeBlockEntry(pattern));
  }

  private removeBlockEntry(blockPattern: BlockPattern): void {
    let index = this.blockSettings.blockPatterns.indexOf(blockPattern);
    this.blockSettings.blockPatterns.splice(index, 1);
    this.emit("update");
  }

  private enterPattern(): void {
    this.submitButton.val.click();
  }

  private submitPattern(): void {
    if (!this.patternInput.val.value) {
      return;
    }

    let blockPattern: BlockPattern = {
      kind: this.dropdownList.val.selectedKind,
      content: this.patternInput.val.value,
    };
    this.blockSettings.blockPatterns.push(blockPattern);
    this.addBlockEntry(blockPattern);
    this.patternInput.val.value = "";
    this.emit("update");
  }

  public show(): this {
    this.body.style.display = "flex";
    return this;
  }

  public hide(): this {
    this.body.style.display = "none";
    return this;
  }
}
