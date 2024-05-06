import { PostChatRequest, PostChatResponse } from "../interface/service";
import { UserSession } from "../interface/session";
import { CHAT_ENTRY_MODEL } from "./datastore/chat_entry_model";
import { DATASTORE_CLIENT } from "./datastore/client";
import { USER_MODEL } from "./datastore/user_model";
import { PostChatHandlerInterface } from "./server_handlers";
import { DatastoreClient } from "@selfage/datastore_client";

export class PostChatHandler extends PostChatHandlerInterface {
  public static create(): PostChatHandler {
    return new PostChatHandler(DATASTORE_CLIENT, () => Date.now());
  }

  public constructor(
    private datastoreClient: DatastoreClient,
    private getNow: () => number,
  ) {
    super();
  }

  public async handle(
    loggingPrefix: string,
    body: PostChatRequest,
    auth: UserSession,
  ): Promise<PostChatResponse> {
    let users = await this.datastoreClient.get([auth.userId], USER_MODEL);
    let user = users[0];
    body.chatEntry.userId = user.id;
    body.chatEntry.userNickname = user.nickname;
    body.chatEntry.timestamp = Math.floor(body.chatEntry.timestamp);
    body.chatEntry.created = Math.floor(this.getNow() / 1000);
    let chatEntries = await this.datastoreClient.allocateKeys(
      [body.chatEntry],
      CHAT_ENTRY_MODEL,
    );
    await this.datastoreClient.save(chatEntries, CHAT_ENTRY_MODEL, "insert");
    return { chatEntry: chatEntries[0] };
  }
}
