import { ORIGIN_LOCAL, ORIGIN_PROD } from "../../../common";
import { parseGoogleAccessToken } from "../../common/oauth_helper";
import "../../../environment";

function main(): void {
  let origin = "";
  if (globalThis.ENVIRONMENT === "prod") {
    origin = ORIGIN_PROD;
  } else if (globalThis.ENVIRONMENT === "local") {
    origin = ORIGIN_LOCAL;
  } else {
    throw new Error("Unsupported environment.");
  }

  let accessToken = parseGoogleAccessToken(window.location.href);
  if (accessToken) {
    window.opener.postMessage(accessToken, origin);
  }
  window.close();
}

main();
