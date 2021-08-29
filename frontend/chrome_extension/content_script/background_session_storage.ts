import {
  BackgroundRequest,
  GET_SESSION_RESPONSE,
} from "../interface/background_service";
import { ChromeRuntime } from "./chrome_runtime";
import { parseMessage } from "@selfage/message/parser";
import { SessionStorage } from "@selfage/service_client/session_storage";

export class BackgroundSessionStorage implements SessionStorage {
  public constructor(private chromeRuntime: ChromeRuntime) {}

  public static create(): BackgroundSessionStorage {
    return new BackgroundSessionStorage(ChromeRuntime.create());
  }

  public save(session: string): void {
    // Not implemented.
  }

  public async read(): Promise<string | undefined> {
    let request: BackgroundRequest = { getSessionRequest: {} };
    let rawResponse = await this.chromeRuntime.sendMessage(request);
    let response = parseMessage(rawResponse, GET_SESSION_RESPONSE);
    return response.signedSession;
  }

  public async clear(): Promise<void> {
    let request: BackgroundRequest = { signOutRequest: {} };
    await this.chromeRuntime.sendMessage(request);
  }
}
