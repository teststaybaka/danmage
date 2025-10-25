import { ENV_VARS } from "../../env_vars";

export function getGoogleOauthUrl(redirectUrl: string): string {
  let urlBuilder = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  urlBuilder.searchParams.append("client_id", ENV_VARS.googleOauthClientId);
  urlBuilder.searchParams.append("redirect_uri", redirectUrl);
  urlBuilder.searchParams.append("response_type", "token");
  urlBuilder.searchParams.append("scope", "profile");
  return urlBuilder.toString();
}

export function parseGoogleAccessToken(responseUrl?: string): string {
  if (!responseUrl) {
    return undefined;
  }

  let extractRegex = /access_token=(.*?)($|&)/;
  let match = new URL(responseUrl).hash.match(extractRegex);
  if (match) {
    return match[1];
  } else {
    return undefined;
  }
}
