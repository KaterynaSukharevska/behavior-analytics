# Behavior Analytics MVP — Deployment Plan

## Purpose

This document is a practical future deployment plan for the Behavior Analytics MVP.

Deployment is **not implemented yet**. The project is still local-first and should not be described as production-ready.

The goal of this plan is to make the next deployment step clear without adding infrastructure, config files, packages, or production claims too early.

---

## 1. Current Local Architecture

The current MVP runs locally with this product loop:

```txt
demo-site
  -> @behavior-analytics/tracker
  -> Fastify ingest API
  -> Zod validation
  -> Prisma
  -> PostgreSQL analytics_events
  -> reporting API endpoints
  -> dashboard API clients
  -> dashboard UI
```

Current pieces:

- `apps/dashboard` — Next.js dashboard at `http://localhost:3000`
- `apps/demo-site` — Next.js demo site at `http://localhost:3001`
- `apps/ingest-api` — Fastify ingest/reporting API at `http://localhost:4000`
- `packages/tracker` — browser tracker SDK used by the demo site
- `packages/analytics-core` — Zod schemas for runtime validation
- `packages/types` — shared TypeScript event contracts
- `prisma/schema.prisma` — Prisma source of truth for PostgreSQL
- PostgreSQL — local Docker Compose database

Communication is REST-first:

- tracker sends `POST /api/events`
- dashboard reads `GET /api/reports/*`
- dashboard does not connect directly to PostgreSQL

---

## 2. Recommended Simple Deployment Path

Use a small, beginner-friendly deployment split:

| Part | Suggested hosting direction |
|------|-----------------------------|
| Dashboard | Vercel |
| Demo site | Vercel |
| Ingest API | Render, Railway, or Fly.io |
| PostgreSQL | Managed PostgreSQL from the API host or a dedicated provider |

This is only a suggested path. Do not implement all options at once.

Recommended first deployment attempt:

1. Managed PostgreSQL
2. Ingest API
3. Dashboard
4. Demo site

This order keeps the core data path easy to verify before adding the UI surfaces.

### Important Current Gap

The dashboard already supports `NEXT_PUBLIC_INGEST_API_URL`.

The demo site currently uses a hard-coded tracker endpoint:

```txt
http://localhost:4000/api/events
```

Before deploying the demo site, make the tracker endpoint configurable with a public environment variable such as `NEXT_PUBLIC_TRACKER_ENDPOINT` or equivalent. That should be a small future implementation task, not part of this planning document.

---

## 3. Required Environment Variables

Current variables used by the project:

| Variable | Used by | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | Prisma / ingest API | PostgreSQL connection string |
| `INGEST_API_PORT` | ingest API | Local API port, defaults to `4000` |
| `NEXT_PUBLIC_INGEST_API_URL` | dashboard | Public base URL for reporting API calls |
| `NEXT_PUBLIC_BA_TRACKER_DEBUG` | demo site | Optional local debug logging for tracker events |

Current `.env.example` includes:

```txt
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/behavior_analytics
DASHBOARD_PORT=3000
DEMO_SITE_PORT=3001
INGEST_API_PORT=4000
POSTGRES_DB=behavior_analytics
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432
```

Deployment-specific notes:

- Production/staging `DATABASE_URL` must come from the managed PostgreSQL provider.
- Hosted platforms often provide `PORT`; the ingest API currently reads `INGEST_API_PORT`, so confirm host compatibility before deployment.
- Dashboard deployment should set `NEXT_PUBLIC_INGEST_API_URL` to the deployed ingest API origin.
- Demo-site deployment needs a future public tracker endpoint variable before it can send events to a deployed ingest API.
- Do not commit real production secrets.

---

## 4. Deployment Order

### Step 1 — Create Managed PostgreSQL

- Create a managed PostgreSQL database.
- Copy the provider connection string.
- Store it as `DATABASE_URL` for the ingest API deployment environment.
- Confirm SSL requirements from the provider.

### Step 2 — Run Prisma Migrations

Run migrations against the managed database before sending traffic.

Current local script:

```bash
npm run db:migrate
```

For production-like deployment, prefer a controlled migration command from the deployment platform or CI later. Do not run migrations casually against production data.

### Step 3 — Deploy Ingest API

Deploy `apps/ingest-api` to a Node-capable host such as Render, Railway, or Fly.io.

Expected commands from package scripts:

```bash
npm run build --workspace=@behavior-analytics/ingest-api
npm run start --workspace=@behavior-analytics/ingest-api
```

Set:

