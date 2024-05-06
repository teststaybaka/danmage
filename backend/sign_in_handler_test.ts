import { SIGN_IN_RESPONSE } from "../interface/service";
import { USER, User } from "../interface/user";
import { SignInHandler } from "./sign_in_handler";
import { Counter } from "@selfage/counter";
import { DatastoreClient } from "@selfage/datastore_client";
import { HttpError } from "@selfage/http_error";
import { eqMessage } from "@selfage/message/test_matcher";
import { SessionBuilder } from "@selfage/service_handler/session_signer";
import {
  assertReject,
  assertThat,
  containStr,
  eq,
  eqError,
  isArray,
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
          new (class extends DatastoreClient {
            public constructor() {
              super(undefined);
            }
          })(),
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
          new (class extends DatastoreClient {
            public constructor() {
              super(undefined);
            }
          })(),
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
          new (class extends DatastoreClient {
            public constructor() {
              super(undefined);
            }
          })(),
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
          new (class extends DatastoreClient {
            public constructor() {
              super(undefined);
            }
            public get(ids: Array<string>, model: any) {
              counter.increment("get");
              assertThat(ids, isArray([eq("google-8rXL")]), "ids");
              return Promise.resolve([]);
            }
            public save(users: Array<User>, model: any) {
              counter.increment("save");
              assertThat(
                users,
                isArray([
                  eqMessage(
                    {
                      id: "google-8rXL",
                      created: 10,
                    },
                    USER,
                  ),
                ]),
                "users",
              );
              return Promise.resolve();
            }
          })(),
          new (class extends SessionBuilder {
            public constructor() {
              super(undefined, undefined);
            }
            public build(sessionStr: string) {
              counter.increment("build");
              assertThat(
                sessionStr,
                eq('{"userId":"google-8rXL"}'),
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
        assertThat(counter.get("get"), eq(1), "get called");
        assertThat(counter.get("save"), eq(1), "save called");
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
    },
    {
      name: "ExistingUser",
      execute: async () => {
        // Prepare
        let counter = new Counter<string>();
        let handler = new SignInHandler(
          new Set(["some client id", "some other id"]),
          new (class extends DatastoreClient {
            public constructor() {
              super(undefined);
            }
            public get(ids: Array<string>, model: any) {
              counter.increment("get");
              assertThat(ids, isArray([eq("google-8rXL")]), "ids");
              return Promise.resolve([{ id: "anything" } as any]);
            }
            public save(users: Array<User>, model: any) {
              counter.increment("save");
              return Promise.resolve();
            }
          })(),
          new (class extends SessionBuilder {
            public constructor() {
              super(undefined, undefined);
            }
            public build(sessionStr: string) {
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
        assertThat(counter.get("get"), eq(1), "get called");
        assertThat(counter.get("save"), eq(0), "save not called");
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
    },
  ],
});
