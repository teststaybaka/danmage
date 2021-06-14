import {
  REPORT_USER_ISSUE,
  ReportUserIssueRequest,
  ReportUserIssueResponse,
} from "../interface/service";
import { USER_ISSUE_MODEL } from "./datastore/user_issue_model";
import { DatastoreClient } from "@selfage/datastore_client";
import { UnauthedServiceHandler } from "@selfage/service_handler";

export class ReportUserIssueHandler
  implements
    UnauthedServiceHandler<ReportUserIssueRequest, ReportUserIssueResponse> {
  public serviceDescriptor = REPORT_USER_ISSUE;

  public constructor(private datastoreClient: DatastoreClient) {}

  public static create(): ReportUserIssueHandler {
    return new ReportUserIssueHandler(DatastoreClient.create());
  }

  public async handle(
    logContext: string,
    request: ReportUserIssueRequest
  ): Promise<ReportUserIssueResponse> {
    let userIssues = await this.datastoreClient.allocateKeys(
      [request.userIssue],
      USER_ISSUE_MODEL
    );
    await this.datastoreClient.save(userIssues, USER_ISSUE_MODEL, "insert");
    return {};
  }
}
