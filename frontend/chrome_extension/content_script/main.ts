import { ORIGIN_LOCAL, ORIGIN_PROD } from "../../../common";
import { CLASSIC_COLOR_SCHEME, ColorScheme } from "../../color_scheme";
import { SERVICE_CLIENT } from "../common/service_client";
import { PLAYER_SETTINGS_STORAGE } from "./common/player_settings_storage";
import { Refresher } from "./refresher";
import "../../../environment";

async function main(): Promise<void> {
  if (globalThis.ENVIRONMENT === "prod") {
    SERVICE_CLIENT.baseUrl = ORIGIN_PROD;
  } else if (globalThis.ENVIRONMENT === "local") {
    SERVICE_CLIENT.baseUrl = ORIGIN_LOCAL;
  } else {
    throw new Error("Unsupported environment.");
  }
  ColorScheme.SCHEME = CLASSIC_COLOR_SCHEME;
  document.documentElement.style.fontSize = "62.5%";

  let playerSettings = await PLAYER_SETTINGS_STORAGE.read();
  switch (location.hostname) {
    case "www.youtube.com":
      Refresher.createYouTube(playerSettings);
      break;
    case "www.twitch.tv":
      Refresher.createTwitch(playerSettings);
      break;
    case "static.crunchyroll.com":
      Refresher.createCrunchyroll(playerSettings);
      break;
    default:
      throw new Error(`Unsupported hostname: ${location.hostname}.`);
  }
}

main();
