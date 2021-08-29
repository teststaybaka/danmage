export class ChromeRuntime {
  public static create(): ChromeRuntime {
    return new ChromeRuntime();
  }

  public sendMessage(request: any): Promise<any> {
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
