import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "../../../lib/env";
import { OAUTH_STATE_COOKIE } from "../../../lib/ghl/constants";
import { exchangeCode } from "../../../lib/ghl/oauth";
import { writeSession } from "../../../lib/ghl/session";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const store = await cookies();
  const expectedState = store.get(OAUTH_STATE_COOKIE)?.value;
  store.delete(OAUTH_STATE_COOKIE);

  if (errorParam) {
    return NextResponse.redirect(`${env.appBaseUrl}/?error=access_denied`);
  }
  if (!code) {
    return NextResponse.redirect(`${env.appBaseUrl}/?error=missing_code`);
  }
  if (!state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(`${env.appBaseUrl}/?error=invalid_state`);
  }

  try {
    const session = await exchangeCode(code);
    if (!session.locationId) {
      return NextResponse.redirect(`${env.appBaseUrl}/?error=no_location`);
    }
    await writeSession(session);
    return NextResponse.redirect(`${env.appBaseUrl}/dashboard`);
  } catch {
    return NextResponse.redirect(`${env.appBaseUrl}/?error=token_exchange`);
  }
}
