import express = require("express");
import getStream = require("get-stream");
import http = require("http");
import https = require("https");
import { Storage } from "@google-cloud/storage";
import "../environment";

let HOST_NAME = "www.danmage.com";

function readFileFromStorage(
  storage: Storage,
  fileName: string
): Promise<string> {
  return getStream(
    storage.bucket("danmage-keys").file(fileName).createReadStream()
  );
}

async function main(): Promise<void> {
  if (globalThis.ENVIRONMENT === "prod") {
    let storage = new Storage();
    let [privateKey, certificate, ca0, ca1, ca2] = await Promise.all([
      readFileFromStorage(storage, "danmage.key"),
      readFileFromStorage(storage, "danmage.crt"),
      readFileFromStorage(storage, "ca_g0.crt"),
      readFileFromStorage(storage, "ca_g1.crt"),
      readFileFromStorage(storage, "ca_g2.crt"),
    ]);

    let httpApp = express();
    httpApp.get("/*", (req, res) => {
      res.redirect(`https://${HOST_NAME}` + req.path);
    });
    let httpServer = http.createServer(httpApp);
    httpServer.listen({ host: HOST_NAME, port: 80 }, () => {
      console.log("Http server started at 80.");
    });

    let httpsApp = express();
    let httpsServer = https.createServer(
      {
        key: privateKey,
        cert: certificate,
        ca: [ca0, ca1, ca2],
      },
      httpsApp
    );
    httpsServer.listen({ host: HOST_NAME, port: 443 }, () => {
      console.log("Https server started at 443.");
    });
  } else if (globalThis.ENVIRONMENT === "local") {
    let httpApp = express();
    let httpServer = http.createServer(httpApp);
    httpServer.listen({ host: "localhost", port: 8080 }, () => {
      console.log("Http server started at 8080.");
    });
  }
}

main();
