import { ENV_VARS } from "./env_vars";

ENV_VARS.projectId = "danmage-dev-476121";
ENV_VARS.local = true;
ENV_VARS.httpPort = 8080;
ENV_VARS.externalDomain = "localhost";
ENV_VARS.externalOrigin = `http://${ENV_VARS.externalDomain}:${ENV_VARS.httpPort}`;
