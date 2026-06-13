import { NextResponse } from "next/server";
import { env } from "../../../lib/env";
import { clearSession } from "../../../lib/ghl/session";

export async function GET() {
  await clearSession();
  return NextResponse.redirect(`${env.appBaseUrl}/`);
}
