import "../local/env";
import { UserSession } from "../interface/session";
import { USER } from "../interface/user";
import { DATASTORE_CLIENT } from "./datastore_client";
import { SessionExtractor } from "./session_signer";
import { UpdateNicknameHandler } from "./update_nickname_handler";
import { eqMessage } from "@selfage/message/test_matcher";
import { assertThat } from "@selfage/test_matcher";
import { TEST_RUNNER } from "@selfage/test_runner";

TEST_RUNNER.run({
  name: "UpdateNicknameHandlerTest",
  cases: [
    {
      name: "Update",
      execute: async () => {
        // Prepare
        await DATASTORE_CLIENT.save({
          key: DATASTORE_CLIENT.key(["User", "user123"]),
          data: {
            id: "user123",
            created: 20000,
          },
          method: "insert",
        });
        let handler = new UpdateNicknameHandler(
          DATASTORE_CLIENT,
          new (class extends SessionExtractor {
            public constructor() {
              super(undefined);
            }
            public extractSessionData(
              loggingPrefix: string,
              signedSession: string,
            ): UserSession {
              return {
                userId: "user123",
              };
            }
          })(),
        );

        // Execute
        await handler.handle(
          "Requst:",
          {
            newName: "newNickname",
          },
          "authString",
        );

        // Verify
        let [user] = await DATASTORE_CLIENT.get(
          DATASTORE_CLIENT.key(["User", "user123"]),
        );
        assertThat(
          user,
          eqMessage(
            {
              id: "user123",
              created: 20000,
              nickname: "newNickname",
            },
            USER,
          ),
          "user",
        );
      },
      tearDown: async () => {
        await DATASTORE_CLIENT.delete(
          DATASTORE_CLIENT.key(["User", "user123"]),
        );
      },
    },
  ],
});
