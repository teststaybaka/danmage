import { CHAT_CONTENT_MAX_LENGTH } from "../common";
import { PostChatRequestBody, PostChatResponse } from "../interface/service";
import { DATASTORE_CLIENT } from "./datastore_client";
import { PostChatHandlerInterface } from "./server_handlers";
import { SessionExtractor } from "./session_signer";
import { Datastore } from "@google-cloud/datastore";
import {
  newBadRequestError,
  newInternalServerErrorError,
} from "@selfage/http_error";

export class PostChatHandler extends PostChatHandlerInterface {
  public static create(): PostChatHandler {
    return new PostChatHandler(
      DATASTORE_CLIENT,
      SessionExtractor.create(),
      () => crypto.randomUUID(),
      () => Date.now(),
    );
  }

  public constructor(
    private datastoreClient: Datastore,
    private sessionExtractor: SessionExtractor,
    private generateUuid: () => string,
    private getNow: () => number,
  ) {
    super();
  }

  public async handle(
    loggingPrefix: string,
    body: PostChatRequestBody,
    auth: string,
  ): Promise<PostChatResponse> {
    if (!body.chatEntry) {
      throw newBadRequestError(`"chatEntry" is required.`);
    }
    if (!body.chatEntry.hostApp) {
      throw newBadRequestError(`"chatEntry.hostApp" is required.`);
    }
    if (!body.chatEntry.hostContentId) {
      throw newBadRequestError(`"chatEntry.hostContentId" is required.`);
    }
    if (!body.chatEntry.content) {
      throw newBadRequestError(`"chatEntry.content" is required.`);
    }
    if (body.chatEntry.content.length > CHAT_CONTENT_MAX_LENGTH) {
      throw newBadRequestError(
        `"chatEntry.content" must be less than ${CHAT_CONTENT_MAX_LENGTH} characters long.`,
      );
    }
    if (!body.chatEntry.timestamp) {
      throw newBadRequestError(`"chatEntry.timestamp" is required.`);
    }
    let session = this.sessionExtractor.extractSessionData(loggingPrefix, auth);
    let [user] = await this.datastoreClient.get(
      this.datastoreClient.key(["User", session.userId]),
    );
    if (!user) {
      throw newInternalServerErrorError(
        `User with ID ${session.userId} not found in datastore.`,
      );
    }
    body.chatEntry.id = this.generateUuid();
    body.chatEntry.userId = user.id;
    body.chatEntry.userNickname = user.nickname;
    body.chatEntry.timestamp = Math.floor(body.chatEntry.timestamp);
    body.chatEntry.created = Math.floor(this.getNow() / 1000);
    await this.datastoreClient.save({
      key: this.datastoreClient.key(["ChatEntry", body.chatEntry.id]),
      data: body.chatEntry,
      method: "insert",
    });
    return { chatEntry: body.chatEntry };
  }
}
