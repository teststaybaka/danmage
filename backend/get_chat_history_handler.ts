import {
  GetChatHistoryRequestBody,
  GetChatHistoryResponse,
} from "../interface/service";
import { DATASTORE_CLIENT } from "./datastore_client";
import { GetChatHistoryHandlerInterface } from "./server_handlers";
import { SessionExtractor } from "./session_signer";
import { Datastore, PropertyFilter } from "@google-cloud/datastore";

export class GetChatHistoryHandler extends GetChatHistoryHandlerInterface {
  public static create(): GetChatHistoryHandler {
    return new GetChatHistoryHandler(
      DATASTORE_CLIENT,
      SessionExtractor.create(),
    );
  }

  public constructor(
    private datastoreClient: Datastore,
    private sessionExtractor: SessionExtractor,
  ) {
    super();
  }

  public async handle(
    loggingPrefix: string,
    body: GetChatHistoryRequestBody,
    auth: string,
  ): Promise<GetChatHistoryResponse> {
    let session = this.sessionExtractor.extractSessionData(loggingPrefix, auth);
    let [entities, option] = await this.datastoreClient.runQuery(
      this.datastoreClient
        .createQuery("ChatEntry")
        .filter(new PropertyFilter("userId", "=", session.userId))
        .start(body.cursor)
        .order("created", { descending: true })
        .limit(20),
    );
    return {
      chatEntries: entities,
      cursor:
        option.moreResults !== Datastore.NO_MORE_RESULTS
          ? option.endCursor
          : undefined,
    };
  }
}
