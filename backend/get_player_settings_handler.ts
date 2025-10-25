import {
  GetPlayerSettingsRequestBody,
  GetPlayerSettingsResponse,
} from "../interface/service";
import { DATASTORE_CLIENT } from "./datastore_client";
import { GetPlayerSettingsHandlerInterface } from "./server_handlers";
import { SessionExtractor } from "./session_signer";
import { Datastore } from "@google-cloud/datastore";

export class GetPlayerSettingsHandler extends GetPlayerSettingsHandlerInterface {
  public static create(): GetPlayerSettingsHandler {
    return new GetPlayerSettingsHandler(
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
    body: GetPlayerSettingsRequestBody,
    auth: string,
  ): Promise<GetPlayerSettingsResponse> {
    let session = this.sessionExtractor.extractSessionData(loggingPrefix, auth);
    let [playerSettings] = await this.datastoreClient.get(
      this.datastoreClient.key(["PlayerSettings", session.userId]),
    );
    if (!playerSettings) {
      return {};
    } else {
      return { playerSettings };
    }
  }
}