```txt
DATABASE_URL=<managed-postgres-url>
INGEST_API_PORT=<platform-compatible-port-if-needed>
```

Then verify:

```http
GET https://<ingest-api-host>/api/health
```

Expected response:

```json
{ "ok": true, "service": "ingest-api" }
```

### Step 4 — Deploy Dashboard

Deploy `apps/dashboard` to Vercel or another Next.js host.

Set:

```txt
NEXT_PUBLIC_INGEST_API_URL=https://<ingest-api-host>
```

Expected package scripts:

```bash
npm run build --workspace=@behavior-analytics/dashboard
npm run start --workspace=@behavior-analytics/dashboard
```

The dashboard should load reports from the deployed ingest API. It should show safe empty states before demo data exists.

### Step 5 — Deploy Demo Site

Deploy `apps/demo-site` after the tracker endpoint is made configurable.

Expected package scripts:

```bash
npm run build --workspace=@behavior-analytics/demo-site
npm run start --workspace=@behavior-analytics/demo-site
```

After deployment, verify the demo site sends events to the deployed ingest API, not to localhost.

### Step 6 — Verify End-to-End Flow

Confirm:

```txt
deployed demo-site
  -> deployed ingest API
  -> managed PostgreSQL
  -> deployed dashboard reports
```

---

## 5. Deployment Smoke Checklist

Use this after any first deployment attempt.

### API Health

- Open `https://<ingest-api-host>/api/health`
- Expect `{ "ok": true, "service": "ingest-api" }`

### Demo Site Events

Use browser DevTools Network tab on the deployed demo site.

- Visit the demo site home page.
- Confirm a `page_view` request is sent to the deployed ingest API.
- Click an element with `data-analytics-id`.
- Confirm a `click` event is sent.
- Scroll a long page.
- Confirm `scroll_depth` events are sent for valid milestones.
- Trigger a conversion:
  - contact form submit action
  - pricing CTA
  - thank-you page view
- Confirm `conversion` events use expected explicit names.

### Database Persistence

Check the managed database or run a safe read-only query.

Confirm rows exist in `analytics_events` with:

- `siteId = demo-site`
- event types `page_view`, `click`, `scroll_depth`, and `conversion`
- no form values, emails, message text, cookies, DOM text, or session replay data in `payload`

### Reporting API

Call:

```http
GET /api/reports/overview?siteId=demo-site
GET /api/reports/page-views-by-path?siteId=demo-site
GET /api/reports/interactions-summary?siteId=demo-site
GET /api/reports/scroll-depth-summary?siteId=demo-site
```

Confirm each response is HTTP 200 and matches the current local response shape.

### Dashboard Reports

Open the deployed dashboard and verify:

- overview metric cards load
- page views by path loads
- interactions summary loads
- scroll depth summary loads
- empty states appear safely if no data exists yet
- stopping or breaking the API shows safe dashboard errors, not raw stack traces

---

## 6. Risks And Future Hardening

The current MVP is not production-ready. Before a real public launch, address:

- no authentication yet
- no API keys or site ownership checks yet
- no rate limiting on ingest yet
- no hardened production CORS policy yet
- no retention policy for analytics events yet
- no aggregation tables or materialized views yet
- no monitoring/logging strategy yet
- no CI/CD pipeline yet
- no formal backup/restore plan documented yet
- no environment-specific configuration validation yet

Suggested future hardening order:

1. Make demo-site tracker endpoint configurable.
2. Add production CORS configuration.
3. Add site keys or simple auth for ingest.
4. Add rate limiting.
5. Add retention policy.
6. Add CI checks for tests, typechecks, and Prisma validation.
7. Add basic monitoring/logging.

---

## 7. Not Implemented Yet

This document is a plan only.

It does not add:

- deployment config files
- hosting provider setup
- Docker production images
- CI/CD workflows
- auth
- rate limiting
- charts
- date filters
- production CORS hardening
- monitoring

Do not claim the project is deployed or production-ready until the deployment has actually been implemented and verified.

---

## Related Documentation

- [`../README.md`](../README.md)
- [`../phase-6-context.md`](../phase-6-context.md)
- [`../architecture/architecture.en.md`](../architecture/architecture.en.md)
- [`../architecture/data-flow.en.md`](../architecture/data-flow.en.md)
- [`../architecture/privacy-security.en.md`](../architecture/privacy-security.en.md)
- [`../setup/dashboard-reporting-smoke.en.md`](../setup/dashboard-reporting-smoke.en.md)
- [`../setup/tracker-local-smoke.en.md`](../setup/tracker-local-smoke.en.md)
