import { DatastoreQuery, DatastoreFilter, Operator, DatastoreModelDescriptor } from '@selfage/datastore_client/model_descriptor';
import { HostApp, Chat, CHAT } from '../../interface/chat_entry';

export let CHAT_MODEL: DatastoreModelDescriptor<Chat> = {
  name: "Chat",
  key: "id",
  excludedIndexes: ["id", "hostContentId", "userDisplayName", "content", "timestamp"],
  valueDescriptor: CHAT,
}

export class UserHistoryQueryBuilder {
  private datastoreQuery: DatastoreQuery<Chat>;

  public constructor() {
    this.datastoreQuery = {
      modelDescriptor: CHAT_MODEL,
      filters: new Array<DatastoreFilter>(),
      orderings: [
        {
          fieldName: "created",
          descending: true
        },
      ]
    }
  }
  public start(cursor: string): this {
    this.datastoreQuery.startCursor = cursor;
    return this;
  }
  public limit(num: number): this {
    this.datastoreQuery.limit = num;
    return this;
  }
  public filterByUserId(operator: Operator, value: string): this {
    this.datastoreQuery.filters.push({
      fieldName: "userId",
      fieldValue: value,
      operator: operator,
    });
    return this;
  }
  public filterByHostApp(operator: Operator, value: HostApp): this {
    this.datastoreQuery.filters.push({
      fieldName: "hostApp",
      fieldValue: value,
      operator: operator,
    });
    return this;
  }
  public filterByCreated(operator: Operator, value: number): this {
    this.datastoreQuery.filters.push({
      fieldName: "created",
      fieldValue: value,
      operator: operator,
    });
    return this;
  }
  public build(): DatastoreQuery<Chat> {
    return this.datastoreQuery;
  }
}
