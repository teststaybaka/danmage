import CRUNCHYROLL_VIDEO_PATH = require("../assets/crunchyroll.mp4");
import INTRO_VIDEO_PATH = require("../assets/intro.mp4");
import TWITCH_VIDEO_PATH = require("../assets/twitch.mp4");
import YOUTUBE_VIDEO_PATH = require("../assets/youtube.mp4");
import { ColorScheme } from "../../color_scheme";
import { SIDE_PADDING } from "./common_style";
import { LOCALIZED_TEXT } from "./localized_text";
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
        HomeView.textElement(LOCALIZED_TEXT.intro, ColorScheme.getContent()),
        HomeView.link(
          "https://chrome.google.com/webstore/detail/danmage/elhaopojedichjdgkglifmijgkeclalm"
        ),
        HomeView.textElement(LOCALIZED_TEXT.intro2, ColorScheme.getContent()),
        HomeView.link("https://github.com/teststaybaka/danmage")
      ),
      HomeView.paragraph(
        `rgb(100,65,164)`,
        TWITCH_VIDEO_PATH,
        HomeView.textElement(LOCALIZED_TEXT.introTwitch, "white")
      ),
      HomeView.paragraph(
        `rgb(255,0,0)`,
        YOUTUBE_VIDEO_PATH,
        HomeView.textElement(LOCALIZED_TEXT.introYouTube, "white"),
        HomeView.textElement(LOCALIZED_TEXT.introYouTube2, "white"),
        HomeView.textElement(LOCALIZED_TEXT.introYouTube3, "white")
      ),
      HomeView.paragraph(
        `rgb(223,99,0)`,
        CRUNCHYROLL_VIDEO_PATH,
        HomeView.textElement(LOCALIZED_TEXT.introCrunchyroll, "white")
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
