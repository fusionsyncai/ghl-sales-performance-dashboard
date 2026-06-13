import type {
  GhlOpportunity,
  GhlPipeline,
  GhlUser,
  OpportunityStatus,
} from "./ghl/types";

const DAY_MS = 24 * 60 * 60 * 1000;
const STALE_DAYS = 7;
const UNASSIGNED_ID = "__unassigned__";

export interface Snapshot {
  opportunities: GhlOpportunity[];
  users: GhlUser[];
  pipelines: GhlPipeline[];
  fetchedAt: number;
}

export interface KpiSummary {
  totalOpps: number;
  openOpps: number;
  wonOpps: number;
  lostOpps: number;
  abandonedOpps: number;
  revenueClosed: number;
  pipelineValue: number;
  avgDealSize: number | null;
  closeRate: number | null;
  avgCloseTimeDays: number | null;
}

export interface RepMetrics {
  id: string;
  name: string;
  isUnassigned: boolean;
  assigned: number;
  active: number;
  won: number;
  lost: number;
  abandoned: number;
  closeRate: number | null;
  revenue: number;
  pipelineValue: number;
  avgDealSize: number | null;
  avgCloseTimeDays: number | null;
  staleCount: number;
  untouched24: number;
  untouched48: number;
  workloadShare: number;
}

export interface StageBucket {
  stageId: string;
  name: string;
  pipelineName: string;
  position: number;
  count: number;
  value: number;
}

export interface AgingBuckets {
  fresh: number;
  over24: number;
  over48: number;
  over7d: number;
  over14d: number;
}

export interface StaleOpp {
  id: string;
  name: string;
  repName: string;
  stageName: string;
  value: number;
  ageDays: number;
}

export type AlertSeverity = "high" | "medium" | "low";

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  detail: string;
}

export interface DashboardData {
  kpis: KpiSummary;
  reps: RepMetrics[];
  stages: StageBucket[];
  aging: AgingBuckets;
  staleOpps: StaleOpp[];
  alerts: Alert[];
  unassignedCount: number;
  repCount: number;
  fetchedAt: number;
}

function displayName(user: GhlUser): string {
  if (user.name?.trim()) return user.name.trim();
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  if (full) return full;
  return user.email ?? "Unknown user";
}

function toTime(value?: string): number | null {
  if (!value) return null;
  const t = Date.parse(value);
  return Number.isNaN(t) ? null : t;
}

/** Most recent activity timestamp we can infer for an opportunity. */
function lastActivityTime(opp: GhlOpportunity): number | null {
  return (
    toTime(opp.lastActionDate) ??
    toTime(opp.updatedAt) ??
    toTime(opp.createdAt)
  );
}

/** Days a won opportunity took from creation to close, if derivable. */
function closeDurationDays(opp: GhlOpportunity): number | null {
  const created = toTime(opp.createdAt);
  const closed = toTime(opp.lastStatusChangeAt) ?? toTime(opp.updatedAt);
  if (created === null || closed === null || closed < created) return null;
  return (closed - created) / DAY_MS;
}

function safeRate(won: number, lost: number): number | null {
  const closed = won + lost;
  return closed > 0 ? won / closed : null;
}

function buildStageIndex(pipelines: GhlPipeline[]) {
  const index = new Map<
    string,
    { name: string; pipelineName: string; position: number }
  >();
  for (const pipeline of pipelines) {
    const stages = pipeline.stages ?? [];
    stages.forEach((stage, i) => {
      index.set(stage.id, {
        name: stage.name ?? "Unnamed stage",
        pipelineName: pipeline.name ?? "Pipeline",
        position: stage.position ?? i,
      });
    });
  }
  return index;
}

interface MutableRep {
  id: string;
  name: string;
  isUnassigned: boolean;
  assigned: number;
  active: number;
  won: number;
  lost: number;
  abandoned: number;
  revenue: number;
  pipelineValue: number;
  closeDurations: number[];
  staleCount: number;
  untouched24: number;
  untouched48: number;
}

