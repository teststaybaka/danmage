import { ENV_VARS } from "./env_vars";

ENV_VARS.secretBucketName = "danmage-prod";
ENV_VARS.sslPrivateKeyPath = "danmage.key";
ENV_VARS.sslCertificatePath = "danmage.crt";
ENV_VARS.sessionSecretPath = "session.key";
ENV_VARS.externalDomain = "www.danmage.com";
ENV_VARS.externalOrigin = `https://${ENV_VARS.externalDomain}`;
ENV_VARS.feedbackLink = "https://github.com/teststaybaka/danmage/issues";
