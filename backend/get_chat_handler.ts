import { GetChatRequestBody, GetChatResponse } from "../interface/service";
import { DATASTORE_CLIENT } from "./datastore_client";
import { GetChatHandlerInterface } from "./server_handlers";
import { Datastore, PropertyFilter } from "@google-cloud/datastore";
import { newBadRequestError } from "@selfage/http_error";

export class GetChatHandler extends GetChatHandlerInterface {
  public static create(): GetChatHandler {
    return new GetChatHandler(DATASTORE_CLIENT);
  }

  public constructor(private datastoreClient: Datastore) {
    super();
  }

  public async handle(
    loggingPrefix: string,
    body: GetChatRequestBody,
  ): Promise<GetChatResponse> {
    if (!body.hostApp) {
      throw newBadRequestError(`"hostApp" is required.`);
    }
    if (!body.hostContentId) {
      throw newBadRequestError(`"hostContentId" is required.`);
    }
    let [entities] = await this.datastoreClient.runQuery(
      this.datastoreClient
        .createQuery("ChatEntry")
        .filter(new PropertyFilter("hostApp", "=", body.hostApp))
        .filter(new PropertyFilter("hostContentId", "=", body.hostContentId)),
    );
    return {
      chatEntries: entities,
    };
  }
}
