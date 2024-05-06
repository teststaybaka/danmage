import {
  GetPlayerSettingsRequest,
  GetPlayerSettingsResponse,
} from "../interface/service";
import { UserSession } from "../interface/session";
import { DATASTORE_CLIENT } from "./datastore/client";
import { PLAYER_SETTINGS_MODEL } from "./datastore/player_settings_model";
import { GetPlayerSettingsHandlerInterface } from "./server_handlers";
import { DatastoreClient } from "@selfage/datastore_client";

export class GetPlayerSettingsHandler extends GetPlayerSettingsHandlerInterface {
  public static create(): GetPlayerSettingsHandler {
    return new GetPlayerSettingsHandler(DATASTORE_CLIENT);
  }

  public constructor(private datastoreClient: DatastoreClient) {
    super();
  }

  public async handle(
    loggingPrefix: string,
    body: GetPlayerSettingsRequest,
    auth: UserSession,
  ): Promise<GetPlayerSettingsResponse> {
    let playerSettingsList = await this.datastoreClient.get(
      [auth.userId],
      PLAYER_SETTINGS_MODEL,
    );
    if (playerSettingsList.length === 0) {
      return {};
    } else {
      return { playerSettings: playerSettingsList[0] };
    }
  }
}
