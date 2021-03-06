import { ORIGIN_LOCAL, ORIGIN_PROD } from "../../../common";
import { CLASSIC_COLOR_SCHEME, ColorScheme } from "../../color_scheme";
import { CHROME_PLAYER_SETTINGS_STORAGE } from "../common/chrome_player_settings_storage";
import { SERVICE_CLIENT } from "../common/service_client";
import { BodyRefresher } from "./body_refresher";
import "../../../environment";

async function main(): Promise<void> {
  if (globalThis.ENVIRONMENT === "prod") {
    SERVICE_CLIENT.origin = ORIGIN_PROD;
  } else if (globalThis.ENVIRONMENT === "local") {
    SERVICE_CLIENT.origin = ORIGIN_LOCAL;
  } else {
    throw new Error("Unsupported environment.");
  }
  ColorScheme.SCHEME = CLASSIC_COLOR_SCHEME;

  let playerSettings = await CHROME_PLAYER_SETTINGS_STORAGE.read();
  switch (location.hostname) {
    case "www.youtube.com":
      BodyRefresher.createYouTube(playerSettings);
      break;
    case "www.twitch.tv":
      BodyRefresher.createTwitch(playerSettings);
      break;
    case "static.crunchyroll.com":
      BodyRefresher.createCrunchyroll(playerSettings);
      break;
    default:
      throw new Error(`Unsupported hostname: ${location.hostname}.`);
  }
}

main();
