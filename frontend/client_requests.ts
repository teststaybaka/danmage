import { SignInRequestBody, SignInResponse, SIGN_IN, GetUserRequestBody, GetUserResponse, GET_USER, PostChatRequestBody, PostChatResponse, POST_CHAT, GetChatRequestBody, GetChatResponse, GET_CHAT, GetChatHistoryRequestBody, GetChatHistoryResponse, GET_CHAT_HISTORY, UpdatePlayerSettingsRequestBody, UpdatePlayerSettingsResponse, UPDATE_PLAYER_SETTINGS, GetPlayerSettingsRequestBody, GetPlayerSettingsResponse, GET_PLAYER_SETTINGS, UpdateNicknameRequestBody, UpdateNicknameResponse, UPDATE_NICKNAME } from '../interface/service';
import { ClientRequestInterface } from '@selfage/service_descriptor/client_request_interface';

export function newSignInRequest(
  body: SignInRequestBody,
): ClientRequestInterface<SignInResponse> {
  return {
    descriptor: SIGN_IN,
    body,
  };
}

export function newGetUserRequest(
  body: GetUserRequestBody,
): ClientRequestInterface<GetUserResponse> {
  return {
    descriptor: GET_USER,
    body,
  };
}

export function newPostChatRequest(
  body: PostChatRequestBody,
): ClientRequestInterface<PostChatResponse> {
  return {
    descriptor: POST_CHAT,
    body,
  };
}

export function newGetChatRequest(
  body: GetChatRequestBody,
): ClientRequestInterface<GetChatResponse> {
  return {
    descriptor: GET_CHAT,
    body,
  };
}

export function newGetChatHistoryRequest(
  body: GetChatHistoryRequestBody,
): ClientRequestInterface<GetChatHistoryResponse> {
  return {
    descriptor: GET_CHAT_HISTORY,
    body,
  };
}

export function newUpdatePlayerSettingsRequest(
  body: UpdatePlayerSettingsRequestBody,
): ClientRequestInterface<UpdatePlayerSettingsResponse> {
  return {
    descriptor: UPDATE_PLAYER_SETTINGS,
    body,
  };
}

export function newGetPlayerSettingsRequest(
  body: GetPlayerSettingsRequestBody,
): ClientRequestInterface<GetPlayerSettingsResponse> {
  return {
    descriptor: GET_PLAYER_SETTINGS,
    body,
  };
}

export function newUpdateNicknameRequest(
  body: UpdateNicknameRequestBody,
): ClientRequestInterface<UpdateNicknameResponse> {
  return {
    descriptor: UPDATE_NICKNAME,
    body,
  };
}
