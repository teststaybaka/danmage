import { DatastoreQuery, DatastoreFilter, Operator, DatastoreModelDescriptor } from '@selfage/datastore_client/model_descriptor';
import { HostApp, ChatEntry, CHAT_ENTRY } from '../../interface/chat_entry';

export let CHAT_ENTRY_MODEL: DatastoreModelDescriptor<ChatEntry> = {
  name: "ChatEntry",
  key: "id",
  excludedIndexes: ["id", "userNickname", "content", "timestamp"],
  valueDescriptor: CHAT_ENTRY,
}

export class UserHistoryQueryBuilder {
  private datastoreQuery: DatastoreQuery<ChatEntry>;

  public constructor() {
    this.datastoreQuery = {
      modelDescriptor: CHAT_ENTRY_MODEL,
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
  public build(): DatastoreQuery<ChatEntry> {
    return this.datastoreQuery;
  }
}

export class HostContentQueryBuilder {
  private datastoreQuery: DatastoreQuery<ChatEntry>;

  public constructor() {
    this.datastoreQuery = {
      modelDescriptor: CHAT_ENTRY_MODEL,
      filters: new Array<DatastoreFilter>(),
      orderings: [
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
  public filterByHostApp(operator: Operator, value: HostApp): this {
    this.datastoreQuery.filters.push({
      fieldName: "hostApp",
      fieldValue: value,
      operator: operator,
    });
    return this;
  }
  public filterByHostContentId(operator: Operator, value: string): this {
    this.datastoreQuery.filters.push({
      fieldName: "hostContentId",
      fieldValue: value,
      operator: operator,
    });
    return this;
  }
  public build(): DatastoreQuery<ChatEntry> {
    return this.datastoreQuery;
  }
}
