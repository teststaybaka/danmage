import { GET_CHAT_HISTORY } from "../interface/service";
import {
  GetChatHistoryRequest,
  GetChatHistoryResponse,
} from "../interface/service_body";
import { UserSession } from "../interface/session";
import { UserHistoryQueryBuilder } from "./datastore/chat_entry_model";
import { UserAuthedServiceHandler } from "./user_authed_service_handler";
import { DatastoreClient } from "@selfage/datastore_client";

export class GetChatHistoryHandler extends UserAuthedServiceHandler<
  GetChatHistoryRequest,
  GetChatHistoryResponse
> {
  public serviceDescriptor = GET_CHAT_HISTORY;

  public constructor(private datastoreClient: DatastoreClient) {
    super();
  }

  public static create(): GetChatHistoryHandler {
    return new GetChatHistoryHandler(DatastoreClient.create());
  }

  public async handle(
    logContext: string,
    request: GetChatHistoryRequest,
    session: UserSession
  ): Promise<GetChatHistoryResponse> {
    let queryBuilder = new UserHistoryQueryBuilder()
      .filterByUserId("=", session.userId)
      .filterByHostApp("=", request.hostApp)
      .limit(20);
    if (request.cursor) {
      queryBuilder.start(request.cursor);
    }
    let { values, cursor } = await this.datastoreClient.query(
      queryBuilder.build()
    );
    return {
      chatEntries: values,
      cursor: cursor,
    };
  }
}
