# Local demo checklist

Use this checklist to run and verify the Behavior Analytics MVP on your machine before interviews, portfolio reviews, or demo recordings.

This project is a **local-first portfolio MVP**, not a production SaaS. No deployment is required for this demo.

---

## Goal

Demonstrate the current implemented product flow:

```txt
demo-site → tracker SDK → ingest API → Zod validation → Prisma → PostgreSQL analytics_events → reporting API → dashboard UI
```

---

## Before the demo

Complete this once before an interview or recording session.

### Prerequisites

- [ ] Node.js 20+ and npm are installed
- [ ] Docker Desktop is available for PostgreSQL
- [ ] Repository dependencies are installed: `npm install` (from repo root)
- [ ] Root `.env` exists (copy from `.env.example` if needed; `DATABASE_URL` is required)
- [ ] Prisma client and migrations are ready (see [`README.md`](../../README.md) Local Setup)

### Quick port check

Confirm these ports are free before starting services:

| Port | Service |
|------|---------|
| 3000 | Dashboard |
| 3001 | Demo site |
| 4000 | Ingest API |
| 5432 | PostgreSQL |

If a port is busy, stop the old process or change the port in `.env` only when you understand the impact.

### Tabs to prepare (optional)

- [ ] http://localhost:3000 — dashboard
- [ ] http://localhost:3001 — demo site
- [ ] http://localhost:4000/api/health — ingest health
- [ ] This checklist open for reference

Full setup commands: [`README.md`](../../README.md), [`docs/setup/local-development.en.md`](../setup/local-development.en.md).

---

## Start local services

Run from the **repository root** in separate terminals. **Recommended order:** PostgreSQL → ingest API → dashboard → demo site.

### 1. PostgreSQL (Docker Compose)

```bash
docker compose up -d postgres
docker compose ps
```

Prepare Prisma if needed:

```bash
npm run db:generate
npm run db:migrate
```

- [ ] `docker compose ps` shows postgres running
- [ ] `npm run db:status` succeeds (if unsure about schema state)

### 2. Ingest API — http://localhost:4000

```bash
npm run dev --workspace=@behavior-analytics/ingest-api
```

- [ ] Terminal shows ingest API listening (no immediate crash)

### 3. Dashboard — http://localhost:3000

```bash
npm run dev --workspace=@behavior-analytics/dashboard
```

- [ ] Dashboard page loads in the browser

### 4. Demo site — http://localhost:3001

```bash
npm run dev --workspace=@behavior-analytics/demo-site
```

- [ ] Demo site home page loads

Do not skip ingest API or PostgreSQL — the dashboard reads reports from the API, not the database directly.

---

## Verify ingest API health

Check before generating demo data.

- [ ] Open http://localhost:4000/api/health
- [ ] Response is JSON: `{ "ok": true, "service": "ingest-api" }`

If health fails:

- [ ] Ingest API terminal is still running
- [ ] Port 4000 is not used by another app
- [ ] Restart ingest API after PostgreSQL is up

Optional events endpoint (after demo data exists):

- [ ] `POST http://localhost:4000/api/events` is used by the tracker from the demo site (check Network tab on demo site, not manual POST unless testing)

---

## Generate demo data from the demo-site

Use http://localhost:3001. The tracker sends events to `POST http://localhost:4000/api/events`.

**Optional:** DevTools → **Network** → filter `events` or `4000`. Successful ingest responses look like `{ "ok": true, "accepted": 1 }`.

### `page_view`

- [ ] Visit routes (each navigation sends a page view):
  - `/`
  - `/features`
  - `/pricing`
  - `/contact`
  - `/thank-you`

### `click`

- [ ] Click elements with `data-analytics-id` (nav links, hero/pricing CTAs)
- [ ] Confirm clicks on form fields or elements **without** `data-analytics-id` are **not** tracked

### `scroll_depth`

- [ ] On a long page (home works well), scroll through milestones: 25%, 50%, 75%, 100%
- [ ] Each milestone fires at most once per path per session

### `conversion`

| Action | Conversion name |
|--------|-----------------|
| Contact page → **Submit demo request** | `contact_form_submitted` |
| Pricing page → **Contact sales** | `pricing_cta_clicked` |
| Open `/thank-you` | `thank_you_page_viewed` |

More detail: [`docs/setup/tracker-local-smoke.en.md`](../setup/tracker-local-smoke.en.md).

---

## Verify report endpoints directly

Open in the browser or use `curl`. All use `siteId=demo-site`.

| Endpoint | URL |
|----------|-----|
| Overview | http://localhost:4000/api/reports/overview?siteId=demo-site |
| Page views by path | http://localhost:4000/api/reports/page-views-by-path?siteId=demo-site |
| Interactions summary | http://localhost:4000/api/reports/interactions-summary?siteId=demo-site |
| Scroll depth summary | http://localhost:4000/api/reports/scroll-depth-summary?siteId=demo-site |

For each endpoint:

- [ ] HTTP 200
- [ ] JSON body includes `"ok": true` and report data (or empty arrays/zero totals before demo data)
- [ ] After demo data: totals and lists match what you generated

If any endpoint returns `"ok": false`:

- [ ] PostgreSQL is running
- [ ] `DATABASE_URL` in `.env` is correct
- [ ] Run `npm run db:migrate` if schema may be out of date

More API smoke detail: [`docs/setup/dashboard-reporting-smoke.en.md`](../setup/dashboard-reporting-smoke.en.md).

