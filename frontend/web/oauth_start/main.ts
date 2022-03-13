import { ORIGIN_LOCAL, ORIGIN_PROD } from "../../../common";
import "../../../environment";

// Copied from https://developers.google.com/identity/protocols/OAuth2UserAgent

/*
 * Create form to request access token from Google's OAuth 2.0 server.
 */
function oauthSignIn() {
  let origin = "";
  if (globalThis.ENVIRONMENT === "prod") {
    origin = ORIGIN_PROD;
  } else if (globalThis.ENVIRONMENT === "local") {
    origin = ORIGIN_LOCAL;
  } else {
    throw new Error("Unsupported environment.");
  }

  // Google's OAuth 2.0 endpoint for requesting an access token
  var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  var form = document.createElement("form");
  form.setAttribute("method", "GET"); // Send as a GET request.
  form.setAttribute("action", oauth2Endpoint);

  // Parameters to pass to OAuth 2.0 endpoint.
  var params = {
    client_id:
      "783644681124-88huoven16e44ujc1lctmgs6be8fof3n.apps.googleusercontent.com",
    redirect_uri: `${origin}/oauth_callback`,
    response_type: "token",
    scope: "profile",
  } as any;

  // Add form parameters as hidden input values.
  for (var p in params) {
    var input = document.createElement("input");
    input.setAttribute("type", "hidden");
    input.setAttribute("name", p);
    input.setAttribute("value", params[p]);
    form.appendChild(input);
  }

  // Add form to page and submit it to open the OAuth 2.0 endpoint.
  document.body.appendChild(form);
  form.submit();
}

oauthSignIn();
