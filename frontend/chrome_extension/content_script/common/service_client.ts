import { ENV_VARS } from "../../../../env_vars";
import { LOCAL_SESSION_STORAGE } from "./local_session_storage";
import { WebServiceClient } from "@selfage/web_service_client";

export let SERVICE_CLIENT = WebServiceClient.create(
  LOCAL_SESSION_STORAGE,
  ENV_VARS.externalOrigin,
);
