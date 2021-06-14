import { UserIssue, USER_ISSUE } from '../../interface/user_issue';
import { DatastoreModelDescriptor } from '@selfage/datastore_client/model_descriptor';

export let USER_ISSUE_MODEL: DatastoreModelDescriptor<UserIssue> = {
  name: "UserIssue",
  key: "id",
  excludedIndexes: ["id", "email", "description", "created"],
  valueDescriptor: USER_ISSUE,
}
