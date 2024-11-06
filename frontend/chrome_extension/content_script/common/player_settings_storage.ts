import {
  PLAYER_SETTINGS,
  PlayerSettings,
} from "../../../../interface/player_settings";
import {
  getPlayerSettings,
  updatePlayerSettings,
} from "../../../client_requests";
import { SERVICE_CLIENT } from "../../common/service_client";
import {
  BOTTOM_MARGIN_RANGE,
  DENSITY_RANGE,
  DISTRIBUTION_STYLE_DEFAULT,
  ENABLE_CHAT_INTERACTION_DEFAULT,
  ENABLE_CHAT_SCROLLING_DEFAULT,
  FONT_FAMILY_DEFAULT,
  FONT_SIZE_RANGE,
  FONT_WEIGHT_RANGE,
  OPACITY_RANGE,
  SHOW_USER_NAME_DEFAULT,
  SPEED_RANGE,
  TOP_MARGIN_RANGE,
} from "./defaults";
import { parseMessage } from "@selfage/message/parser";

export class PlayerSettingsStorage {
  private static NAME = "PlayerSettings";

  public async read(): Promise<PlayerSettings> {
    let playerSettings: PlayerSettings;
    try {
      playerSettings = (await getPlayerSettings(SERVICE_CLIENT, {}))
        .playerSettings;
    } catch (e) {
      playerSettings = parseMessage(
        JSON.parse(localStorage.getItem(PlayerSettingsStorage.NAME)),
        PLAYER_SETTINGS,
      );
    }
    return PlayerSettingsStorage.normalizePlayerSettings(playerSettings);
  }

  private static normalizePlayerSettings(
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
    displaySettings.fontWeight = FONT_WEIGHT_RANGE.getValidValue(
      displaySettings.fontWeight,
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
    if (displaySettings.enableInteraction === undefined) {
      displaySettings.enableInteraction = ENABLE_CHAT_INTERACTION_DEFAULT;
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

  public async save(playerSettings: PlayerSettings): Promise<void> {
    localStorage.setItem(
      PlayerSettingsStorage.NAME,
      JSON.stringify(playerSettings),
    );
    await updatePlayerSettings(SERVICE_CLIENT, {
      playerSettings,
    });
  }
}

export let PLAYER_SETTINGS_STORAGE = new PlayerSettingsStorage();
