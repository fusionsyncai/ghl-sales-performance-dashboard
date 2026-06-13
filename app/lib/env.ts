const DEFAULT_SCOPES = "opportunities.readonly users.readonly locations.readonly";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. See .env.example.`,
    );
  }
  return value;
}

export const env = {
  get ghlClientId() {
    return required("GHL_CLIENT_ID");
  },
  get ghlClientSecret() {
    return required("GHL_CLIENT_SECRET");
  },
  get ghlRedirectUri() {
    return required("GHL_REDIRECT_URI");
  },
  get ghlScopes() {
    return process.env.GHL_SCOPES?.trim() || DEFAULT_SCOPES;
  },
  get tokenEncryptionKey() {
    return required("TOKEN_ENCRYPTION_KEY");
  },
  get appBaseUrl() {
    return (process.env.APP_BASE_URL || "http://localhost:3035").replace(
      /\/$/,
      "",
    );
  },
};

/** Returns true when the GHL OAuth app appears configured (no throw). */
export function isGhlConfigured(): boolean {
  return Boolean(
    process.env.GHL_CLIENT_ID &&
      process.env.GHL_CLIENT_SECRET &&
      process.env.GHL_REDIRECT_URI &&
      process.env.TOKEN_ENCRYPTION_KEY,
  );
}
