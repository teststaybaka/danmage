import { ChatEntry } from "../../../interface/chat_entry";
import { BlockSettings } from "../../../interface/player_settings";
import { BlockPatternTester } from "./common/block_pattern_tester";

export interface ChatPool {
  fill: (chatEntries: Array<ChatEntry>) => void;
  clear: () => void;
  start: (timestamp: number) => void;
  read: (timestamp: number) => Array<ChatEntry>;
}

export class StructuredChatPool implements ChatPool {
  public static create(blockSettings: BlockSettings): StructuredChatPool {
    return new StructuredChatPool(
      BlockPatternTester.createIdentity(blockSettings),
    );
  }

  private static ANONYMOUS = "Anonymous";

  private lastTimestamp: number = 0; // ms
  private chatEntries = new Array<ChatEntry>();
  private lastIndex = 0;

  public constructor(private blockTester: BlockPatternTester) {}

  public fill(newChatEntries: Array<ChatEntry>): void {
    for (let newChatEntry of newChatEntries) {
      if (!newChatEntry.userNickname) {
        newChatEntry.userNickname = StructuredChatPool.ANONYMOUS;
      }
    }

    let rightChatEntries = newChatEntries.sort((l, r) => {
      return l.timestamp - r.timestamp;
    });
    let leftChatEntries = this.chatEntries;
    this.chatEntries = [];
    let leftPointer = 0;
    let rightPointer = 0;
    while (
      leftPointer < leftChatEntries.length &&
      rightPointer < rightChatEntries.length
    ) {
      let left = leftChatEntries[leftPointer];
      let right = rightChatEntries[rightPointer];
      if (left.timestamp <= right.timestamp) {
        this.chatEntries.push(left);
        leftPointer++;
      } else {
        this.chatEntries.push(right);
        rightPointer++;
      }
    }
    for (; leftPointer < leftChatEntries.length; leftPointer++) {
      this.chatEntries.push(leftChatEntries[leftPointer]);
    }
    for (; rightPointer < rightChatEntries.length; rightPointer++) {
      this.chatEntries.push(rightChatEntries[rightPointer]);
    }

    this.binarySearchReadPointer();
  }

  private binarySearchReadPointer(): void {
    let left = 0;
    let right = this.chatEntries.length;
    while (left < right) {
      let mid = Math.floor((left + right) / 2);
      let chatEntry = this.chatEntries[mid];
      if (chatEntry.timestamp < this.lastTimestamp) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    this.lastIndex = left;
  }

  public clear(): void {
    this.chatEntries = [];
  }

  public start(destinationTimestamp: number /* ms */): void {
    this.lastTimestamp = destinationTimestamp;
    this.binarySearchReadPointer();
  }

  public read(currentTimestamp: number /* ms */): Array<ChatEntry> {
    let returnChatEntries = new Array<ChatEntry>();
    for (
      ;
      this.lastIndex < this.chatEntries.length &&
      this.chatEntries[this.lastIndex].timestamp < currentTimestamp;
      this.lastIndex++
    ) {
      let chatEntry = this.chatEntries[this.lastIndex];
      if (this.blockTester.test(chatEntry)) {
        continue;
      }
      returnChatEntries.push(chatEntry);
    }
    this.lastTimestamp = currentTimestamp;
    return returnChatEntries;
  }
}

export class YouTubeChatPool implements ChatPool {
  public static create(
    chatContainer: Element,
    blockSettings: BlockSettings,
  ): YouTubeChatPool {
    return new YouTubeChatPool(
      chatContainer,
      BlockPatternTester.createHtml(blockSettings),
    );
  }

  private lastLogElement: Element;

  public constructor(
    private chatContainer: Element,
    private blockTester: BlockPatternTester,
  ) {}

  public fill(): void {
    // Do nothing.
  }

  public clear(): void {
    // Do nothing.
  }

  public start(): void {
    this.lastLogElement = this.chatContainer.lastElementChild;
  }

  public read(): Array<ChatEntry> {
    let logElementPointer: Element;
    if (this.chatContainer.contains(this.lastLogElement)) {
      logElementPointer = this.lastLogElement.nextElementSibling;
    } else {
      logElementPointer = this.chatContainer.firstElementChild;
    }

    let returnChatEntries = new Array<ChatEntry>();
    for (
      ;
      logElementPointer;
      this.lastLogElement = logElementPointer,
        logElementPointer = logElementPointer.nextElementSibling
    ) {
      let chatEntry: ChatEntry = {
        content: logElementPointer.innerHTML,
      };
      if (this.blockTester.test(chatEntry)) {
        continue;
      }

      returnChatEntries.push(chatEntry);
    }
    return returnChatEntries;
  }
}

export class TwitchChatPool implements ChatPool {
  public static create(
    chatContainer: Element,
    blockSettings: BlockSettings,
  ): TwitchChatPool {
    return new TwitchChatPool(
      chatContainer,
      BlockPatternTester.createHtml(blockSettings),
    );
  }

  private static TW_HIDE_CLASS = "tw-hide";

  private logElementPointer: Element;

  public constructor(
    private chatContainer: Element,
    private blockTester: BlockPatternTester,
  ) {}

  public fill(): void {
    // Do nothing.
  }

  public clear(): void {
    // Do nothing.
  }

  public start(): void {
    this.logElementPointer = this.chatContainer.lastElementChild;
  }

  public read(): Array<ChatEntry> {
    let nextLogElementPointer: Element;
    if (this.chatContainer.contains(this.logElementPointer)) {
      nextLogElementPointer = this.logElementPointer.nextElementSibling;
    } else {
      nextLogElementPointer = this.chatContainer.firstElementChild;
    }

    let returnChatEntries = new Array<ChatEntry>();
    for (
      ;
      nextLogElementPointer;
      this.logElementPointer = nextLogElementPointer,
        nextLogElementPointer = nextLogElementPointer.nextElementSibling
    ) {
      let htmlContent = nextLogElementPointer.innerHTML;
      // Silly twitch hidden emoticons. Stop and try from here next time.
      if (htmlContent.indexOf(TwitchChatPool.TW_HIDE_CLASS) !== -1) {
        break;
      }

      let chatEntry: ChatEntry = {
        content: htmlContent,
      };
      if (this.blockTester.test(chatEntry)) {
        continue;
      }

      returnChatEntries.push(chatEntry);
    }
    return returnChatEntries;
  }
}
