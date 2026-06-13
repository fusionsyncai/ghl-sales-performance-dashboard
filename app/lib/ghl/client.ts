import { GHL_API_BASE, GHL_API_VERSION } from "./constants";
import type {
  GhlOpportunity,
  GhlPipeline,
  GhlSession,
  GhlUser,
} from "./types";

const PAGE_LIMIT = 100;
const MAX_PAGES = 100; // safety bound (≈10k opportunities)
const MAX_RETRIES = 3;

async function ghlFetch<T>(
  session: GhlSession,
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const url = new URL(`${GHL_API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Version: GHL_API_VERSION,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (res.ok) {
      return (await res.json()) as T;
    }

    // Back off on rate-limit / transient server errors.
    if ((res.status === 429 || res.status >= 500) && attempt < MAX_RETRIES) {
      const retryAfter = Number(res.headers.get("retry-after"));
      const delayMs = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : 2 ** attempt * 500;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      continue;
    }

    const detail = await res.text().catch(() => "");
    throw new Error(`GHL ${path} failed (${res.status}): ${detail}`);
  }

  throw new Error(`GHL ${path} failed after ${MAX_RETRIES} retries`);
}

interface OpportunitySearchResponse {
  opportunities: GhlOpportunity[];
  meta?: {
    total?: number;
    nextPageUrl?: string | null;
    startAfterId?: string | null;
    startAfter?: number | null;
  };
}

/** Fetch every opportunity for the session's location (handles pagination). */
export async function fetchAllOpportunities(
  session: GhlSession,
): Promise<GhlOpportunity[]> {
  const all: GhlOpportunity[] = [];
  let startAfterId: string | undefined;
  let startAfter: number | undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    const data = await ghlFetch<OpportunitySearchResponse>(
      session,
      "/opportunities/search",
      {
        location_id: session.locationId,
        limit: PAGE_LIMIT,
        startAfterId,
        startAfter,
      },
    );

    const batch = data.opportunities ?? [];
    all.push(...batch);

    const next = data.meta?.startAfterId ?? undefined;
    if (
      batch.length < PAGE_LIMIT ||
      !next ||
      data.meta?.nextPageUrl == null
    ) {
      break;
    }
    startAfterId = next;
    startAfter = data.meta?.startAfter ?? undefined;
  }

  return all;
}

export async function fetchUsers(session: GhlSession): Promise<GhlUser[]> {
  const data = await ghlFetch<{ users: GhlUser[] }>(session, "/users/", {
    locationId: session.locationId,
  });
  return data.users ?? [];
}

export async function fetchPipelines(
  session: GhlSession,
): Promise<GhlPipeline[]> {
  const data = await ghlFetch<{ pipelines: GhlPipeline[] }>(
    session,
    "/opportunities/pipelines",
    { locationId: session.locationId },
  );
  return data.pipelines ?? [];
}
