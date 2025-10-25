import {
  UpdatePlayerSettingsRequestBody,
  UpdatePlayerSettingsResponse,
} from "../interface/service";
import { DATASTORE_CLIENT } from "./datastore_client";
import { UpdatePlayerSettingsHandlerInterface } from "./server_handlers";
import { SessionExtractor } from "./session_signer";
import { Datastore } from "@google-cloud/datastore";
import { newBadRequestError } from "@selfage/http_error";

export class UpdatePlayerSettingsHandler extends UpdatePlayerSettingsHandlerInterface {
  public static create(): UpdatePlayerSettingsHandler {
    return new UpdatePlayerSettingsHandler(
      DATASTORE_CLIENT,
      SessionExtractor.create(),
    );
  }

  public constructor(
    private datastoreClient: Datastore,
    private sessionExtractor: SessionExtractor,
  ) {
    super();
  }

  public async handle(
    loggingPrefix: string,
    body: UpdatePlayerSettingsRequestBody,
    auth: string,
  ): Promise<UpdatePlayerSettingsResponse> {
    if (!body.playerSettings) {
      throw newBadRequestError(`"playerSettings" is required.`);
    }
    let session = this.sessionExtractor.extractSessionData(loggingPrefix, auth);
    body.playerSettings.userId = session.userId;
    await this.datastoreClient.save({
      key: this.datastoreClient.key([
        "PlayerSettings",
        body.playerSettings.userId,
      ]),
      data: body.playerSettings,
      method: "upsert",
    });
    return {};
  }
}
