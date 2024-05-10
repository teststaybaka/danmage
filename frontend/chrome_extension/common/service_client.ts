import { WebServiceClient } from "@selfage/web_service_client";
import { LOCAL_SESSION_STORAGE } from "./local_session_storage";

export let SERVICE_CLIENT = new WebServiceClient(
  LOCAL_SESSION_STORAGE,
  window.fetch.bind(window)
);
