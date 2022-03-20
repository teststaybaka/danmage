import { BackgroundRequest } from "../../interface/background_service";

export class BackgroungServiceClient {
  public send(request: BackgroundRequest): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      chrome.runtime.sendMessage(
        chrome.runtime.id,
        request,
        {},
        (response: any) => {
          if (!response) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        }
      );
    });
  }
}

export let BACKGROUND_SERVICE_CLIENT = new BackgroungServiceClient();
