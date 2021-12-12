import { BackgroundSessionStorage } from "./background_session_storage";
import { ServiceClient } from "@selfage/service_client";

export let SERVICE_CLIENT = new ServiceClient(
  BackgroundSessionStorage.create(),
  window.fetch.bind(window)
);
