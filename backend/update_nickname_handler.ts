import {
  UPDATE_NICKNAME,
  UpdateNicknameRequest,
  UpdateNicknameResponse,
} from "../interface/service";
import { UserSession } from "../interface/session";
import { DATASTORE_CLIENT } from "./datastore/client";
import { USER_MODEL } from "./datastore/user_model";
import { UserAuthedServiceHandler } from "./user_authed_service_handler";
import { DatastoreClient } from "@selfage/datastore_client";
import { newBadRequestError } from "@selfage/http_error";

export class UpdateNicknameHandler extends UserAuthedServiceHandler<
  UpdateNicknameRequest,
  UpdateNicknameResponse
> {
  public serviceDescriptor = UPDATE_NICKNAME;

  public constructor(private datastoreClient: DatastoreClient) {
    super();
  }

  public static create(): UpdateNicknameHandler {
    return new UpdateNicknameHandler(DATASTORE_CLIENT);
  }

  public async handle(
    logContext: string,
    request: UpdateNicknameRequest,
    session: UserSession
  ): Promise<UpdateNicknameResponse> {
    let users = await this.datastoreClient.get([session.userId], USER_MODEL);
    let user = users[0];
    if (user.nickname) {
      throw newBadRequestError("Nickname already exists.");
    }

    user.nickname = request.newName;
    await this.datastoreClient.save([user], USER_MODEL, "update");
    return {};
  }
}
