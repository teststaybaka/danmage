import {
  PLAYER_SETTINGS,
  PlayerSettings,
} from "../../../../interface/player_settings";
import {
  newGetPlayerSettingsRequest,
  newUpdatePlayerSettingsRequest,
} from "../../../client_requests";
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
  SHOW_CHAT_WINDOW_DEFAULT,
  SHOW_USER_NAME_DEFAULT,
  SPEED_RANGE,
  TOP_MARGIN_RANGE,
} from "./defaults";
import { SERVICE_CLIENT } from "./service_client";
import { parseMessage } from "@selfage/message/parser";
import { WebServiceClient } from "@selfage/web_service_client";

export class PlayerSettingsStorage {
  public static create(): PlayerSettingsStorage {
    return new PlayerSettingsStorage(SERVICE_CLIENT);
  }

  private static NAME = "PlayerSettings";

  public constructor(private serviceClient: WebServiceClient) {}

  public async read(): Promise<PlayerSettings> {
    let remotePlayerSettings: PlayerSettings;
    try {
      remotePlayerSettings = (
        await this.serviceClient.send(newGetPlayerSettingsRequest({}))
      ).playerSettings;
    } catch (e) {
      remotePlayerSettings = {};
    }
    let localPlayerSettings = parseMessage(
      JSON.parse(localStorage.getItem(PlayerSettingsStorage.NAME)),
      PLAYER_SETTINGS,
    );
    return PlayerSettingsStorage.normalizePlayerSettings(
      remotePlayerSettings,
      localPlayerSettings,
    );
  }

  private static normalizePlayerSettings(
    remotePlayerSettings?: PlayerSettings,
    localPlayerSettings?: PlayerSettings,
  ): PlayerSettings {
    let playerSettings: PlayerSettings = {
      displaySettings: {},
      blockSettings: {},
    };

    let displaySettings = playerSettings.displaySettings;
    displaySettings.speed = SPEED_RANGE.getValidValue(
      remotePlayerSettings?.displaySettings?.speed ??
        localPlayerSettings?.displaySettings?.speed,
    );
    displaySettings.opacity = OPACITY_RANGE.getValidValue(
      remotePlayerSettings?.displaySettings?.opacity ??
        localPlayerSettings?.displaySettings?.opacity,
    );
    displaySettings.fontSize = FONT_SIZE_RANGE.getValidValue(
      remotePlayerSettings?.displaySettings?.fontSize ??
        localPlayerSettings?.displaySettings?.fontSize,
    );
    displaySettings.density = DENSITY_RANGE.getValidValue(
      remotePlayerSettings?.displaySettings?.density ??
        localPlayerSettings?.displaySettings?.density,
    );
    displaySettings.topMargin = TOP_MARGIN_RANGE.getValidValue(
      remotePlayerSettings?.displaySettings?.topMargin ??
        localPlayerSettings?.displaySettings?.topMargin,
    );
    displaySettings.bottomMargin = BOTTOM_MARGIN_RANGE.getValidValue(
      remotePlayerSettings?.displaySettings?.bottomMargin ??
        localPlayerSettings?.displaySettings?.bottomMargin,
    );
    displaySettings.fontWeight = FONT_WEIGHT_RANGE.getValidValue(
      remotePlayerSettings?.displaySettings?.fontWeight ??
        localPlayerSettings?.displaySettings?.fontWeight,
    );
    displaySettings.fontFamily =
      remotePlayerSettings?.displaySettings?.fontFamily ??
      localPlayerSettings?.displaySettings?.fontFamily ??
      FONT_FAMILY_DEFAULT;
    displaySettings.showUserName =
      remotePlayerSettings?.displaySettings?.showUserName ??
      localPlayerSettings?.displaySettings?.showUserName ??
      SHOW_USER_NAME_DEFAULT;
    displaySettings.enable =
      remotePlayerSettings?.displaySettings?.enable ??
      localPlayerSettings?.displaySettings?.enable ??
      ENABLE_CHAT_SCROLLING_DEFAULT;
    displaySettings.distributionStyle =
      remotePlayerSettings?.displaySettings?.distributionStyle ??
      localPlayerSettings?.displaySettings?.distributionStyle ??
      DISTRIBUTION_STYLE_DEFAULT;
    displaySettings.enableInteraction =
      remotePlayerSettings?.displaySettings?.enableInteraction ??
      localPlayerSettings?.displaySettings?.enableInteraction ??
      ENABLE_CHAT_INTERACTION_DEFAULT;
    displaySettings.showChatWindow =
      remotePlayerSettings?.displaySettings?.showChatWindow ??
      localPlayerSettings?.displaySettings?.showChatWindow ??
      SHOW_CHAT_WINDOW_DEFAULT;

    let blockSettings = playerSettings.blockSettings;
    blockSettings.blockPatterns = [
      ...(remotePlayerSettings?.blockSettings?.blockPatterns ?? []),
      ...(localPlayerSettings?.blockSettings?.blockPatterns ?? []),
    ];
    return playerSettings;
  }

  public async save(playerSettings: PlayerSettings): Promise<void> {
    localStorage.setItem(
      PlayerSettingsStorage.NAME,
      JSON.stringify(playerSettings),
    );
    await this.serviceClient.send(
      newUpdatePlayerSettingsRequest({
        playerSettings,
      }),
    );
  }
}

export let PLAYER_SETTINGS_STORAGE = PlayerSettingsStorage.create();
