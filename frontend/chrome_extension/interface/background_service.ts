import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export interface SignInRequest {
}

export let SIGN_IN_REQUEST: MessageDescriptor<SignInRequest> = {
  name: 'SignInRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
  ]
};

export interface SignInResponse {
}

export let SIGN_IN_RESPONSE: MessageDescriptor<SignInResponse> = {
  name: 'SignInResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
  ]
};

export interface SignOutRequest {
}

export let SIGN_OUT_REQUEST: MessageDescriptor<SignOutRequest> = {
  name: 'SignOutRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
  ]
};

export interface SignOutResponse {
}

export let SIGN_OUT_RESPONSE: MessageDescriptor<SignOutResponse> = {
  name: 'SignOutResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
  ]
};

export interface GetSessionRequest {
}

export let GET_SESSION_REQUEST: MessageDescriptor<GetSessionRequest> = {
  name: 'GetSessionRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
  ]
};

export interface GetSessionResponse {
  signedSession?: string,
}

export let GET_SESSION_RESPONSE: MessageDescriptor<GetSessionResponse> = {
  name: 'GetSessionResponse',
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

export interface GetUrlRequest {
}

export let GET_URL_REQUEST: MessageDescriptor<GetUrlRequest> = {
  name: 'GetUrlRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
  ]
};

export interface GetUrlResponse {
  url?: string,
}

export let GET_URL_RESPONSE: MessageDescriptor<GetUrlResponse> = {
  name: 'GetUrlResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'url',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface SavePlayerSettingsRequest {
  playerSettingsStringified?: string,
}

export let SAVE_PLAYER_SETTINGS_REQUEST: MessageDescriptor<SavePlayerSettingsRequest> = {
  name: 'SavePlayerSettingsRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'playerSettingsStringified',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface SavePlayerSettingsResponse {
}

export let SAVE_PLAYER_SETTINGS_RESPONSE: MessageDescriptor<SavePlayerSettingsResponse> = {
  name: 'SavePlayerSettingsResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
  ]
};

export interface ReadPlayerSettingsRequest {
}

export let READ_PLAYER_SETTINGS_REQUEST: MessageDescriptor<ReadPlayerSettingsRequest> = {
  name: 'ReadPlayerSettingsRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
  ]
};

export interface ReadPlayerSettingsResponse {
  playerSettingsStringified?: string,
}

export let READ_PLAYER_SETTINGS_RESPONSE: MessageDescriptor<ReadPlayerSettingsResponse> = {
  name: 'ReadPlayerSettingsResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'playerSettingsStringified',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface BackgroundRequest {
  signInRequest?: SignInRequest,
  signOutRequest?: SignOutRequest,
  getSessionRequest?: GetSessionRequest,
  getUrlRequest?: GetUrlRequest,
  savePlayerSettingsRequest?: SavePlayerSettingsRequest,
  readPlayerSettingsRequest?: ReadPlayerSettingsRequest,
}

export let BACKGROUND_REQUEST: MessageDescriptor<BackgroundRequest> = {
  name: 'BackgroundRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'signInRequest',
      messageDescriptor: SIGN_IN_REQUEST,
    },
    {
      name: 'signOutRequest',
      messageDescriptor: SIGN_OUT_REQUEST,
    },
    {
      name: 'getSessionRequest',
      messageDescriptor: GET_SESSION_REQUEST,
    },
    {
      name: 'getUrlRequest',
      messageDescriptor: GET_URL_REQUEST,
    },
    {
      name: 'savePlayerSettingsRequest',
      messageDescriptor: SAVE_PLAYER_SETTINGS_REQUEST,
    },
    {
      name: 'readPlayerSettingsRequest',
      messageDescriptor: READ_PLAYER_SETTINGS_REQUEST,
    },
  ]
};