export function computeDashboard(snapshot: Snapshot): DashboardData {
  const { opportunities, users, pipelines, fetchedAt } = snapshot;
  const now = Date.now();
  const stageIndex = buildStageIndex(pipelines);

  const userNames = new Map<string, string>();
  for (const user of users) userNames.set(user.id, displayName(user));

  const reps = new Map<string, MutableRep>();
  const ensureRep = (id: string): MutableRep => {
    let rep = reps.get(id);
    if (!rep) {
      const isUnassigned = id === UNASSIGNED_ID;
      rep = {
        id,
        name: isUnassigned ? "Unassigned" : userNames.get(id) ?? "Unknown rep",
        isUnassigned,
        assigned: 0,
        active: 0,
        won: 0,
        lost: 0,
        abandoned: 0,
        revenue: 0,
        pipelineValue: 0,
        closeDurations: [],
        staleCount: 0,
        untouched24: 0,
        untouched48: 0,
      };
      reps.set(id, rep);
    }
    return rep;
  };

  const kpis: KpiSummary = {
    totalOpps: opportunities.length,
    openOpps: 0,
    wonOpps: 0,
    lostOpps: 0,
    abandonedOpps: 0,
    revenueClosed: 0,
    pipelineValue: 0,
    avgDealSize: null,
    closeRate: null,
    avgCloseTimeDays: null,
  };

  const stageBuckets = new Map<string, StageBucket>();
  const aging: AgingBuckets = {
    fresh: 0,
    over24: 0,
    over48: 0,
    over7d: 0,
    over14d: 0,
  };
  const staleOpps: StaleOpp[] = [];
  const teamCloseDurations: number[] = [];
  let unassignedCount = 0;

  for (const opp of opportunities) {
    const repId = opp.assignedTo || UNASSIGNED_ID;
    const rep = ensureRep(repId);
    const value = typeof opp.monetaryValue === "number" ? opp.monetaryValue : 0;
    if (repId === UNASSIGNED_ID) unassignedCount += 1;

    rep.assigned += 1;

    const status: OpportunityStatus = opp.status;
    if (status === "open") {
      kpis.openOpps += 1;
      kpis.pipelineValue += value;
      rep.active += 1;
      rep.pipelineValue += value;

      // Stage distribution (open pipeline only).
      if (opp.pipelineStageId) {
        const meta = stageIndex.get(opp.pipelineStageId);
        const existing = stageBuckets.get(opp.pipelineStageId);
        if (existing) {
          existing.count += 1;
          existing.value += value;
        } else {
          stageBuckets.set(opp.pipelineStageId, {
            stageId: opp.pipelineStageId,
            name: meta?.name ?? "Unknown stage",
            pipelineName: meta?.pipelineName ?? "Pipeline",
            position: meta?.position ?? 999,
            count: 1,
            value,
          });
        }
      }

      // Aging (open opps only).
      const last = lastActivityTime(opp);
      if (last !== null) {
        const ageDays = (now - last) / DAY_MS;
        if (ageDays < 1) aging.fresh += 1;
        if (ageDays >= 1) aging.over24 += 1;
        if (ageDays >= 2) aging.over48 += 1;
        if (ageDays >= 7) aging.over7d += 1;
        if (ageDays >= 14) aging.over14d += 1;
        if (ageDays >= 1) rep.untouched24 += 1;
        if (ageDays >= 2) rep.untouched48 += 1;
        if (ageDays >= STALE_DAYS) {
          rep.staleCount += 1;
          staleOpps.push({
            id: opp.id,
            name: opp.name || opp.contact?.name || "Untitled opportunity",
            repName: rep.name,
            stageName: opp.pipelineStageId
              ? stageIndex.get(opp.pipelineStageId)?.name ?? "—"
              : "—",
            value,
            ageDays,
          });
        }
      }
    } else if (status === "won") {
      kpis.wonOpps += 1;
      kpis.revenueClosed += value;
      rep.won += 1;
      rep.revenue += value;
      const dur = closeDurationDays(opp);
      if (dur !== null) {
        rep.closeDurations.push(dur);
        teamCloseDurations.push(dur);
      }
    } else if (status === "lost") {
      kpis.lostOpps += 1;
      rep.lost += 1;
    } else if (status === "abandoned") {
      kpis.abandonedOpps += 1;
      rep.abandoned += 1;
    }
  }

  kpis.avgDealSize = kpis.wonOpps > 0 ? kpis.revenueClosed / kpis.wonOpps : null;
  kpis.closeRate = safeRate(kpis.wonOpps, kpis.lostOpps);
  kpis.avgCloseTimeDays =
    teamCloseDurations.length > 0
      ? teamCloseDurations.reduce((a, b) => a + b, 0) /
        teamCloseDurations.length
      : null;

  const totalAssigned = opportunities.length || 1;
  const repList: RepMetrics[] = [...reps.values()].map((r) => ({
    id: r.id,
    name: r.name,
    isUnassigned: r.isUnassigned,
    assigned: r.assigned,
    active: r.active,
    won: r.won,
    lost: r.lost,
    abandoned: r.abandoned,
    closeRate: safeRate(r.won, r.lost),
    revenue: r.revenue,
    pipelineValue: r.pipelineValue,
    avgDealSize: r.won > 0 ? r.revenue / r.won : null,
    avgCloseTimeDays:
      r.closeDurations.length > 0
        ? r.closeDurations.reduce((a, b) => a + b, 0) / r.closeDurations.length
        : null,
    staleCount: r.staleCount,
    untouched24: r.untouched24,
    untouched48: r.untouched48,
    workloadShare: r.assigned / totalAssigned,
  }));

  repList.sort((a, b) => {
    if (a.isUnassigned !== b.isUnassigned) return a.isUnassigned ? 1 : -1;
    if (b.revenue !== a.revenue) return b.revenue - a.revenue;
    return b.assigned - a.assigned;
  });

  staleOpps.sort((a, b) => b.ageDays - a.ageDays);

  const stages = [...stageBuckets.values()].sort(
    (a, b) =>
      a.pipelineName.localeCompare(b.pipelineName) || a.position - b.position,
  );

  const realReps = repList.filter((r) => !r.isUnassigned);
  const alerts = computeAlerts({
    reps: realReps,
    teamCloseRate: kpis.closeRate,
    unassignedCount,
  });

  return {
    kpis,
    reps: repList,
    stages,
    aging,
    staleOpps: staleOpps.slice(0, 100),
    alerts,
    unassignedCount,
    repCount: realReps.length,
    fetchedAt,
  };
}

