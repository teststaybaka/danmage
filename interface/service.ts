import { UnauthedServiceDescriptor, AuthedServiceDescriptor } from '@selfage/service_descriptor';
import { GetChatRequest, GET_CHAT_REQUEST, GetChatResponse, GET_CHAT_RESPONSE, GetChatHistoryRequest, GET_CHAT_HISTORY_REQUEST, GetChatHistoryResponse, GET_CHAT_HISTORY_RESPONSE } from './service_body';

export let GET_CHAT: UnauthedServiceDescriptor<GetChatRequest, GetChatResponse> = {
  name: "GetChat",
  path: "/get_chat",
  requestDescriptor: GET_CHAT_REQUEST,
  responseDescriptor: GET_CHAT_RESPONSE,
};

export let GET_CHAT_HISTORY: AuthedServiceDescriptor<GetChatHistoryRequest, GetChatHistoryResponse> = {
  name: "GetChatHistory",
  path: "/get_chat_history",
  requestDescriptor: GET_CHAT_HISTORY_REQUEST,
  responseDescriptor: GET_CHAT_HISTORY_RESPONSE,
};
