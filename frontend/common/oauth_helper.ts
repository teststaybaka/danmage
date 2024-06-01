export function getGoogleOauthUrl(redirectUrl: string): string {
  let urlBuilder = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  urlBuilder.searchParams.append(
    "client_id",
    "783644681124-88huoven16e44ujc1lctmgs6be8fof3n.apps.googleusercontent.com",
  );
  urlBuilder.searchParams.append("redirect_uri", redirectUrl);
  urlBuilder.searchParams.append("response_type", "token");
  urlBuilder.searchParams.append("scope", "profile");
  return urlBuilder.toString();
}

export function parseGoogleAccessToken(responseUrl: string): string {
  let extractRegex = /access_token=(.*?)($|&)/;
  let match = new URL(responseUrl).hash.match(extractRegex);
  if (match) {
    return match[1];
  } else {
    return undefined;
  }
}
