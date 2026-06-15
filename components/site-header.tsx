import Link from "next/link";

export const BOOK_A_CALL_URL = "https://www.fusionsync.ai/contact";

export function SiteHeader() {
  return (
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
          href={BOOK_A_CALL_URL}
          target="_blank"
          rel="noopener noreferrer"
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
  );
}
