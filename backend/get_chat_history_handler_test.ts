import "../local/env";
import { HostApp } from "../interface/chat_entry";
import { GET_CHAT_RESPONSE } from "../interface/service";
import { DATASTORE_CLIENT } from "./datastore_client";
import { GetChatHistoryHandler } from "./get_chat_history_handler";
import { SessionExtractor } from "./session_signer";
import { eqMessage } from "@selfage/message/test_matcher";
import { assertThat } from "@selfage/test_matcher";
import { TEST_RUNNER } from "@selfage/test_runner";

TEST_RUNNER.run({
  name: "GetChatHistoryHandlerTest",
  cases: [
    {
      name: "GetChatHistory",
      execute: async () => {
        // Prepare
        await DATASTORE_CLIENT.save([
          {
            key: DATASTORE_CLIENT.key(["ChatEntry", "chat1"]),
            data: {
              id: "chat1",
              userId: "user1",
              hostApp: HostApp.YouTube,
              hostContentId: "video1",
              content: "hello world",
              timestamp: 123,
              created: 1000,
            },
            method: "insert",
          },
          {
            key: DATASTORE_CLIENT.key(["ChatEntry", "chat2"]),
            data: {
              id: "chat2",
              userId: "user1",
              hostApp: HostApp.YouTube,
              hostContentId: "video1",
              content: "another message",
              timestamp: 124,
              created: 1001,
            },
            method: "insert",
          },
          {
            key: DATASTORE_CLIENT.key(["ChatEntry", "chat3"]),
            data: {
              id: "chat3",
              userId: "user2", // Different user ID
              hostApp: HostApp.YouTube,
              hostContentId: "video2",
              content: "some other message",
              timestamp: 125,
              created: 1002,
            },
            method: "insert",
          },
        ]);
        let handler = new GetChatHistoryHandler(
          DATASTORE_CLIENT,
          new (class extends SessionExtractor {
            public constructor() {
              super(undefined);
            }
            public extractSessionData(loggingPrefix: string, auth: string) {
              return { userId: "user1" };
            }
          })(),
        );

        // Execute
        let response = await handler.handle("Request:", {}, "authStr");

        // Verify
        assertThat(
          response,
          eqMessage(
            {
              chatEntries: [
                {
                  id: "chat2",
                  userId: "user1",
                  hostApp: HostApp.YouTube,
                  hostContentId: "video1",
                  content: "another message",
                  timestamp: 124,
                  created: 1001,
                },
                {
                  id: "chat1",
                  userId: "user1",
                  hostApp: HostApp.YouTube,
                  hostContentId: "video1",
                  content: "hello world",
                  timestamp: 123,
                  created: 1000,
                },
              ],
            },
            GET_CHAT_RESPONSE,
          ),
          "response",
        );
      },
      tearDown: async () => {
        await DATASTORE_CLIENT.delete([
          DATASTORE_CLIENT.key(["ChatEntry", "chat1"]),
          DATASTORE_CLIENT.key(["ChatEntry", "chat2"]),
          DATASTORE_CLIENT.key(["ChatEntry", "chat3"]),
        ]);
      },
    },
  ],
});
