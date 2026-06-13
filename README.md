# Rep Performance OS for GHL

> **The system that runs the sales floor.** A free, zero-storage tool that turns a
> GoHighLevel sales team from vibes into operational visibility — who makes money,
> who drops the ball, who's overloaded, and where deals get stuck — rendered live
> from the GHL API.

**We store nothing.** Your GHL OAuth token is AES-256-GCM encrypted and kept only in
an `httpOnly` cookie. All metrics are computed live from GHL's current snapshot.

See [`docs/PROJECT_PLAN.md`](docs/PROJECT_PLAN.md) for the full scope, architecture,
metric-computability matrix, and sprint plan.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript. No database.

## Setup

1. **Create a GHL Marketplace app** at <https://marketplace.gohighlevel.com>.
   - Add a Redirect URI of `http://localhost:3000/api/auth/callback` (and your prod URL).
   - Add scopes: `opportunities.readonly`, `users.readonly`, `locations.readonly`.
   - Copy the Client ID and Client Secret.
2. **Configure env.** Copy `.env.example` to `.env` and fill in values:

   ```bash
   cp .env.example .env
   # generate a session secret:
   openssl rand -base64 48   # → TOKEN_ENCRYPTION_KEY
   ```

3. **Run it.**

   ```bash
   npm install
   npm run dev
   ```

   Open <http://localhost:3000>, click **Connect GoHighLevel**, install on a
   sub-account, and you'll land on the Sprint 0 connection-check dashboard.

## Status

- **Sprint 0 (done):** GHL OAuth, encrypted cookie session + refresh, paginated API
  client, connect/disconnect, raw-counts connection check.
- **Next:** metrics engine, Executive Overview, Rep Intelligence, Aging, Revenue,
  Alerts (see the project plan).
