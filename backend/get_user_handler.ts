import { GetUserRequestBody, GetUserResponse } from "../interface/service";
import { DATASTORE_CLIENT } from "./datastore_client";
import { GetUserHandlerInterface } from "./server_handlers";
import { SessionExtractor } from "./session_signer";
import { Datastore } from "@google-cloud/datastore";
import { newInternalServerErrorError } from "@selfage/http_error";

export class GetUserHandler extends GetUserHandlerInterface {
  public static create(): GetUserHandler {
    return new GetUserHandler(DATASTORE_CLIENT, SessionExtractor.create());
  }

  public constructor(
    private datastoreClient: Datastore,
    private sessionExtractor: SessionExtractor,
  ) {
    super();
  }

  public async handle(
    loggingPrefix: string,
    body: GetUserRequestBody,
    auth: string,
  ): Promise<GetUserResponse> {
    let session = this.sessionExtractor.extractSessionData(loggingPrefix, auth);
    let [user] = await this.datastoreClient.get(
      this.datastoreClient.key(["User", session.userId]),
    );
    if (!user) {
      throw newInternalServerErrorError(`User not found: ${session.userId}`);
    }
    return { user };
  }
}
