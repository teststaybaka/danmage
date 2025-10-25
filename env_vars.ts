export interface EnvVars {
  projectId?: string;
  local?: boolean;
  httpPort?: number;
  httpsPort?: number;
  secretBucketName?: string;
  sslPrivateKeyPath?: string;
  sslCertificatePath?: string;
  sessionSecretPath?: string;
  googleOauthClientId?: string;
  externalDomain?: string;
  externalOrigin?: string;
  feedbackLink?: string;
}

export let ENV_VARS: EnvVars = {};
