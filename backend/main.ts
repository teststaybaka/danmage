import express = require("express");
import expressStaticGzip = require("express-static-gzip");
import getStream = require("get-stream");
import http = require("http");
import https = require("https");
import { ORIGIN_PROD } from "../common";
import { GetChatHandler, GetDanmakuHandler } from "./get_chat_handler";
import { GetChatHistoryHandler } from "./get_chat_history_handler";
import { GetPlayerSettingsHandler } from "./get_player_settings_handler";
import { GetUserHandler } from "./get_user_handler";
import { PostChatHandler } from "./post_chat_handler";
import { ReportUserIssueHandler } from "./report_user_issue_handler";
import { SignInHandler } from "./sign_in_handler";
import { UpdateNicknameHandler } from "./update_nickname_handler";
import {
  ChangePlayerSettingsHandler,
  UpdatePlayerSettingsHandler,
} from "./update_player_settings_handler";
import { Storage } from "@google-cloud/storage";
import { registerCorsAllowedPreflightHandler } from "@selfage/service_handler/preflight_handler";
import {
  registerAuthed,
  registerUnauthed,
} from "@selfage/service_handler/register";
import { SessionSigner } from "@selfage/service_handler/session_signer";
import "../environment";
import "@selfage/web_app_base_dir";

async function main(): Promise<void> {
  if (globalThis.ENVIRONMENT === "prod") {
    let reader = new BucketReader(new Storage(), "danmage-keys");
    let [
      privateKey,
      certificate,
      ca0,
      ca1,
      ca2,
      sessionKey,
      googleOauthWebClientId,
      googleOauthChromeExtensionMasterClientId,
    ] = await Promise.all([
      reader.read("danmage.key"),
      reader.read("danmage.crt"),
      reader.read("ca_g0.crt"),
      reader.read("ca_g1.crt"),
      reader.read("ca_g2.crt"),
      reader.read("session.key"),
      reader.read("google_oauth_web_client_id.key"),
      reader.read("google_oauth_chrome_extension_master_client_id.key"),
    ]);

    let redirectApp = express();
    redirectApp.get("/*", (req, res) => {
      res.redirect(`${ORIGIN_PROD}${req.path}`);
    });
    let httpServer = http.createServer(redirectApp);
    httpServer.listen(80, () => {
      console.log("Http server started at 80.");
    });

    let app = registerHandlers(sessionKey, [
      googleOauthWebClientId,
      googleOauthChromeExtensionMasterClientId,
    ]);
    let httpsServer = https.createServer(
      {
        key: privateKey,
        cert: certificate,
        ca: [ca0, ca1, ca2],
      },
      app
    );
    httpsServer.listen(443, () => {
      console.log("Https server started at 443.");
    });
  } else if (globalThis.ENVIRONMENT === "dev") {
    let reader = new BucketReader(new Storage(), "danmage-dev-keys");
    let [
      sessionKey,
      googleOauthWebClientId,
      googleOauthChromeExtensionMasterClientId,
    ] = await Promise.all([
      reader.read("session.key"),
      reader.read("google_oauth_web_client_id.key"),
      reader.read("google_oauth_chrome_extension_master_client_id.key"),
    ]);

    let app = registerHandlers(sessionKey, [
      googleOauthWebClientId,
      googleOauthChromeExtensionMasterClientId,
    ]);
    let httpServer = http.createServer(app);
    httpServer.listen(80, () => {
      console.log("Http server started at 80.");
    });
  } else if (globalThis.ENVIRONMENT === "local") {
    let app = registerHandlers("randomlocalkey", ["randomclientid"]);
    let httpServer = http.createServer(app);
    httpServer.listen(8080, () => {
      console.log("Http server started at 8080.");
    });
  } else {
    throw new Error(`Not supported environment ${globalThis.ENVIRONMENT}.`);
  }
}

function registerHandlers(
  sessionKey: string,
  googleOauthClientIds: Array<string>
): express.Express {
  SessionSigner.SECRET_KEY = sessionKey;
  let app = express();
  registerCorsAllowedPreflightHandler(app);
  registerUnauthed(app, SignInHandler.create(new Set(googleOauthClientIds)));
  registerAuthed(app, GetUserHandler.create());
  registerAuthed(app, PostChatHandler.create());
  registerUnauthed(app, GetChatHandler.create());
  registerAuthed(app, GetChatHistoryHandler.create());
  registerAuthed(app, UpdatePlayerSettingsHandler.create());
  registerAuthed(app, GetPlayerSettingsHandler.create());
  registerAuthed(app, UpdateNicknameHandler.create());
  registerUnauthed(app, ReportUserIssueHandler.create());
  registerUnauthed(app, GetDanmakuHandler.create());
  registerAuthed(app, ChangePlayerSettingsHandler.create());
  app.use(
    "/",
    expressStaticGzip(globalThis.WEB_APP_BASE_DIR, {
      serveStatic: {
        extensions: ["html"],
        fallthrough: false,
      },
    })
  );
  return app;
}

class BucketReader {
  public constructor(private storage: Storage, private bucketName: string) {}

  public async read(fileName: string): Promise<string> {
    return getStream(
      this.storage.bucket(this.bucketName).file(fileName).createReadStream()
    );
  }
}

main();
