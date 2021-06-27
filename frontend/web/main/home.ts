import image1Path = require("../image/1.jpg");
import image2Path = require("../image/2.jpg");
import image3Path = require("../image/3.jpg");
import image4Path = require("../image/4.jpg");
import image5Path = require("../image/5.jpg");
import image6Path = require("../image/6.jpg");
import { ColorScheme } from "../../color_scheme";
import { E } from "@selfage/element/factory";

export class Home {
  private static IMAGE_PATHS = [
    image1Path,
    image2Path,
    image3Path,
    image4Path,
    image5Path,
    image6Path,
  ];

  public static create(): HTMLElement {
    return E.div(
      `class="home-container"`,
      Home.paragraph(
        1,
        Home.textElement(
          `DanMage is a Chrome extension that introduces NicoNico-style ` +
            `chats (or Danmaku, bullet comments, scrolling comments, ` +
            `whatever you call it) into video sites. It currently supports ` +
            `Twitch, YouTube and Crunchyroll. Get it here:`
        ),
        E.a(
          `style="display: block; color: ${ColorScheme.getLinkContent()}; ` +
            `word-break: break-all; margin-bottom: 1rem;"`,
          E.text(
            "https://chrome.google.com/webstore/detail/danmage/elhaopojedichjdgkglifmijgkeclalm"
          )
        )
      ),
      Home.paragraph(
        2,
        Home.textElement(
          `When watching videos on YouTube, the extension will replay ` +
            `chats scrolling from right to left. The control panel is ` +
            `located alongside with YouTube player settings, which ` +
            `displays as well as posts chats.`
        ),
        Home.textElement(
          `Click on "Fire!" button to post a chat. The chat you posted ` +
            `will be sent to this site, separated from YouTube. You can ` +
            `find your chat history on this site.`
        )
      ),
      Home.paragraph(
        3,
        Home.textElement(
          `When watching videos on Crunchyroll, it works exactly the same ` +
            `way as watching videos on YouTube.`
        ),
        Home.textElement(
          `Click on those icons at the top-right corner of the control ` +
            `panel, you will find plenty of options to control how ` +
            `chats are scrolling over your videos.`
        )
      ),
      Home.paragraph(
        4,
        Home.textElement(
          `When watching live stream on YouTube, the control panel can be ` +
            `found by clicking on the icon at top-right corner of the chat ` +
            `room.`
        ),
        Home.textElement(
          `The control panel itself won't display any chat and you cannot ` +
            `post any chat there either. You can chat normally via ` +
            `YouTube's chat window and all chats will be captured and ` +
            `scrolled over the live stream, as long as you don't pop the ` +
            `chat window out of the video page.`
        ),
        Home.textElement(
          `By default, the control panel shows a list of display settings ` +
            `which are stored for each site but could be cross-site if ` +
            `signed in, so you only need to set them once. However, there ` +
            `are certain options that only make sense in certain sites.`
        )
      ),
      Home.paragraph(
        5,
        Home.textElement(
          `When watching live stream on Twitch, the control panel can be ` +
            `found by clicking on the icon next to Twitch's chat room ` +
            `options.`
        ),
        Home.textElement(
          `Same as YouTube live stream, the control panel itself won't ` +
            `display any chat and you cannot post any chat there either. ` +
            `You can chat normally via Twitch's chat room and all chats ` +
            `will be captured and scrolled over the live stream, as long ` +
            `as you don't hide chats.`
        )
      ),
      Home.paragraph(
        6,
        Home.textElement(
          `There is another setting named "Block settings", a.k.a., ` +
            `filtering. You can add rules to block certain chats from ` +
            `scrolling over the video you are watching (and from ` +
            `displaying at all in YouTube playback videos). E.g., people ` +
            `are f**king copy-pasting chats! If you don't want to ` +
            `learn/use regular expression, just find one or two keywords ` +
            `and add them here. You can always remove them later.`
        )
      )
    );
  }

  private static paragraph(
    index: number,
    ...textElements: Array<HTMLElement>
  ): HTMLElement {
    let backgroundColor: string;
    let wrap: string;
    let alignItems: string;
    if (index % 2 == 1) {
      backgroundColor = ColorScheme.getBackground();
      wrap = "wrap";
      alignItems = "flex-start";
    } else {
      backgroundColor = ColorScheme.getAlternativeBackground();
      wrap = "wrap-reverse";
      alignItems = "flex-end";
    }
    let paragraph = E.div(
      `class="home-paragraph" style="display: flex; flex-flow: row ${wrap}; ` +
        `justify-content: center; align-items: ${alignItems}; ` +
        `padding: 2.5rem; background-color: ${backgroundColor};"`
    );
    if (index % 2 == 1) {
      paragraph.appendChild(Home.picture(Home.IMAGE_PATHS[index - 1]));
      paragraph.appendChild(Home.textContainer(index, textElements));
    } else {
      paragraph.appendChild(Home.textContainer(index, textElements));
      paragraph.appendChild(Home.picture(Home.IMAGE_PATHS[index - 1]));
    }
    return paragraph;
  }

  private static picture(imagePath: string): HTMLElement {
    let pic = E.image(
      `class="home-picture" style="width: 70rem; padding: 2.5rem;"`
    );
    pic.src = imagePath;
    return pic;
  }

  private static textContainer(
    index: number,
    textElements: Array<HTMLElement>
  ): HTMLElement {
    return E.div(
      `class="home-text-container" style="flex: 1 0 20rem; ` +
        `padding: 2.5rem 2.5rem 1.5rem; font-size: 1.6rem; ` +
        `color: ${ColorScheme.getContent()};"`,
      ...textElements
    );
  }

  private static textElement(text: string): HTMLElement {
    return E.div(
      `class="home-text" style="margin-bottom: 1rem;"`,
      E.text(text)
    );
  }
}
