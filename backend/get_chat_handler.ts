import {
  EmptyMessage,
  GET_CHAT,
  GET_DANMAKU,
  GetChatRequest,
  GetChatResponse,
} from "../interface/service";
import { HostContentQueryBuilder } from "./datastore/chat_entry_model";
import { DATASTORE_CLIENT } from "./datastore/client";
import { DatastoreClient } from "@selfage/datastore_client";
import { UnauthedServiceHandler } from "@selfage/service_handler";

export class GetChatHandler
  implements UnauthedServiceHandler<GetChatRequest, GetChatResponse>
{
  public serviceDescriptor = GET_CHAT;

  public constructor(private datastoreClient: DatastoreClient) {}

  public static create(): GetChatHandler {
    return new GetChatHandler(DATASTORE_CLIENT);
  }

  public async handle(
    request: GetChatRequest
  ): Promise<GetChatResponse> {
    let query = new HostContentQueryBuilder()
      .equalToHostApp(request.hostApp)
      .equalToHostContentId(request.hostContentId)
      .build();
    let { values } = await this.datastoreClient.query(query);
    return {
      chatEntries: values,
    };
  }
}

// Legacy handler
export class GetDanmakuHandler
  implements UnauthedServiceHandler<EmptyMessage, EmptyMessage>
{
  public serviceDescriptor = GET_DANMAKU;

  public constructor() {}

  public static create(): GetDanmakuHandler {
    return new GetDanmakuHandler();
  }

  public async handle(
    request: EmptyMessage
  ): Promise<EmptyMessage> {
    return {};
  }
}
