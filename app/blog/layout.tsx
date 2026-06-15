import Link from "next/link";

import { SiteHeader } from "@/components/site-header";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(60%_60%_at_50%_0%,oklch(0.66_0.15_156/0.1),transparent_70%)]"
      />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <footer className="flex shrink-0 flex-col items-center justify-center gap-1.5 border-t border-border px-6 py-8 text-center text-xs text-muted-foreground">
        <p>
          A free{" "}
          <Link
            href="https://search.brave.com/search?q=fusionsync+ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground underline-offset-4 transition-colors hover:text-emerald-600 hover:underline"
          >
            fusionsync.ai
          </Link>{" "}
          resource · live snapshot · no database · no tracking.
        </p>
      </footer>
    </div>
  );
}
