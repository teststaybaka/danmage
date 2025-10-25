import express = require("express");
import expressStaticGzip = require("express-static-gzip");
import getStream = require("get-stream");
import http = require("http");
import https = require("https");
import { ENV_VARS } from "../env_vars";
import { DANMAKU_SERVICE } from "../interface/service";
import { GetChatHandler } from "./get_chat_handler";
import { GetChatHistoryHandler } from "./get_chat_history_handler";
import { GetPlayerSettingsHandler } from "./get_player_settings_handler";
import { GetUserHandler } from "./get_user_handler";
import { PostChatHandler } from "./post_chat_handler";
import { SessionSigner } from "./session_signer";
import { SignInHandler } from "./sign_in_handler";
import { UpdateNicknameHandler } from "./update_nickname_handler";
import { UpdatePlayerSettingsHandler } from "./update_player_settings_handler";
import { Storage } from "@google-cloud/storage";
import { ServiceHandler } from "@selfage/service_handler/service_handler";

// Requires command line argument: path to the directory of static files.
async function main(): Promise<void> {
  if (!ENV_VARS.local) {
    let reader = new BucketReader(new Storage(), ENV_VARS.secretBucketName);
    let [privateKey, certificate, sessionKey] = await Promise.all([
      reader.read(ENV_VARS.sslPrivateKeyPath),
      reader.read(ENV_VARS.sslCertificatePath),
      reader.read(ENV_VARS.sessionSecretPath),
    ]);
    startServer(
      https.createServer({
        key: privateKey,
        cert: certificate,
      }),
      ENV_VARS.httpsPort,
      sessionKey,
      [ENV_VARS.googleOauthClientId],
    );

    // Redirect http to https.
    let redirectApp = express();
    redirectApp.get("/*", (req, res) => {
      res.redirect(`${ENV_VARS.externalOrigin}${req.path}`);
    });
    let httpServer = http.createServer(redirectApp);
    httpServer.listen(ENV_VARS.httpPort, () => {
      console.log(`Http server started at ${ENV_VARS.httpPort}.`);
    });
  } else {
    startServer(http.createServer(), ENV_VARS.httpPort, "randomlocalkey", [
      "randomclientid",
    ]);
  }
}

function startServer(
  server: https.Server | http.Server,
  port: number,
  sessionKey: string,
  googleOauthClientIds: Array<string>,
): void {
  SessionSigner.SECRET_KEY = sessionKey;
  let app = express();
  // Post requests
  let service = ServiceHandler.create(
    server,
    "*",
    app,
  ).addCorsAllowedPreflightHandler();
  service
    .addHandlerRegister(DANMAKU_SERVICE)
    .add(SignInHandler.create(new Set(googleOauthClientIds)))
    .add(GetUserHandler.create())
    .add(PostChatHandler.create())
    .add(GetChatHandler.create())
    .add(GetChatHistoryHandler.create())
    .add(UpdatePlayerSettingsHandler.create())
    .add(GetPlayerSettingsHandler.create())
    .add(UpdateNicknameHandler.create());

  // Web UI
  app.get("/*", (req, res, next) => {
    console.log(`Received GET request at ${req.originalUrl}.`);
    // Redirect to canonical domain if needed.
    if (req.hostname !== ENV_VARS.externalDomain) {
      res.redirect(`${ENV_VARS.externalOrigin}${req.path}`);
    } else {
      next();
    }
  });
  app.use(
    "/",
    expressStaticGzip(process.argv[2], {
      serveStatic: {
        extensions: ["html"],
        fallthrough: false,
      },
    }),
  );
  service.start(port);
}

class BucketReader {
  public constructor(
    private storage: Storage,
    private bucketName: string,
  ) {}

  public async read(fileName: string): Promise<string> {
    return getStream(
      this.storage.bucket(this.bucketName).file(fileName).createReadStream(),
    );
  }
}

main();
