import { ORIGIN_LOCAL, ORIGIN_PROD } from "../../../common";
import { SIGN_IN } from "../../../interface/service";
import {
  BACKGROUND_REQUEST,
  GetSessionResponse,
  GetUrlResponse,
  ReadPlayerSettingsResponse,
  SavePlayerSettingsResponse,
  SignInResponse,
  SignOutResponse,
} from "../interface/background_service";
import { parseMessage } from "@selfage/message/parser";
import { ServiceClient } from "@selfage/service_client";
import { LocalSessionStorage } from "@selfage/service_client/local_session_storage";
import "../../../environment";

let PLAYER_SETTINGS_STORAGE_KEY = "player_settings";
let LOCAL_SESSION_STORAGE = new LocalSessionStorage();
let SERVICE_CLIENT = new ServiceClient(
  LOCAL_SESSION_STORAGE,
  window.fetch.bind(window)
);

async function handle(
  data: any,
  sender: chrome.runtime.MessageSender
): Promise<any> {
  let backgroundRequest = parseMessage(data, BACKGROUND_REQUEST);
  if (backgroundRequest.signInRequest) {
    let token = await new Promise<string>((resolve) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        resolve(token);
      });
    });
    if (!token) {
      return {} as SignInResponse;
    }

    let response = await SERVICE_CLIENT.fetchUnauthed(
      { googleAccessToken: token },
      SIGN_IN
    );
    LOCAL_SESSION_STORAGE.save(response.signedSession);
    return {} as SignInResponse;
  } else if (backgroundRequest.signOutRequest) {
    LOCAL_SESSION_STORAGE.clear();
    return {} as SignOutResponse;
  } else if (backgroundRequest.getSessionRequest) {
    return {
      signedSession: LOCAL_SESSION_STORAGE.read(),
    } as GetSessionResponse;
  } else if (backgroundRequest.getUrlRequest) {
    return {
      url: sender.tab.url,
    } as GetUrlResponse;
  } else if (backgroundRequest.savePlayerSettingsRequest) {
    localStorage.setItem(
      PLAYER_SETTINGS_STORAGE_KEY,
      backgroundRequest.savePlayerSettingsRequest.playerSettingsStringified
    );
    return {} as SavePlayerSettingsResponse;
  } else if (backgroundRequest.readPlayerSettingsRequest) {
    let playerSettingsStringified = localStorage.getItem(
      PLAYER_SETTINGS_STORAGE_KEY
    );
    return { playerSettingsStringified } as ReadPlayerSettingsResponse;
  }
}

function main(): void {
  if (globalThis.ENVIRONMENT === "prod") {
    SERVICE_CLIENT.origin = ORIGIN_PROD;
  } else if (globalThis.ENVIRONMENT === "local") {
    SERVICE_CLIENT.origin = ORIGIN_LOCAL;
  } else {
    throw new Error("Unsupported environment.");
  }

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
