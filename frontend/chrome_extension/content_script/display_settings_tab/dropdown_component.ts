import EventEmitter = require("events");
import {
  DropdownListComponent,
  OptionEntry,
} from "../common/dropdown_list_component";
import { ENTRY_PADDING_TOP_STYLE, LABEL_STYLE } from "./styles";
import { E } from "@selfage/element/factory";

export interface DropdownComponent<T> {
  on(event: "change", listener: (value: T) => void): this;
}

export class DropdownComponent<T> extends EventEmitter {
  public constructor(
    public body: HTMLDivElement,
    private dropdonwListComponent: DropdownListComponent<T>,
    private defaultValue: OptionEntry<T>,
    private value: OptionEntry<T>
  ) {
    super();
  }

  public static create<T>(
    label: string,
    defaultValue: OptionEntry<T>,
    value: OptionEntry<T>,
    optionEntries: Array<OptionEntry<T>>
  ): DropdownComponent<T> {
    return new DropdownComponent(
      ...DropdownComponent.createView(
        label,
        DropdownListComponent.create(".4rem", optionEntries)
      ),
      defaultValue,
      value
    ).init();
  }

  public static createView<T>(
    label: string,
    dropdonwListComponent: DropdownListComponent<T>
  ) {
    let body = E.div(
      {
        class: "dropdown-container",
        style: `display: flex; flex-flow: row nowrap; justify-content: space-between; align-items: center; ${ENTRY_PADDING_TOP_STYLE}`,
      },
      E.div(
        {
          class: "dropdown-label",
          style: LABEL_STYLE,
          title: label,
        },
        E.text(label)
      ),
      dropdonwListComponent.body
    );
    return [body, dropdonwListComponent] as const;
  }

  public init(): this {
    this.dropdonwListComponent.setOption(this.value);
    this.dropdonwListComponent.on("select", (selectedKind: T) =>
      this.select(selectedKind)
    );
    return this;
  }

  private select(selectedKind: T): void {
    this.emit("change", selectedKind);
  }

  public reset(): T {
    this.dropdonwListComponent.setOption(this.defaultValue);
    return this.defaultValue.kind;
  }
}
