import EventEmitter = require("events");
import {
  BlockKind,
  BlockPattern,
  BlockSettings,
} from "../../../../interface/player_settings";
import { FillButtonComponent } from "../../../button_component";
import { ColorScheme } from "../../../color_scheme";
import { TAB_SIDE_PADDING } from "../common";
import { DropdownListComponent } from "../common/dropdown_list_component";
import { CustomTextInputController } from "../custom_text_input_controller";
import { BlockEntryComponent } from "./block_entry_component";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";

export interface BlockSettingsTabComponent {
  on(event: "update", listener: () => void): this;
}

export class BlockSettingsTabComponent extends EventEmitter {
  private displayStyle: string;

  public constructor(
    public body: HTMLDivElement,
    private patternInput: HTMLInputElement,
    private blockEntryList: HTMLDivElement,
    private dropdownListComponent: DropdownListComponent<BlockKind>,
    private submitButton: FillButtonComponent,
    private patternInputController: CustomTextInputController,
    private blockEntryComponentFactoryFn: (
      blockPattern: BlockPattern
    ) => BlockEntryComponent,
    private blockSettings: BlockSettings
  ) {
    super();
  }

  public static create(
    blockSettings: BlockSettings
  ): BlockSettingsTabComponent {
    let views = BlockSettingsTabComponent.createView(
      DropdownListComponent.create(".8rem", [
        {
          kind: BlockKind.KeywordBlockKind,
          localizedMsg: chrome.i18n.getMessage(
            BlockKind[BlockKind.KeywordBlockKind]
          ),
        },
        {
          kind: BlockKind.RegExpBlockKind,
          localizedMsg: chrome.i18n.getMessage(
            BlockKind[BlockKind.RegExpBlockKind]
          ),
        },
      ]),
      FillButtonComponent.create(
        E.text(chrome.i18n.getMessage("addBlockRuleButton"))
      )
    );
    return new BlockSettingsTabComponent(
      ...views,
      CustomTextInputController.create(views[1]),
      BlockEntryComponent.create,
      blockSettings
    ).init();
  }

  public static createView(
    dropdownListComponent: DropdownListComponent<BlockKind>,
    submitButton: FillButtonComponent
  ) {
    let patternInputRef = new Ref<HTMLInputElement>();
    let blockEntryListRef = new Ref<HTMLDivElement>();
    let body = E.div(
      {
        class: "block-settings-tab-container",
        style: `display: flex; flex-flow: column nowrap; height: 100%;`,
      },
      E.div(
        {
          class: "block-settings-tab-input-container",
          style: `display: flex; flex-flow: row nowrap; align-items: center; margin-top: .7rem; padding: 0 ${TAB_SIDE_PADDING}; box-sizing: border-box; width: 100%;`,
        },
        dropdownListComponent.body,
        E.inputRef(patternInputRef, {
          class: "block-settings-tab-pattern-input",
          style: `padding: 0; margin: 0; outline: none; border: 0; min-width: 0; flex-grow: 1; margin: 0 1rem; line-height: 3rem; font-size: 1.4rem; font-family: initial !important; color: ${ColorScheme.getContent()}; border-bottom: .1rem solid ${ColorScheme.getInputBorder()};`,
          placeHolder: chrome.i18n.getMessage("blockRuleInputPlaceHolder"),
        }),
        submitButton.body
      ),
      E.divRef(blockEntryListRef, {
        class: "block-settings-tab-block-entry-list",
        style: `flex-grow: 1; width: 100%; margin-top: .7rem; padding: 0 ${TAB_SIDE_PADDING}; box-sizing: border-box; overflow-y: auto;`,
      })
    );
    return [
      body,
      patternInputRef.val,
      blockEntryListRef.val,
      dropdownListComponent,
      submitButton,
    ] as const;
  }

  public init(): this {
    this.displayStyle = this.body.style.display;
    this.dropdownListComponent.setOption({
      kind: BlockKind.KeywordBlockKind,
      localizedMsg: chrome.i18n.getMessage(
        BlockKind[BlockKind.KeywordBlockKind]
      ),
    });
    for (let blockPattern of this.blockSettings.blockPatterns) {
      this.addBlockEntry(blockPattern);
    }

    this.patternInputController.on("enter", () => this.enterPattern());
    this.submitButton.on("click", () => this.submitPattern());
    return this;
  }

  private addBlockEntry(blockPattern: BlockPattern): void {
    let entry = this.blockEntryComponentFactoryFn(blockPattern);
    this.blockEntryList.appendChild(entry.body);
    entry.on("remove", (pattern) => this.removeBlockEntry(pattern));
  }

  private removeBlockEntry(blockPattern: BlockPattern): void {
    let index = this.blockSettings.blockPatterns.indexOf(blockPattern);
    this.blockSettings.blockPatterns.splice(index, 1);
    this.emit("update");
  }

  private enterPattern(): void {
    this.submitButton.click();
  }

  private submitPattern(): void {
    if (!this.patternInput.value) {
      return;
    }

    let blockPattern: BlockPattern = {
      kind: this.dropdownListComponent.selectedKind,
      content: this.patternInput.value,
    };
    this.blockSettings.blockPatterns.push(blockPattern);
    this.addBlockEntry(blockPattern);
    this.patternInput.value = "";
    this.emit("update");
  }

  public show(): void {
    this.body.style.display = this.displayStyle;
  }

  public hide(): void {
    this.body.style.display = "none";
  }
}
