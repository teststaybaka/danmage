import express = require("express");
import getStream = require("get-stream");
import http = require("http");
import https = require("https");
import { GetChatHandler } from "./get_chat_handler";
import { Storage } from "@google-cloud/storage";
import { registerCorsAllowedPreflightHandler } from "@selfage/service_handler/preflight_handler";
import { registerUnauthed } from "@selfage/service_handler/register";
import { SessionSigner } from "@selfage/service_handler/session_signer";
import "../environment";

let HOST_NAME = "www.danmage.com";

async function main(): Promise<void> {
  let app = express();
  registerCorsAllowedPreflightHandler(app);
  registerUnauthed(app, GetChatHandler.create());

  await startServer(app);
}

async function startServer(app: express.Express): Promise<void> {
  if (globalThis.ENVIRONMENT === "prod") {
    let storage = new Storage();
    let [
      privateKey,
      certificate,
      ca0,
      ca1,
      ca2,
      sessionKey,
    ] = await Promise.all([
      readFileFromStorage(storage, "danmage.key"),
      readFileFromStorage(storage, "danmage.crt"),
      readFileFromStorage(storage, "ca_g0.crt"),
      readFileFromStorage(storage, "ca_g1.crt"),
      readFileFromStorage(storage, "ca_g2.crt"),
      readFileFromStorage(storage, "session.key"),
    ]);

    SessionSigner.SECRET_KEY = sessionKey;

    let redirectApp = express();
    redirectApp.get("/*", (req, res) => {
      res.redirect(`https://${HOST_NAME}` + req.path);
    });
    let httpServer = http.createServer(redirectApp);
    httpServer.listen({ host: HOST_NAME, port: 80 }, () => {
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
    httpsServer.listen({ host: HOST_NAME, port: 443 }, () => {
      console.log("Https server started at 443.");
    });
  } else if (globalThis.ENVIRONMENT === "local") {
    SessionSigner.SECRET_KEY = "randomlocalkey";

    let httpServer = http.createServer(app);
    httpServer.listen({ host: "localhost", port: 8080 }, () => {
      console.log("Http server started at 8080.");
    });
  }
}

function readFileFromStorage(
  storage: Storage,
  fileName: string
): Promise<string> {
  return getStream(
    storage.bucket("danmage-keys").file(fileName).createReadStream()
  );
}

main();
