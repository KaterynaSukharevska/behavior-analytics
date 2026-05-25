# Behavior Analytics MVP — Phase 6 Cursor Context

## Purpose of This File

Phase 6 handoff: **polish, tests, and portfolio readiness**.

Use this file to understand:

- what the project is and where it stands after Phases 1–5;
- what Phase 6 is for;
- what Phase 6.1, 6.2, and 6.3 completed;
- which files matter for the next testing work;
- the recommended order for the remaining Phase 6 milestones.

---

# Phase 6 Status

| Step | Title | Status |
|------|-------|--------|
| 6.1 | Reporting helpers tests | **Done** |
| 6.2 | Reporting endpoint tests | **Done** |
| 6.3 | Tracker privacy tests / review | **Done** |
| 6.4 | Dashboard UI polish | Recommended next |
| 6.5 | README / portfolio packaging | Not started |
| 6.6 | Deployment planning | Not started |

**Best immediate next task:** Phase 6.4 — Dashboard UI polish.

---

# 1. Project Summary

**Behavior Analytics MVP** is a lightweight website behavior analytics product built as a **portfolio / career project** for demonstrating modern frontend and full-stack engineering.

Current local product loop:

```txt
demo-site
  → @behavior-analytics/tracker
  → Fastify ingest API
  → Zod validation
  → Prisma
  → PostgreSQL analytics_events
  → reporting API endpoints
  → dashboard API clients
  → dashboard UI
```

The project is intentionally local-first and portfolio-friendly. It is not presented as a production SaaS yet.

---

# 2. Current Stack

- npm workspaces
- Next.js dashboard
- Next.js demo-site
- Fastify ingest API
- PostgreSQL via Docker Compose
- Prisma
- TypeScript
- Zod
- Vitest
- REST-first APIs
- No GraphQL
- No microfrontends

---

# 3. Completed Phases 1–5

## Phase 1 — Local Foundation

- npm workspaces monorepo
- Docker PostgreSQL
- Fastify ingest API
- Next.js dashboard
- Next.js demo-site
- GitHub repository and local app ports

## Phase 2 — Shared Contracts and Validation

- Shared TypeScript analytics event types
- Zod schemas in `packages/analytics-core`
- Supported event types: `session_start`, `session_end`, `page_view`, `click`, `scroll_depth`, `conversion`
- Analytics-core Vitest coverage for schema validation

## Phase 3 — PostgreSQL Persistence

- Root `prisma/schema.prisma` is the database source of truth
- `analytics_events` table stores duplicated query columns plus full validated payload JSON
- `POST /api/events` validates payloads and persists valid events
- Safe ingest errors and 256 KB body limit

## Phase 4 — Tracker SDK and Demo Site

- Tracker public API: `init`, `trackPageView`, `startClickTracking`, `startScrollTracking`, `trackConversion`
- Demo site emits `page_view`, `click`, `scroll_depth`, and `conversion`
- Privacy rules prevent form values, PII, cookies, storage contents, arbitrary DOM text, DOM snapshots, and session replay data from being collected

## Phase 5 — Dashboard Reports Foundation

- Reporting API endpoints:
  - `GET /api/reports/overview?siteId=demo-site`
  - `GET /api/reports/page-views-by-path?siteId=demo-site`
  - `GET /api/reports/interactions-summary?siteId=demo-site`
  - `GET /api/reports/scroll-depth-summary?siteId=demo-site`
- Dashboard report clients and UI sections for overview metrics, page views by path, top clicked elements, conversions, and scroll depth summary
- Each dashboard section supports loading, error, empty, and success states
- Dashboard reporting smoke documentation added

---

# 4. Phase 6 Purpose

Phase 6 should strengthen the existing MVP rather than add a large new feature.

Focus areas:

- polish
- tests
- portfolio readiness
- documentation readiness
- deployment planning later

