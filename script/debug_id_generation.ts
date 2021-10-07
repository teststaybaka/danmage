import { CHAT_ENTRY_MODEL } from "../backend/datastore/chat_entry_model";
import { ChatEntry } from "../interface/chat_entry";
import { DatastoreClient } from "@selfage/datastore_client";

async function main(): Promise<void> {
  let datastoreClient = DatastoreClient.create();
  let chatEntry: ChatEntry = { userId: "hhh", content: "lllll" };
  let chatEntries = await datastoreClient.allocateKeys(
    [chatEntry],
    CHAT_ENTRY_MODEL
  );
  await datastoreClient.save(chatEntries, CHAT_ENTRY_MODEL, "insert");
}

main();
