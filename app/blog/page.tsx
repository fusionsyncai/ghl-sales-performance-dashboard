import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { getAllPosts } from "./posts";

export const metadata: Metadata = {
  title: "Sales Performance Blog for GoHighLevel Teams | FusionSync AI",
  description:
    "Trending playbooks and metrics for running a GoHighLevel sales floor — rep performance, pipeline KPIs, aging reports, revenue attribution, and more.",
  keywords: [
    "gohighlevel sales blog",
    "sales rep performance",
    "sales pipeline metrics",
    "ghl dashboard",
    "rep performance os",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Sales Performance Blog for GoHighLevel Teams",
    description:
      "Trending playbooks and metrics for running a GoHighLevel sales floor.",
    type: "website",
    url: "/blog",
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-8 sm:px-8">
      {/* Heading */}
      <div className="max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
          <span className="size-2 rounded-full bg-emerald-500" />
          Insights for the sales floor
        </span>
        <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Run your GoHighLevel sales team like an operator
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          Field-tested playbooks and the metrics that actually move revenue —
          written for agencies and teams that live inside GoHighLevel.
        </p>
      </div>

      {/* Featured */}
      {featured ? (
        <Link
          href={`/blog/${featured.slug}`}
          className="group mt-10 block overflow-hidden rounded-3xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-md sm:p-8"
        >
          <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-600">
              Featured
            </span>
            <span>{featured.category}</span>
            <span aria-hidden>·</span>
            <span>{featured.readingTime}</span>
          </div>
          <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {featured.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {featured.excerpt}
          </p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
            Read article
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      ) : null}

      {/* Grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-md"
          >
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">
                {post.category}
              </span>
              <span aria-hidden>·</span>
              <span>{post.readingTime}</span>
            </div>
            <h3 className="mt-4 font-heading text-lg font-bold leading-snug tracking-tight text-foreground">
              {post.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
              {post.excerpt}
            </p>
            <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatDate(post.date)}</span>
              <ArrowUpRight className="size-4 text-emerald-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