The project should remain beginner-readable and explainable in interviews. Phase 6 should make the current implementation easier to trust, run, and present.

---

# 5. Phase 6.1 Completed Status

Phase 6.1 added focused tests for the reporting aggregation helpers.

Files changed in Phase 6.1:

- `apps/ingest-api/src/db/reports.test.ts` added
- `apps/ingest-api/package.json` updated with a `test` script
- `apps/ingest-api/package.json` updated with a Vitest dev dependency for the ingest API workspace
- `package-lock.json` minimally updated for the ingest API Vitest declaration

Test coverage added:

- overview totals mapping/defaults
- page views by path sorting and top 10 behavior
- interactions grouping by safe payload fields
- skipping unsafe empty or non-string interaction payload fields
- scroll depth valid milestone counting
- scroll depth sorting by milestone

The tests mock `prisma.analyticsEvent`, so they do not require a running PostgreSQL database.

---

# 6. Phase 6.2 Completed Status

Phase 6.2 added endpoint-level tests for the reporting API routes.

Endpoint tests were added for:

- `GET /api/reports/overview`
- `GET /api/reports/page-views-by-path`
- `GET /api/reports/interactions-summary`
- `GET /api/reports/scroll-depth-summary`

Test coverage added:

- valid `siteId` returns `200`
- response shapes match the current dashboard/API clients
- empty or no matching data returns safe empty/default responses
- missing or blank `siteId` returns `{ "ok": false, "error": "INVALID_SITE_ID" }`
- reporting helper failures return safe `500` errors without exposing stack traces, Prisma internals, or raw internal errors
- route handlers call the existing reporting helper functions instead of duplicating aggregation logic

Small testability refactor:

- `apps/ingest-api/src/app.ts` now exposes `buildApp()` for Fastify `app.inject()` tests
- `apps/ingest-api/src/server.ts` remains the runtime entrypoint that creates the app and listens on the configured port

Phase 6.2 verification result: **2 test files, 18 tests passing**.

---

# 7. Phase 6.3 Completed Status

Phase 6.3 added focused privacy tests for the tracker SDK.

Files changed in Phase 6.3:

- `packages/tracker/src/privacy.test.ts` added
- `packages/tracker/package.json` updated with a tracker test script and Vitest dev dependency
- `package-lock.json` updated for the tracker Vitest declaration

Tracker privacy tests were added for:

- click tracking sends `data-analytics-id` without DOM text
- `data-analytics-ignore` is ignored
- `data-private` is ignored
- inputs, textareas, and selects are ignored
- payloads do not include form values
- payloads do not include cookies
- payloads do not include `localStorage` data
- conversions send explicit names and safe optional metadata only
- page views do not collect arbitrary page text

Review result:

- no privacy issue was found
- no tracker runtime/source behavior was changed

Phase 6.3 verification result: **1 test file, 8 tests passing**.

---

# 8. Verified Commands

Phase 6.1 and 6.2 ingest API verification:

```bash
npm run test -w @behavior-analytics/ingest-api
npm run typecheck -w @behavior-analytics/ingest-api
```

Both commands passed after the Phase 6.2 changes.

Phase 6.3 tracker verification:

```bash
npm run test -w @behavior-analytics/tracker
npm run typecheck -w @behavior-analytics/tracker
```

Both commands passed after the Phase 6.3 changes.

---

# 9. Current Important Files

## Reporting Helpers

- `apps/ingest-api/src/db/get-overview-totals.ts`
- `apps/ingest-api/src/db/get-page-views-by-path.ts`
- `apps/ingest-api/src/db/get-interactions-summary.ts`
- `apps/ingest-api/src/db/get-scroll-depth-summary.ts`

## Reporting Tests

- `apps/ingest-api/src/db/reports.test.ts`
- `apps/ingest-api/src/reports-routes.test.ts`

## Tracker Privacy Tests

- `packages/tracker/src/privacy.test.ts`

## Fastify Server and Routes

