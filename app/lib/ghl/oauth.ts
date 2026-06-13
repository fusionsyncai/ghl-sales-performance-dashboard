import { env } from "../env";
import {
  GHL_AUTH_URL,
  GHL_TOKEN_URL,
  GHL_USER_TYPE,
} from "./constants";
import type { GhlSession, GhlTokenResponse } from "./types";

/** Build the GHL authorization URL the user is redirected to. */
export function buildAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.ghlClientId,
    redirect_uri: env.ghlRedirectUri,
    scope: env.ghlScopes,
    state,
  });
  return `${GHL_AUTH_URL}?${params.toString()}`;
}

function tokenResponseToSession(token: GhlTokenResponse): GhlSession {
  return {
    accessToken: token.access_token,
    refreshToken: token.refresh_token,
    expiresAt: Date.now() + token.expires_in * 1000,
    locationId: token.locationId ?? "",
    userId: token.userId,
    scope: token.scope,
  };
}

async function postToken(body: Record<string, string>): Promise<GhlSession> {
  const res = await fetch(GHL_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams(body).toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`GHL token request failed (${res.status}): ${detail}`);
  }

  return tokenResponseToSession((await res.json()) as GhlTokenResponse);
}

/** Exchange a one-time authorization code for tokens. */
export function exchangeCode(code: string): Promise<GhlSession> {
  return postToken({
    client_id: env.ghlClientId,
    client_secret: env.ghlClientSecret,
    grant_type: "authorization_code",
    code,
    user_type: GHL_USER_TYPE,
    redirect_uri: env.ghlRedirectUri,
  });
}

/** Use a refresh token to obtain a fresh access token. */
export function refreshAccessToken(refreshToken: string): Promise<GhlSession> {
  return postToken({
    client_id: env.ghlClientId,
    client_secret: env.ghlClientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    user_type: GHL_USER_TYPE,
  });
}
