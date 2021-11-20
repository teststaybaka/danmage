import CRUNCHYROLL_VIDEO_PATH = require("../assets/crunchyroll.mp4");
import TWITCH_VIDEO_PATH = require("../assets/twitch.mp4");
import INTRO_VIDEO_PATH = require("../assets/twitch_youtube.mp4");
import YOUTUBE_VIDEO_PATH = require("../assets/youtube.mp4");
import { ColorScheme } from "../../color_scheme";
import { SIDE_PADDING } from "./common_style";
import { E } from "@selfage/element/factory";

export class HomeView {
  private static FONT_SIZE = "2rem";
  private static MAX_WIDTH = "128rem";

  public static create(): HTMLDivElement {
    return E.div(
      { class: "home-container" },
      HomeView.paragraph(
        ColorScheme.getBackground(),
        INTRO_VIDEO_PATH,
        HomeView.textElement(
          `DanMage is a Chrome extension that introduces NicoNico-style ` +
            `chats (or Danmaku, bullet comments, scrolling comments) to ` +
            `video sites. It currently supports Twitch, YouTube and ` +
            `Crunchyroll. Get it here:`,
          ColorScheme.getContent()
        ),
        HomeView.link(
          "https://chrome.google.com/webstore/detail/danmage/elhaopojedichjdgkglifmijgkeclalm"
        ),
        HomeView.textElement(
          `It's also open-sourced at:`,
          ColorScheme.getContent()
        ),
        HomeView.link("https://github.com/teststaybaka/danmage")
      ),
      HomeView.paragraph(
        `rgb(100,65,164)`,
        TWITCH_VIDEO_PATH,
        HomeView.textElement(
          `On Twitch, it works on both live streams and recordings. Find ` +
            `customizable options around Twitch's chat room. Unfortunatley, ` +
            `you have to keep the chat room visible, or it will disconnet ` +
            `from Twitch's chat server.`,
          "white"
        )
      ),
      HomeView.paragraph(
        `rgb(255,0,0)`,
        YOUTUBE_VIDEO_PATH,
        HomeView.textElement(
          `On YouTube, it works on live streams, live recordings, premiere, ` +
            `and regular videos.`,
          "white"
        ),
        HomeView.textElement(
          `For live streams, live recordings, and premiere, you need to ` +
            `enable YouTube chat. Then you can Find customizable options ` +
            `around YouTube's chat room.`,
          "white"
        ),
        HomeView.textElement(
          `Unfortunatley for regular videos, you might not find any chats ` +
            `because this extension hasn't gained enough popularity ` +
            `¯\\_(ツ)_/¯, but it's working technically. Find customizable ` +
            `options around video player controller, which can also be used ` +
            `to post chats, after signed in to the extension. Chats will be ` +
            `stored in this site.`,
          "white"
        )
      ),
      HomeView.paragraph(
        `rgb(223,99,0)`,
        CRUNCHYROLL_VIDEO_PATH,
        HomeView.textElement(
          `It works on Crunchyroll videos, though unfortunatley you might ` +
            `not find any chats because this extension hasn't gained enough ` +
            `popularity ¯\\_(ツ)_/¯. Find customizable options around video ` +
            `player controller, which can also be used to post chats, after ` +
            `signed in to the extension. Chats will be stored in this site.`,
          "white"
        )
      )
    );
  }

  private static paragraph(
    backgroundColor: string,
    videoPath: string,
    ...textElements: Array<HTMLElement>
  ): HTMLElement {
    return E.div(
      {
        class: "home-paragraph",
        style: `display: flex; flex-flow: column nowrap; align-items: center; padding: 0 ${SIDE_PADDING}rem; background-color: ${backgroundColor};`,
      },
      HomeView.video(videoPath),
      ...textElements
    );
  }

  private static video(videoPath: string): HTMLElement {
    let v = E.video({
      class: "home-video",
      style: `width: 100%; max-width: ${HomeView.MAX_WIDTH}; margin: ${
        SIDE_PADDING / 2
      }rem 0;`,
      src: videoPath,
    });
    v.autoplay = true;
    v.muted = true;
    v.loop = true;
    return v;
  }

  private static textElement(text: string, color: string): HTMLElement {
    return E.div(
      {
        class: "home-text",
        style: `width: 100%; font-size: ${HomeView.FONT_SIZE}; max-width: ${
          HomeView.MAX_WIDTH
        }; margin-bottom: ${SIDE_PADDING / 2}rem; color: ${color};`,
      },
      E.text(text)
    );
  }

  private static link(url: string): HTMLElement {
    return E.a(
      {
        style:
          `width: 100%; font-size: ${HomeView.FONT_SIZE}; max-width: ${
            HomeView.MAX_WIDTH
          }; margin-bottom: ${
            SIDE_PADDING / 2
          }rem; color: ${ColorScheme.getLinkContent()}; ` +
          `word-break: break-all; text-decoration: none;`,
        href: url,
        target: "_blank",
      },
      E.text(url)
    );
  }
}
