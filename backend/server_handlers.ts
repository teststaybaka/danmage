import { ServiceHandlerInterface } from '@selfage/service_descriptor/service_handler_interface';
import { SIGN_IN, SignInRequest, SignInResponse, GET_USER, GetUserRequest, GetUserResponse, POST_CHAT, PostChatRequest, PostChatResponse, GET_CHAT, GetChatRequest, GetChatResponse, GET_CHAT_HISTORY, GetChatHistoryRequest, GetChatHistoryResponse, UPDATE_PLAYER_SETTINGS, UpdatePlayerSettingsRequest, UpdatePlayerSettingsResponse, GET_PLAYER_SETTINGS, GetPlayerSettingsRequest, GetPlayerSettingsResponse, UPDATE_NICKNAME, UpdateNicknameRequest, UpdateNicknameResponse, REPORT_USER_ISSUE, ReportUserIssueRequest, ReportUserIssueResponse } from '../interface/service';
import { UserSession } from '../interface/session';

export abstract class SignInHandlerInterface implements ServiceHandlerInterface {
  public descriptor = SIGN_IN;
  public abstract handle(
    loggingPrefix: string,
    body: SignInRequest,
  ): Promise<SignInResponse>;
}

export abstract class GetUserHandlerInterface implements ServiceHandlerInterface {
  public descriptor = GET_USER;
  public abstract handle(
    loggingPrefix: string,
    body: GetUserRequest,
    auth: UserSession,
  ): Promise<GetUserResponse>;
}

export abstract class PostChatHandlerInterface implements ServiceHandlerInterface {
  public descriptor = POST_CHAT;
  public abstract handle(
    loggingPrefix: string,
    body: PostChatRequest,
    auth: UserSession,
  ): Promise<PostChatResponse>;
}

export abstract class GetChatHandlerInterface implements ServiceHandlerInterface {
  public descriptor = GET_CHAT;
  public abstract handle(
    loggingPrefix: string,
    body: GetChatRequest,
  ): Promise<GetChatResponse>;
}

export abstract class GetChatHistoryHandlerInterface implements ServiceHandlerInterface {
  public descriptor = GET_CHAT_HISTORY;
  public abstract handle(
    loggingPrefix: string,
    body: GetChatHistoryRequest,
    auth: UserSession,
  ): Promise<GetChatHistoryResponse>;
}

export abstract class UpdatePlayerSettingsHandlerInterface implements ServiceHandlerInterface {
  public descriptor = UPDATE_PLAYER_SETTINGS;
  public abstract handle(
    loggingPrefix: string,
    body: UpdatePlayerSettingsRequest,
    auth: UserSession,
  ): Promise<UpdatePlayerSettingsResponse>;
}

export abstract class GetPlayerSettingsHandlerInterface implements ServiceHandlerInterface {
  public descriptor = GET_PLAYER_SETTINGS;
  public abstract handle(
    loggingPrefix: string,
    body: GetPlayerSettingsRequest,
    auth: UserSession,
  ): Promise<GetPlayerSettingsResponse>;
}

export abstract class UpdateNicknameHandlerInterface implements ServiceHandlerInterface {
  public descriptor = UPDATE_NICKNAME;
  public abstract handle(
    loggingPrefix: string,
    body: UpdateNicknameRequest,
    auth: UserSession,
  ): Promise<UpdateNicknameResponse>;
}

export abstract class ReportUserIssueHandlerInterface implements ServiceHandlerInterface {
  public descriptor = REPORT_USER_ISSUE;
  public abstract handle(
    loggingPrefix: string,
    body: ReportUserIssueRequest,
  ): Promise<ReportUserIssueResponse>;
}
