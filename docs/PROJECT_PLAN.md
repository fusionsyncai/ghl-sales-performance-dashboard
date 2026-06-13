# Rep Performance OS for GHL — Project Plan

> **The system that runs the sales floor.** A free tool that turns a GoHighLevel
> sales team from vibes into operational visibility — answering "who makes money,
> who drops the ball, who's overloaded, where deals get stuck" in a 5-second scan.

**Unit of analysis: `rep × opportunity`** (not lead). This is the architectural spine.

---

## 1. Product definition

- **What it is:** a zero-storage, read-only dashboard over a single GHL location's
  opportunities, rendered live from the GHL API.
- **Who it's for (V1):** the owner/manager of one GHL sales team (≈10 closers).
- **Business role:** a free lead-magnet for RecallSync. The free snapshot tool sells
  the future paid tier (trends, history, alerts-over-time, AI automation).
- **Positioning:** *Opportunity Intelligence / Rep Performance OS* — not "another
  dashboard," but the operating system for the sales floor.

---

## 2. Hard constraints (decided)

| Decision | Choice |
| --- | --- |
| Tenancy | **Single GHL location** (one sales team). Multi-location is Phase 2. |
| GHL auth | **OAuth 2.0 Marketplace app** (not a paid SaaS — free marketplace app). |
| Storage | **None.** No database, no backend persistence. |
| Session | Encrypted OAuth token in an **httpOnly cookie** (AES-256-GCM). The cookie *is* the session. |
| Response-time metrics | **Phase 2** (needs Conversations API). |

---

## 3. The defining constraint: snapshot-only

GHL's API exposes exactly two things:

1. **Current snapshot** — `GET /opportunities/search` returns `id, name,
   monetaryValue, status (open/won/lost/abandoned), pipelineId, pipelineStageId,
   assignedTo, contact, createdAt, updatedAt, lastActionDate, lastStatusChangeAt`,
   paginated via `startAfterId`.
2. **Forward-looking change events** — webhooks (`OpportunityStageUpdate`,
   `OpportunityStatusUpdate`, etc.). **Unusable here** because we store nothing.

GHL provides **no historical/time-series data via API**. With no database, every
metric must be computable from a single live snapshot.

### What this REMOVES from V1 (requires storage/history)

- Opportunity **movement over time** (New→Contacted→Qualified→… *counts*)
- **Time-in-stage** history, pipeline progression *speed*
- Any **trend / delta** ("close rate dropped 31%", "response time +22%")
- **Monthly revenue trend**
- Response time, meetings booked, activity counts (also need extra APIs)

### What this KEEPS (snapshot-derivable, fully in V1)

- **§1 Executive Overview + Team Snapshot** — totals, open/won/lost, revenue closed,
  pipeline value, avg deal size, team close rate, avg close time.
- **§2 Rep outcomes** — win rate, revenue, avg deal size, opp→close %, lost %,
  deal-cycle length (`createdAt`→`lastStatusChangeAt` on closed opps).
- **§3 Ownership/workload** — distribution + overload detection (relative to team avg).
- **§5 Aging** — untouched >24h/48h, stagnant >7d, stale lists per rep.
- **§6 Revenue attribution (current)** — closed / pipeline / projected + payroll-vs-output.
- **§7 Risk alerts (threshold/relative)** — overloaded rep, N stale opps, below-team
  close rate. (No delta-vs-last-week alerts.)
- **§4 (reduced)** — current **stage distribution** ("where each rep's opps sit now").

---

## 4. Metric computability matrix

| Metric | Source | V1? |
| --- | --- | --- |
| Total / open / won / lost opps | snapshot count | ✅ |
| Revenue closed (Σ won `monetaryValue`) | snapshot | ✅ |
| Pipeline value (Σ open `monetaryValue`) | snapshot | ✅ |
| Avg deal size | snapshot | ✅ |
| Team / rep close rate (won / (won+lost)) | snapshot | ✅ |
| Avg close time / deal-cycle length | `createdAt`→`lastStatusChangeAt` (closed) | ✅ |
| Per-rep distribution / workload / overload | snapshot (`assignedTo` vs team avg) | ✅ |
| Aging buckets (>24h/48h/7d), stale lists | `lastActionDate` / `updatedAt` | ✅ |
| Current stage distribution per rep | snapshot (`pipelineStageId`) | ✅ |
| Threshold/relative risk alerts | derived snapshot | ✅ |
| Stage movement counts over time | event history | ❌ Phase 2 |
| Time-in-stage, progression speed | event history | ❌ Phase 2 |
| Trend deltas / monthly trends | history | ❌ Phase 2 |
| First-response / reply time | Conversations API | ❌ Phase 2 |
| Meetings booked, appointment→close % | Calendars API | ❌ Phase 2 |
| Follow-ups completed, activity count | Tasks + Conversations API | ❌ Phase 2 |

