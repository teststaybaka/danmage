import EventEmitter = require("events");
import { ColorScheme } from "../../../color_scheme";
import { FONT_M } from "../../../font_sizes";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";

export interface OptionEntry<T> {
  kind: T;
  localizedMsg: string;
}

export interface DropdownEntry<T> {
  on(event: "select", listener: (optionEntry: OptionEntry<T>) => void): this;
}

export class DropdownEntry<T> extends EventEmitter {
  public static create<T>(optionEntry: OptionEntry<T>): DropdownEntry<T> {
    return new DropdownEntry(optionEntry);
  }

  public body: HTMLDivElement;

  public constructor(private optionEntry: OptionEntry<T>) {
    super();
    this.body = E.div(
      {
        class: "dropdown-entry",
        style: `padding: .125rem 0; font-size: ${FONT_M}rem; line-height: 100%; font-family: initial !important;`,
      },
      E.text(this.optionEntry.localizedMsg),
    );

    this.lowlight();
    this.body.addEventListener("mouseenter", () => this.highlight());
    this.body.addEventListener("mouseleave", () => this.lowlight());
    this.body.addEventListener("click", () => this.select());
  }

  private lowlight(): void {
    this.body.style.color = ColorScheme.getContent();
  }

  private highlight(): void {
    this.body.style.color = ColorScheme.getHighlightContent();
  }

  public select(): void {
    this.emit("select", this.optionEntry);
  }
}

export interface DropdownList<T> {
  on(event: "select", listener: (selectedKind: T) => void): this;
}

export class DropdownList<T> extends EventEmitter {
  public static create<T>(
    verticalPadding: string,
    optionEntries: Array<OptionEntry<T>>,
    defaultValue: T,
    value: T,
  ): DropdownList<T> {
    return new DropdownList(
      verticalPadding,
      optionEntries,
      defaultValue,
      value,
    );
  }

  public selectedKind: T;
  public body: HTMLDivElement;
  private selectedOption = new Ref<HTMLDivElement>();
  private optionList = new Ref<HTMLDivElement>();
  private dropdownEntries: Array<DropdownEntry<T>>;

  public constructor(
    verticalPadding: string,
    private optionEntries: Array<OptionEntry<T>>,
    private defaultValue: T,
    value: T,
  ) {
    super();
    this.dropdownEntries = optionEntries.map((optionEntry) =>
      DropdownEntry.create(optionEntry),
    );
    this.body = E.div(
      {
        class: "dropdown-list-container",
        style: `flex: 0 0 auto; position: relative; cursor: pointer; border-bottom: .0625rem solid ${ColorScheme.getInputBorder()};`,
      },
      E.div(
        {
          class: "dropdown-list-selected-option",
          style: `display: flex; flex-flow: row nowrap; align-items: center;`,
        },
        E.div({
          ref: this.selectedOption,
          class: "dropdown-list-selected-option-text",
          style: `padding: ${verticalPadding} .25rem ${verticalPadding} 0; font-size: ${FONT_M}rem; line-height: 100%; font-family: initial !important; color: ${ColorScheme.getContent()};`,
        }),
        E.div({
          class: "dropdown-list-option-arrow",
          style: `border-left: .25rem solid transparent; border-right: .25rem solid transparent; border-top: .5rem solid ${ColorScheme.getInputBorder()};`,
        }),
      ),
      E.div(
        {
          ref: this.optionList,
          class: "dropdown-list-option-list",
          style: `position: absolute; width: 100%; background-color: ${ColorScheme.getBackground()}; z-index: 1;`,
        },
        ...this.dropdownEntries.map((dropdownEntry) => dropdownEntry.body),
      ),
    );
    this.optionList.val.style.display = "none";
    this.setOption(optionEntries.find((option) => option.kind === value));

    this.dropdownEntries.forEach((dropdownEntry) => {
      dropdownEntry.on("select", (optionEntry) =>
        this.selectOption(optionEntry),
      );
    });
    this.body.addEventListener("click", () => this.toggleOptionList());
  }

  private setOption(optionEntry: OptionEntry<T>): this {
    this.selectedKind = optionEntry.kind;
    this.selectedOption.val.textContent = optionEntry.localizedMsg;
    return this;
  }

  private selectOption(optionEntry: OptionEntry<T>): void {
    this.setOption(optionEntry);
    this.emit("select", this.selectedKind);
  }

  private toggleOptionList(): void {
    if (this.optionList.val.style.display === "none") {
      this.optionList.val.style.display = "block";
    } else {
      this.optionList.val.style.display = "none";
    }
  }

  public resetOption(): T {
    this.setOption(
      this.optionEntries.find((option) => option.kind === this.defaultValue),
    );
    return this.defaultValue;
  }

  public remove(): void {
    this.body.remove();
  }
}
