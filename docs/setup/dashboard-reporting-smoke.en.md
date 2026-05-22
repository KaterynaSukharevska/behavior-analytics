# Dashboard Reporting — Local Smoke Checklist

This guide walks through the **full local reporting loop** for Behavior Analytics MVP: demo site → tracker → ingest API → PostgreSQL → reporting APIs → dashboard UI.

**Scope:** local development only. This is not a production deployment guide.

---

## What works today

The dashboard (`apps/dashboard`) reads live metrics from the ingest API for site `demo-site`:

| Dashboard section | Reporting API |
|-------------------|---------------|
| Overview metric cards | `GET /api/reports/overview` |
| Page views by path | `GET /api/reports/page-views-by-path` |
| Top clicked elements + conversions | `GET /api/reports/interactions-summary` |
| Scroll depth summary | `GET /api/reports/scroll-depth-summary` |

Each section shows **loading**, **error**, **empty**, and **success** states without crashing the page.

---

## Prerequisites

Before you start, confirm:

- **Node.js 20+** and **npm** are installed
- **Docker Desktop** is running
- Repository dependencies are installed
- Root `.env` exists (copy from `.env.example` for `DATABASE_URL`)
- Prisma migrations have been applied at least once

From the repository root:

```bash
npm install
docker compose up -d postgres
npm run db:generate
npm run db:migrate
```

Optional typechecks:

```bash
npm run typecheck --workspace=@behavior-analytics/ingest-api
npm run typecheck --workspace=@behavior-analytics/dashboard
```

---

## Local URLs

| Service | URL |
|---------|-----|
| Dashboard | http://localhost:3000 |
| Demo site | http://localhost:3001 |
| Ingest API | http://localhost:4000 |
| Health check | http://localhost:4000/api/health |

All reporting endpoints use `siteId=demo-site`.

---

## Local startup (four terminals)

Run from the **repository root** in separate terminals:

```bash
# Terminal 1 — PostgreSQL (once per session)
docker compose up -d postgres
docker compose ps
```

```bash
# Terminal 2 — Ingest API
npm run dev --workspace=@behavior-analytics/ingest-api
```

```bash
# Terminal 3 — Demo site
npm run dev --workspace=@behavior-analytics/demo-site
```

```bash
# Terminal 4 — Dashboard
npm run dev --workspace=@behavior-analytics/dashboard
```

**Quick health check:**

```bash
curl "http://localhost:4000/api/health"
```

Expected: `{ "ok": true, "service": "ingest-api" }`.

---

## Step 1 — Generate demo events

Open http://localhost:3001 and produce a small mix of events.

### Page views (`page_view`)

Visit these routes (each navigation sends a `page_view`):

- `/`
- `/features`
- `/pricing`
- `/contact`
- `/thank-you`

### Clicks (`click`)

Click elements that have `data-analytics-id`, for example:

- Navigation links (home, features, pricing, contact)
- Hero or pricing CTAs

Clicks on form fields or elements without `data-analytics-id` are **not** tracked.

### Scroll depth (`scroll_depth`)

On a long page (home works well), scroll slowly until milestones fire:

- 25%
- 50%
- 75%
- 100%

Each milestone is sent at most once per path per session.

### Conversions (`conversion`)

Trigger demo conversion names:

| Action | Conversion name |
|--------|-----------------|
| Contact page → **Submit demo request** | `contact_form_submitted` |
| Pricing page → **Contact sales** | `pricing_cta_clicked` |
| Open `/thank-you` | `thank_you_page_viewed` |

**Optional:** confirm ingest in the browser Network tab — `POST http://localhost:4000/api/events` → `{ "ok": true, "accepted": 1 }`.

**Optional:** query the database from repo root:

```bash
node scripts/query-demo-events.mjs
node scripts/query-demo-events.mjs page_view
node scripts/query-demo-events.mjs click
node scripts/query-demo-events.mjs scroll_depth
node scripts/query-demo-events.mjs conversion
```

More tracker detail: [`tracker-local-smoke.en.md`](tracker-local-smoke.en.md).

---

## Step 2 — Reporting API checks (curl)

Use `curl.exe` on Windows PowerShell if `curl` is aliased to `Invoke-WebRequest`.

### Overview

```bash
curl "http://localhost:4000/api/reports/overview?siteId=demo-site"
```

Expected:

- HTTP **200**
- `siteId` is `"demo-site"`
- `totals` object with numeric `pageViews`, `clicks`, `scrollDepthEvents`, `conversions`

