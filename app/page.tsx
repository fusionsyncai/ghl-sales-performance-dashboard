import Link from "next/link";
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

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = isGhlConfigured();
  const session = configured ? await getSession() : null;

  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-24 dark:bg-black">
      <div className="w-full max-w-xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-zinc-500">
          Rep Performance OS
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          The system that runs your sales floor
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Connect your GoHighLevel location to see who&apos;s making money,
          who&apos;s overloaded, and where deals get stuck — live. We store
          nothing; your data is read directly from GHL in your session.
        </p>

        {error ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {ERROR_MESSAGES[error] ?? "Something went wrong. Please try again."}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Open dashboard
              </Link>
              <a
                href="/api/auth/logout"
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              >
                Disconnect
              </a>
            </>
          ) : (
            <a
              href="/api/auth/ghl"
              aria-disabled={!configured}
              className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors ${
                configured
                  ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  : "pointer-events-none bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
            >
              Connect GoHighLevel
            </a>
          )}
        </div>

        {!configured ? (
          <p className="mt-6 text-sm text-zinc-500">
            Set <code className="font-mono">GHL_CLIENT_ID</code>,{" "}
            <code className="font-mono">GHL_CLIENT_SECRET</code>,{" "}
            <code className="font-mono">GHL_REDIRECT_URI</code> and{" "}
            <code className="font-mono">TOKEN_ENCRYPTION_KEY</code> in your{" "}
            <code className="font-mono">.env</code> to enable connecting.
          </p>
        ) : null}
      </div>
    </main>
  );
}
