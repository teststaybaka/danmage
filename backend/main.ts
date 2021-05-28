import express = require("express");
import getStream = require("get-stream");
import http = require("http");
import https = require("https");
import { GetChatHandler } from "./get_chat_handler";
import { GetChatHistoryHandler } from "./get_chat_history_handler";
import { Storage } from "@google-cloud/storage";
import { registerCorsAllowedPreflightHandler } from "@selfage/service_handler/preflight_handler";
import {
  registerAuthed,
  registerUnauthed,
} from "@selfage/service_handler/register";
import { SessionSigner } from "@selfage/service_handler/session_signer";
import "../environment";

async function main(): Promise<void> {
  let app = express();
  registerCorsAllowedPreflightHandler(app);
  registerUnauthed(app, GetChatHandler.create());
  registerAuthed(app, GetChatHistoryHandler.create());

  await startServer(app);
}

async function startServer(app: express.Express): Promise<void> {
  if (globalThis.ENVIRONMENT === "prod") {
    let reader = new BucketReader(new Storage(), "danmage-keys");
    let [
      privateKey,
      certificate,
      ca0,
      ca1,
      ca2,
      sessionKey,
    ] = await Promise.all([
      reader.read("danmage.key"),
      reader.read("danmage.crt"),
      reader.read("ca_g0.crt"),
      reader.read("ca_g1.crt"),
      reader.read("ca_g2.crt"),
      reader.read("session.key"),
    ]);

    SessionSigner.SECRET_KEY = sessionKey;

    let hostName = "www.danmage.com";
    let redirectApp = express();
    redirectApp.get("/*", (req, res) => {
      res.redirect(`https://${hostName}` + req.path);
    });
    let httpServer = http.createServer(redirectApp);
    httpServer.listen({ host: hostName, port: 80 }, () => {
      console.log("Http server started at 80.");
    });

    let httpsServer = https.createServer(
      {
        key: privateKey,
        cert: certificate,
        ca: [ca0, ca1, ca2],
      },
      app
    );
    httpsServer.listen({ host: hostName, port: 443 }, () => {
      console.log("Https server started at 443.");
    });
  } else if (globalThis.ENVIRONMENT === "dev") {
    let reader = new BucketReader(new Storage(), "danmage-dev-keys");
    let sessionKey = await reader.read("session.key");
    SessionSigner.SECRET_KEY = sessionKey;

    let httpServer = http.createServer(app);
    httpServer.listen({ host: "dev.danmage.com", port: 80 }, () => {
      console.log("Http server started at 80.");
    });
  } else if (globalThis.ENVIRONMENT === "local") {
    SessionSigner.SECRET_KEY = "randomlocalkey";

    let httpServer = http.createServer(app);
    httpServer.listen({ host: "localhost", port: 8080 }, () => {
      console.log("Http server started at 8080.");
    });
  } else {
    throw new Error(`Not supported environment ${globalThis.ENVIRONMENT}.`);
  }
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
