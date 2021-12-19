import {
  POST_CHAT,
  PostChatRequest,
  PostChatResponse,
} from "../interface/service";
import { UserSession } from "../interface/session";
import { CHAT_ENTRY_MODEL } from "./datastore/chat_entry_model";
import { DATASTORE_CLIENT } from "./datastore/client";
import { USER_MODEL } from "./datastore/user_model";
import { UserAuthedServiceHandler } from "./user_authed_service_handler";
import { DatastoreClient } from "@selfage/datastore_client";

export class PostChatHandler extends UserAuthedServiceHandler<
  PostChatRequest,
  PostChatResponse
> {
  public serviceDescriptor = POST_CHAT;

  public constructor(
    private datastoreClient: DatastoreClient,
    private getNow: () => number
  ) {
    super();
  }

  public static create(): PostChatHandler {
    return new PostChatHandler(DATASTORE_CLIENT, () => Date.now());
  }

  public async handle(
    logContext: string,
    request: PostChatRequest,
    session: UserSession
  ): Promise<PostChatResponse> {
    let users = await this.datastoreClient.get([session.userId], USER_MODEL);
    let user = users[0];
    request.chatEntry.userId = user.id;
    request.chatEntry.userNickname = user.nickname;
    request.chatEntry.timestamp = Math.floor(request.chatEntry.timestamp);
    request.chatEntry.created = Math.floor(this.getNow() / 1000);
    let chatEntries = await this.datastoreClient.allocateKeys(
      [request.chatEntry],
      CHAT_ENTRY_MODEL
    );
    await this.datastoreClient.save(chatEntries, CHAT_ENTRY_MODEL, "insert");
    return { chatEntry: chatEntries[0] };
  }
}
