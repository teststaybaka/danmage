import bigInt = require("big-integer");
import { PLAYER_SETTINGS_MODEL } from "../backend/datastore/player_settings_model";
import { USER_MODEL } from "../backend/datastore/user_model";
import { PLAYER_SETTINGS, PlayerSettings } from "../interface/player_settings";
import { USER, User } from "../interface/user";
import { Datastore } from "@google-cloud/datastore";
import { DatastoreClient } from "@selfage/datastore_client";
import { parseMessage } from "@selfage/message/parser";

async function main(): Promise<void> {
  let datastore = new Datastore();
  let newClient = new DatastoreClient(datastore);

  let userQuery = datastore.createQuery("User");
  let userResponse = await userQuery.run();
  let users = new Array<User>();
  for (let rawValue of userResponse[0] as any) {
    let user = parseMessage(rawValue, USER);
    let idStr = user.id.substring(7);
    let uint8Array = bigInt(idStr).toArray(256).value;
    let base64GoogleId = Buffer.from(uint8Array).toString("base64");
    user.id = `google-${base64GoogleId}`;
    users.push(user);
  }
  await newClient.save(users, USER_MODEL, "upsert");

  let settingsQuery = datastore.createQuery("PlayerSettings");
  let settingResponse = await settingsQuery.run();
  let settings = new Array<PlayerSettings>();
  for (let rawValue of settingResponse[0] as any) {
    let setting = parseMessage(rawValue, PLAYER_SETTINGS);
    let idStr = setting.userId.substring(7);
    let uint8Array = bigInt(idStr).toArray(256).value;
    let base64GoogleId = Buffer.from(uint8Array).toString("base64");
    setting.userId = `google-${base64GoogleId}`;
    settings.push(setting);
  }
  await newClient.save(settings, PLAYER_SETTINGS_MODEL, "upsert");
}

main();
