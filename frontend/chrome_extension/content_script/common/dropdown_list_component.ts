import EventEmitter = require("events");
import { ColorScheme } from "../../../color_scheme";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";

export interface OptionEntry<T> {
  kind: T;
  localizedMsg: string;
}

export interface DropdownEntryComponent<T> {
  on(event: "select", listener: (optionEntry: OptionEntry<T>) => void): this;
}

export class DropdownEntryComponent<T> extends EventEmitter {
  public constructor(
    public body: HTMLDivElement,
    private optionEntry: OptionEntry<T>
  ) {
    super();
  }

  public static create<T>(
    optionEntry: OptionEntry<T>
  ): DropdownEntryComponent<T> {
    return new DropdownEntryComponent(
      DropdownEntryComponent.createView(optionEntry.localizedMsg),
      optionEntry
    ).init();
  }

  public static createView(localizedMsg: string) {
    return E.div(
      {
        class: "dropdown-entry",
        style: `padding: .2rem 0; font-size: 1.4rem; line-height: 1.6rem; font-family: initial !important;`,
      },
      E.text(localizedMsg)
    );
  }

  public init(): this {
    this.lowlight();
    this.body.addEventListener("mouseover", () => this.highlight());
    this.body.addEventListener("mouseleave", () => this.lowlight());
    this.body.addEventListener("click", () => this.select());
    return this;
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

export interface DropdownListComponent<T> {
  on(event: "select", listener: (selectedKind: T) => void): this;
}

export class DropdownListComponent<T> extends EventEmitter {
  public selectedKind: T;

  public constructor(
    public body: HTMLDivElement,
    private selectedOptionText: Text,
    private optionList: HTMLDivElement,
    private dropdownEntryComponents: Array<DropdownEntryComponent<T>>
  ) {
    super();
  }

  public static create<T>(
    verticalPadding: string,
    optionEntries: Array<OptionEntry<T>>
  ): DropdownListComponent<T> {
    return new DropdownListComponent(
      ...DropdownListComponent.createView(
        verticalPadding,
        optionEntries.map((optionEntry) =>
          DropdownEntryComponent.create(optionEntry)
        )
      )
    ).init();
  }

  private static createView<T>(
    verticalPadding: string,
    dropdownEntryComponents: Array<DropdownEntryComponent<T>>
  ) {
    let selectedOptionTextRef = new Ref<Text>();
    let optionListRef = new Ref<HTMLDivElement>();
    let body = E.div(
      {
        class: "dropdown-list-container",
        style: `flex: 0 0 auto; position: relative; cursor: pointer; border-bottom: .1rem solid ${ColorScheme.getInputBorder()};`,
      },
      E.div(
        {
          class: "dropdown-list-selected-option",
          style: `display: flex; flex-flow: row nowrap; align-items: center;`,
        },
        E.div(
          {
            class: "dropdown-list-selected-option-text",
            style: `padding: ${verticalPadding} .4rem ${verticalPadding} 0; font-size: 1.4rem; line-height: 1.6rem; font-family: initial !important; color: ${ColorScheme.getContent()};`,
          },
          E.textRef(selectedOptionTextRef)
        ),
        E.div({
          class: "dropdown-list-option-arrow",
          style: `border-left: .4rem solid transparent; border-right: .4rem solid transparent; border-top: .8rem solid ${ColorScheme.getInputBorder()};`,
        })
      ),
      E.divRef(
        optionListRef,
        {
          class: "dropdown-list-option-list",
          style: `position: absolute; width: 100%; background-color: ${ColorScheme.getBackground()}; z-index: 1;`,
        },
        ...dropdownEntryComponents.map(
          (dropdownEntryComponent) => dropdownEntryComponent.body
        )
      )
    );
    return [
      body,
      selectedOptionTextRef.val,
      optionListRef.val,
      dropdownEntryComponents,
    ] as const;
  }

  public init(): this {
    this.optionList.style.display = "none";

    this.dropdownEntryComponents.forEach((dropdownEntryComponent) => {
      dropdownEntryComponent.on("select", (optionEntry) =>
        this.selectOption(optionEntry)
      );
    });
    this.body.addEventListener("click", () => this.toggleOptionList());
    return this;
  }

  public selectOption(optionEntry: OptionEntry<T>): void {
    this.setOption(optionEntry);
    this.emit("select", this.selectedKind);
  }

  public setOption(optionEntry: OptionEntry<T>): void {
    this.selectedKind = optionEntry.kind;
    this.selectedOptionText.textContent = optionEntry.localizedMsg;
  }

  private toggleOptionList(): void {
    if (this.optionList.style.display === "none") {
      this.optionList.style.display = "block";
    } else {
      this.optionList.style.display = "none";
    }
  }
}
