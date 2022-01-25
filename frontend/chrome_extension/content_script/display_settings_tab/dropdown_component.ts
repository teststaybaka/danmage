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
  public body: HTMLDivElement;

  public constructor(
    label: string,
    private defaultValue: OptionEntry<T>,
    private value: OptionEntry<T>,
    private dropdonwListComponent: DropdownListComponent<T>
  ) {
    super();
    this.body = E.div(
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
  }

  public static create<T>(
    label: string,
    defaultValue: OptionEntry<T>,
    value: OptionEntry<T>,
    optionEntries: Array<OptionEntry<T>>
  ): DropdownComponent<T> {
    return new DropdownComponent(
      label,
      defaultValue,
      value,
      DropdownListComponent.create(".4rem", optionEntries)
    ).init();
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
