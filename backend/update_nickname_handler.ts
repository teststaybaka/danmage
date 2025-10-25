import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH } from "../common";
import {
  UpdateNicknameRequestBody,
  UpdateNicknameResponse,
} from "../interface/service";
import { DATASTORE_CLIENT } from "./datastore_client";
import { UpdateNicknameHandlerInterface } from "./server_handlers";
import { SessionExtractor } from "./session_signer";
import { Datastore } from "@google-cloud/datastore";
import { newBadRequestError } from "@selfage/http_error";

export class UpdateNicknameHandler extends UpdateNicknameHandlerInterface {
  public static create(): UpdateNicknameHandler {
    return new UpdateNicknameHandler(
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
    body: UpdateNicknameRequestBody,
    auth: string,
  ): Promise<UpdateNicknameResponse> {
    if (!body.newName) {
      throw newBadRequestError(`"newName" is required.`);
    }
    if (
      body.newName.length < NICKNAME_MIN_LENGTH ||
      body.newName.length > NICKNAME_MAX_LENGTH
    ) {
      throw newBadRequestError(
        `"newName" must be between ${NICKNAME_MIN_LENGTH} and ${NICKNAME_MAX_LENGTH} characters long.`,
      );
    }
    let session = this.sessionExtractor.extractSessionData(loggingPrefix, auth);
    let [user] = await this.datastoreClient.get(
      this.datastoreClient.key(["User", session.userId]),
    );
    if (!user) {
      throw newBadRequestError(`User not found.`);
    }
    if (user.nickname) {
      throw newBadRequestError(`Nickname already exists.`);
    }

    user.nickname = body.newName;
    await this.datastoreClient.save({
      key: this.datastoreClient.key(["User", session.userId]),
      data: user,
      method: "update",
    });
    return {};
  }
}
