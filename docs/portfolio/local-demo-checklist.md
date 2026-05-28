# Local demo checklist

Use this checklist to manually run and present the Behavior Analytics MVP on your machine. It is for portfolio preparation, recruiter/interviewer walkthroughs, screenshot capture, and short demo video recording.

This project is a **local-first portfolio MVP**, not a production SaaS. No deployment is required for this demo.

---

## Goal

Demonstrate the current implemented product flow:

```txt
demo-site → tracker SDK → ingest API → database → reporting API → dashboard
```

In plain language:

1. The demo site emits privacy-safe behavior events.
2. The tracker sends events to the ingest API.
3. Zod validates events before persistence.
4. Prisma stores events in PostgreSQL (`analytics_events`).
5. Reporting endpoints aggregate stored events.
6. The dashboard displays overview and report sections.

---

## Before you start

Confirm these prerequisites at a high level:

- [ ] Node.js 20+ and npm are installed
- [ ] Docker Desktop is available for PostgreSQL
- [ ] Repository dependencies are installed (`npm install` from repo root)
- [ ] Root `.env` exists (copy from `.env.example` if needed, especially `DATABASE_URL`)
- [ ] Prisma client and migrations are ready (see [`README.md`](../../README.md) Local Setup)
- [ ] You understand this is a **local demo only** — no production deployment required

For full setup commands, use [`README.md`](../../README.md) and [`docs/setup/local-development.en.md`](../setup/local-development.en.md).

---

## Start local services

Run these from the **repository root** in separate terminals. Commands match the root README.

### PostgreSQL (Docker Compose)

- [ ] Start PostgreSQL:

```bash
docker compose up -d postgres
docker compose ps
```

- [ ] Prepare Prisma if needed:

```bash
npm run db:generate
npm run db:migrate
```

### Ingest API (`localhost:4000`)

- [ ] Start ingest API:

```bash
npm run dev --workspace=@behavior-analytics/ingest-api
```

### Dashboard (`localhost:3000`)

- [ ] Start dashboard:

```bash
npm run dev --workspace=@behavior-analytics/dashboard
```

### Demo site (`localhost:3001`)

- [ ] Start demo site:

```bash
npm run dev --workspace=@behavior-analytics/demo-site
```

---

## Health checks

Manual checks before generating demo data:

- [ ] Ingest API health: open http://localhost:4000/api/health  
  Expected JSON: `{ "ok": true, "service": "ingest-api" }`
- [ ] Dashboard opens: http://localhost:3000
- [ ] Demo site opens: http://localhost:3001

Optional direct report endpoint checks (browser or `curl`):

- [ ] http://localhost:4000/api/reports/overview?siteId=demo-site
- [ ] http://localhost:4000/api/reports/page-views-by-path?siteId=demo-site
- [ ] http://localhost:4000/api/reports/interactions-summary?siteId=demo-site
- [ ] http://localhost:4000/api/reports/scroll-depth-summary?siteId=demo-site

All reporting endpoints use `siteId=demo-site`.

More API smoke detail: [`docs/setup/dashboard-reporting-smoke.en.md`](../setup/dashboard-reporting-smoke.en.md).

---

## Generate demo events

Use the demo site at http://localhost:3001. Events are sent to `POST http://localhost:4000/api/events`.

Optional: open browser DevTools → **Network** and filter by `events` or `4000` to confirm requests return `{ "ok": true, "accepted": 1 }`.

### `page_view`

- [ ] Visit multiple routes (each navigation sends a page view):
  - `/`
  - `/features`
  - `/pricing`
  - `/contact`
  - `/thank-you`

### `click`

- [ ] Click elements that have `data-analytics-id` (for example navigation links or hero/pricing CTAs)
- [ ] Confirm clicks on form fields or elements **without** `data-analytics-id` are not tracked

### `scroll_depth`

- [ ] On a long page (home works well), scroll slowly through milestones:
  - 25%
  - 50%
  - 75%
  - 100%
- [ ] Each milestone should fire at most once per path per session

### `conversion`

Trigger the demo site's explicit conversion events:

| Action | Conversion name |
|--------|-----------------|
| Contact page → **Submit demo request** | `contact_form_submitted` |
| Pricing page → **Contact sales** | `pricing_cta_clicked` |
| Open `/thank-you` | `thank_you_page_viewed` |

More tracker detail: [`docs/setup/tracker-local-smoke.en.md`](../setup/tracker-local-smoke.en.md).

---

## Verify dashboard reports

Open http://localhost:3000 and refresh after generating events.

Check each current dashboard section:

### Overview

- [ ] Section loads (brief loading state is OK)
- [ ] Overview metric cards show numbers for page views, clicks, scroll depth events, and conversions
- [ ] If totals are zero, follow the on-page info message and generate more demo-site events

