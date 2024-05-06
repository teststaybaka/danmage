import {
  UpdatePlayerSettingsRequest,
  UpdatePlayerSettingsResponse,
} from "../interface/service";
import { UserSession } from "../interface/session";
import { DATASTORE_CLIENT } from "./datastore/client";
import { PLAYER_SETTINGS_MODEL } from "./datastore/player_settings_model";
import { UpdatePlayerSettingsHandlerInterface } from "./server_handlers";
import { DatastoreClient } from "@selfage/datastore_client";

export class UpdatePlayerSettingsHandler extends UpdatePlayerSettingsHandlerInterface {
  public static create(): UpdatePlayerSettingsHandler {
    return new UpdatePlayerSettingsHandler(DATASTORE_CLIENT);
  }

  public constructor(private datastoreClient: DatastoreClient) {
    super();
  }

  public async handle(
    loggingPrefix: string,
    body: UpdatePlayerSettingsRequest,
    auth: UserSession,
  ): Promise<UpdatePlayerSettingsResponse> {
    body.playerSettings.userId = auth.userId;
    await this.datastoreClient.save(
      [body.playerSettings],
      PLAYER_SETTINGS_MODEL,
      "upsert",
    );
    return {};
  }
}
