import { parseGoogleAccessToken } from "../../common/oauth_helper";

function main(): void {
  let accessToken = parseGoogleAccessToken(window.location.href);
  if (accessToken) {
    window.opener.postMessage(accessToken);
  }
  window.close();
}

main();
