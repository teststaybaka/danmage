import { ORIGIN_LOCAL, ORIGIN_PROD } from "../../../common";
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

  let extractRegex = /access_token=(.*?)($|&)/;
  let match = window.location.hash.match(extractRegex);
  if (match) {
    let accessToken = match[1];
    window.parent.postMessage(accessToken, origin);
  }
}

main();
