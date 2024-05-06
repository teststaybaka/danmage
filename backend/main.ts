import express = require("express");
import expressStaticGzip = require("express-static-gzip");
import getStream = require("get-stream");
import http = require("http");
import https = require("https");
import { ORIGIN_PROD } from "../common";
import { GetChatHandler } from "./get_chat_handler";
import { GetChatHistoryHandler } from "./get_chat_history_handler";
import { GetPlayerSettingsHandler } from "./get_player_settings_handler";
import { GetUserHandler } from "./get_user_handler";
import { LOGGER } from "./logger";
import { PostChatHandler } from "./post_chat_handler";
import { ReportUserIssueHandler } from "./report_user_issue_handler";
import { SignInHandler } from "./sign_in_handler";
import { UpdateNicknameHandler } from "./update_nickname_handler";
import {
  UpdatePlayerSettingsHandler,
} from "./update_player_settings_handler";
import { Storage } from "@google-cloud/storage";
import { HandlerRegister } from "@selfage/service_handler/register";
import { SessionSigner } from "@selfage/service_handler/session_signer";
import "../environment";
import "@selfage/web_app_base_dir";

async function main(): Promise<void> {
  if (globalThis.ENVIRONMENT === "prod") {
    let reader = new BucketReader(new Storage(), "danmage-prod");
    let [
      privateKey,
      certificate,
      ca0,
      ca1,
      ca2,
      sessionKey,
      googleOauthWebClientId,
      googleOauthChromeExtensionClientId,
      googleOauthChromeExtensionPastClientId,
    ] = await Promise.all([
      reader.read("danmage.key"),
      reader.read("danmage.crt"),
      reader.read("ca_g0.crt"),
      reader.read("ca_g1.crt"),
      reader.read("ca_g2.crt"),
      reader.read("session.key"),
      reader.read("google_oauth_web_client_id.key"),
      reader.read("google_oauth_chrome_extension_client_id.key"),
      reader.read("google_oauth_chrome_extension_past_client_id.key"),
    ]);

    let redirectApp = express();
    redirectApp.get("/*", (req, res) => {
      res.redirect(`${ORIGIN_PROD}${req.path}`);
    });
    let httpServer = http.createServer(redirectApp);
    httpServer.listen(80, () => {
      LOGGER.info("Http server started at 80.");
    });

    let app = registerHandlers(sessionKey, [
      googleOauthWebClientId,
      googleOauthChromeExtensionClientId,
      googleOauthChromeExtensionPastClientId,
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
      LOGGER.info("Https server started at 443.");
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
      LOGGER.info("Http server started at 80.");
    });
  } else if (globalThis.ENVIRONMENT === "local") {
    let app = registerHandlers("randomlocalkey", ["randomclientid"]);
    let httpServer = http.createServer(app);
    httpServer.listen(8080, () => {
      LOGGER.info("Http server started at 8080.");
    });
  } else {
    throw new Error(
      `Not supported environment ${globalThis.ENVIRONMENT} when intializing main.`
    );
  }
}

function registerHandlers(
  sessionKey: string,
  googleOauthClientIds: Array<string>
): express.Express {
  SessionSigner.SECRET_KEY = sessionKey;
  let app = express();
  let register = new HandlerRegister(app, LOGGER);
  register.registerCorsAllowedPreflightHandler();
  register.register(SignInHandler.create(new Set(googleOauthClientIds)));
  register.register(GetUserHandler.create());
  register.register(PostChatHandler.create());
  register.register(GetChatHandler.create());
  register.register(GetChatHistoryHandler.create());
  register.register(UpdatePlayerSettingsHandler.create());
  register.register(GetPlayerSettingsHandler.create());
  register.register(UpdateNicknameHandler.create());
  register.register(ReportUserIssueHandler.create());

  app.get("/*", (req, res, next) => {
    LOGGER.info(`Received GET request at ${req.originalUrl}.`);
    next();
  });
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
