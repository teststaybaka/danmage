import { LOCAL_SESSION_STORAGE } from "./local_session_storage";
import { ServiceClient } from "@selfage/service_client";

export let SERVICE_CLIENT = new ServiceClient(
  LOCAL_SESSION_STORAGE,
  window.fetch.bind(window)
);
