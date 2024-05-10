import EventEmitter = require("events");
import { DropdownList, OptionEntry } from "../common/dropdown_list";
import { ENTRY_PADDING_TOP_STYLE, LABEL_STYLE } from "./styles";
import { E } from "@selfage/element/factory";
import { Ref, assign } from "@selfage/ref";

export interface Dropdown<T> {
  on(event: "change", listener: (value: T) => void): this;
}

export class Dropdown<T> extends EventEmitter {
  public static create<T>(
    label: string,
    optionEntries: Array<OptionEntry<T>>,
    defaultValue: T,
    value: T,
  ): Dropdown<T> {
    return new Dropdown(label, optionEntries, defaultValue, value);
  }

  public body: HTMLDivElement;
  private dropdownList = new Ref<DropdownList<T>>();

  public constructor(
    label: string,
    optionEntries: Array<OptionEntry<T>>,
    defaultValue: T,
    value: T,
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
        E.text(label),
      ),
      assign(
        this.dropdownList,
        DropdownList.create(".4rem", optionEntries, defaultValue, value),
      ).body,
    );

    this.dropdownList.val.on("select", (selectedKind: T) =>
      this.select(selectedKind),
    );
  }

  private select(selectedKind: T): void {
    this.emit("change", selectedKind);
  }

  public reset(): T {
    return this.dropdownList.val.resetOption();
  }
}
