import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';
import { ServiceDescriptor } from '@selfage/service_descriptor';
import { User, USER } from './user';
import { USER_SESSION } from './session';
import { ChatEntry, CHAT_ENTRY, HostApp, HOST_APP } from './chat_entry';
import { PlayerSettings, PLAYER_SETTINGS } from './player_settings';
import { UserIssue, USER_ISSUE } from './user_issue';

export interface SignInRequest {
  googleAccessToken?: string,
}

export let SIGN_IN_REQUEST: MessageDescriptor<SignInRequest> = {
  name: 'SignInRequest',
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
  fields: [
    {
      name: 'signedSession',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export let SIGN_IN: ServiceDescriptor = {
  name: "SignIn",
  path: "/SignIn",
  body: {
    messageType: SIGN_IN_REQUEST,
  },
  response: {
    messageType: SIGN_IN_RESPONSE,
  },
}

export interface GetUserRequest {
}

export let GET_USER_REQUEST: MessageDescriptor<GetUserRequest> = {
  name: 'GetUserRequest',
  fields: [
  ]
};

export interface GetUserResponse {
  user?: User,
}

export let GET_USER_RESPONSE: MessageDescriptor<GetUserResponse> = {
  name: 'GetUserResponse',
  fields: [
    {
      name: 'user',
      messageType: USER,
    },
  ]
};

export let GET_USER: ServiceDescriptor = {
  name: "GetUser",
  path: "/GetUser",
  body: {
    messageType: GET_USER_REQUEST,
  },
  auth: {
    key: "auth",
    type: USER_SESSION
  },
  response: {
    messageType: GET_USER_RESPONSE,
  },
}

export interface PostChatRequest {
  chatEntry?: ChatEntry,
}

export let POST_CHAT_REQUEST: MessageDescriptor<PostChatRequest> = {
  name: 'PostChatRequest',
  fields: [
    {
      name: 'chatEntry',
      messageType: CHAT_ENTRY,
    },
  ]
};

export interface PostChatResponse {
  chatEntry?: ChatEntry,
}

export let POST_CHAT_RESPONSE: MessageDescriptor<PostChatResponse> = {
  name: 'PostChatResponse',
  fields: [
    {
      name: 'chatEntry',
      messageType: CHAT_ENTRY,
    },
  ]
};

export let POST_CHAT: ServiceDescriptor = {
  name: "PostChat",
  path: "/PostChat",
  body: {
    messageType: POST_CHAT_REQUEST,
  },
  auth: {
    key: "auth",
    type: USER_SESSION
  },
  response: {
    messageType: POST_CHAT_RESPONSE,
  },
}

export interface GetChatRequest {
  hostApp?: HostApp,
  hostContentId?: string,
}

export let GET_CHAT_REQUEST: MessageDescriptor<GetChatRequest> = {
  name: 'GetChatRequest',
  fields: [
    {
      name: 'hostApp',
      enumType: HOST_APP,
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
  fields: [
    {
      name: 'chatEntries',
      messageType: CHAT_ENTRY,
      isArray: true,
    },
  ]
};

export let GET_CHAT: ServiceDescriptor = {
  name: "GetChat",
  path: "/GetChat",
  body: {
    messageType: GET_CHAT_REQUEST,
  },
  response: {
    messageType: GET_CHAT_RESPONSE,
  },
}

export interface GetChatHistoryRequest {
/* If absent, query from the beginning. */
  cursor?: string,
}

export let GET_CHAT_HISTORY_REQUEST: MessageDescriptor<GetChatHistoryRequest> = {
  name: 'GetChatHistoryRequest',
  fields: [
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
  fields: [
    {
      name: 'chatEntries',
      messageType: CHAT_ENTRY,
      isArray: true,
    },
    {
      name: 'cursor',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export let GET_CHAT_HISTORY: ServiceDescriptor = {
  name: "GetChatHistory",
  path: "/GetChatHistory",
  body: {
    messageType: GET_CHAT_HISTORY_REQUEST,
  },
  auth: {
    key: "auth",
    type: USER_SESSION
  },
  response: {
    messageType: GET_CHAT_HISTORY_RESPONSE,
  },
}

export interface UpdatePlayerSettingsRequest {
  playerSettings?: PlayerSettings,
}

export let UPDATE_PLAYER_SETTINGS_REQUEST: MessageDescriptor<UpdatePlayerSettingsRequest> = {
  name: 'UpdatePlayerSettingsRequest',
  fields: [
    {
      name: 'playerSettings',
      messageType: PLAYER_SETTINGS,
    },
  ]
};

export interface UpdatePlayerSettingsResponse {
}

export let UPDATE_PLAYER_SETTINGS_RESPONSE: MessageDescriptor<UpdatePlayerSettingsResponse> = {
  name: 'UpdatePlayerSettingsResponse',
  fields: [
  ]
};

export let UPDATE_PLAYER_SETTINGS: ServiceDescriptor = {
  name: "UpdatePlayerSettings",
  path: "/UpdatePlayerSettings",
  body: {
    messageType: UPDATE_PLAYER_SETTINGS_REQUEST,
  },
  auth: {
    key: "auth",
    type: USER_SESSION
  },
  response: {
    messageType: UPDATE_PLAYER_SETTINGS_RESPONSE,
  },
}

export interface GetPlayerSettingsRequest {
}

export let GET_PLAYER_SETTINGS_REQUEST: MessageDescriptor<GetPlayerSettingsRequest> = {
  name: 'GetPlayerSettingsRequest',
  fields: [
  ]
};

export interface GetPlayerSettingsResponse {
  playerSettings?: PlayerSettings,
}

export let GET_PLAYER_SETTINGS_RESPONSE: MessageDescriptor<GetPlayerSettingsResponse> = {
  name: 'GetPlayerSettingsResponse',
  fields: [
    {
      name: 'playerSettings',
      messageType: PLAYER_SETTINGS,
    },
  ]
};

export let GET_PLAYER_SETTINGS: ServiceDescriptor = {
  name: "GetPlayerSettings",
  path: "/GetPlayerSettings",
  body: {
    messageType: GET_PLAYER_SETTINGS_REQUEST,
  },
  auth: {
    key: "auth",
    type: USER_SESSION
  },
  response: {
    messageType: GET_PLAYER_SETTINGS_RESPONSE,
  },
}

export interface UpdateNicknameRequest {
  newName?: string,
}

export let UPDATE_NICKNAME_REQUEST: MessageDescriptor<UpdateNicknameRequest> = {
  name: 'UpdateNicknameRequest',
  fields: [
    {
      name: 'newName',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface UpdateNicknameResponse {
}

export let UPDATE_NICKNAME_RESPONSE: MessageDescriptor<UpdateNicknameResponse> = {
  name: 'UpdateNicknameResponse',
  fields: [
  ]
};

export let UPDATE_NICKNAME: ServiceDescriptor = {
  name: "UpdateNickname",
  path: "/UpdateNickname",
  body: {
    messageType: UPDATE_NICKNAME_REQUEST,
  },
  auth: {
    key: "auth",
    type: USER_SESSION
  },
  response: {
    messageType: UPDATE_NICKNAME_RESPONSE,
  },
}

export interface ReportUserIssueRequest {
  userIssue?: UserIssue,
}

export let REPORT_USER_ISSUE_REQUEST: MessageDescriptor<ReportUserIssueRequest> = {
  name: 'ReportUserIssueRequest',
  fields: [
    {
      name: 'userIssue',
      messageType: USER_ISSUE,
    },
  ]
};

export interface ReportUserIssueResponse {
}

export let REPORT_USER_ISSUE_RESPONSE: MessageDescriptor<ReportUserIssueResponse> = {
  name: 'ReportUserIssueResponse',
  fields: [
  ]
};

export let REPORT_USER_ISSUE: ServiceDescriptor = {
  name: "ReportUserIssue",
  path: "/ReportUserIssue",
  body: {
    messageType: REPORT_USER_ISSUE_REQUEST,
  },
  response: {
    messageType: REPORT_USER_ISSUE_RESPONSE,
  },
}
