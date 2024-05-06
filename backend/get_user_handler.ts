import { GetUserRequest, GetUserResponse } from "../interface/service";
import { UserSession } from "../interface/session";
import { DATASTORE_CLIENT } from "./datastore/client";
import { USER_MODEL } from "./datastore/user_model";
import { GetUserHandlerInterface } from "./server_handlers";
import { DatastoreClient } from "@selfage/datastore_client";

export class GetUserHandler extends GetUserHandlerInterface {
  public static create(): GetUserHandler {
    return new GetUserHandler(DATASTORE_CLIENT);
  }

  public constructor(private datastoreClient: DatastoreClient) {
    super();
  }

  public async handle(
    loggingPrefix: string,
    body: GetUserRequest,
    auth: UserSession,
  ): Promise<GetUserResponse> {
    let users = await this.datastoreClient.get([auth.userId], USER_MODEL);
    return { user: users[0] };
  }
}
