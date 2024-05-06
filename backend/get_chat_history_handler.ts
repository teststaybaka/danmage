import {
  GetChatHistoryRequest,
  GetChatHistoryResponse,
} from "../interface/service";
import { UserSession } from "../interface/session";
import { UserHistoryQueryBuilder } from "./datastore/chat_entry_model";
import { DATASTORE_CLIENT } from "./datastore/client";
import { GetChatHistoryHandlerInterface } from "./server_handlers";
import { DatastoreClient } from "@selfage/datastore_client";

export class GetChatHistoryHandler extends GetChatHistoryHandlerInterface {
  public static create(): GetChatHistoryHandler {
    return new GetChatHistoryHandler(DATASTORE_CLIENT);
  }

  public constructor(private datastoreClient: DatastoreClient) {
    super();
  }

  public async handle(
    loggingPrefix: string,
    body: GetChatHistoryRequest,
    auth: UserSession,
  ): Promise<GetChatHistoryResponse> {
    let queryBuilder = new UserHistoryQueryBuilder()
      .equalToUserId(auth.userId)
      .limit(20);
    if (body.cursor) {
      queryBuilder.start(body.cursor);
    }
    let query = queryBuilder.build();
    let { values, cursor } = await this.datastoreClient.query(query);
    return {
      chatEntries: values,
      cursor: cursor,
    };
  }
}
