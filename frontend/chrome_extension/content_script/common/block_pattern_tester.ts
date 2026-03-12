import { ChatEntry } from "../../../../interface/chat_entry";
import {
  BlockKind,
  BlockSettings,
} from "../../../../interface/player_settings";
import { ChatContentBuilder } from "./chat_content_builder";

export interface ContentExtractor {
  extract: (content: string) => string;
}

class IdentityExtractor implements ContentExtractor {
  public extract(content: string): string {
    return content;
  }
}

class HtmlExtractor implements ContentExtractor {
  private static TAG_REPLACER = /<.*?>/g;

  public extract(content: string): string {
    return content.replace(HtmlExtractor.TAG_REPLACER, "");
  }
}

export class BlockPatternTester {
  public static createIdentity(
    contentBuilder: ChatContentBuilder,
    blockSettings: BlockSettings,
  ): BlockPatternTester {
    return new BlockPatternTester(
      blockSettings,
      new IdentityExtractor(),
      contentBuilder,
    );
  }

  public static createHtml(
    contentBuilder: ChatContentBuilder,
    blockSettings: BlockSettings,
  ): BlockPatternTester {
    return new BlockPatternTester(
      blockSettings,
      new HtmlExtractor(),
      contentBuilder,
    );
  }

  public constructor(
    private blockSettings: BlockSettings,
    private contentExtractor: ContentExtractor,
    private contentBuilder: ChatContentBuilder,
  ) {}

  public test(chatEntry: ChatEntry): boolean {
    for (let blockPattern of this.blockSettings.blockPatterns) {
      let content = this.contentExtractor.extract(
        this.contentBuilder.extractContent(chatEntry.content),
      );
      switch (blockPattern.kind) {
        case BlockKind.KeywordBlockKind:
          if (
            content
              .toLocaleLowerCase()
              .includes(blockPattern.content.toLocaleLowerCase())
          ) {
            return true;
          }
          break;
        case BlockKind.RegExpBlockKind:
          let regExp = new RegExp(blockPattern.content);
          if (regExp.test(content)) {
            return true;
          }
          break;
      }
    }

    return false;
  }
}
