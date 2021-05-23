import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';
import { HostApp, HOST_APP, Chat, CHAT } from './chat_entry';

export interface GetChatRequest {
  hostApp?: HostApp,
  hostContentId?: string,
}

export let GET_CHAT_REQUEST: MessageDescriptor<GetChatRequest> = {
  name: 'GetChatRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'hostApp',
      enumDescriptor: HOST_APP,
    },
    {
      name: 'hostContentId',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface GetChatResponse {
  chats?: Array<Chat>,
}

export let GET_CHAT_RESPONSE: MessageDescriptor<GetChatResponse> = {
  name: 'GetChatResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'chats',
      enumDescriptor: CHAT,
      arrayFactoryFn: () => {
        return new Array<any>();
      },
    },
  ]
};

export interface GetChatHistoryRequest {
  userId?: string,
/* Optional. */
  hostApp?: HostApp,
}

export let GET_CHAT_HISTORY_REQUEST: MessageDescriptor<GetChatHistoryRequest> = {
  name: 'GetChatHistoryRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'userId',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'hostApp',
      enumDescriptor: HOST_APP,
    },
  ]
};

export interface GetChatHistoryResponse {
  chats?: Array<Chat>,
}

export let GET_CHAT_HISTORY_RESPONSE: MessageDescriptor<GetChatHistoryResponse> = {
  name: 'GetChatHistoryResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'chats',
      enumDescriptor: CHAT,
      arrayFactoryFn: () => {
        return new Array<any>();
      },
    },
  ]
};
