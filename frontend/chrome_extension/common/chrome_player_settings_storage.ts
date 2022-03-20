import { PlayerSettings } from "../../../interface/player_settings";
import {
  BOTTOM_MARGIN_RANGE,
  DISTRIBUTION_STYLE_DEFAULT,
  ENABLE_CHAT_SCROLLING_DEFAULT,
  FONT_FAMILY_DEFAULT,
  FONT_SIZE_RANGE,
  NUM_LIMIT_RANGE,
  OPACITY_RANGE,
  SHOW_USER_NAME_DEFAULT,
  SPEED_RANGE,
  TOP_MARGIN_RANGE,
} from "./defaults";

export class ChromePlayerSettingsStorage {
  private static NAME = "PlayerSettings";

  public async read(): Promise<PlayerSettings> {
    let playerSettings: PlayerSettings;
    try {
      playerSettings = await new Promise<PlayerSettings>((resolve) => {
        chrome.storage.sync.get(
          ChromePlayerSettingsStorage.NAME,
          function (result) {
            resolve(result[ChromePlayerSettingsStorage.NAME]);
          }
        );
      });
    } catch (e) {
      // Do nothing.
    }

    return ChromePlayerSettingsStorage.normalizePlayerSettings(playerSettings);
  }

  private static normalizePlayerSettings(
    playerSettings?: PlayerSettings
  ): PlayerSettings {
    if (!playerSettings) {
      playerSettings = {};
    }

    if (!playerSettings.displaySettings) {
      playerSettings.displaySettings = {};
    }
    let displaySettings = playerSettings.displaySettings;
    displaySettings.speed = SPEED_RANGE.getValidValueWithDefault(
      displaySettings.speed
    );
    displaySettings.opacity = OPACITY_RANGE.getValidValueWithDefault(
      displaySettings.opacity
    );
    displaySettings.fontSize = FONT_SIZE_RANGE.getValidValueWithDefault(
      displaySettings.fontSize
    );
    displaySettings.numLimit = NUM_LIMIT_RANGE.getValidValueWithDefault(
      displaySettings.numLimit
    );
    displaySettings.topMargin = TOP_MARGIN_RANGE.getValidValueWithDefault(
      displaySettings.topMargin
    );
    displaySettings.bottomMargin = BOTTOM_MARGIN_RANGE.getValidValueWithDefault(
      displaySettings.bottomMargin
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

  public async save(playerSettings: PlayerSettings): Promise<void> {
    return new Promise<void>((resolve) => {
      chrome.storage.sync.set(
        { [ChromePlayerSettingsStorage.NAME]: playerSettings },
        function () {
          resolve();
        }
      );
    });
  }
}

export let CHROME_PLAYER_SETTINGS_STORAGE = new ChromePlayerSettingsStorage();
