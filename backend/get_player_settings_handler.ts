import {
  GET_PLAYER_SETTINGS,
  GetPlayerSettingsRequest,
  GetPlayerSettingsResponse,
} from "../interface/service";
import { UserSession } from "../interface/session";
import { PLAYER_SETTINGS_MODEL } from "./datastore/player_settings_model";
import { UserAuthedServiceHandler } from "./user_authed_service_handler";
import { DatastoreClient } from "@selfage/datastore_client";

export class GetPlayerSettingsHandler extends UserAuthedServiceHandler<
  GetPlayerSettingsRequest,
  GetPlayerSettingsResponse
> {
  public serviceDescriptor = GET_PLAYER_SETTINGS;

  public constructor(private datastoreClient: DatastoreClient) {
    super();
  }

  public static create(): GetPlayerSettingsHandler {
    return new GetPlayerSettingsHandler(DatastoreClient.create());
  }

  public async handle(
    logContext: string,
    request: GetPlayerSettingsRequest,
    session: UserSession
  ): Promise<GetPlayerSettingsResponse> {
    let playerSettingsList = await this.datastoreClient.get(
      [session.userId],
      PLAYER_SETTINGS_MODEL
    );
    if (playerSettingsList.length === 0) {
      return {};
    } else {
      return { playerSettings: playerSettingsList[0] };
    }
  }
}
