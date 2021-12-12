import {
  PLAYER_SETTINGS,
  PlayerSettings,
} from "../../../interface/player_settings";
import {
  GET_PLAYER_SETTINGS,
  GetPlayerSettingsRequest,
  GetPlayerSettingsResponse,
  UPDATE_PLAYER_SETTINGS,
  UpdatePlayerSettingsRequest,
  UpdatePlayerSettingsResponse,
} from "../../../interface/service";
import {
  BackgroundRequest,
  READ_PLAYER_SETTINGS_RESPONSE,
} from "../interface/background_service";
import { ChromeRuntime } from "./chrome_runtime";
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
} from "./common";
import { SERVICE_CLIENT } from "./service_client";
import { parseMessage } from "@selfage/message/parser";
import { ServiceClient } from "@selfage/service_client";

export class PlayerSettingsStorage {
  public constructor(
    private chromeRuntime: ChromeRuntime,
    private serviceClient: ServiceClient
  ) {}

  public static create(): PlayerSettingsStorage {
    return new PlayerSettingsStorage(ChromeRuntime.create(), SERVICE_CLIENT);
  }

  public async read(): Promise<PlayerSettings> {
    let playerSettings: PlayerSettings;

    try {
      let backgroundRequest: BackgroundRequest = {
        readPlayerSettingsRequest: {},
      };
      let rawResponse = await this.chromeRuntime.sendMessage(backgroundRequest);
      let response = parseMessage(rawResponse, READ_PLAYER_SETTINGS_RESPONSE);
      playerSettings = parseMessage(
        JSON.parse(response.playerSettingsStringified),
        PLAYER_SETTINGS
      );
    } catch (e) {
      // Do nothing.
    }

    try {
      let response = await this.serviceClient.fetchAuthed<
        GetPlayerSettingsRequest,
        GetPlayerSettingsResponse
      >({}, GET_PLAYER_SETTINGS);
      playerSettings = response.playerSettings;
    } catch (e) {
      // Do nothing.
    }
    return PlayerSettingsStorage.normalizePlayerSettings(playerSettings);
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
    let backgroundRequest: BackgroundRequest = {
      savePlayerSettingsRequest: {
        playerSettingsStringified: JSON.stringify(playerSettings),
      },
    };
    await this.chromeRuntime.sendMessage(backgroundRequest);

    try {
      await this.serviceClient.fetchAuthed<
        UpdatePlayerSettingsRequest,
        UpdatePlayerSettingsResponse
      >(
        {
          playerSettings: playerSettings,
        },
        UPDATE_PLAYER_SETTINGS
      );
    } catch (e) {
      // It's oK to not update remotely.
    }
  }
}
