import EventEmitter = require("events");
import {
  BlockKind,
  BlockPattern,
  BlockSettings,
} from "../../../../interface/player_settings";
import { FillButtonComponent } from "../../../button_component";
import { ColorScheme } from "../../../color_scheme";
import { GlobalDocuments } from "../global_documents";
import { BlockEntryComponent } from "./block_entry_component";
import { BlockOptionEntryComponent } from "./block_option_entry_component";
import { E } from "@selfage/element/factory";
import { TextInputController } from "@selfage/element/text_input_controller";
import { Ref, assign } from "@selfage/ref";

export interface BlockSettingsTabComponent {
  on(event: "update", listener: () => void): this;
}

export class BlockSettingsTabComponent extends EventEmitter {
  private displayStyle: string;
  private selectedBlockKind: BlockKind;

  public constructor(
    public body: HTMLDivElement,
    private optionContainer: HTMLDivElement,
    private optionSelected: HTMLDivElement,
    private optionSelectedText: Text,
    private optionList: HTMLDivElement,
    private blockOptionKeyword: BlockOptionEntryComponent,
    private blockOptionRegExp: BlockOptionEntryComponent,
    private patternInput: HTMLInputElement,
    private submitButton: FillButtonComponent,
    private blockEntryList: HTMLDivElement,
    private patternInputController: TextInputController,
    private blockEntryComponentFactoryFn: (
      blockPattern: BlockPattern
    ) => BlockEntryComponent,
    private blockSettings: BlockSettings,
    private globalDocuments: GlobalDocuments
  ) {
    super();
  }

  public static create(
    blockSettings: BlockSettings,
    globalDocuments: GlobalDocuments
  ): BlockSettingsTabComponent {
    let views = BlockSettingsTabComponent.createView();
    return new BlockSettingsTabComponent(
      ...views,
      new TextInputController(views[7]),
      BlockEntryComponent.create,
      blockSettings,
      globalDocuments
    ).init();
  }

  public static createView() {
    let optionContainerRef = new Ref<HTMLDivElement>();
    let optionSelectedRef = new Ref<HTMLDivElement>();
    let optionSelectedTextRef = new Ref<Text>();
    let optionListRef = new Ref<HTMLDivElement>();
    let blockOptionKeywordRef = new Ref<BlockOptionEntryComponent>();
    let blockOptionRegExpRef = new Ref<BlockOptionEntryComponent>();
    let patternInputRef = new Ref<HTMLInputElement>();
    let submitButtonRef = new Ref<FillButtonComponent>();
    let blockEntryListRef = new Ref<HTMLDivElement>();
    let body = E.div(
      `class="block-settings-tab-container" style="display: flex; ` +
        `flow-flow: column nowrap; padding: 0 .5rem;"`,
      E.div(
        `class="block-settings-tab-input-container" ` +
          `style="display: flex; flex-flow: row nowrap; align-items: center; ` +
          `margin-top: 1.5rem; width: 100%; ` +
          `color: ${ColorScheme.getContent()};"`,
        E.divRef(
          optionContainerRef,
          `class="block-settings-tab-option-container" style="flex-grow: 1; ` +
            `position: relative; cursor: pointer; ` +
            `border-bottom: .1rem solid ${ColorScheme.getInputBorder()};"`,
          E.divRef(
            optionSelectedRef,
            `class="block-settings-tab-option-selected" ` +
              `style="display: flex; flex-flow: row nowrap; ` +
              `align-items: center;"`,
            E.div(
              `class="block-settings-tab-option-selected-text" ` +
                `style="flex-grow: 1; padding: .5rem 0; font-size: 1.4rem; ` +
                `line-height: 100%; font-family: initial !important;"`,
              E.textRef(optionSelectedTextRef)
            ),
            E.div(
              `class="block-settings-tab-option-arrow" ` +
                `style="border-left: .4rem solid transparent; ` +
                `border-right: .4rem solid transparent; ` +
                `border-top: .8rem solid ${ColorScheme.getInputBorder()};"`
            )
          ),
          E.divRef(
            optionListRef,
            `class="block-settings-tab-options-list" ` +
              `style="position: absolute; width: 100%; ` +
              `box-shadow: .1rem .1rem .3rem ${ColorScheme.getPopupShadow()}; ` +
              `background-color: ${ColorScheme.getBackground()};`,
            assign(
              blockOptionKeywordRef,
              BlockOptionEntryComponent.create(BlockKind.Keyword)
            ).body,
            assign(
              blockOptionRegExpRef,
              BlockOptionEntryComponent.create(BlockKind.RegExp)
            ).body
          )
        ),
        E.inputRef(
          patternInputRef,
          `class="block-settings-tab-pattern-input" style="flex-grow: 3; ` +
            `margin-left: 1rem; line-height: 2.4rem; font-size: 1.4rem; ` +
            `font-family: initial !important; ` +
            `border-bottom: .1rem solid ${ColorScheme.getInputBorder()}; ` +
            `placeHolder="New block rule"`
        ),
        assign(submitButtonRef, FillButtonComponent.create(E.text("Add"))).body
      ),
      E.divRef(
        blockEntryListRef,
        `class="block-settings-tab-block-entry-list" style="flex-grow: 1; ` +
          `width: 100%; margin-top: 1.5rem; overflow-y: auto;"`
      )
    );
    return [
      body,
      optionContainerRef.val,
      optionSelectedRef.val,
      optionSelectedTextRef.val,
      optionListRef.val,
      blockOptionKeywordRef.val,
      blockOptionRegExpRef.val,
      patternInputRef.val,
      submitButtonRef.val,
      blockEntryListRef.val,
    ] as const;
  }

  public init(): this {
    this.displayStyle = this.body.style.display;
    for (let blockPattern of this.blockSettings.blockPatterns) {
      this.addBlockEntry(blockPattern);
    }
    this.selectOption(BlockKind.Keyword);
    this.blockOptionKeyword.on("select", (kind) => this.selectOption(kind));
    this.blockOptionRegExp.on("select", (kind) => this.selectOption(kind));
    this.optionSelected.addEventListener("click", () => this.showOptions());
    this.globalDocuments.hideWhenMousedown(this.optionContainer, () =>
      this.hideOptions()
    );
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

  private selectOption(kind: BlockKind): void {
    this.selectedBlockKind = kind;
    this.optionSelectedText.textContent = BlockKind[kind];
    this.optionList.style.display = "none";
  }

  private showOptions(): void {
    this.optionList.style.display = "block";
  }

  private hideOptions(): void {
    this.optionList.style.display = "none";
  }

  private enterPattern(): void {
    this.submitButton.click();
  }

  private submitPattern(): void {
    if (!this.patternInput.value) {
      return;
    }

    let blockPattern: BlockPattern = {
      kind: this.selectedBlockKind,
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
