import { ORIGIN_LOCAL, ORIGIN_PROD } from "../../../common";
import { CLASSIC_COLOR_SCHEME, ColorScheme } from "../../color_scheme";
import { BodyRefresher } from "./body_refresher";
import { PlayerSettingsStorage } from "./player_settings_storage";
import { SERVICE_CLIENT } from "./service_client";
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

  let playerSettings = await PlayerSettingsStorage.create().read();
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
