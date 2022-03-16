import {
  GET_CHAT_HISTORY,
  GetChatHistoryRequest,
  GetChatHistoryResponse,
} from "../interface/service";
import { UserSession } from "../interface/session";
import { UserHistoryQueryBuilder } from "./datastore/chat_entry_model";
import { DATASTORE_CLIENT } from "./datastore/client";
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
    return new GetChatHistoryHandler(DATASTORE_CLIENT);
  }

  public async handle(
    request: GetChatHistoryRequest,
    session: UserSession
  ): Promise<GetChatHistoryResponse> {
    let queryBuilder = new UserHistoryQueryBuilder()
      .equalToUserId(session.userId)
      .limit(20);
    if (request.cursor) {
      queryBuilder.start(request.cursor);
    }
    let query = queryBuilder.build();
    let { values, cursor } = await this.datastoreClient.query(query);
    return {
      chatEntries: values,
      cursor: cursor,
    };
  }
}
