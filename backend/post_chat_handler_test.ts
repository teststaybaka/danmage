import { HostApp } from "../interface/chat_entry";
import { POST_CHAT_RESPONSE } from "../interface/service";
import { User } from "../interface/user";
import { PostChatHandler } from "./post_chat_handler";
import { Counter } from "@selfage/counter";
import { DatastoreClient } from "@selfage/datastore_client";
import { eqMessage } from "@selfage/message/test_matcher";
import { assertThat, eq, eqArray } from "@selfage/test_matcher";
import { NODE_TEST_RUNNER } from "@selfage/test_runner";

NODE_TEST_RUNNER.run({
  name: "PostChatHandlerTest",
  cases: [
    {
      name: "PostChat",
      execute: async () => {
        // Prepare
        let counter = new Counter<string>();
        let handler = new PostChatHandler(
          new (class extends DatastoreClient {
            public constructor() {
              super(undefined);
            }
            public get(ids: Array<string>) {
              counter.increment("get");
              assertThat(ids, eqArray([eq("789")]), "get user ids");
              return Promise.resolve([
                ({
                  id: "789",
                  nickname: "some name",
                } as User) as any,
              ]);
            }
            public allocateKeys(entries: Array<any>) {
              counter.increment("allocateKeys");
              assertThat(entries.length, eq(1), "entries length to allocate");
              entries[0].id = "901";
              return Promise.resolve(entries);
            }
            public save(entries: Array<any>) {
              counter.increment("save");
              assertThat(entries.length, eq(1), "entries length to save");
              return Promise.resolve();
            }
          })(),
          () => {
            return 10000;
          }
        );

        // Execute
        let response = await handler.handle(
          {
            chatEntry: {
              hostApp: HostApp.YouTube,
              hostContentId: "12345",
              content: "some blabla",
              timestamp: 567,
            },
          },
          { userId: "789" }
        );

        // Verify
        assertThat(counter.get("get"), eq(1), "get called");
        assertThat(counter.get("allocateKeys"), eq(1), "allocateKeys called");
        assertThat(counter.get("save"), eq(1), "save called");
        assertThat(
          response,
          eqMessage(
            {
              chatEntry: {
                id: "901",
                hostApp: HostApp.YouTube,
                hostContentId: "12345",
                userId: "789",
                userNickname: "some name",
                content: "some blabla",
                timestamp: 567,
                created: 10,
              },
            },
            POST_CHAT_RESPONSE
          ),
          "response"
        );
      },
    },
  ],
});
