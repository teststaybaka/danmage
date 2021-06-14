import {
  EmptyMessage,
  GET_CHAT,
  GET_DANMAKU,
  GetChatRequest,
  GetChatResponse,
} from "../interface/service";
import { HostContentQueryBuilder } from "./datastore/chat_entry_model";
import { DatastoreClient } from "@selfage/datastore_client";
import { UnauthedServiceHandler } from "@selfage/service_handler";

export class GetChatHandler
  implements UnauthedServiceHandler<GetChatRequest, GetChatResponse> {
  public serviceDescriptor = GET_CHAT;

  public constructor(private datastoreClient: DatastoreClient) {}

  public static create(): GetChatHandler {
    return new GetChatHandler(DatastoreClient.create());
  }

  public async handle(
    logContext: string,
    request: GetChatRequest
  ): Promise<GetChatResponse> {
    let query = new HostContentQueryBuilder()
      .filterByHostApp("=", request.hostApp)
      .filterByHostContentId("=", request.hostContentId)
      .build();
    let { values } = await this.datastoreClient.query(query);
    return {
      chatEntries: values,
    };
  }
}

// Legacy handler
export class GetDanmakuHandler
  implements UnauthedServiceHandler<EmptyMessage, EmptyMessage> {
  public serviceDescriptor = GET_DANMAKU;

  public constructor() {}

  public async handle(
    logContext: string,
    request: EmptyMessage
  ): Promise<EmptyMessage> {
    return {};
  }
}
