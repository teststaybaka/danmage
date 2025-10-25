import { EnumDescriptor, PrimitiveType, MessageDescriptor } from '@selfage/message/descriptor';

export enum HostApp {
  YouTube = 1,
  Crunchyroll = 2,
  Netflix = 3,
}

export let HOST_APP: EnumDescriptor<HostApp> = {
  name: 'HostApp',
  values: [{
    name: 'YouTube',
    value: 1,
  }, {
    name: 'Crunchyroll',
    value: 2,
  }, {
    name: 'Netflix',
    value: 3,
  }]
}

export interface ChatEntry {
  id?: string,
  hostApp?: HostApp,
  hostContentId?: string,
  userId?: string,
  userNickname?: string,
  content?: string,
  timestamp?: number,
  created?: number,
}

export let CHAT_ENTRY: MessageDescriptor<ChatEntry> = {
  name: 'ChatEntry',
  fields: [{
    name: 'id',
    index: 1,
    primitiveType: PrimitiveType.STRING,
  }, {
    name: 'hostApp',
    index: 2,
    enumType: HOST_APP,
  }, {
    name: 'hostContentId',
    index: 3,
    primitiveType: PrimitiveType.STRING,
  }, {
    name: 'userId',
    index: 4,
    primitiveType: PrimitiveType.STRING,
  }, {
    name: 'userNickname',
    index: 5,
    primitiveType: PrimitiveType.STRING,
  }, {
    name: 'content',
    index: 6,
    primitiveType: PrimitiveType.STRING,
  }, {
    name: 'timestamp',
    index: 7,
    primitiveType: PrimitiveType.NUMBER,
  }, {
    name: 'created',
    index: 8,
    primitiveType: PrimitiveType.NUMBER,
  }],
};
