import EventEmitter = require("events");
import { BlockKind, BlockPattern } from "../../../../interface/player_settings";
import { ColorScheme } from "../../../color_scheme";
import { E } from "@selfage/element/factory";
import { Ref } from "@selfage/ref";

export interface BlockEntryComponent {
  on(event: "remove", listener: (blockPattern: BlockPattern) => void): this;
}

export class BlockEntryComponent extends EventEmitter {
  public constructor(
    public body: HTMLDivElement,
    private removeButton: SVGSVGElement,
    private blockPattern: BlockPattern
  ) {
    super();
  }

  public static create(blockPattern: BlockPattern): BlockEntryComponent {
    return new BlockEntryComponent(
      ...BlockEntryComponent.createView(blockPattern),
      blockPattern
    ).init();
  }

  public static createView(blockPattern: BlockPattern) {
    let removeButtonRef = new Ref<SVGSVGElement>();
    let body = E.div(
      `class="block-entry-container" style="display: flex; ` +
        `flex-flow: row nowrap; align-items: center; margin: .4rem 0;"`,
      E.div(
        `class="block-entry-type" style="font-size: 1.4rem; ` +
          `line-height: 100%; font-family: initial !important;"`,
        E.text(BlockKind[blockPattern.kind])
      ),
      E.div(
        `class="block-entry-content" style="flex-grow: 1; font-size: 1.4rem; ` +
          `line-height: 100%; font-family: initial !important;"`,
        E.text(blockPattern.content)
      ),
      E.svgRef(
        removeButtonRef,
        `class="block-entry-remove-button" style="width: 1rem; height: 1rem; ` +
          `margin-left: .5rem; cursor: pointer; ` +
          `fill: ${ColorScheme.getContent()};" viewBox="0 0 200 200"`,
        E.path(
          `class="block-entry-remove-path" ` +
            `d="M45 0 L100 55 L155 0 L200 45 L145 100 L200 155 L155 200 L100 145 L45 200 L0 155 L55 100 L0 45 z"`
        )
      )
    );
    return [body, removeButtonRef.val] as const;
  }

  public init(): this {
    this.lowlight();
    this.body.addEventListener("mouseover", () => this.highlight());
    this.body.addEventListener("mouseleave", () => this.lowlight());
    this.removeButton.addEventListener("click", () => this.remove());
    return this;
  }

  private lowlight(): void {
    this.body.style.color = ColorScheme.getHighlightContent();
    this.removeButton.style.display = "none";
  }

  private highlight(): void {
    this.body.style.color = ColorScheme.getContent();
    this.removeButton.style.display = "block";
  }

  private remove(): void {
    this.body.remove();
    this.emit("remove", this.blockPattern);
  }
}
