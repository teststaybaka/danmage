import {
  BACKGROUND_REQUEST,
  GetAuthTokenResponse,
  GetUrlResponse,
} from "../interface/background_service";
import { parseMessage } from "@selfage/message/parser";

async function handle(
  data: any,
  sender: chrome.runtime.MessageSender
): Promise<any> {
  let backgroundRequest = parseMessage(data, BACKGROUND_REQUEST);
  if (backgroundRequest.getUrlRequest) {
    return {
      url: sender.tab.url,
    } as GetUrlResponse;
  } else if (backgroundRequest.getAuthTokenRequest) {
    let token = await new Promise<string>((resolve) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        resolve(token);
      });
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
    }
  );
}

main();
