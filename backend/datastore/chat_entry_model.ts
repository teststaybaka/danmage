import { DatastoreQuery, DatastoreFilter, DatastoreModelDescriptor } from '@selfage/datastore_client/model_descriptor';
import { HostApp, ChatEntry, CHAT_ENTRY } from '../../interface/chat_entry';

export let CHAT_ENTRY_MODEL: DatastoreModelDescriptor<ChatEntry> = {
  name: "ChatEntry",
  key: "id",
  excludedIndexes: ["id", "userNickname", "content", "timestamp"],
  valueDescriptor: CHAT_ENTRY,
}

export class UserHistoryQueryBuilder {
  private datastoreQuery: DatastoreQuery<ChatEntry> = {
    modelDescriptor: CHAT_ENTRY_MODEL,
    filters: new Array<DatastoreFilter>(),
    orderings: [
      {
        fieldName: "created",
        descending: true
      },
    ]
  };

  public start(cursor: string): this {
    this.datastoreQuery.startCursor = cursor;
    return this;
  }
  public limit(num: number): this {
    this.datastoreQuery.limit = num;
    return this;
  }
  public equalToUserId(value: string): this {
    this.datastoreQuery.filters.push({
      fieldName: "userId",
      fieldValue: value,
      operator: "=",
    });
    return this;
  }
  public build(): DatastoreQuery<ChatEntry> {
    return this.datastoreQuery;
  }
}

export class HostContentQueryBuilder {
  private datastoreQuery: DatastoreQuery<ChatEntry> = {
    modelDescriptor: CHAT_ENTRY_MODEL,
    filters: new Array<DatastoreFilter>(),
    orderings: [
    ]
  };

  public start(cursor: string): this {
    this.datastoreQuery.startCursor = cursor;
    return this;
  }
  public limit(num: number): this {
    this.datastoreQuery.limit = num;
    return this;
  }
  public equalToHostApp(value: HostApp): this {
    this.datastoreQuery.filters.push({
      fieldName: "hostApp",
      fieldValue: value,
      operator: "=",
    });
    return this;
  }
  public equalToHostContentId(value: string): this {
    this.datastoreQuery.filters.push({
      fieldName: "hostContentId",
      fieldValue: value,
      operator: "=",
    });
    return this;
  }
  public build(): DatastoreQuery<ChatEntry> {
    return this.datastoreQuery;
  }
}