---

## 5. Architecture (zero-storage)

```
Browser ──OAuth──> GHL Marketplace ──code──> /api/auth/callback
                                               │ exchange code → tokens
                                               │ AES-256-GCM encrypt
                                               ▼
                                     httpOnly Secure cookie  (the session)
                                               │
Server Component (/dashboard) ── read cookie ──┤ refresh if expired
                                               ▼
                          GHL API client (paginated + backoff)
                          /opportunities/search · /users · /pipelines
                                               │
                                  pure metrics engine (snapshot → KPIs)
                                               ▼
                                     React dashboard sections
```

- **Stack:** Next.js 16 App Router (Node runtime), React 19, Tailwind v4, Recharts/Tremor.
- **No DB, no webhooks, no cron, no app auth.** Stateless.
- **Token cookie:** AES-256-GCM with `TOKEN_ENCRYPTION_KEY`; `httpOnly`, `Secure`,
  `SameSite=Lax`. Auto-refresh on expiry via the GHL refresh token.
  - *Risk:* access+refresh JWTs may approach the ~4KB cookie limit. Fallback:
    chunk into two cookies.
- **Ephemeral cache:** short-lived in-memory cache (per server instance) to avoid
  refetch storms — not persistence.
- **Privacy promise:** "We store nothing. Your data is read live from GHL and never
  leaves your session."

### Key modules

- `app/lib/crypto.ts` — AES-256-GCM encrypt/decrypt.
- `app/lib/ghl/oauth.ts` — auth URL, code exchange, token refresh.
- `app/lib/ghl/session.ts` — read/write/clear encrypted cookie + refresh.
- `app/lib/ghl/client.ts` — fetch wrapper + paginated fetchers.
- `app/lib/metrics/*` — pure, unit-tested snapshot → KPI functions.

---

## 6. Sprint plan

Each sprint ends in a working demo.

### Sprint 0 — Foundation & GHL OAuth
- GHL Marketplace app + scopes (`opportunities.readonly`, `users.readonly`, `locations.readonly`).
- OAuth redirect + callback, AES-GCM cookie token util, refresh handling, connect/disconnect.
- GHL client + paginated fetchers.
- **Demo:** connect via OAuth → encrypted token in cookie → raw counts render.

### Sprint 1 — Data layer & metrics engine
- Paginated fetchers + ephemeral cache + backoff.
- Pure metrics module + types + unit tests; loading/empty/error states + refresh.
- **Demo:** all numbers compute correctly from live data.

### Sprint 2 — Executive Overview + Team Snapshot (§1)
- KPI cards + per-rep table (response-time column shown as "—").
- **Demo:** the 5-second morning scan.

### Sprint 3 — Rep Intelligence (§2) + Ownership (§3)
- Per-rep scorecard + drill-down; workload distribution + overload flags.
- **Demo:** click a rep → full scorecard.

### Sprint 4 — Aging (§5) + Stage Distribution (§4 reduced)
- Aging buckets + actionable stale lists per rep; current stage-distribution funnel.
- **Demo:** stale opps + where opps sit now.

### Sprint 5 — Revenue Attribution (§6) + Risk Alerts (§7)
- Current revenue views, optional payroll input (cookie-stored), threshold/relative alerts.
- **Demo:** revenue leaderboard + automatic flags.

### Sprint 6 — Polish & ship
- Responsive design, RecallSync branding, onboarding copy, Vercel deploy.

---

## 7. Phase 2 (the paid tier — requires a backend)

Adding storage unlocks the time-based layer that the snapshot tool cannot do:

- Event store (webhooks) → movement over time, time-in-stage, progression speed.
- Trend deltas + monthly trends + delta-based risk alerts.
- Conversations API → response times. Calendars → meetings. Tasks → activity.
- Multi-location agency rollup, goals/coaching notes, scheduled digests, exports.

---

## 8. Open questions for later

- Cookie size validation against real GHL tokens (chunk if needed).
- Exact GHL scope strings to confirm during Marketplace app setup.
- Projected-revenue formula (raw pipeline Σ vs stage-probability weighting).
