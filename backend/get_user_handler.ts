import {
  GET_USER,
  GetUserRequest,
  GetUserResponse,
} from "../interface/service";
import { UserSession } from "../interface/session";
import { USER_MODEL } from "./datastore/user_model";
import { UserAuthedServiceHandler } from "./user_authed_service_handler";
import { DatastoreClient } from "@selfage/datastore_client";

export class GetUserHandler extends UserAuthedServiceHandler<
  GetUserRequest,
  GetUserResponse
> {
  public serviceDescriptor = GET_USER;

  public constructor(private datastoreClient: DatastoreClient) {
    super();
  }

  public static create(): GetUserHandler {
    return new GetUserHandler(DatastoreClient.create());
  }

  public async handle(
    logContext: string,
    request: GetUserRequest,
    session: UserSession
  ): Promise<GetUserResponse> {
    let users = await this.datastoreClient.get([session.userId], USER_MODEL);
    return { user: users[0] };
  }
}
