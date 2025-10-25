import { Datastore } from "@google-cloud/datastore";
import { ENV_VARS } from "../env_vars";

export let DATASTORE_CLIENT = new Datastore({
  projectId: ENV_VARS.projectId,
});
