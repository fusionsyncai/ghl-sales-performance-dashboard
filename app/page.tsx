import Link from "next/link";
import { Activity, ArrowRight, ShieldCheck } from "lucide-react";

import { isGhlConfigured } from "./lib/env";
import { getSession } from "./lib/ghl/session";

const ERROR_MESSAGES: Record<string, string> = {
  not_configured: "The GHL app is not configured yet. Add credentials to .env.",
  access_denied: "Authorization was cancelled.",
  missing_code: "GHL did not return an authorization code.",
  invalid_state: "Security check failed. Please try connecting again.",
  no_location: "No GHL location was returned. Install on a sub-account.",
  token_exchange: "Could not exchange the authorization code for a token.",
};

const HIGHLIGHTS = [
  "See who's making money and who's dropping the ball",
  "Spot overloaded reps and stale, dying opportunities",
  "Revenue attribution and risk alerts — live, every morning",
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = isGhlConfigured();
  const session = configured ? await getSession() : null;

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,oklch(0.66_0.15_156/0.12),transparent)]"
      />
      <div className="w-full max-w-xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
          <span className="flex size-5 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <Activity className="size-3" />
          </span>
          Rep Performance OS for GHL
        </div>

        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          The system that runs your{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            sales floor
          </span>
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Connect your GoHighLevel location to see who&apos;s making money,
          who&apos;s overloaded, and where deals get stuck — live.
        </p>

        <ul className="mt-6 flex flex-col gap-2.5">
          {HIGHLIGHTS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm text-foreground/80"
            >
              <ArrowRight className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              {item}
            </li>
          ))}
        </ul>

        {error ? (
          <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {ERROR_MESSAGES[error] ?? "Something went wrong. Please try again."}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                Open dashboard
                <ArrowRight className="size-4" />
              </Link>
              <a
                href="/api/auth/logout"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Disconnect
              </a>
            </>
          ) : (
            <a
              href="/api/auth/ghl"
              aria-disabled={!configured}
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all ${
                configured
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                  : "pointer-events-none bg-muted text-muted-foreground"
              }`}
            >
              Connect GoHighLevel
              <ArrowRight className="size-4" />
            </a>
          )}
        </div>

        <div className="mt-7 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-emerald-600" />
          We store nothing. Your data is read live from GHL in your session.
        </div>

        {!configured ? (
          <p className="mt-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground shadow-sm">
            Set <code className="font-mono text-foreground">GHL_CLIENT_ID</code>,{" "}
            <code className="font-mono text-foreground">GHL_CLIENT_SECRET</code>,{" "}
            <code className="font-mono text-foreground">GHL_REDIRECT_URI</code>{" "}
            and{" "}
            <code className="font-mono text-foreground">
              TOKEN_ENCRYPTION_KEY
            </code>{" "}
            in your <code className="font-mono text-foreground">.env</code> to
            enable connecting.
          </p>
        ) : null}
      </div>
    </main>
  );
}
