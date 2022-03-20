import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

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

export interface GetAuthTokenRequest {
}

export let GET_AUTH_TOKEN_REQUEST: MessageDescriptor<GetAuthTokenRequest> = {
  name: 'GetAuthTokenRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
  ]
};

export interface GetAuthTokenResponse {
  accessToken?: string,
}

export let GET_AUTH_TOKEN_RESPONSE: MessageDescriptor<GetAuthTokenResponse> = {
  name: 'GetAuthTokenResponse',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'accessToken',
      primitiveType: PrimitiveType.STRING,
    },
  ]
};

export interface BackgroundRequest {
  getUrlRequest?: GetUrlRequest,
  getAuthTokenRequest?: GetAuthTokenRequest,
}

export let BACKGROUND_REQUEST: MessageDescriptor<BackgroundRequest> = {
  name: 'BackgroundRequest',
  factoryFn: () => {
    return new Object();
  },
  fields: [
    {
      name: 'getUrlRequest',
      messageDescriptor: GET_URL_REQUEST,
    },
    {
      name: 'getAuthTokenRequest',
      messageDescriptor: GET_AUTH_TOKEN_REQUEST,
    },
  ]
};
