import "../local/env";
import { CHAT_ENTRY, HostApp } from "../interface/chat_entry";
import { POST_CHAT_RESPONSE } from "../interface/service";
import { DATASTORE_CLIENT } from "./datastore_client";
import { PostChatHandler } from "./post_chat_handler";
import { SessionExtractor } from "./session_signer";
import { eqMessage } from "@selfage/message/test_matcher";
import { assertThat } from "@selfage/test_matcher";
import { TEST_RUNNER } from "@selfage/test_runner";

TEST_RUNNER.run({
  name: "PostChatHandlerTest",
  cases: [
    {
      name: "PostChat",
      execute: async () => {
        // Prepare
        await DATASTORE_CLIENT.save({
          key: DATASTORE_CLIENT.key(["User", "user1"]),
          data: {
            id: "user1",
            nickname: "some name",
            created: 5000,
          },
          method: "insert",
        });
        let handler = new PostChatHandler(
          DATASTORE_CLIENT,
          new (class extends SessionExtractor {
            public constructor() {
              super(undefined);
            }
            public extractSessionData(loggingPrefix: string, auth: string) {
              return { userId: "user1" };
            }
          })(),
          () => "u-u-i-d",
          () => 10000,
        );

        // Execute
        let response = await handler.handle(
          "Request:",
          {
            chatEntry: {
              hostApp: HostApp.YouTube,
              hostContentId: "video1",
              content: "some blabla",
              timestamp: 567,
            },
          },
          "some auth token",
        );

        // Verify
        let [chatEntry] = await DATASTORE_CLIENT.get(
          DATASTORE_CLIENT.key(["ChatEntry", "u-u-i-d"]),
        );
        assertThat(
          chatEntry,
          eqMessage(
            {
              id: "u-u-i-d",
              hostApp: HostApp.YouTube,
              hostContentId: "video1",
              userId: "user1",
              userNickname: "some name",
              content: "some blabla",
              timestamp: 567,
              created: 10,
            },
            CHAT_ENTRY,
          ),
          "stored chat entry",
        );
        assertThat(
          response,
          eqMessage(
            {
              chatEntry: {
                id: "u-u-i-d",
                hostApp: HostApp.YouTube,
                hostContentId: "video1",
                userId: "user1",
                userNickname: "some name",
                content: "some blabla",
                timestamp: 567,
                created: 10,
              },
            },
            POST_CHAT_RESPONSE,
          ),
          "response",
        );
      },
      tearDown: async () => {
        await DATASTORE_CLIENT.delete([
          DATASTORE_CLIENT.key(["User", "user1"]),
          DATASTORE_CLIENT.key(["ChatEntry", "u-u-i-d"]),
        ]);
      },
    },
  ],
});