function computeAlerts(input: {
  reps: RepMetrics[];
  teamCloseRate: number | null;
  unassignedCount: number;
}): Alert[] {
  const { reps, teamCloseRate, unassignedCount } = input;
  const alerts: Alert[] = [];

  const avgAssigned =
    reps.length > 0
      ? reps.reduce((sum, r) => sum + r.assigned, 0) / reps.length
      : 0;

  for (const rep of reps) {
    // Overloaded reps (well above team average).
    if (reps.length >= 3 && rep.assigned >= 10 && avgAssigned > 0) {
      const ratio = rep.assigned / avgAssigned;
      if (ratio >= 1.4) {
        alerts.push({
          id: `overload-${rep.id}`,
          severity: ratio >= 1.7 ? "high" : "medium",
          title: `${rep.name} is overloaded`,
          detail: `${rep.assigned} opportunities — ${Math.round(
            (ratio - 1) * 100,
          )}% above the team average of ${Math.round(avgAssigned)}.`,
        });
      }
    }

    // Stale pipeline per rep.
    if (rep.staleCount >= 5) {
      alerts.push({
        id: `stale-${rep.id}`,
        severity: rep.staleCount >= 10 ? "high" : "medium",
        title: `${rep.name} has ${rep.staleCount} stale opportunities`,
        detail: `Open ${STALE_DAYS}+ days with no activity. These are dying.`,
      });
    }

    // Underperforming close rate vs team.
    if (
      teamCloseRate !== null &&
      rep.closeRate !== null &&
      rep.won + rep.lost >= 5 &&
      rep.closeRate < teamCloseRate * 0.6
    ) {
      alerts.push({
        id: `closerate-${rep.id}`,
        severity: "medium",
        title: `${rep.name} is closing below the team`,
        detail: `${Math.round(rep.closeRate * 100)}% close rate vs team ${Math.round(
          teamCloseRate * 100,
        )}%.`,
      });
    }
  }

  if (unassignedCount > 0) {
    alerts.push({
      id: "unassigned",
      severity: unassignedCount >= 10 ? "high" : "medium",
      title: `${unassignedCount} opportunities have no owner`,
      detail: "Unassigned opportunities rarely get worked. Route them to a rep.",
    });
  }

  const severityRank: Record<AlertSeverity, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };
  alerts.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
  return alerts;
}
