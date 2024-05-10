import { MessageDescriptor, PrimitiveType } from '@selfage/message/descriptor';

export interface GetUrlRequest {
}

export let GET_URL_REQUEST: MessageDescriptor<GetUrlRequest> = {
  name: 'GetUrlRequest',
  fields: [
  ]
};

export interface GetUrlResponse {
  url?: string,
}

export let GET_URL_RESPONSE: MessageDescriptor<GetUrlResponse> = {
  name: 'GetUrlResponse',
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
  fields: [
  ]
};

export interface GetAuthTokenResponse {
  accessToken?: string,
}

export let GET_AUTH_TOKEN_RESPONSE: MessageDescriptor<GetAuthTokenResponse> = {
  name: 'GetAuthTokenResponse',
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
  fields: [
    {
      name: 'getUrlRequest',
      messageType: GET_URL_REQUEST,
    },
    {
      name: 'getAuthTokenRequest',
      messageType: GET_AUTH_TOKEN_REQUEST,
    },
  ]
};
