import { cookies } from "next/headers";
import { decrypt, encrypt } from "../crypto";
import { SESSION_COOKIE, TOKEN_REFRESH_BUFFER_MS } from "./constants";
import { refreshAccessToken } from "./oauth";
import type { GhlSession } from "./types";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  };
}

/** Encrypt and persist the session. Safe to call from Route Handlers / Server Actions. */
export async function writeSession(session: GhlSession): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, encrypt(JSON.stringify(session)), cookieOptions());
}

/** Remove the session cookie (logout / disconnect). */
export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

function parseSession(raw: string | undefined): GhlSession | null {
  if (!raw) return null;
  const decrypted = decrypt(raw);
  if (!decrypted) return null;
  try {
    return JSON.parse(decrypted) as GhlSession;
  } catch {
    return null;
  }
}

/**
 * Returns the current session, refreshing the access token if it is close to
 * expiry. When invoked from a context that may mutate cookies (Route Handler /
 * Server Action), the refreshed token is persisted; in a pure render it is used
 * for this request only.
 */
export async function getSession(): Promise<GhlSession | null> {
  const store = await cookies();
  const session = parseSession(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;

  const needsRefresh = Date.now() >= session.expiresAt - TOKEN_REFRESH_BUFFER_MS;
  if (!needsRefresh) return session;

  try {
    const refreshed = await refreshAccessToken(session.refreshToken);
    // GHL refresh responses may omit locationId; keep the original.
    const merged: GhlSession = {
      ...refreshed,
      locationId: refreshed.locationId || session.locationId,
      userId: refreshed.userId || session.userId,
    };
    try {
      await writeSession(merged);
    } catch {
      // Pure render contexts cannot set cookies; use the token in-memory.
    }
    return merged;
  } catch {
    return null;
  }
}
