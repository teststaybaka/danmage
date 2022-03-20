import { CHROME_SESSION_STORAGE } from "./chrome_session_storage";
import { ServiceClient } from "@selfage/service_client";

export let SERVICE_CLIENT = new ServiceClient(
  CHROME_SESSION_STORAGE,
  window.fetch.bind(window)
);
