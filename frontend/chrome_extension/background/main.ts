import {
  getGoogleOauthUrl,
  parseGoogleAccessToken,
} from "../../common/oauth_helper";
import {
  BACKGROUND_REQUEST,
  GetAuthTokenResponse,
  GetUrlResponse,
} from "../interface/background_service";
import { parseMessage } from "@selfage/message/parser";

async function handle(
  data: any,
  sender: chrome.runtime.MessageSender,
): Promise<any> {
  let backgroundRequest = parseMessage(data, BACKGROUND_REQUEST);
  if (backgroundRequest.getUrlRequest) {
    return {
      url: sender.tab.url,
    } as GetUrlResponse;
  } else if (backgroundRequest.getAuthTokenRequest) {
    let redirectUri = chrome.identity.getRedirectURL();
    console.log("redirectUri", redirectUri);
    let token = await new Promise<string>((resolve) => {
      chrome.identity.launchWebAuthFlow(
        {
          url: getGoogleOauthUrl(redirectUri),
          interactive: true,
        },
        (responseUrl) => {
          resolve(parseGoogleAccessToken(responseUrl));
        },
      );
    });
    if (!token) {
      return {} as GetAuthTokenResponse;
    } else {
      return { accessToken: token } as GetAuthTokenResponse;
    }
  }
}

function main(): void {
  chrome.runtime.onMessage.addListener(
    (data, sender, sendResponse): boolean => {
      if (sender.id !== chrome.runtime.id) {
        return false;
      }

      handle(data, sender).then((response) => sendResponse(response));
      return true;
    },
  );
}

main();
