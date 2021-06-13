import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';
import { UnauthedServiceDescriptor, AuthedServiceDescriptor } from '@selfage/service_descriptor';
import { User, USER } from './user';
import { ChatEntry, CHAT_ENTRY, HostApp, HOST_APP } from './chat_entry';
import { PlayerSettings, PLAYER_SETTINGS } from './player_settings';

export interface SignInRequest {
  googleAccessToken?: string,
}

export let SIGN_IN_REQUEST: MessageDescriptor<SignInRequest> = {
  name: 'SignInRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'googleAccessToken',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface SignInResponse {
  signedSession?: string,
}

export let SIGN_IN_RESPONSE: MessageDescriptor<SignInResponse> = {
  name: 'SignInResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'signedSession',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export let SIGN_IN: UnauthedServiceDescriptor<SignInRequest, SignInResponse> = {
  name: "SignIn",
  path: "/sign_in",
  requestDescriptor: SIGN_IN_REQUEST,
  responseDescriptor: SIGN_IN_RESPONSE,
};

export interface GetUserRequest {
}

export let GET_USER_REQUEST: MessageDescriptor<GetUserRequest> = {
  name: 'GetUserRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
  ]
};

export interface GetUserResponse {
  user?: User,
}

export let GET_USER_RESPONSE: MessageDescriptor<GetUserResponse> = {
  name: 'GetUserResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'user',
      messageDescriptor: USER,
    },
  ]
};

export let GET_USER: UnauthedServiceDescriptor<GetUserRequest, GetUserResponse> = {
  name: "GetUser",
  path: "/get_user",
  requestDescriptor: GET_USER_REQUEST,
  responseDescriptor: GET_USER_RESPONSE,
};

export interface PostChatRequest {
  signedSession?: string,
  chatEntry?: ChatEntry,
}

export let POST_CHAT_REQUEST: MessageDescriptor<PostChatRequest> = {
  name: 'PostChatRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'signedSession',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'chatEntry',
      messageDescriptor: CHAT_ENTRY,
    },
  ]
};

export interface PostChatResponse {
  chatEntry?: ChatEntry,
}

export let POST_CHAT_RESPONSE: MessageDescriptor<PostChatResponse> = {
  name: 'PostChatResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'chatEntry',
      messageDescriptor: CHAT_ENTRY,
    },
  ]
};

export let POST_CHAT: AuthedServiceDescriptor<PostChatRequest, PostChatResponse> = {
  name: "PostChat",
  path: "/post_chat",
  requestDescriptor: POST_CHAT_REQUEST,
  responseDescriptor: POST_CHAT_RESPONSE,
};

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
  chatEntries?: Array<ChatEntry>,
}

export let GET_CHAT_RESPONSE: MessageDescriptor<GetChatResponse> = {
  name: 'GetChatResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'chatEntries',
      messageDescriptor: CHAT_ENTRY,
      arrayFactoryFn: () => {
        return new Array<any>();
      },
    },
  ]
};

export let GET_CHAT: UnauthedServiceDescriptor<GetChatRequest, GetChatResponse> = {
  name: "GetChat",
  path: "/get_chat",
  requestDescriptor: GET_CHAT_REQUEST,
  responseDescriptor: GET_CHAT_RESPONSE,
};

export interface GetChatHistoryRequest {
  signedSession?: string,
/* Optional. */
  hostApp?: HostApp,
/* If absent, query from the beginning. */
  cursor?: string,
}

export let GET_CHAT_HISTORY_REQUEST: MessageDescriptor<GetChatHistoryRequest> = {
  name: 'GetChatHistoryRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'signedSession',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'hostApp',
      enumDescriptor: HOST_APP,
    },
    {
      name: 'cursor',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface GetChatHistoryResponse {
  chatEntries?: Array<ChatEntry>,
  cursor?: string,
}

export let GET_CHAT_HISTORY_RESPONSE: MessageDescriptor<GetChatHistoryResponse> = {
  name: 'GetChatHistoryResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'chatEntries',
      messageDescriptor: CHAT_ENTRY,
      arrayFactoryFn: () => {
        return new Array<any>();
      },
    },
    {
      name: 'cursor',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export let GET_CHAT_HISTORY: AuthedServiceDescriptor<GetChatHistoryRequest, GetChatHistoryResponse> = {
  name: "GetChatHistory",
  path: "/get_chat_history",
  requestDescriptor: GET_CHAT_HISTORY_REQUEST,
  responseDescriptor: GET_CHAT_HISTORY_RESPONSE,
};

export interface UpdatePlayerSettingsRequest {
  signedSession?: string,
  playerSettings?: PlayerSettings,
}

export let UPDATE_PLAYER_SETTINGS_REQUEST: MessageDescriptor<UpdatePlayerSettingsRequest> = {
  name: 'UpdatePlayerSettingsRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'signedSession',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'playerSettings',
      messageDescriptor: PLAYER_SETTINGS,
    },
  ]
};

export interface UpdatePlayerSettingsResponse {
}

export let UPDATE_PLAYER_SETTINGS_RESPONSE: MessageDescriptor<UpdatePlayerSettingsResponse> = {
  name: 'UpdatePlayerSettingsResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
  ]
};

export let UPDATE_PLAYER_SETTINGS: AuthedServiceDescriptor<UpdatePlayerSettingsRequest, UpdatePlayerSettingsResponse> = {
  name: "UpdatePlayerSettings",
  path: "/update_player_settings",
  requestDescriptor: UPDATE_PLAYER_SETTINGS_REQUEST,
  responseDescriptor: UPDATE_PLAYER_SETTINGS_RESPONSE,
};

export interface GetPlayerSettingsRequest {
  signedSession?: string,
}

export let GET_PLAYER_SETTINGS_REQUEST: MessageDescriptor<GetPlayerSettingsRequest> = {
  name: 'GetPlayerSettingsRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'signedSession',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface GetPlayerSettingsResponse {
  playerSettings?: PlayerSettings,
}

export let GET_PLAYER_SETTINGS_RESPONSE: MessageDescriptor<GetPlayerSettingsResponse> = {
  name: 'GetPlayerSettingsResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'playerSettings',
      messageDescriptor: PLAYER_SETTINGS,
    },
  ]
};

export let GET_PLAYER_SETTINGS: AuthedServiceDescriptor<GetPlayerSettingsRequest, GetPlayerSettingsResponse> = {
  name: "GetPlayerSettings",
  path: "/get_player_settings",
  requestDescriptor: GET_PLAYER_SETTINGS_REQUEST,
  responseDescriptor: GET_PLAYER_SETTINGS_RESPONSE,
};

export interface UpdateDisplayNameRequest {
  signedSession?: string,
  newName?: string,
}

export let UPDATE_DISPLAY_NAME_REQUEST: MessageDescriptor<UpdateDisplayNameRequest> = {
  name: 'UpdateDisplayNameRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'signedSession',
      primitiveType: PrimitiveType.STRING,
    },
    {
      name: 'newName',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface UpdateDisplayNameResponse {
}

export let UPDATE_DISPLAY_NAME_RESPONSE: MessageDescriptor<UpdateDisplayNameResponse> = {
  name: 'UpdateDisplayNameResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
  ]
};

export let UPDATE_DISPLAY_NAME: AuthedServiceDescriptor<UpdateDisplayNameRequest, UpdateDisplayNameResponse> = {
  name: "UpdateDisplayName",
  path: "/update_display_name",
  requestDescriptor: UPDATE_DISPLAY_NAME_REQUEST,
  responseDescriptor: UPDATE_DISPLAY_NAME_RESPONSE,
};
