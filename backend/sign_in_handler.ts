import bigInt = require("big-integer");
import nodeFetch from "node-fetch";
import { SignInRequestBody, SignInResponse } from "../interface/service";
import { User } from "../interface/user";
import { DATASTORE_CLIENT } from "./datastore_client";
import { SignInHandlerInterface } from "./server_handlers";
import { SessionBuilder } from "./session_signer";
import { Datastore } from "@google-cloud/datastore";
import { HttpError, newBadRequestError } from "@selfage/http_error";
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
    private datastoreClient: Datastore,
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
    body: SignInRequestBody,
  ): Promise<SignInResponse> {
    if (!body.googleAccessToken) {
      throw newBadRequestError(`"googleAccessToken" is required.`);
    }
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
        `Failed to fetch Google access token info. Response status: ` +
          `${response.statusText}`,
      );
    }

    let data = await response.json();
    if (!this.googleOauthClientIds.has(data.aud)) {
      throw newBadRequestError(`Unexpected aud from Google access token.`);
    }
    let googleId = data.sub;
    if (!googleId || typeof googleId !== "string") {
      throw newBadRequestError(`No google id or not a string. ${JSON.stringify(data)}`);
    }

    let uint8Array = bigInt(googleId).toArray(256).value;
    let base64GoogleId = Buffer.from(uint8Array).toString("base64");
    let user: User = {
      id: `google-${base64GoogleId}`,
      created: this.getNow(),
    };
    let key = this.datastoreClient.key(["User", user.id]);
    let [existingUser] = await this.datastoreClient.get(key);
    if (!existingUser) {
      await this.datastoreClient.save({
        key: key,
        data: user,
        method: "insert",
      });
    }

    let signedSession = this.sessionBuilder.build({ userId: user.id });
    return {
      signedSession: signedSession,
    };
  }
}
