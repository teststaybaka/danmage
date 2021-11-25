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
    private removeButton: HTMLDivElement,
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
    let removeButtonRef = new Ref<HTMLDivElement>();
    let body = E.div(
      {
        class: "block-entry-container",
        style: `display: flex; flex-flow: row nowrap; align-items: center; padding: .4rem 0;`,
      },
      E.div(
        {
          class: "block-entry-type",
          style: `font-size: 1.4rem; line-height: 120%; font-family: initial !important; padding-right: .5rem;`,
        },
        E.text(chrome.i18n.getMessage(BlockKind[blockPattern.kind]))
      ),
      E.div(
        {
          class: "block-entry-content",
          style: `flex-grow: 1; font-size: 1.4rem; line-height: 120%; font-family: initial !important; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`,
          title: blockPattern.content,
        },
        E.text(blockPattern.content)
      ),
      E.divRef(
        removeButtonRef,
        {
          class: "block-entry-remove-button",
          style: `flex-shrink: 0; height: 1rem; margin-left: .5rem; cursor: pointer; fill: ${ColorScheme.getContent()};`,
        },
        E.svg(
          {
            class: "block-entry-remove-button-svg",
            style: `display: block; height: 100%;`,
            viewBox: "0 0 200 200",
          },
          E.path({
            class: "block-entry-remove-button-path",
            d: "M45 0 L100 55 L155 0 L200 45 L145 100 L200 155 L155 200 L100 145 L45 200 L0 155 L55 100 L0 45 z",
          })
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
    this.body.style.color = ColorScheme.getContent();
    this.removeButton.style.display = "none";
  }

  private highlight(): void {
    this.body.style.color = ColorScheme.getHighlightContent();
    this.removeButton.style.display = "block";
  }

  private remove(): void {
    this.body.remove();
    this.emit("remove", this.blockPattern);
  }
}
