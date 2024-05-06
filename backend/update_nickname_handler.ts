import {
  UpdateNicknameRequest,
  UpdateNicknameResponse,
} from "../interface/service";
import { UserSession } from "../interface/session";
import { DATASTORE_CLIENT } from "./datastore/client";
import { USER_MODEL } from "./datastore/user_model";
import { UpdateNicknameHandlerInterface } from "./server_handlers";
import { DatastoreClient } from "@selfage/datastore_client";
import { newBadRequestError } from "@selfage/http_error";

export class UpdateNicknameHandler extends UpdateNicknameHandlerInterface {
  public static create(): UpdateNicknameHandler {
    return new UpdateNicknameHandler(DATASTORE_CLIENT);
  }

  public constructor(private datastoreClient: DatastoreClient) {
    super();
  }

  public async handle(
    loggingPrefix: string,
    body: UpdateNicknameRequest,
    auth: UserSession,
  ): Promise<UpdateNicknameResponse> {
    let users = await this.datastoreClient.get([auth.userId], USER_MODEL);
    let user = users[0];
    if (user.nickname) {
      throw newBadRequestError(`${loggingPrefix} Nickname already exists.`);
    }

    user.nickname = body.newName;
    await this.datastoreClient.save([user], USER_MODEL, "update");
    return {};
  }
}
