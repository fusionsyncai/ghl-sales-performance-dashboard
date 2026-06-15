import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock } from "lucide-react";

import { BOOK_A_CALL_URL } from "@/components/site-header";
import { getAllPosts, getPost, type ContentBlock } from "../posts";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found" };

  const url = `/blog/${post.slug}`;
  return {
    title: `${post.title} | FusionSync AI`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-10 font-heading text-2xl font-bold tracking-tight text-foreground">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-8 font-heading text-xl font-semibold tracking-tight text-foreground">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p className="mt-4 text-base leading-8 text-foreground/85">
          {block.text}
        </p>
      );
    case "ul":
      return (
        <ul className="mt-4 flex flex-col gap-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-base leading-7 text-foreground/85">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mt-4 flex flex-col gap-3">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-3 text-base leading-7 text-foreground/85">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-600">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote className="mt-8 border-l-2 border-emerald-500 pl-5 font-heading text-lg font-medium italic text-foreground">
          {block.text}
        </blockquote>
      );
    case "callout":
      return (
        <div className="mt-8 rounded-2xl border border-border bg-card/70 p-5 shadow-sm backdrop-blur">
          <p className="text-sm font-bold text-foreground">{block.title}</p>
          <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
            {block.text}
          </p>
        </div>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.keywords.join(", "),
    author: { "@type": "Organization", name: "FusionSync AI" },
    publisher: { "@type": "Organization", name: "FusionSync AI" },
    mainEntityOfPage: `/blog/${post.slug}`,
  };

  return (
    <article className="mx-auto w-full max-w-3xl px-6 pb-20 pt-8 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All articles
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-600">
            {post.category}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {post.readingTime}
          </span>
        </div>
        <h1 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          {post.description}
        </p>
      </header>

      <div className="mt-6 h-px bg-gradient-to-r from-border via-border to-transparent" />

      <div className="mt-2">
        {post.content.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-emerald-500/10 via-card to-card p-8 text-center shadow-sm">
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          See your own numbers in a 5-second scan
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">
          Turn this into action. Connect your GoHighLevel location or talk to us
          about putting a Rep Performance OS on your sales floor.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 px-6 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            Try the dashboard
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href={BOOK_A_CALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Book a call
          </Link>
        </div>
      </div>

      {/* Related */}
      {related.length ? (
        <div className="mt-14">
          <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Keep reading
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group rounded-2xl border border-border bg-card/60 p-5 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-emerald-500/30 hover:shadow-md"
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {p.category}
                </span>
                <p className="mt-2 font-heading text-base font-bold leading-snug text-foreground">
                  {p.title}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  Read
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
