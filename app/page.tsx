import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Gauge,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { PrivacyInfo } from "@/components/landing/privacy-info";
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

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Revenue attribution",
    body: "Closed, pipeline & projected — per rep.",
  },
  {
    icon: Users,
    title: "Workload & overload",
    body: "Spot who's drowning vs. coasting.",
  },
  {
    icon: Clock,
    title: "Aging & stale opps",
    body: "Untouched >24h, dying deals, surfaced.",
  },
  {
    icon: Gauge,
    title: "Risk alerts",
    body: "Below-team close rate, flagged live.",
  },
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
    <main className="relative flex h-dvh flex-col overflow-hidden bg-background">
      {/* ── Aceternity-style animated backdrop ─────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* animated grid */}
        <div className="animate-grid-pan absolute inset-0 bg-[linear-gradient(to_right,oklch(0.5_0.02_257/0.07)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.5_0.02_257/0.07)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)] dark:bg-[linear-gradient(to_right,oklch(1_0_0/0.05)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.05)_1px,transparent_1px)]" />
        {/* aurora glows */}
        <div className="animate-aurora absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0.66_0.15_156/0.22),transparent_60%)] blur-3xl" />
        <div className="animate-aurora-slow absolute -right-32 top-1/3 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,oklch(0.72_0.13_175/0.18),transparent_60%)] blur-3xl" />
        <div className="animate-aurora absolute -bottom-40 -left-24 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,oklch(0.62_0.1_235/0.16),transparent_60%)] blur-3xl" />
        {/* top fade so the nav reads cleanly */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
      </div>

      {/* ── Top nav ────────────────────────────────────────────────── */}
      <header className="relative flex shrink-0 items-center justify-between px-6 py-5 sm:px-10">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          {/* LOGO SLOT — drop your logo image here manually (e.g. <Image src="/logo.svg" .../>) */}
          <span className="size-8 shrink-0 rounded-lg" data-logo-slot />
          <span className="font-heading text-lg font-bold tracking-tight text-foreground">
            FusionSync{" "}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
              AI
            </span>
          </span>
        </Link>

        {/* Actions */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/blog"
            className="hidden px-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground sm:inline-flex"
          >
            Blog
          </Link>

         

          <Link
            href="/contact"
            className="inline-flex h-9 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            Book a call
          </Link>
        </nav>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
        />
      </header>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="flex w-full max-w-3xl flex-col items-center">
          <div className="animate-rise-in mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Live opportunity intelligence for GoHighLevel
          </div>

          <h1
            className="animate-rise-in font-heading text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl"
            style={{ animationDelay: "60ms" }}
          >
            The system that runs your{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              sales floor
            </span>
          </h1>

          <p
            className="animate-rise-in mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Connect your GoHighLevel location to see who&apos;s making money,
            who&apos;s overloaded, and where deals get stuck — in a 5-second
            morning scan.
          </p>

          {error ? (
            <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {ERROR_MESSAGES[error] ?? "Something went wrong. Please try again."}
            </div>
          ) : null}

          <div
            className="animate-rise-in mt-8 flex flex-col items-center gap-3 sm:flex-row"
            style={{ animationDelay: "180ms" }}
          >
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Open dashboard
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
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
                className={`group inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold transition-all ${
                  configured
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm hover:-translate-y-0.5 hover:shadow-lg"
                    : "pointer-events-none bg-muted text-muted-foreground"
                }`}
              >
                Connect GoHighLevel
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            )}
            {!session ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-emerald-600" />
                We store nothing — your key lives in your browser only.
                <PrivacyInfo />
              </span>
            ) : null}
          </div>

          {/* feature pills */}
          <div
            className="animate-rise-in mt-12 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
            style={{ animationDelay: "240ms" }}
          >
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-4 text-left shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-md"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent transition-transform duration-300 group-hover:scale-x-100"
                />
                <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-emerald-500/15">
                  <Icon className="size-4" />
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">
                  {title}
                </p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>

          {!configured ? (
            <p className="mt-8 max-w-xl rounded-xl border border-border bg-card/70 px-4 py-3 text-xs text-muted-foreground shadow-sm backdrop-blur">
              Set{" "}
              <code className="font-mono text-foreground">GHL_CLIENT_ID</code>,{" "}
              <code className="font-mono text-foreground">
                GHL_CLIENT_SECRET
              </code>
              ,{" "}
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
      </section>

      {/* ── Footer line ────────────────────────────────────────────── */}
      <footer className="flex shrink-0 items-center justify-center gap-1.5 px-6 py-5 text-xs text-muted-foreground">
        A free{" "}
        <Link
          href="https://fusionsync.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-emerald-600 hover:underline"
        >
          fusionsync.ai
        </Link>{" "}
        tool · live snapshot · no database · no tracking.
      </footer>
    </main>
  );
}
