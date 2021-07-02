import { ServiceClient } from "@selfage/service_client";
import { LocalSessionStorage } from "@selfage/service_client/local_session_storage";

export let SERVICE_CLIENT = new ServiceClient(
  new LocalSessionStorage(),
  window.fetch
);