- `apps/ingest-api/src/app.ts`
- `apps/ingest-api/src/server.ts`
- `apps/ingest-api/src/db/save-analytics-events.ts`
- `apps/ingest-api/src/db/prisma.ts`

Current reporting routes live in `apps/ingest-api/src/app.ts` through `buildApp()`. Route handlers validate `siteId`, call small DB helper functions, and return safe public errors. `apps/ingest-api/src/server.ts` remains the runtime entrypoint.

## Dashboard Report Clients and Components

- `apps/dashboard/src/lib/reports-config.ts`
- `apps/dashboard/src/lib/reports-api.ts`
- `apps/dashboard/src/components/overview-report.tsx`
- `apps/dashboard/src/components/page-views-by-path.tsx`
- `apps/dashboard/src/components/interactions-summary.tsx`
- `apps/dashboard/src/components/scroll-depth-summary.tsx`
- `apps/dashboard/src/app/page.tsx`
- `apps/dashboard/src/app/globals.css`

## Documentation

- `README.md`
- `docs/README.md`
- `docs/phase-5-context.md`
- `docs/phase-6-context.md`
- `docs/setup/dashboard-reporting-smoke.en.md`
- `docs/architecture/architecture.en.md`
- `docs/architecture/data-flow.en.md`
- `docs/architecture/api-conventions.en.md`
- `docs/architecture/frontend-conventions.en.md`
- `docs/architecture/css-conventions.en.md`
- `docs/architecture/privacy-security.en.md`
- `docs/architecture/testing-strategy.en.md`
- `docs/architecture/project-decisions.en.md`

---

# 10. Recommended Next Phase 6 Order

1. **6.4 — Dashboard UI polish**
2. **6.5 — README / portfolio packaging**
3. **6.6 — Deployment planning**

Keep each milestone small. Do not combine endpoint tests, tracker privacy review, dashboard polish, and deployment planning in one task.

---

# 11. Best Immediate Next Task

**Phase 6.4 — Dashboard UI polish.**

Recommended scope:

- improve dashboard visual polish without introducing a new styling framework
- preserve existing report sections and API clients
- keep loading, error, empty, and success states for every reporting section
- avoid charts unless explicitly requested
- keep the UI beginner-readable and portfolio-friendly

Phase 6.4 should improve presentation quality while keeping the current plain CSS architecture.

---

# 12. Guardrails

Do **not** start these yet unless explicitly requested:

- charts
- auth
- deployment
- date filters
- aggregation tables or materialized views
- background jobs
- batching or offline retry
- GraphQL
- microfrontends
- broad rewrites
- enterprise architecture

Also avoid adding dependencies unless there is a clear, small testing need that cannot be solved with existing tools.

---

# 13. Project Philosophy

- Keep phases small.
- One Cursor task = one small milestone.
- Prefer beginner-readable, portfolio-friendly code.
- Avoid overengineering.
- Document actual implementation, not aspirational architecture.
- Prefer focused tests and clear handoffs.
- Keep route handlers thin and DB/reporting logic in small helper functions.
- Preserve the privacy-first tracker posture.
- Use REST-first APIs; do not introduce GraphQL.

---

# Quick Reference

| Service | URL |
|---------|-----|
| Dashboard | http://localhost:3000 |
| Demo site | http://localhost:3001 |
| Ingest API | http://localhost:4000 |
| Health | http://localhost:4000/api/health |
| Events | http://localhost:4000/api/events |
| Reports overview | http://localhost:4000/api/reports/overview?siteId=demo-site |
| Page views by path | http://localhost:4000/api/reports/page-views-by-path?siteId=demo-site |
| Interactions summary | http://localhost:4000/api/reports/interactions-summary?siteId=demo-site |
| Scroll depth summary | http://localhost:4000/api/reports/scroll-depth-summary?siteId=demo-site |
| PostgreSQL | localhost:5432 |