---

## Verify dashboard cards

Open http://localhost:3000 and **hard refresh** after generating demo-site events.

### Overview

- [ ] Brief loading state, then success (not stuck loading)
- [ ] Metric cards show page views, clicks, scroll depth events, and conversions
- [ ] If all zeros: generate more events on the demo site, then refresh

### Page views by path

- [ ] CSS-only horizontal bar chart visible (no chart library)
- [ ] Table lists paths and counts matching visited routes

### Interactions summary

- [ ] **Top clicked elements** lists `data-analytics-id` values you clicked
- [ ] **Conversions** lists conversion names you triggered

### Scroll depth summary

- [ ] CSS-only milestone visualization visible
- [ ] Table shows depth milestones (25%, 50%, 75%, 100%) with counts after scroll events

If any section fails, see **Common error states** below.

---

## Common error states and what to check

The dashboard report sections use loading, empty, error, and success states. Use this table during a demo.

| What you see | Likely cause | What to check |
|--------------|--------------|---------------|
| Loading never finishes | Ingest API down or wrong URL | Health at http://localhost:4000/api/health; ingest API terminal running |
| Error alert on a report card | API unreachable or report returned `ok: false` | Direct report URL in browser; PostgreSQL + migrations |
| Empty / zero metrics | No events stored yet | Demo site open; Network tab shows successful `POST /api/events`; refresh dashboard |
| Demo site works, dashboard empty | Dashboard cannot reach ingest API | `NEXT_PUBLIC_INGEST_API_URL` unset or wrong (defaults to localhost:4000 locally) |
| Health OK, reports `ok: false` | Database connection or schema | `docker compose ps`; `npm run db:migrate`; `npm run db:validate` |
| Clicks missing in interactions | No tracked clicks | Click elements with `data-analytics-id` only |
| Scroll depth empty | No scroll milestones fired | Scroll home page slowly through 25–100% |

**Interview tip:** If one card errors, show a working report endpoint URL in the browser to prove the API layer, then fix the failing layer (DB, ingest, or demo data).

---

## Clean restart checklist

Use when the demo behaved oddly, ports were stuck, or you want a fresh run.

1. [ ] Stop demo site, dashboard, and ingest API dev terminals (`Ctrl+C`)
2. [ ] Optional: `docker compose restart postgres` (or `docker compose down` then `docker compose up -d postgres`)
3. [ ] Confirm ports 3000, 3001, 4000 are free
4. [ ] From repo root: `docker compose ps` — postgres up
5. [ ] `npm run db:generate` (only if Prisma client issues appeared)
6. [ ] Start ingest API → wait until health responds
7. [ ] Start dashboard → start demo site
8. [ ] Re-run **Verify ingest API health** and **Generate demo data** sections
9. [ ] Hard refresh dashboard

Avoid editing code during an interview; prefer restart over live debugging.

---

## What this demo proves technically

When the checklist passes, you can honestly say you verified:

- **End-to-end flow** — demo-site → tracker → ingest → validation → PostgreSQL → reporting API → dashboard
- **Privacy-conscious tracking** — no form values, PII, cookies, `localStorage`, DOM text, or session replay; clicks via `data-analytics-id`; explicit conversions only
- **Runtime validation** — Zod at ingest before persistence
- **REST reporting** — four `GET /api/reports/*` endpoints with `siteId=demo-site`
- **Dashboard UX** — loading, empty, error, and success states on report sections
- **Local-first scope** — not production SaaS; no auth, deployment, or date filters in this MVP

Short talking points: [`docs/portfolio/interview-walkthrough-script.md`](interview-walkthrough-script.md), [`docs/portfolio/technical-highlights.md`](technical-highlights.md).

---

## Screenshot capture (optional)

Capture **manually** in the browser or OS tool. No screenshot automation in this repo.

Follow the full sequence, file names, and privacy rules in [`demo-screenshots-plan.md`](demo-screenshots-plan.md).

Quick minimum:

- [ ] Dashboard full page with report sections populated
- [ ] Overview metric cards with non-zero numbers
- [ ] Page views chart + table; scroll depth visualization
- [ ] Demo-site page with visible `data-analytics-id` CTA
- [ ] Optional: health JSON tab; terminals showing services running

Store images only when you plan to commit them in a later task. Do not fake data or screenshots.

---

## Current limitations

Be explicit when presenting:

- no authentication
- no rate limiting
- no deployment yet (plan: [`docs/deployment/deployment-plan.en.md`](../deployment/deployment-plan.en.md))
- no production monitoring/logging strategy
- no date filters
- no aggregation tables or materialized views
- no background jobs
- no E2E or screenshot testing automation
- not a production SaaS

Dashboard charts are **CSS-only** (no chart library).

---

## Related documentation

- [`README.md`](../../README.md) — project overview and local setup
- [`docs/phase-9-context.md`](../phase-9-context.md) — Phase 9 handoff
- [`docs/portfolio/interview-prep-checklist.md`](interview-prep-checklist.md) — 30-minute pre-interview prep
- [`docs/portfolio/demo-day-fallback-script.md`](demo-day-fallback-script.md) — when live demo is unavailable
- [`docs/setup/dashboard-reporting-smoke.en.md`](../setup/dashboard-reporting-smoke.en.md) — reporting API smoke steps
- [`docs/setup/tracker-local-smoke.en.md`](../setup/tracker-local-smoke.en.md) — tracker event detail
