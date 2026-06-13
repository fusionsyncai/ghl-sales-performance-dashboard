import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env, isGhlConfigured } from "../../../lib/env";
import { OAUTH_STATE_COOKIE } from "../../../lib/ghl/constants";
import { buildAuthorizeUrl } from "../../../lib/ghl/oauth";

export async function GET() {
  if (!isGhlConfigured()) {
    return NextResponse.redirect(`${env.appBaseUrl}/?error=not_configured`);
  }

  const state = randomBytes(16).toString("hex");
  const store = await cookies();
  store.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return NextResponse.redirect(buildAuthorizeUrl(state));
}
