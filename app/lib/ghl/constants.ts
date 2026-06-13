export const GHL_API_BASE = "https://services.leadconnectorhq.com";
export const GHL_AUTH_URL =
  "https://marketplace.gohighlevel.com/oauth/chooselocation";
export const GHL_TOKEN_URL = `${GHL_API_BASE}/oauth/token`;

/** Required on every GHL API v2 request. */
export const GHL_API_VERSION = "2021-07-28";

/** Sub-account install → Location token (callable directly). */
export const GHL_USER_TYPE = "Location";

export const SESSION_COOKIE = "ghl_session";
export const OAUTH_STATE_COOKIE = "ghl_oauth_state";

/** Refresh the access token this many ms before it actually expires. */
export const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;
