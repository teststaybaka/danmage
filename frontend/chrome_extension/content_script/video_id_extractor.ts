import {
  BackgroundRequest,
  GET_URL_RESPONSE,
} from "../interface/background_service";
import { BACKGROUND_SERVICE_CLIENT, BackgroungServiceClient } from "./common/background_service_client";
import { parseMessage } from "@selfage/message/parser";

export interface VideoIdExtractor {
  extract: () => Promise<string | undefined> | string | undefined;
}

export class YouTubeVideoIdExtractor implements VideoIdExtractor {
  private static AD_SHOWING_CLASSNAME = "ad-showing";
  private static AD_OVERLAY_CLASSNAME = "ytp-ad-overlay-open";

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
    return new URLSearchParams(this.location.search).get("v");
  }
}

export class CrunchyrollVideoIdExtractor implements VideoIdExtractor {
  private static VIDEO_ID_EXTRACTION =
    /^.*?\.crunchyroll\.com\/(?:watch\/){0,1}(.+?)(?:\?.*$|$)/;

  public constructor(private backgroundServiceClient: BackgroungServiceClient) {}

  public static create(): CrunchyrollVideoIdExtractor {
    return new CrunchyrollVideoIdExtractor(BACKGROUND_SERVICE_CLIENT);
  }

  public async extract(): Promise<string | undefined> {
    let request: BackgroundRequest = {
      getUrlRequest: {},
    };
    let rawResponse = await this.backgroundServiceClient.send(request);
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
