import bigInt = require("big-integer");
import nodeFetch from "node-fetch";
import { SignInRequest, SignInResponse } from "../interface/service";
import { UserSession } from "../interface/session";
import { DATASTORE_CLIENT } from "./datastore/client";
import { USER_MODEL } from "./datastore/user_model";
import { SignInHandlerInterface } from "./server_handlers";
import { DatastoreClient } from "@selfage/datastore_client";
import { HttpError } from "@selfage/http_error";
import { SessionBuilder } from "@selfage/service_handler/session_signer";
import {
  RequestInfo,
  RequestInit,
  Response as NodeFetchResponse,
} from "node-fetch";

export class SignInHandler extends SignInHandlerInterface {
  public static create(googleOauthClientIds: Set<string>): SignInHandler {
    return new SignInHandler(
      googleOauthClientIds,
      DATASTORE_CLIENT,
      SessionBuilder.create(),
      () => Date.now(),
      nodeFetch,
    );
  }

  public constructor(
    private googleOauthClientIds: Set<string>,
    private datastoreClient: DatastoreClient,
    private sessionBuilder: SessionBuilder,
    private getNow: () => number,
    private fetch: (
      url: RequestInfo,
      init?: RequestInit,
    ) => Promise<NodeFetchResponse>,
  ) {
    super();
  }

  public async handle(
    loggingPrefix: string,
    body: SignInRequest,
  ): Promise<SignInResponse> {
    let response = await this.fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?` +
        `access_token=${body.googleAccessToken}`,
      {
        timeout: 60000,
      },
    );
    if (!response.ok) {
      throw new HttpError(
        response.status,
        `${loggingPrefix} Failed to fetch Google access token info. Response status: ` +
          `${response.statusText}`,
      );
    }

    let data = (await response.json()) as any;
    if (!this.googleOauthClientIds.has(data.aud)) {
      throw new Error(
        `${loggingPrefix} Unexpected aud from Google access token.`,
      );
    }
    let googleId = data.sub;
    if (!googleId || typeof googleId !== "string") {
      throw new Error(
        `${loggingPrefix} No google id or not a string. ${JSON.stringify(data)}`,
      );
    }

    let uint8Array = bigInt(googleId).toArray(256).value;
    let base64GoogleId = Buffer.from(uint8Array).toString("base64");
    let userId = `google-${base64GoogleId}`;
    let users = await this.datastoreClient.get([userId], USER_MODEL);
    if (users.length === 0) {
      await this.datastoreClient.save(
        [{ id: userId, created: Math.floor(this.getNow() / 1000) }],
        USER_MODEL,
        "insert",
      );
    }

    let signedSession = this.sessionBuilder.build(
      JSON.stringify({ userId: userId } as UserSession),
    );
    return {
      signedSession: signedSession,
    };
  }
}
