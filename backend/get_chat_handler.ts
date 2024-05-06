import { GetChatRequest, GetChatResponse } from "../interface/service";
import { HostContentQueryBuilder } from "./datastore/chat_entry_model";
import { DATASTORE_CLIENT } from "./datastore/client";
import { GetChatHandlerInterface } from "./server_handlers";
import { DatastoreClient } from "@selfage/datastore_client";

export class GetChatHandler extends GetChatHandlerInterface {
  public static create(): GetChatHandler {
    return new GetChatHandler(DATASTORE_CLIENT);
  }

  public constructor(private datastoreClient: DatastoreClient) {
    super();
  }

  public async handle(
    loggingPrefix: string,
    body: GetChatRequest,
  ): Promise<GetChatResponse> {
    let query = new HostContentQueryBuilder()
      .equalToHostApp(body.hostApp)
      .equalToHostContentId(body.hostContentId)
      .build();
    let { values } = await this.datastoreClient.query(query);
    return {
      chatEntries: values,
    };
  }
}
