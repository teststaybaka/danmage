import {
  ReportUserIssueRequest,
  ReportUserIssueResponse,
} from "../interface/service";
import { DATASTORE_CLIENT } from "./datastore/client";
import { USER_ISSUE_MODEL } from "./datastore/user_issue_model";
import { ReportUserIssueHandlerInterface } from "./server_handlers";
import { DatastoreClient } from "@selfage/datastore_client";

export class ReportUserIssueHandler extends ReportUserIssueHandlerInterface {
  public static create(): ReportUserIssueHandler {
    return new ReportUserIssueHandler(DATASTORE_CLIENT);
  }

  public constructor(private datastoreClient: DatastoreClient) {
    super();
  }

  public async handle(
    loggingPrefix: string,
    body: ReportUserIssueRequest,
  ): Promise<ReportUserIssueResponse> {
    let userIssues = await this.datastoreClient.allocateKeys(
      [body.userIssue],
      USER_ISSUE_MODEL,
    );
    await this.datastoreClient.save(userIssues, USER_ISSUE_MODEL, "insert");
    return {};
  }
}
