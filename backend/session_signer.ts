import crypto = require("crypto");
import { USER_SESSION, UserSession } from "../interface/session";
import { newUnauthorizedError } from "@selfage/http_error";
import { parseMessage } from "@selfage/message/parser";

function millisecondsToSeconds(ms: number): number {
  return Math.floor(ms / 1000);
}

export class SessionSigner {
  public static SECRET_KEY = "some secrets";
  private static ALGORITHM = "sha256";

  public sign(sessionDataStr: string, timestamp: number): string {
    let signature = crypto
      .createHmac(SessionSigner.ALGORITHM, SessionSigner.SECRET_KEY)
      .update(`${sessionDataStr}/${timestamp}`)
      .digest("base64");
    return signature;
  }
}

export class SessionBuilder {
  public static create(): SessionBuilder {
    return new SessionBuilder(new SessionSigner(), () => Date.now());
  }

  public constructor(
    private sessionSigner: SessionSigner,
    private getNow: () => number,
  ) {}

  public build(sessionData: UserSession): string {
    let timestamp = millisecondsToSeconds(this.getNow());
    let sessionDataStr = JSON.stringify(sessionData);
    let signature = this.sessionSigner.sign(sessionDataStr, timestamp);
    return `${sessionDataStr}|${timestamp.toString(36)}|${signature}`;
  }
}

export class SessionExtractor {
  public static create(): SessionExtractor {
    return new SessionExtractor(new SessionSigner());
  }

  public constructor(private sessionSigner: SessionSigner) {}

  public extractSessionData(
    loggingPrefix: string,
    signedSession: string,
  ): UserSession {
    if (typeof signedSession !== "string") {
      throw newUnauthorizedError(
        `signedSession is not a string, but it's ${typeof signedSession}.`,
      );
    }

    let pieces = signedSession.split("|");
    if (pieces.length !== 3) {
      throw newUnauthorizedError("Invalid signed session string.");
    }
    let sessionDataStr = pieces[0];
    let timestamp = Number.parseInt(pieces[1], 36);
    let signature = pieces[2];

    let signatureExpected = this.sessionSigner.sign(sessionDataStr, timestamp);
    if (signature !== signatureExpected) {
      throw newUnauthorizedError("Invalid session signature");
    }
    return parseMessage(JSON.parse(sessionDataStr), USER_SESSION);
  }
}
