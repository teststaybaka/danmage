import { ServiceDescriptor, RemoteCallDescriptor } from '@selfage/service_descriptor';
import { PrimitiveType, MessageDescriptor } from '@selfage/message/descriptor';
import { User, USER } from './user';
import { ChatEntry, CHAT_ENTRY, HostApp, HOST_APP } from './chat_entry';
import { PlayerSettings, PLAYER_SETTINGS } from './player_settings';

export let DANMAKU_SERVICE: ServiceDescriptor = {
  name: "DanmakuService",
  path: "/",
}

export interface SignInRequestBody {
  googleAccessToken?: string,
}

export let SIGN_IN_REQUEST_BODY: MessageDescriptor<SignInRequestBody> = {
  name: 'SignInRequestBody',
  fields: [{
    name: 'googleAccessToken',
    index: 1,
    primitiveType: PrimitiveType.STRING,
  }],
};

export interface SignInResponse {
  signedSession?: string,
}

export let SIGN_IN_RESPONSE: MessageDescriptor<SignInResponse> = {
  name: 'SignInResponse',
  fields: [{
    name: 'signedSession',
    index: 1,
    primitiveType: PrimitiveType.STRING,
  }],
};

export interface GetUserRequestBody {
}

export let GET_USER_REQUEST_BODY: MessageDescriptor<GetUserRequestBody> = {
  name: 'GetUserRequestBody',
  fields: [],
};

export interface GetUserResponse {
  user?: User,
}

export let GET_USER_RESPONSE: MessageDescriptor<GetUserResponse> = {
  name: 'GetUserResponse',
  fields: [{
    name: 'user',
    index: 1,
    messageType: USER,
  }],
};

export interface PostChatRequestBody {
  chatEntry?: ChatEntry,
}

export let POST_CHAT_REQUEST_BODY: MessageDescriptor<PostChatRequestBody> = {
  name: 'PostChatRequestBody',
  fields: [{
    name: 'chatEntry',
    index: 1,
    messageType: CHAT_ENTRY,
  }],
};

export interface PostChatResponse {
  chatEntry?: ChatEntry,
}

export let POST_CHAT_RESPONSE: MessageDescriptor<PostChatResponse> = {
  name: 'PostChatResponse',
  fields: [{
    name: 'chatEntry',
    index: 1,
    messageType: CHAT_ENTRY,
  }],
};

export interface GetChatRequestBody {
  hostApp?: HostApp,
  hostContentId?: string,
}

export let GET_CHAT_REQUEST_BODY: MessageDescriptor<GetChatRequestBody> = {
  name: 'GetChatRequestBody',
  fields: [{
    name: 'hostApp',
    index: 1,
    enumType: HOST_APP,
  }, {
    name: 'hostContentId',
    index: 2,
    primitiveType: PrimitiveType.STRING,
  }],
};

export interface GetChatResponse {
  chatEntries?: Array<ChatEntry>,
}

export let GET_CHAT_RESPONSE: MessageDescriptor<GetChatResponse> = {
  name: 'GetChatResponse',
  fields: [{
    name: 'chatEntries',
    index: 1,
    messageType: CHAT_ENTRY,
    isArray: true,
  }],
};

export interface GetChatHistoryRequestBody {
  cursor?: string,
}

export let GET_CHAT_HISTORY_REQUEST_BODY: MessageDescriptor<GetChatHistoryRequestBody> = {
  name: 'GetChatHistoryRequestBody',
  fields: [{
    name: 'cursor',
    index: 1,
    primitiveType: PrimitiveType.STRING,
  }],
};

export interface GetChatHistoryResponse {
  chatEntries?: Array<ChatEntry>,
  cursor?: string,
}

export let GET_CHAT_HISTORY_RESPONSE: MessageDescriptor<GetChatHistoryResponse> = {
  name: 'GetChatHistoryResponse',
  fields: [{
    name: 'chatEntries',
    index: 1,
    messageType: CHAT_ENTRY,
    isArray: true,
  }, {
    name: 'cursor',
    index: 2,
    primitiveType: PrimitiveType.STRING,
  }],
};

export interface UpdatePlayerSettingsRequestBody {
  playerSettings?: PlayerSettings,
}

export let UPDATE_PLAYER_SETTINGS_REQUEST_BODY: MessageDescriptor<UpdatePlayerSettingsRequestBody> = {
  name: 'UpdatePlayerSettingsRequestBody',
  fields: [{
    name: 'playerSettings',
    index: 1,
    messageType: PLAYER_SETTINGS,
  }],
};

