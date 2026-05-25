# Behavior Analytics MVP — Phase 6 Cursor Context

## Purpose of This File

Phase 6 handoff: **polish, tests, and portfolio readiness**.

Use this file to understand:

- what the project is and where it stands after Phases 1–5;
- what Phase 6 is for;
- what Phase 6 completed;
- which files matter for future work;
- recommended options for Phase 7.

---

# Phase 6 Status

| Step | Title | Status |
|------|-------|--------|
| 6.1 | Reporting helpers tests | **Done** |
| 6.2 | Reporting endpoint tests | **Done** |
| 6.3 | Tracker privacy tests / review | **Done** |
| 6.4 | Dashboard UI polish | **Done** |
| 6.5 | README / portfolio packaging | **Done** |
| 6.6 | Deployment planning | **Done** |

**Phase 6 final status:** **Complete.**

**Recommended next phase:** Phase 7 should be chosen deliberately based on the portfolio goal.

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

# 8. Phase 6.4 Completed Status

Phase 6.4 polished the dashboard UI without adding new product features.

Files changed in Phase 6.4:

- `apps/dashboard/src/app/page.tsx` updated
- `apps/dashboard/src/app/globals.css` updated
- dashboard report components polished:
  - `apps/dashboard/src/components/overview-report.tsx`
  - `apps/dashboard/src/components/page-views-by-path.tsx`
  - `apps/dashboard/src/components/interactions-summary.tsx`
  - `apps/dashboard/src/components/scroll-depth-summary.tsx`

UI improvements included:

- refined page hero and subtitle
- improved local status cards
- better responsive page width
- consistent report card styling
- improved spacing, shadows, and section labels
- clearer metric helper text
- formatted metric values
- improved table/list readability
- horizontal overflow handling
- preserved loading, error, empty, and success states

Scope confirmation:

- no backend changes
- no tracker changes
- no reporting API changes
- no dependency changes
- no auth
- no charts
- no date filters

Phase 6.4 verification:

- `npm run typecheck -w @behavior-analytics/dashboard` passed
- no dashboard test script exists
- `apps/dashboard/tsconfig.tsbuildinfo` was generated by typecheck and removed

---

# 9. Phase 6.5 Completed Status

Phase 6.5 improved the main README and portfolio-facing documentation.

Files changed in Phase 6.5:

- `README.md` updated
- `docs/README.md` updated

README improvements included:

- clearer project summary and purpose
- current product flow
- current tech stack
- current features
- privacy principles
- local URLs and setup
- important test/typecheck commands
- current limitations
- useful documentation links

Scope confirmation:

- no source changes
- no test changes
- no dependency changes
- no production/deployment claims

---

# 10. Phase 6.6 Completed Status

Phase 6.6 added a practical deployment planning document without implementing deployment.

Files changed in Phase 6.6:

- `docs/deployment/deployment-plan.en.md` added
- `docs/README.md` updated with a deployment plan link

Deployment plan sections include:

- current local architecture
- recommended simple deployment path
- required environment variables
- deployment order
- deployment smoke checklist
- risks and future hardening
- clear "not implemented yet" scope note

Scope confirmation:

- no deployment config files added
- no source changes
- no test changes
- no dependency changes
- deployment is still not implemented
- production readiness is not claimed

---

# 11. Phase 6 Final Summary

Phase 6 strengthened the MVP without adding large new product features.

Completed work:

- **6.1 Reporting helper tests** — added focused tests for overview totals, page views by path, interactions summary, and scroll depth summary helpers.
- **6.2 Reporting endpoint tests** — added Fastify endpoint tests for the four reporting API routes and extracted `buildApp()` for testability.
- **6.3 Tracker privacy tests** — added focused tracker tests for click privacy, ignored/private/form elements, safe conversions, page views, and absence of sensitive data in payloads.
- **6.4 Dashboard UI polish** — improved dashboard presentation, spacing, status cards, metric cards, tables, responsive behavior, and preserved all loading/error/empty/success states.
- **6.5 README / portfolio packaging** — updated the root README and docs index to explain the current MVP, local workflow, privacy posture, tests, limitations, and useful docs.
- **6.6 Deployment planning** — added a future deployment plan without implementing deployment or claiming production readiness.

---

# 12. Current Verification Commands

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

Phase 6.4 dashboard verification:

```bash
npm run typecheck -w @behavior-analytics/dashboard
```

This command passed after the Phase 6.4 changes. The dashboard package currently has no test script.

Additional useful checks:

```bash
npm run db:validate
npm run db:status
```

---

# 13. Current Portfolio Strengths

The project is now strong as a portfolio MVP because it demonstrates:

- privacy-conscious tracker behavior
- validated event ingestion with Zod
- persisted analytics events in PostgreSQL
- reporting API endpoints over raw events
- polished dashboard UI with real report data
- focused reporting helper tests
- focused reporting endpoint tests
- focused tracker privacy tests
- clear README and documentation index
- practical deployment plan
- REST-first architecture
- beginner-readable TypeScript structure

---

# 14. Current Limitations

Current limitations remain explicit and intentional:

- no auth
- no rate limiting
- no deployed environment yet
- no charts
- no date filters
- no CI/CD
- no aggregation tables or materialized views
- no background jobs
- no batching/offline retry
- no production CORS hardening
- no retention policy
- `session_start` and `session_end` are supported by shared types/schemas but are not emitted by the tracker yet

---

# 15. Current Important Files

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
- `docs/deployment/deployment-plan.en.md`
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

# 16. Recommended Phase 7 Options

Phase 7 should be chosen deliberately. Good options:

| Option | Focus | Why choose it |
|--------|-------|---------------|
| A | Screenshots / demo polish | Best if the next goal is GitHub, CV, LinkedIn, or interview presentation |
| B | Simple charts | Best if the dashboard should feel more like an analytics product, but keep scope small |
| C | Basic CI | Best if the next goal is engineering reliability and automated checks |
| D | Actual deployment | Best if a live demo URL is the top priority |
| E | Auth / rate-limiting hardening | Best if moving toward production-like behavior |

Recommended default: **Phase 7A — screenshots / demo polish** or **Phase 7C — basic CI**.

Choose **actual deployment** only after accepting the extra setup work called out in `docs/deployment/deployment-plan.en.md`, especially making the demo-site tracker endpoint configurable.

---

# 17. Guardrails

Do **not** start these unless explicitly selected for Phase 7:

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

---

# 18. Project Philosophy

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
