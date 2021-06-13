import {
  UPDATE_PLAYER_SETTINGS,
  UpdatePlayerSettingsRequest,
  UpdatePlayerSettingsResponse,
} from "../interface/service";
import { UserSession } from "../interface/session";
import { PLAYER_SETTINGS_MODEL } from "./datastore/player_settings_model";
import { UserAuthedServiceHandler } from "./user_authed_service_handler";
import { DatastoreClient } from "@selfage/datastore_client";

export class UpdatePlayerSettingsHandler extends UserAuthedServiceHandler<
  UpdatePlayerSettingsRequest,
  UpdatePlayerSettingsResponse
> {
  public serviceDescriptor = UPDATE_PLAYER_SETTINGS;

  public constructor(private datastoreClient: DatastoreClient) {
    super();
  }

  public static create(): UpdatePlayerSettingsHandler {
    return new UpdatePlayerSettingsHandler(DatastoreClient.create());
  }

  public async handle(
    logContext: string,
    request: UpdatePlayerSettingsRequest,
    session: UserSession
  ): Promise<UpdatePlayerSettingsResponse> {
    request.playerSettings.userId = session.userId;
    await this.datastoreClient.save(
      [request.playerSettings],
      PLAYER_SETTINGS_MODEL,
      "upsert"
    );
    return {};
  }
}