export interface UpdatePlayerSettingsResponse {
}

export let UPDATE_PLAYER_SETTINGS_RESPONSE: MessageDescriptor<UpdatePlayerSettingsResponse> = {
  name: 'UpdatePlayerSettingsResponse',
  fields: [],
};

export interface GetPlayerSettingsRequestBody {
}

export let GET_PLAYER_SETTINGS_REQUEST_BODY: MessageDescriptor<GetPlayerSettingsRequestBody> = {
  name: 'GetPlayerSettingsRequestBody',
  fields: [],
};

export interface GetPlayerSettingsResponse {
  playerSettings?: PlayerSettings,
}

export let GET_PLAYER_SETTINGS_RESPONSE: MessageDescriptor<GetPlayerSettingsResponse> = {
  name: 'GetPlayerSettingsResponse',
  fields: [{
    name: 'playerSettings',
    index: 1,
    messageType: PLAYER_SETTINGS,
  }],
};

export interface UpdateNicknameRequestBody {
  newName?: string,
}

export let UPDATE_NICKNAME_REQUEST_BODY: MessageDescriptor<UpdateNicknameRequestBody> = {
  name: 'UpdateNicknameRequestBody',
  fields: [{
    name: 'newName',
    index: 1,
    primitiveType: PrimitiveType.STRING,
  }],
};

export interface UpdateNicknameResponse {
}

export let UPDATE_NICKNAME_RESPONSE: MessageDescriptor<UpdateNicknameResponse> = {
  name: 'UpdateNicknameResponse',
  fields: [],
};

export let SIGN_IN: RemoteCallDescriptor = {
  name: "SignIn",
  service: DANMAKU_SERVICE,
  path: "/SignIn",
  body: {
    messageType: SIGN_IN_REQUEST_BODY,
  },
  response: {
    messageType: SIGN_IN_RESPONSE,
  },
}

export let GET_USER: RemoteCallDescriptor = {
  name: "GetUser",
  service: DANMAKU_SERVICE,
  path: "/GetUser",
  body: {
    messageType: GET_USER_REQUEST_BODY,
  },
  authKey: "a",
  response: {
    messageType: GET_USER_RESPONSE,
  },
}

export let POST_CHAT: RemoteCallDescriptor = {
  name: "PostChat",
  service: DANMAKU_SERVICE,
  path: "/PostChat",
  body: {
    messageType: POST_CHAT_REQUEST_BODY,
  },
  authKey: "a",
  response: {
    messageType: POST_CHAT_RESPONSE,
  },
}

export let GET_CHAT: RemoteCallDescriptor = {
  name: "GetChat",
  service: DANMAKU_SERVICE,
  path: "/GetChat",
  body: {
    messageType: GET_CHAT_REQUEST_BODY,
  },
  response: {
    messageType: GET_CHAT_RESPONSE,
  },
}

export let GET_CHAT_HISTORY: RemoteCallDescriptor = {
  name: "GetChatHistory",
  service: DANMAKU_SERVICE,
  path: "/GetChatHistory",
  body: {
    messageType: GET_CHAT_HISTORY_REQUEST_BODY,
  },
  authKey: "a",
  response: {
    messageType: GET_CHAT_HISTORY_RESPONSE,
  },
}

export let UPDATE_PLAYER_SETTINGS: RemoteCallDescriptor = {
  name: "UpdatePlayerSettings",
  service: DANMAKU_SERVICE,
  path: "/UpdatePlayerSettings",
  body: {
    messageType: UPDATE_PLAYER_SETTINGS_REQUEST_BODY,
  },
  authKey: "a",
  response: {
    messageType: UPDATE_PLAYER_SETTINGS_RESPONSE,
  },
}

export let GET_PLAYER_SETTINGS: RemoteCallDescriptor = {
  name: "GetPlayerSettings",
  service: DANMAKU_SERVICE,
  path: "/GetPlayerSettings",
  body: {
    messageType: GET_PLAYER_SETTINGS_REQUEST_BODY,
  },
  authKey: "a",
  response: {
    messageType: GET_PLAYER_SETTINGS_RESPONSE,
  },
}

export let UPDATE_NICKNAME: RemoteCallDescriptor = {
  name: "UpdateNickname",
  service: DANMAKU_SERVICE,
  path: "/UpdateNickname",
  body: {
    messageType: UPDATE_NICKNAME_REQUEST_BODY,
  },
  authKey: "a",
  response: {
    messageType: UPDATE_NICKNAME_RESPONSE,
  },
}
