import "../local/env";
import { SIGN_IN_RESPONSE } from "../interface/service";
import { USER_SESSION, UserSession } from "../interface/session";
import { USER } from "../interface/user";
import { DATASTORE_CLIENT } from "./datastore_client";
import { SessionBuilder } from "./session_signer";
import { SignInHandler } from "./sign_in_handler";
import { Counter } from "@selfage/counter";
import { HttpError } from "@selfage/http_error";
import { eqMessage } from "@selfage/message/test_matcher";
import {
  assertReject,
  assertThat,
  containStr,
  eq,
  eqError,
} from "@selfage/test_matcher";
import { TEST_RUNNER } from "@selfage/test_runner";

TEST_RUNNER.run({
  name: "SignInHandlerTest",
  cases: [
    {
      name: "FailedToFetch",
      execute: async () => {
        // Prepare
        let counter = new Counter<string>();
        let handler = new SignInHandler(
          new Set(["some client id"]),
          DATASTORE_CLIENT,
          new (class extends SessionBuilder {
            public constructor() {
              super(undefined, undefined);
            }
          })(),
          () => 10000,
          (url: string, init: any) => {
            counter.increment("fetch");
            assertThat(url, containStr("access_token=some_token"), "url");
            return Promise.resolve({
              ok: false,
              status: 400,
              statusText: "400 error",
            } as any);
          },
        );

        // Execute
        let error = await assertReject(
          handler.handle("Request:", { googleAccessToken: "some_token" }),
        );

        // Verify
        assertThat(counter.get("fetch"), eq(1), "fetch called");
        assertThat(
          error,
          eqError(new HttpError(400, "Failed to fetch")),
          "error",
        );
        assertThat(error.status, eq(400), "error code");
      },
    },
    {
      name: "UnexpectedAud",
      execute: async () => {
        // Prepare
        let handler = new SignInHandler(
          new Set(["some client id"]),
          DATASTORE_CLIENT,
          new (class extends SessionBuilder {
            public constructor() {
              super(undefined, undefined);
            }
          })(),
          () => 10000,
          (url: string, init: any) => {
            return Promise.resolve({
              ok: true,
              json: () => {
                return Promise.resolve({
                  aud: "other client id",
                });
              },
            } as any);
          },
        );

        // Execute
        let error = await assertReject(
          handler.handle("Request:", { googleAccessToken: "some_token" }),
        );

        // Verify
        assertThat(error, eqError(new Error("Unexpected aud")), "error");
      },
    },
    {
      name: "NoGoogleId",
      execute: async () => {
        // Prepare
        let handler = new SignInHandler(
          new Set(["some client id", "some other id"]),
          DATASTORE_CLIENT,
          new (class extends SessionBuilder {
            public constructor() {
              super(undefined, undefined);
            }
          })(),
          () => 10000,
          (url: string, init: any) => {
            return Promise.resolve({
              ok: true,
              json: () => {
                return Promise.resolve({
                  aud: "some client id",
                });
              },
            } as any);
          },
        );

        // Execute
        let error = await assertReject(
          handler.handle("Request:", { googleAccessToken: "some_token" }),
        );

        // Verify
        assertThat(error, eqError(new Error("No google id")), "error");
      },
    },
    {
      name: "NewUser",
      execute: async () => {
        // Prepare
        let counter = new Counter<string>();
        let handler = new SignInHandler(
          new Set(["some client id", "some other id"]),
          DATASTORE_CLIENT,
          new (class extends SessionBuilder {
            public constructor() {
              super(undefined, undefined);
            }
            public build(data: UserSession) {
              counter.increment("build");
              assertThat(
                data,
                eqMessage({ userId: "google-8rXL" }, USER_SESSION),
                "session string",
              );
              return "signed random session";
            }
          })(),
          () => 10000,
          (url: string, init: any) => {
            return Promise.resolve({
              ok: true,
              json: () => {
                return Promise.resolve({
                  aud: "some client id",
                  // 60 -> 9, 43 -> r, 23 -> X, 11 -> L
                  sub: `${(60 << 18) + (43 << 12) + (23 << 6) + 11}`,
                });
              },
            } as any);
          },
        );

        // Execute
        let response = await handler.handle("Request:", {
          googleAccessToken: "some_token",
        });

        // Verify
        let [user] = await DATASTORE_CLIENT.get(
          DATASTORE_CLIENT.key(["User", "google-8rXL"]),
        );
        assertThat(
          user,
          eqMessage(
            {
              id: "google-8rXL",
              created: 10000,
            },
            USER,
          ),
          "user stored in datastore",
        );
        assertThat(counter.get("build"), eq(1), "build called");
        assertThat(
          response,
          eqMessage(
            {
              signedSession: "signed random session",
            },
            SIGN_IN_RESPONSE,
          ),
          "signInResponse",
        );
      },
      tearDown: async () => {
        await DATASTORE_CLIENT.delete(
          DATASTORE_CLIENT.key(["User", "google-8rXL"]),
        );
      },
    },
    {
      name: "ExistingUser",
      execute: async () => {
        // Prepare
        await DATASTORE_CLIENT.save({
          key: DATASTORE_CLIENT.key(["User", "google-8rXL"]),
          data: {
            id: "google-8rXL",
            created: 20000,
          },
          method: "insert",
        });
        let counter = new Counter<string>();
        let handler = new SignInHandler(
          new Set(["some client id", "some other id"]),
          DATASTORE_CLIENT,
          new (class extends SessionBuilder {
            public constructor() {
              super(undefined, undefined);
            }
            public build(data: UserSession) {
              counter.increment("build");
              return "signed random session";
            }
          })(),
          () => 10000,
          (url: string, init: any) => {
            return Promise.resolve({
              ok: true,
              json: () => {
                return Promise.resolve({
                  aud: "some client id",
                  // 60 -> 9, 43 -> r, 23 -> X, 11 -> L
                  sub: `${(60 << 18) + (43 << 12) + (23 << 6) + 11}`,
                });
              },
            } as any);
          },
        );

        // Execute
        let response = await handler.handle("Request:", {
          googleAccessToken: "some_token",
        });

        // Verify
        let [user] = await DATASTORE_CLIENT.get(
          DATASTORE_CLIENT.key(["User", "google-8rXL"]),
        );
        assertThat(
          user,
          eqMessage(
            {
              id: "google-8rXL",
              created: 20000,
            },
            USER,
          ),
          "user stored in datastore",
        );
        assertThat(counter.get("build"), eq(1), "build called");
        assertThat(
          response,
          eqMessage(
            {
              signedSession: "signed random session",
            },
            SIGN_IN_RESPONSE,
          ),
          "signInResponse",
        );
      },
      tearDown: async () => {
        await DATASTORE_CLIENT.delete(
          DATASTORE_CLIENT.key(["User", "google-8rXL"]),
        );
      },
    },
  ],
});
