import { ORIGIN_LOCAL, ORIGIN_PROD } from "../../../common";
import { PlayerSettings } from "../../../interface/player_settings";
import { getPlayerSettings } from "../../client_requests";
import { CLASSIC_COLOR_SCHEME, ColorScheme } from "../../color_scheme";
import { SERVICE_CLIENT } from "../common/service_client";
import {
  BOTTOM_MARGIN_RANGE,
  DENSITY_RANGE,
  DISTRIBUTION_STYLE_DEFAULT,
  ENABLE_CHAT_SCROLLING_DEFAULT,
  FONT_FAMILY_DEFAULT,
  FONT_SIZE_RANGE,
  OPACITY_RANGE,
  SHOW_USER_NAME_DEFAULT,
  SPEED_RANGE,
  TOP_MARGIN_RANGE,
} from "./common/defaults";
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

  let playerSettings = normalizePlayerSettings(
    (await getPlayerSettings(SERVICE_CLIENT, {})).playerSettings,
  );
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

function normalizePlayerSettings(
  playerSettings?: PlayerSettings,
): PlayerSettings {
  if (!playerSettings) {
    playerSettings = {};
  }

  if (!playerSettings.displaySettings) {
    playerSettings.displaySettings = {};
  }
  let displaySettings = playerSettings.displaySettings;
  displaySettings.speed = SPEED_RANGE.getValidValue(displaySettings.speed);
  displaySettings.opacity = OPACITY_RANGE.getValidValue(
    displaySettings.opacity,
  );
  displaySettings.fontSize = FONT_SIZE_RANGE.getValidValue(
    displaySettings.fontSize,
  );
  displaySettings.density = DENSITY_RANGE.getValidValue(
    displaySettings.density,
  );
  displaySettings.topMargin = TOP_MARGIN_RANGE.getValidValue(
    displaySettings.topMargin,
  );
  displaySettings.bottomMargin = BOTTOM_MARGIN_RANGE.getValidValue(
    displaySettings.bottomMargin,
  );
  if (!displaySettings.fontFamily) {
    displaySettings.fontFamily = FONT_FAMILY_DEFAULT;
  }
  if (displaySettings.showUserName === undefined) {
    displaySettings.showUserName = SHOW_USER_NAME_DEFAULT;
  }
  if (displaySettings.enable === undefined) {
    displaySettings.enable = ENABLE_CHAT_SCROLLING_DEFAULT;
  }
  if (displaySettings.distributionStyle === undefined) {
    displaySettings.distributionStyle = DISTRIBUTION_STYLE_DEFAULT;
  }

  if (!playerSettings.blockSettings) {
    playerSettings.blockSettings = {};
  }
  let blockSettings = playerSettings.blockSettings;
  if (!blockSettings.blockPatterns) {
    blockSettings.blockPatterns = [];
  }
  return playerSettings;
}

main();
