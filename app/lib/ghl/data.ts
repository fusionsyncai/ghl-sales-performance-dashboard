import { computeDashboard, type DashboardData, type Snapshot } from "../metrics";
import {
  fetchAllOpportunities,
  fetchPipelines,
  fetchUsers,
} from "./client";
import { getSession } from "./session";
import type { GhlSession } from "./types";

const CACHE_TTL_MS = 30_000;

interface CacheEntry {
  data: Snapshot;
  expires: number;
}

// Ephemeral, per-instance cache. Not persistence — avoids refetch storms while
// navigating between dashboard pages.
const cache = new Map<string, CacheEntry>();

/** Fetch (or reuse a recent) full snapshot for the session's location. */
export async function loadSnapshot(session: GhlSession): Promise<Snapshot> {
  const now = Date.now();
  const cached = cache.get(session.locationId);
  if (cached && cached.expires > now) return cached.data;

  const [opportunities, users, pipelines] = await Promise.all([
    fetchAllOpportunities(session),
    fetchUsers(session),
    fetchPipelines(session),
  ]);

  const data: Snapshot = { opportunities, users, pipelines, fetchedAt: now };
  cache.set(session.locationId, { data, expires: now + CACHE_TTL_MS });
  return data;
}

export type DashboardResult =
  | { ok: true; data: DashboardData }
  | { ok: false; error: string };

/** Load the session, fetch the snapshot, and compute all dashboard metrics. */
export async function loadDashboard(): Promise<
  DashboardResult & { authed: boolean }
> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not connected", authed: false };

  try {
    const snapshot = await loadSnapshot(session);
    return { ok: true, data: computeDashboard(snapshot), authed: true };
  } catch (e) {
    return {
      ok: false,
      authed: true,
      error: e instanceof Error ? e.message : "Failed to load GHL data.",
    };
  }
}
