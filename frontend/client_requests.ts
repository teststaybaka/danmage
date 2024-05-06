import { WebServiceClientInterface } from '@selfage/service_descriptor/web_service_client_interface';
import { SignInRequest, SignInResponse, SIGN_IN, GetUserRequest, GetUserResponse, GET_USER, PostChatRequest, PostChatResponse, POST_CHAT, GetChatRequest, GetChatResponse, GET_CHAT, GetChatHistoryRequest, GetChatHistoryResponse, GET_CHAT_HISTORY, UpdatePlayerSettingsRequest, UpdatePlayerSettingsResponse, UPDATE_PLAYER_SETTINGS, GetPlayerSettingsRequest, GetPlayerSettingsResponse, GET_PLAYER_SETTINGS, UpdateNicknameRequest, UpdateNicknameResponse, UPDATE_NICKNAME, ReportUserIssueRequest, ReportUserIssueResponse, REPORT_USER_ISSUE } from '../interface/service';

export function signIn(
  client: WebServiceClientInterface,
  body: SignInRequest,
): Promise<SignInResponse> {
  return client.send({
    descriptor: SIGN_IN,
    body,
  });
}

export function getUser(
  client: WebServiceClientInterface,
  body: GetUserRequest,
): Promise<GetUserResponse> {
  return client.send({
    descriptor: GET_USER,
    body,
  });
}

export function postChat(
  client: WebServiceClientInterface,
  body: PostChatRequest,
): Promise<PostChatResponse> {
  return client.send({
    descriptor: POST_CHAT,
    body,
  });
}

export function getChat(
  client: WebServiceClientInterface,
  body: GetChatRequest,
): Promise<GetChatResponse> {
  return client.send({
    descriptor: GET_CHAT,
    body,
  });
}

export function getChatHistory(
  client: WebServiceClientInterface,
  body: GetChatHistoryRequest,
): Promise<GetChatHistoryResponse> {
  return client.send({
    descriptor: GET_CHAT_HISTORY,
    body,
  });
}

export function updatePlayerSettings(
  client: WebServiceClientInterface,
  body: UpdatePlayerSettingsRequest,
): Promise<UpdatePlayerSettingsResponse> {
  return client.send({
    descriptor: UPDATE_PLAYER_SETTINGS,
    body,
  });
}

export function getPlayerSettings(
  client: WebServiceClientInterface,
  body: GetPlayerSettingsRequest,
): Promise<GetPlayerSettingsResponse> {
  return client.send({
    descriptor: GET_PLAYER_SETTINGS,
    body,
  });
}

export function updateNickname(
  client: WebServiceClientInterface,
  body: UpdateNicknameRequest,
): Promise<UpdateNicknameResponse> {
  return client.send({
    descriptor: UPDATE_NICKNAME,
    body,
  });
}

export function reportUserIssue(
  client: WebServiceClientInterface,
  body: ReportUserIssueRequest,
): Promise<ReportUserIssueResponse> {
  return client.send({
    descriptor: REPORT_USER_ISSUE,
    body,
  });
}
