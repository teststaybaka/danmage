import {
  UPDATE_DISPLAY_NAME,
  UpdateDisplayNameRequest,
  UpdateDisplayNameResponse,
} from "../interface/service";
import { UserSession } from "../interface/session";
import { USER_MODEL } from "./datastore/user_model";
import { UserAuthedServiceHandler } from "./user_authed_service_handler";
import { DatastoreClient } from "@selfage/datastore_client";

export class UpdateDisplayNameHandler extends UserAuthedServiceHandler<
  UpdateDisplayNameRequest,
  UpdateDisplayNameResponse
> {
  public serviceDescriptor = UPDATE_DISPLAY_NAME;

  public constructor(private datastoreClient: DatastoreClient) {
    super();
  }

  public static create(): UpdateDisplayNameHandler {
    return new UpdateDisplayNameHandler(DatastoreClient.create());
  }

  public async handle(
    logContext: string,
    request: UpdateDisplayNameRequest,
    session: UserSession
  ): Promise<UpdateDisplayNameResponse> {
    let users = await this.datastoreClient.get([session.userId], USER_MODEL);
    let user = users[0];
    user.displayName = request.newName;
    await this.datastoreClient.save([user], USER_MODEL, "update");
    return {};
  }
}
