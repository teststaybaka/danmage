import EventEmitter = require("events");
import { BlockKind } from "../../../../interface/player_settings";
import { ColorScheme } from "../../../color_scheme";
import { E } from "@selfage/element/factory";

export interface BlockOptionEntryComponent {
  on(event: "select", listener: (kind: BlockKind) => void): this;
}

export class BlockOptionEntryComponent extends EventEmitter {
  public constructor(public body: HTMLDivElement, private kind: BlockKind) {
    super();
  }

  public static create(kind: BlockKind): BlockOptionEntryComponent {
    return new BlockOptionEntryComponent(
      BlockOptionEntryComponent.createView(kind),
      kind
    ).init();
  }

  public static createView(kind: BlockKind) {
    return E.div(
      {
        class: "block-option-entry",
        style: `padding: .4rem 0; font-size: 1.4rem; line-height: 100%; font-family: initial !important;`,
      },
      E.text(BlockKind[kind])
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

  private select(): void {
    this.emit("select", this.kind);
  }
}
