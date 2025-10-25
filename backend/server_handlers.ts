import { SignInRequestBody, SIGN_IN, SignInResponse, GetUserRequestBody, GET_USER, GetUserResponse, PostChatRequestBody, POST_CHAT, PostChatResponse, GetChatRequestBody, GET_CHAT, GetChatResponse, GetChatHistoryRequestBody, GET_CHAT_HISTORY, GetChatHistoryResponse, UpdatePlayerSettingsRequestBody, UPDATE_PLAYER_SETTINGS, UpdatePlayerSettingsResponse, GetPlayerSettingsRequestBody, GET_PLAYER_SETTINGS, GetPlayerSettingsResponse, UpdateNicknameRequestBody, UPDATE_NICKNAME, UpdateNicknameResponse } from '../interface/service';
import { RemoteCallHandlerInterface } from '@selfage/service_descriptor/remote_call_handler_interface';

export abstract class SignInHandlerInterface implements RemoteCallHandlerInterface {
  public descriptor = SIGN_IN;
  public abstract handle(
    loggingPrefix: string,
    body: SignInRequestBody,
  ): Promise<SignInResponse>;
}

export abstract class GetUserHandlerInterface implements RemoteCallHandlerInterface {
  public descriptor = GET_USER;
  public abstract handle(
    loggingPrefix: string,
    body: GetUserRequestBody,
    authStr: string,
  ): Promise<GetUserResponse>;
}

export abstract class PostChatHandlerInterface implements RemoteCallHandlerInterface {
  public descriptor = POST_CHAT;
  public abstract handle(
    loggingPrefix: string,
    body: PostChatRequestBody,
    authStr: string,
  ): Promise<PostChatResponse>;
}

export abstract class GetChatHandlerInterface implements RemoteCallHandlerInterface {
  public descriptor = GET_CHAT;
  public abstract handle(
    loggingPrefix: string,
    body: GetChatRequestBody,
  ): Promise<GetChatResponse>;
}

export abstract class GetChatHistoryHandlerInterface implements RemoteCallHandlerInterface {
  public descriptor = GET_CHAT_HISTORY;
  public abstract handle(
    loggingPrefix: string,
    body: GetChatHistoryRequestBody,
    authStr: string,
  ): Promise<GetChatHistoryResponse>;
}

export abstract class UpdatePlayerSettingsHandlerInterface implements RemoteCallHandlerInterface {
  public descriptor = UPDATE_PLAYER_SETTINGS;
  public abstract handle(
    loggingPrefix: string,
    body: UpdatePlayerSettingsRequestBody,
    authStr: string,
  ): Promise<UpdatePlayerSettingsResponse>;
}

export abstract class GetPlayerSettingsHandlerInterface implements RemoteCallHandlerInterface {
  public descriptor = GET_PLAYER_SETTINGS;
  public abstract handle(
    loggingPrefix: string,
    body: GetPlayerSettingsRequestBody,
    authStr: string,
  ): Promise<GetPlayerSettingsResponse>;
}

export abstract class UpdateNicknameHandlerInterface implements RemoteCallHandlerInterface {
  public descriptor = UPDATE_NICKNAME;
  public abstract handle(
    loggingPrefix: string,
    body: UpdateNicknameRequestBody,
    authStr: string,
  ): Promise<UpdateNicknameResponse>;
}
