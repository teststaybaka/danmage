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
  error?: string,
}

export let SIGN_IN_RESPONSE: MessageDescriptor<SignInResponse> = {
  name: 'SignInResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'error',
      primitiveType: PrimitiveType.STRING,
    },
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

export interface BackgroundRequest {
  signInRequest?: SignInRequest,
  signOutRequest?: SignOutRequest,
  getSessionRequest?: GetSessionRequest,
  getUrlRequest?: GetUrlRequest,
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
  ]
};
