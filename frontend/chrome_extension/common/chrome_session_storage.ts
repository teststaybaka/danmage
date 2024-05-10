import { SessionStorage } from "@selfage/web_service_client/session_storage";

export class ChromeSessionStorage implements SessionStorage {
  private static NAME = "UserSession";

  public save(session: string): Promise<void> {
    return chrome.storage.sync.set({ [ChromeSessionStorage.NAME]: session });
  }

  public async read(): Promise<string> {
    let result = await chrome.storage.sync.get(ChromeSessionStorage.NAME);
    return result[ChromeSessionStorage.NAME];
  }

  public clear(): Promise<void> {
    return chrome.storage.sync.remove(ChromeSessionStorage.NAME);
  }
}

export let CHROME_SESSION_STORAGE = new ChromeSessionStorage();
