import {
  CHANGE_PLAYER_SETTINGS,
  UPDATE_PLAYER_SETTINGS,
  UpdatePlayerSettingsRequest,
  UpdatePlayerSettingsResponse,
} from "../interface/service";
import { UserSession } from "../interface/session";
import { DATASTORE_CLIENT } from "./datastore/client";
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
    return new UpdatePlayerSettingsHandler(DATASTORE_CLIENT);
  }

  public async handle(
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

// Legacy handler.
export class ChangePlayerSettingsHandler extends UserAuthedServiceHandler<
  UpdatePlayerSettingsRequest,
  UpdatePlayerSettingsResponse
> {
  public serviceDescriptor = CHANGE_PLAYER_SETTINGS;

  public constructor(private datastoreClient: DatastoreClient) {
    super();
  }

  public static create(): ChangePlayerSettingsHandler {
    return new ChangePlayerSettingsHandler(DATASTORE_CLIENT);
  }

  public async handle(
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