### Page views by path

- [ ] Section shows a CSS-only horizontal bar chart (no chart library)
- [ ] Table lists paths and page view counts
- [ ] Data matches visited demo-site routes

### Interactions summary

- [ ] **Top clicked elements** lists `data-analytics-id` values you clicked
- [ ] **Conversions** lists conversion names you triggered

### Scroll depth summary

- [ ] Section shows a CSS-only milestone visualization (no chart library)
- [ ] Table lists depth milestones (25%, 50%, 75%, 100%) and event counts
- [ ] Rows appear after scroll events on a long demo-site page

If any section shows an error alert, see **Troubleshooting** below before continuing.

---

## Screenshot capture checklist

Capture screenshots **manually** in your browser or OS screenshot tool. This project does not include screenshot automation (no Playwright/Cypress or similar).

Recommended captures:

- [ ] Dashboard full page (hero + status card + report sections)
- [ ] Overview metric cards (success state with numbers)
- [ ] Page views by path chart and table
- [ ] Interactions summary (clicks and conversions)
- [ ] Scroll depth visualization and table
- [ ] Demo-site page showing trackable interactions (for example nav or CTA with `data-analytics-id`)
- [ ] Optional: browser tab showing http://localhost:4000/api/health JSON
- [ ] Optional: terminal showing local services running

Store images in your own portfolio folder or `docs/` only when you are ready to commit them in a later Phase 8 task.

---

## Interview talking points

Short points you can explain while demoing:

- **Privacy-conscious analytics** — no form values, PII, cookies, `localStorage`, arbitrary DOM text, DOM snapshots, or session replay; clicks are opt-in via `data-analytics-id`; conversions are explicit from code.
- **TypeScript monorepo** — npm workspaces with shared types, validation package, tracker SDK, apps, and Prisma schema.
- **Zod validation** — events are validated at ingest before persistence.
- **Fastify API** — REST-first ingest and reporting endpoints with safe public errors.
- **Prisma/PostgreSQL** — raw events stored in `analytics_events` with query-time reporting helpers.
- **REST reporting endpoints** — four `GET /api/reports/*` routes power the dashboard.
- **Dashboard visualization** — simple CSS-only charts for page views and scroll depth; no chart library added.
- **CI and tests** — GitHub Actions runs typechecks and Vitest for analytics-core, tracker, and ingest-api.
- **Current limitations** — local-first MVP; not production SaaS; no auth, rate limiting, deployment, or date filters yet.

---

## Current limitations

Be explicit when presenting the project:

- no authentication
- no rate limiting
- no deployment yet (plan only in `docs/deployment/deployment-plan.en.md`)
- no production monitoring/logging strategy
- no date filters
- no aggregation tables or materialized views
- no background jobs
- no E2E or screenshot testing automation
- not a production SaaS

The dashboard uses **simple CSS-only charts** for some reports. It does not use a chart library.

---

## Troubleshooting

If something fails during the demo, check these in order:

### Docker / PostgreSQL

- [ ] Docker Desktop is running
- [ ] `docker compose ps` shows the postgres service up
- [ ] `npm run db:status` and `npm run db:validate` succeed if schema issues are suspected

### Ingest API

- [ ] Ingest API terminal is running
- [ ] http://localhost:4000/api/health returns `{ "ok": true, "service": "ingest-api" }`
- [ ] Restart ingest API if health fails

### Report endpoints

- [ ] Direct check: http://localhost:4000/api/reports/overview?siteId=demo-site returns HTTP 200
- [ ] If response is `{ "ok": false, ... }`, verify database connection and migrations (`npm run db:migrate`)

### Demo site and dashboard data

- [ ] Demo site is open at http://localhost:3001 and you generated `page_view`, `click`, `scroll_depth`, and `conversion` events
- [ ] Hard refresh dashboard at http://localhost:3000 after generating events
- [ ] If dashboard sections show error alerts, confirm ingest API is running (dashboard does not connect directly to PostgreSQL)

---

## Related documentation

- [`README.md`](../../README.md) — project overview and local setup commands
- [`docs/phase-8-context.md`](../phase-8-context.md) — Phase 8 portfolio polish context
- [`docs/setup/dashboard-reporting-smoke.en.md`](../setup/dashboard-reporting-smoke.en.md) — detailed reporting API and dashboard smoke steps
- [`docs/setup/tracker-local-smoke.en.md`](../setup/tracker-local-smoke.en.md) — tracker and event generation detail
- [`docs/deployment/deployment-plan.en.md`](../deployment/deployment-plan.en.md) — future deployment plan (not implemented)