### Page views by path

```bash
curl "http://localhost:4000/api/reports/page-views-by-path?siteId=demo-site"
```

Expected:

- HTTP **200**
- `items` array
- Each item has `path` (string) and `pageViews` (number)
- Sorted by `pageViews` descending (top 10)

### Interactions summary

```bash
curl "http://localhost:4000/api/reports/interactions-summary?siteId=demo-site"
```

Expected:

- HTTP **200**
- `clicks` array — items with `elementId` and `clicks`
- `conversions` array — items with `conversionName` and `conversions`
- Counts sorted descending within each array (top 10)

### Scroll depth summary

```bash
curl "http://localhost:4000/api/reports/scroll-depth-summary?siteId=demo-site"
```

Expected:

- HTTP **200**
- `items` array
- Each item has `depthPercent` (25, 50, 75, or 100) and `events` (number)
- Sorted by `depthPercent` ascending

---

## Step 3 — Safe API error checks

### Missing `siteId` (400)

```bash
curl "http://localhost:4000/api/reports/overview"
```

Expected:

```json
{ "ok": false, "error": "INVALID_SITE_ID" }
```

Repeat for any reporting endpoint, for example:

```bash
curl "http://localhost:4000/api/reports/page-views-by-path"
curl "http://localhost:4000/api/reports/interactions-summary"
curl "http://localhost:4000/api/reports/scroll-depth-summary"
```

### Empty `siteId` (400)

```bash
curl "http://localhost:4000/api/reports/overview?siteId="
```

Expected: `{ "ok": false, "error": "INVALID_SITE_ID" }`.

---

## Step 4 — Dashboard UI checks

Open http://localhost:3000 with ingest API, demo site, and database running.

Work top to bottom through each section:

### 1. Overview metrics

- Brief **loading** message and skeleton cards appear
- Then four cards: **Page views**, **Clicks**, **Scroll depth events**, **Conversions**
- Numbers should match `GET /api/reports/overview?siteId=demo-site` (approximately — same ingest pipeline)

If all totals are zero, an info message explains how to use the demo site.

### 2. Page views by path

- Table with **Path** and **Page views**
- Paths should match data from `page-views-by-path` API
- Empty table → info message if no `page_view` events yet

### 3. Interactions summary

- **Top clicked elements** — Element ID and Clicks
- **Conversions** — Conversion name and Conversions
- If both lists are empty → single info message

### 4. Scroll depth summary

- Table with **Depth** (25%, 50%, 75%, 100%) and **Events**
- Rows should match `scroll-depth-summary` API
- Empty → info message if no `scroll_depth` events yet

### Loading behavior

- Refresh the dashboard — each section loads independently
- Page should **not** white-screen or show React error overlays during loading

---

## Step 5 — Dashboard error behavior (ingest API stopped)

1. With the dashboard open, stop the ingest API terminal (Ctrl+C).
2. Hard refresh http://localhost:3000.

Expected:

- Each reporting section shows a **friendly error alert** (red)
- Message suggests the ingest API may be down and to refresh after restarting
- **No** stack traces, **no** uncaught exception crash
- Rest of the page (hero, status card) still renders

Restart ingest API and refresh — sections should return to success state with live numbers.

---

## Smoke pass checklist

Use this quick checklist after a full run:

- [ ] PostgreSQL container is running
- [ ] Ingest API health returns OK
- [ ] Demo site generates `page_view`, `click`, `scroll_depth`, `conversion` events
- [ ] All four reporting `curl` endpoints return 200 with `siteId=demo-site`
- [ ] Missing/empty `siteId` returns `INVALID_SITE_ID` (400)
- [ ] Dashboard overview cards show numbers
- [ ] Page views by path table has rows
- [ ] Interactions section shows clicks and/or conversions
- [ ] Scroll depth section shows milestone rows
- [ ] Stopping ingest API shows safe dashboard errors, not a crash

---

## Related documentation

- [`tracker-local-smoke.en.md`](tracker-local-smoke.en.md) — tracker and demo-site event generation
- [`local-development.en.md`](local-development.en.md) — general local setup
- [`../phase-5-context.md`](../phase-5-context.md) — Phase 5 implementation handoff
- [`../phase-4-context.md`](../phase-4-context.md) — tracker phase handoff

---

## What is not covered here

- Production hosting or HTTPS
- Auth, API keys, or multi-site accounts
- Date range filters or charts
- Automated E2E tests (manual smoke only)
