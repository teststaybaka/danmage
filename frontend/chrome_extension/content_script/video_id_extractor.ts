import {
  BackgroundRequest,
  GET_URL_RESPONSE,
} from "../interface/background_service";
import { ChromeRuntime } from "./chrome_runtime";
import { parseMessage } from "@selfage/message/parser";

export interface VideoIdExtractor {
  extract: () => Promise<string | undefined> | string | undefined;
}

export class YouTubeVideoIdExtractor implements VideoIdExtractor {
  private static AD_SHOWING_CLASSNAME = "ad-showing";
  private static AD_OVERLAY_CLASSNAME = "ytp-ad-overlay-open";
  private static VIDEO_ID_EXTRACTION = /^.*?v=(.+?)(?:&.*?|)$/;

  public constructor(private canvas: HTMLElement, private location: Location) {}

  public static create(canvas: HTMLElement): YouTubeVideoIdExtractor {
    return new YouTubeVideoIdExtractor(canvas, location);
  }

  public extract(): string | undefined {
    if (
      this.canvas.classList.contains(
        YouTubeVideoIdExtractor.AD_SHOWING_CLASSNAME
      ) &&
      !this.canvas.classList.contains(
        YouTubeVideoIdExtractor.AD_OVERLAY_CLASSNAME
      )
    ) {
      return undefined;
    }
    let videoIdMatched = this.location.href.match(
      YouTubeVideoIdExtractor.VIDEO_ID_EXTRACTION
    );
    return videoIdMatched[1];
  }
}

export class CrunchyrollVideoIdExtractor implements VideoIdExtractor {
  private static VIDEO_ID_EXTRACTION =
    /^.*?www\.crunchyroll\.com\/(.+?)(?:\?.*?|)$/;

  public constructor(private chromeRuntime: ChromeRuntime) {}

  public static create(): CrunchyrollVideoIdExtractor {
    return new CrunchyrollVideoIdExtractor(new ChromeRuntime());
  }

  public async extract(): Promise<string | undefined> {
    let request: BackgroundRequest = {
      getUrlRequest: {},
    };
    let rawResponse = await this.chromeRuntime.sendMessage(request);
    let response = parseMessage(rawResponse, GET_URL_RESPONSE);
    let videoIdMatched = response.url.match(
      CrunchyrollVideoIdExtractor.VIDEO_ID_EXTRACTION
    );
    return videoIdMatched[1];
  }
}

export class NoopVideoIdExtractor implements VideoIdExtractor {
  public static create(): NoopVideoIdExtractor {
    return new NoopVideoIdExtractor();
  }

  public extract(): string | undefined {
    return undefined;
  }
}
