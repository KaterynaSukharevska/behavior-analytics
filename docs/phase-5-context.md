# Behavior Analytics MVP — Phase 5 Cursor Context

## Purpose of This File

Phase 5 handoff: **dashboard reports foundation** — read persisted events and show basic metrics.

Use this file to understand:

- what the project is and where it stands after Phases 1–4,
- current architecture and data flow,
- event types the tracker emits today,
- local commands and smoke verification,
- privacy rules and known limitations,
- recommended Phase 5 breakdown and the first implementation step (Phase 5.1).

**Human smoke checklist (tracker):** [`docs/setup/tracker-local-smoke.en.md`](setup/tracker-local-smoke.en.md)

**Prior handoffs:** [`docs/phase-4-context.md`](phase-4-context.md), [`docs/phase-3-context.md`](phase-3-context.md), [`docs/phase-2-context.md`](phase-2-context.md)

---

# Phase 5 Status — In Progress

| Step | Title | Status |
|------|-------|--------|
| 5.1 | Reporting API overview endpoint | **Done** |
| 5.2 | Dashboard API client | **Done** |
| 5.3 | Basic dashboard metrics UI | **Done** |
| 5.4a | Reporting API page views by path | **Done** |
| 5.4b | Dashboard page views by path | **Done** |
| 5.5a | Reporting API interactions summary | **Done** |
| 5.5b | Dashboard interactions summary | Not started |
| 5.6 | Scroll depth summary | Not started |
| 5.7 | Dashboard smoke docs | Not started |

**End-to-end path today (local):** demo site → tracker → ingest API → Zod validation → Prisma → PostgreSQL `analytics_events`.

**End-to-end path after Phase 5 (goal):** same ingest path **plus** dashboard → reporting API → PostgreSQL aggregates → UI metrics.

**Next recommended step:** Phase 5.5b — dashboard interactions summary UI (or Phase 5.6 scroll depth).

### Phase 5.1 — Reporting API overview (done)

**Endpoint:** `GET /api/reports/overview?siteId=<siteId>`

**Success (200):**

```json
{
  "siteId": "demo-site",
  "totals": {
    "pageViews": 0,
    "clicks": 0,
    "scrollDepthEvents": 0,
    "conversions": 0
  }
}
```

**Errors:**

| Condition | HTTP | Body |
|-----------|------|------|
| Missing or blank `siteId` | `400` | `{ "ok": false, "error": "INVALID_SITE_ID" }` |
| DB/query failure | `500` | `{ "ok": false, "error": "REPORTING_OVERVIEW_FAILED" }` |

**Implementation:** `apps/ingest-api/src/server.ts` (route) + `apps/ingest-api/src/db/get-overview-totals.ts` (Prisma `groupBy` on `eventType`).

**Verify:**

```bash
curl "http://localhost:4000/api/reports/overview?siteId=demo-site"
curl "http://localhost:4000/api/reports/overview"
curl "http://localhost:4000/api/reports/overview?siteId="
```

### Phase 5.2 — Dashboard API client (done)

**Dashboard files:**

- `apps/dashboard/src/lib/reports-config.ts` — `INGEST_API_BASE_URL` (default `http://localhost:4000`), `DEMO_SITE_ID`
- `apps/dashboard/src/lib/reports-api.ts` — typed `fetchOverviewReport()`
- `apps/dashboard/src/components/overview-report.tsx` — client component with loading / error / success UI

**Fetch flow:** dashboard home → `OverviewReport` (client) → `GET /api/reports/overview?siteId=demo-site` → shows four totals.

**Env override (optional):** `NEXT_PUBLIC_INGEST_API_URL` in `apps/dashboard/.env.local`.

**Verify:**

```bash
docker compose up -d postgres
npm run dev --workspace=@behavior-analytics/ingest-api
npm run dev --workspace=@behavior-analytics/dashboard
```

Open http://localhost:3000 — expect brief loading, then totals. Stop ingest-api and reload — expect error message, not a crash.

```bash
npm run typecheck --workspace=@behavior-analytics/dashboard
npm run typecheck --workspace=@behavior-analytics/ingest-api
```

### Phase 5.3 — Basic dashboard metrics UI (done)

**UI:** `apps/dashboard/src/components/overview-report.tsx` — metric cards, loading skeletons, friendly error and zero states.

**States:**

| State | Behavior |
|-------|----------|
| Loading | “Loading metrics…” + four skeleton cards |
| Error | Safe alert (no stack traces); suggests ingest API + refresh |
| Zero | All totals `0` → info message pointing to demo site |
| Success | Four metric cards with live API values |

**Verify:**

```bash
docker compose up -d postgres
npm run dev --workspace=@behavior-analytics/ingest-api
npm run dev --workspace=@behavior-analytics/dashboard
```

Open http://localhost:3000 — four cards with numbers. Stop ingest-api, reload — error alert only. Empty DB → zero-state message + cards showing `0`.

```bash
npm run typecheck --workspace=@behavior-analytics/dashboard
```

### Phase 5.4a — Reporting API page views by path (done)

**Endpoint:** `GET /api/reports/page-views-by-path?siteId=<siteId>`

**Success (200):**

```json
{
  "siteId": "demo-site",
  "items": [
    { "path": "/", "pageViews": 3 },
    { "path": "/pricing", "pageViews": 1 }
  ]
}
```

**Rules:** `eventType = page_view` only; group by `path`; top 10 by `pageViews` descending.

**Errors:**

| Condition | HTTP | Body |
|-----------|------|------|
| Missing or blank `siteId` | `400` | `{ "ok": false, "error": "INVALID_SITE_ID" }` |
| DB/query failure | `500` | `{ "ok": false, "error": "REPORTING_PAGE_VIEWS_BY_PATH_FAILED" }` |

**Implementation:** `apps/ingest-api/src/server.ts` + `apps/ingest-api/src/db/get-page-views-by-path.ts`.

**Verify:**

```bash
curl "http://localhost:4000/api/reports/page-views-by-path?siteId=demo-site"
curl "http://localhost:4000/api/reports/page-views-by-path"
curl "http://localhost:4000/api/reports/page-views-by-path?siteId="
npm run typecheck --workspace=@behavior-analytics/ingest-api
```

### Phase 5.4b — Dashboard page views by path (done)

**API client:** `fetchPageViewsByPathReport()` in `apps/dashboard/src/lib/reports-api.ts` (shared `fetchReport` helper with overview).

**UI:** `apps/dashboard/src/components/page-views-by-path.tsx` — table of path + page views; loading skeleton, error, empty, success states.

**Page:** `apps/dashboard/src/app/page.tsx` renders `<PageViewsByPath />` below overview metric cards.

**Verify:**

```bash
docker compose up -d postgres
npm run dev --workspace=@behavior-analytics/ingest-api
npm run dev --workspace=@behavior-analytics/dashboard
```

Open http://localhost:3000 — overview cards plus “Page views by path” table. Stop ingest-api, reload — error alert in that section only.

```bash
npm run typecheck --workspace=@behavior-analytics/dashboard
```

### Phase 5.5a — Reporting API interactions summary (done)

**Endpoint:** `GET /api/reports/interactions-summary?siteId=<siteId>`

**Success (200):**

```json
{
  "siteId": "demo-site",
  "clicks": [{ "elementId": "pricing-cta", "clicks": 2 }],
  "conversions": [{ "conversionName": "pricing_cta_clicked", "conversions": 1 }]
}
```

**Rules:**

- **Clicks:** `eventType = click`; group by `payload.element_id` (snake_case in stored JSON); ignore rows without id; top 10 by count desc.
- **Conversions:** `eventType = conversion`; group by `payload.conversion_name`; ignore rows without name; top 10 by count desc.

**Payload fields:** Full validated event JSON is stored in `analytics_events.payload` at ingest time (same field names as tracker/types: `element_id`, `conversion_name`). Aggregation is done in TypeScript after `findMany` (MVP-simple for small local datasets).

**Errors:**

| Condition | HTTP | Body |
|-----------|------|------|
| Missing or blank `siteId` | `400` | `{ "ok": false, "error": "INVALID_SITE_ID" }` |
| DB/query failure | `500` | `{ "ok": false, "error": "REPORTING_INTERACTIONS_SUMMARY_FAILED" }` |

**Implementation:** `apps/ingest-api/src/server.ts` + `apps/ingest-api/src/db/get-interactions-summary.ts`.

**Verify:**

```bash
curl "http://localhost:4000/api/reports/interactions-summary?siteId=demo-site"
curl "http://localhost:4000/api/reports/interactions-summary"
curl "http://localhost:4000/api/reports/interactions-summary?siteId="
npm run typecheck --workspace=@behavior-analytics/ingest-api
```

---

# 1. Project Summary

## What Behavior Analytics MVP Is

**Behavior Analytics MVP** is a lightweight website behavior analytics product built as a **portfolio / career project**.

It demonstrates modern frontend and full-stack workflow: a browser tracking SDK, event ingestion with validation, PostgreSQL persistence, and a Next.js dashboard — with **privacy-safe defaults** and a **fully local** development environment.

## Why It Exists

The project is designed for:

- GitHub portfolio presence
- CV and LinkedIn
- live local demo
- technical interviews (explainable architecture, TypeScript, Prisma, privacy choices)

It is **not** presented as a production SaaS with billing, auth, or hosted deployment yet.

## Portfolio / Interview Purpose

Interviewers should be able to trace:

1. **Product thinking** — what questions the MVP answers (traffic, engagement, clicks, scroll, conversions).
2. **Engineering** — monorepo, shared contracts, ingest API, DB design, tracker integration.
3. **Privacy** — what is deliberately *not* collected.
4. **Next step** — dashboard reads the same raw events the tracker already stores.

## Current Product Loop (Working Locally)

```txt
User visits demo site (localhost:3001)
  → @behavior-analytics/tracker sends events
  → POST http://localhost:4000/api/events
  → Zod validation (@behavior-analytics/analytics-core)
  → Prisma createMany → analytics_events
  → (optional) node scripts/query-demo-events.mjs
```

The **dashboard** (`localhost:3000`) is a **placeholder** — it does not read the database or show reports yet. That is Phase 5.

---

# 2. Current Architecture

## Monorepo Structure

npm workspaces monorepo at repository root:

```txt
behavior_analytics/
  apps/
    dashboard/       Next.js — reports UI (placeholder)
    demo-site/       Next.js — portfolio demo + tracker integration
    ingest-api/      Fastify — health + ingest (+ reports later)
  packages/
    tracker/         Browser SDK
    types/           Shared TypeScript event types
    analytics-core/  Zod schemas + Vitest tests
    config/          Placeholder shared config
  prisma/            Single source of truth (schema + migrations)
  scripts/           query-demo-events.mjs
  docs/              Product, setup, phase handoffs
```

## Apps

| App | Port | Role today |
|-----|------|------------|
| `apps/dashboard` | 3000 | Static placeholder home page; links to ingest health; “Reports … later” |
| `apps/demo-site` | 3001 | Marketing pages; `AnalyticsTracker` wires tracker |
| `apps/ingest-api` | 4000 | `GET /api/health`, `POST /api/events`; persists to PostgreSQL |

## Packages

| Package | Role |
|---------|------|
| `packages/types` | TypeScript contracts for all `event_type` values and ingest DTOs |
| `packages/analytics-core` | Zod validation used by ingest API; Vitest tests |
| `packages/tracker` | `init`, `trackPageView`, click/scroll listeners, `trackConversion` |

## Database

- **PostgreSQL** via Docker Compose (`localhost:5432`)
- **Prisma** at repo root: `prisma/schema.prisma`, migrations, `npm run db:*` scripts
- Table **`analytics_events`** — one row per ingested event

Connection (from `.env` / `.env.example`):

```txt
postgresql://postgres:postgres@localhost:5432/behavior_analytics
```

## Ingest Flow

1. Browser `POST /api/events` with body `{ site_id, events: [...] }`.
2. Fastify parses body (max **256 KB**).
3. `IngestEventsRequestSchema.safeParse` in `apps/ingest-api/src/server.ts`.
4. On success, `saveAnalyticsEvents()` maps each event to a row and `prisma.analyticsEvent.createMany()`.
5. Response: `{ "ok": true, "accepted": <count> }`.

**Relevant files:**

- `apps/ingest-api/src/server.ts`
- `apps/ingest-api/src/db/save-analytics-events.ts`
- `apps/ingest-api/src/db/prisma.ts`

## Tracker Flow

1. Demo site mounts `AnalyticsTracker` in root layout (`apps/demo-site/src/components/analytics-tracker.tsx`).
2. `init({ siteId: "demo-site", endpoint: "http://localhost:4000/api/events" })` — starts click + scroll listeners in the browser.
3. On App Router pathname change → `trackPageView()`.
4. Clicks on `data-analytics-id` → automatic `click` events.
5. Scroll milestones → automatic `scroll_depth` events.
6. Explicit `trackConversion(name)` from demo components and `/thank-you` route.

Transport: direct `fetch`, **one event per request** (no queue, batching, or retry).

Session id: `sessionStorage` key `behavior_analytics_session_id`.

## Dashboard Current Status

- Next.js app runs on port **3000**.
- Home page shows product intro, service status links, and note: *“Reports and analytics views will be added later.”*
- **No** API client, **no** charts, **no** live DB queries.
- CORS on ingest API already allows `http://localhost:3000` for future dashboard fetches.

---

# 3. Completed Phases

## Phase 1 — Local Foundation

**Status: done.**

- npm workspaces monorepo
- `apps/dashboard`, `apps/demo-site`, `apps/ingest-api`
- Docker Compose PostgreSQL
- Fastify ingest API with `GET /api/health`
- Next.js app shells and local ports (3000 / 3001 / 4000)

## Phase 2 — Shared Contracts and Validation

**Status: done.**

| Area | Result |
|------|--------|
| `packages/types` | Shared TypeScript analytics event types and ingest DTOs |
| `packages/analytics-core` | Zod schemas + Vitest validation tests |
| `apps/ingest-api` | `POST /api/events` validates via analytics-core |

Handoff: [`docs/phase-2-context.md`](phase-2-context.md)

## Phase 3 — Persistence

**Status: done.**

| Area | Result |
|------|--------|
| Root `prisma/schema.prisma` | `AnalyticsEvent` model → table `analytics_events` |
| Denormalized columns | `eventId`, `siteId`, `sessionId`, `eventType`, `timestamp`, `pageUrl`, `path`, `deviceType` |
| Full payload | `payload` JSON column with complete validated event |
| Ingest | `createMany` after Zod validation |
| Body limit | 256 KB → `413` + `PAYLOAD_TOO_LARGE` |
| Shutdown | `prisma.$disconnect()` on Fastify `onClose` |

Handoff: [`docs/phase-3-context.md`](phase-3-context.md)

## Phase 4 — Tracker SDK and Demo Integration

**Status: done.**

| Step | Result |
|------|--------|
| 4.1 | Tracker foundation: `init`, `trackPageView`, session, transport |
| 4.2 | Demo-site `AnalyticsTracker` + route-based `page_view` |
| 4.3 | Click tracking (`data-analytics-id` only) |
| 4.4 | Scroll depth milestones 25 / 50 / 75 / 100 (once per path) |
| 4.5 | Conversion events on demo site |
| 4.6 | [`docs/setup/tracker-local-smoke.en.md`](setup/tracker-local-smoke.en.md) |

Handoff: [`docs/phase-4-context.md`](phase-4-context.md)

---

# 4. Current Event Types (Tracker Emits Four)

Contracts in `packages/types` also define `session_start` and `session_end`, but the **tracker does not emit them yet**.

## `page_view`

| Topic | Detail |
|-------|--------|
| **Generated where** | `trackPageView()` in `packages/tracker`; called from `apps/demo-site/src/components/analytics-tracker.tsx` on every `usePathname()` change |
| **Safe data sent** | `event_id`, `site_id`, `session_id`, `timestamp`, `page_url`, `path`, `device_type` (from user agent); optional `referrer`, UTM fields, viewport size if provided |
| **Not sent** | Form values, DOM text, cookies, arbitrary element content |
| **Verify** | Navigate `/`, `/features`, `/pricing`, `/contact`, `/thank-you` → Network `POST /api/events` with `event_type: "page_view"`; `node scripts/query-demo-events.mjs page_view` |

## `click`

| Topic | Detail |
|-------|--------|
| **Generated where** | `startClickTracking()` (auto from `init()`) in `packages/tracker/src/click-tracking.ts` |
| **Safe data sent** | Only when click target resolves to `data-analytics-id` (walk up from target); `element_tag`, `element_id` (from attribute), pointer `x`/`y` and `normalized_x`/`normalized_y`; page URL/path; session and device metadata |
| **Not sent** | `element_text_short`, `element_classes`, form values, cookies, arbitrary DOM text |
| **Skipped when** | Inside `data-analytics-ignore`, `data-private`, or sensitive inputs (`input`, `textarea`, `select`, password fields) |
| **Verify** | Click nav/CTAs with `data-analytics-id` on demo site → Network `click` payloads; `node scripts/query-demo-events.mjs click` — check `payload.element_id`, no PII |

## `scroll_depth`

| Topic | Detail |
|-------|--------|
| **Generated where** | `startScrollTracking()` (auto from `init()`) in `packages/tracker/src/scroll-tracking.ts` |
| **Safe data sent** | `depth_percent` as milestone only (**25, 50, 75, 100**); scroll position math from `window` / `documentElement` — no DOM text |
| **Behavior** | Throttled (200 ms); each milestone at most once per `pathname`; resets on path change |
| **Verify** | Scroll home page slowly → up to four POSTs; `node scripts/query-demo-events.mjs scroll_depth` — `payload.depth_percent` in `25|50|75|100` |

## `conversion`

| Topic | Detail |
|-------|--------|
| **Generated where** | `trackConversion(name)` in `packages/tracker/src/conversion-tracking.ts`; demo wiring in contact form actions, pricing CTA link, and `AnalyticsTracker` on `/thank-you` |
| **Safe data sent** | Explicit `conversion_name` string; optional numeric `conversion_value` only |
| **Demo conversion names** | `contact_form_submitted`, `pricing_cta_clicked`, `thank_you_page_viewed` (constants in `apps/demo-site/src/lib/conversion-names.ts`) |
| **Not sent** | Names, emails, messages, cookies, `localStorage` contents |
| **Verify** | Contact submit button, pricing “Contact sales”, visit `/thank-you`; `node scripts/query-demo-events.mjs conversion` |

---

# 5. Current Database State

## Prisma Is the DB Toolkit

- Schema and migrations live at **repo root** `prisma/`.
- Generate client: `npm run db:generate`
- Migrate: `npm run db:migrate`
- Validate: `npm run db:validate`

Legacy `apps/ingest-api/prisma` was removed; do not recreate it.

## PostgreSQL Is the Local Database

Started with:

```bash
docker compose up -d
```

## `analytics_events` Stores Validated Raw Events

Prisma model `AnalyticsEvent` (table `analytics_events`):

| Column | Purpose |
|--------|---------|
| `id` | Row id (`cuid`) |
| `eventId` | Client `event_id` |
| `siteId` | `site_id` (e.g. `demo-site`) |
| `sessionId` | Tracker session |
| `eventType` | e.g. `page_view`, `click` |
| `timestamp` | Event time from payload |
| `pageUrl`, `path`, `deviceType` | Denormalized for filtering/reporting |
| `payload` | **Full validated event JSON** |
| `createdAt` | Ingest time |

**Design:** common query fields are duplicated as columns; the complete event remains in `payload` for richer Phase 5 queries (e.g. `conversion_name`, `depth_percent`, `element_id`).

Indexes exist on `siteId`, `sessionId`, `eventType`, `timestamp`, `createdAt`.

---

# 6. Current Local Commands

From repository root unless noted.

## Install

```bash
npm install
```

Copy `.env.example` → `.env` before Prisma or ingest-api work.

## Start Database

```bash
docker compose up -d
docker compose ps
```

## Start Ingest API

```bash
npm run dev --workspace=@behavior-analytics/ingest-api
```

Health: http://localhost:4000/api/health

## Start Demo Site

```bash
npm run dev --workspace=@behavior-analytics/demo-site
```

URL: http://localhost:3001

## Start Dashboard

```bash
npm run dev --workspace=@behavior-analytics/dashboard
```

URL: http://localhost:3000 (placeholder UI only)

## Typecheck / Tests

Root `package.json` scripts for `test` and `typecheck` are still placeholders. Use **per-workspace** commands:

```bash
npm run typecheck --workspace=@behavior-analytics/ingest-api
npm run typecheck --workspace=@behavior-analytics/tracker
npm run typecheck --workspace=@behavior-analytics/dashboard
npm run typecheck --workspace=@behavior-analytics/analytics-core
npm run test --workspace=@behavior-analytics/analytics-core
```

## Prisma

```bash
npm run db:validate
npm run db:migrate
npm run db:generate
npm run db:status
```

## Query Demo Events Script

Requires DB running and events ingested:

```bash
node scripts/query-demo-events.mjs
node scripts/query-demo-events.mjs page_view
node scripts/query-demo-events.mjs click
node scripts/query-demo-events.mjs scroll_depth
node scripts/query-demo-events.mjs conversion
```

Alternative: `npx prisma studio` → table `analytics_events`.

---

# 7. Tracker Smoke Verification

Full checklist: [`docs/setup/tracker-local-smoke.en.md`](setup/tracker-local-smoke.en.md)

## Browser (Network Tab)

1. Start DB + ingest API + demo site.
2. Open http://localhost:3001 → DevTools → **Network** → filter `events` or port `4000`.
3. **Page views:** visit all main routes → each `POST http://localhost:4000/api/events` → `{ "ok": true, "accepted": 1 }`.
4. **Clicks:** click elements with `data-analytics-id`.
5. **Scroll:** scroll home page → up to four `scroll_depth` requests (25 → 100).
6. **Conversions:** contact submit, pricing CTA, `/thank-you`.

Optional debug: `NEXT_PUBLIC_BA_TRACKER_DEBUG=1` in `apps/demo-site/.env.local`.

## Database Queries

```bash
node scripts/query-demo-events.mjs
node scripts/query-demo-events.mjs page_view
node scripts/query-demo-events.mjs click
node scripts/query-demo-events.mjs scroll_depth
node scripts/query-demo-events.mjs conversion
```

Confirm `siteId: "demo-site"`, matching `eventType`, safe `payload` (no form values or PII).

---

# 8. Privacy / Security Principles

The tracker **does not** collect:

- form field values
- names, emails, phone numbers, or message text typed by users
- cookies
- `localStorage` contents (session id uses **`sessionStorage`** only, key `behavior_analytics_session_id`)
- arbitrary DOM text or `innerHTML`
- DOM snapshots
- session replay data

**Additional MVP rules:**

- **Clicks** — only elements with `data-analytics-id`; ignores `data-analytics-ignore`, `data-private`, and sensitive form controls.
- **Conversions** — explicit business event names in code only; never raw form reads.
- **Scroll** — depth milestones from scroll metrics only; not a continuous stream of content.

Ingest API does **not** log request bodies.

---

# 9. Current Limitations

| Area | State |
|------|--------|
| Dashboard reports | Overview cards + page views by path table; no charts or click/conversion breakdowns yet |
| Reporting API | Overview totals only (`GET /api/reports/overview`); no path breakdowns or date filters yet |
| Auth | None |
| Rate limiting | None on ingest |
| Production deployment | Local workflow only; no hosting docs |
| Offline / retry / batching | Direct `fetch`, one event per POST |
| `session_start` / `session_end` | In types/schemas; **not emitted** by tracker |
| Charts | None |
| Date range filters | None |
| Real-time updates | None |
| Background aggregation / materialized views | None |

---

# 10. Recommended Phase 5 — Dashboard Reports Foundation

**Phase 5 title:** Dashboard Reports Foundation

Goal: read `analytics_events` from PostgreSQL and expose **simple aggregates** to the dashboard — without changing the tracker or ingest contract for the first slice.

## Recommended Split

| Step | Title | Summary |
|------|-------|---------|
| **5.1** | Reporting API overview endpoint | `GET /api/reports/overview?siteId=demo-site` — totals by event type |
| **5.2** | Dashboard API client | Fetch helper in `apps/dashboard` (env-based ingest URL) |
| **5.3** | Basic dashboard metrics UI | Show overview totals on dashboard home |
| **5.4** | Page views by path | Group `page_view` by `path` |
| **5.5** | Clicks and conversions summary | Counts / top `element_id` / conversion names |
| **5.6** | Scroll depth summary | Milestone distribution from `scroll_depth` payloads |
| **5.7** | Dashboard smoke docs | Local verify: API + UI + sample data |

**Working style:** one small Cursor task per sub-step; do not combine auth, charts library, or production deploy in the same task.

---

# 11. Phase 5.1 — Reporting API Overview Endpoint (Complete)

## Reporting API Overview Endpoint

**Status: done.** Implemented in ingest-api.

**Goal (met):** Read `analytics_events` from PostgreSQL and return basic totals for a given `siteId`.

**Suggested endpoint:**

```http
GET /api/reports/overview?siteId=demo-site
```

**Suggested response:**

```json
{
  "siteId": "demo-site",
  "totals": {
    "pageViews": 0,
    "clicks": 0,
    "scrollDepthEvents": 0,
    "conversions": 0
  }
}
```

**Implementation hints (MVP-simple):**

- Add route in `apps/ingest-api` (same Fastify app that already has Prisma).
- Query with `prisma.analyticsEvent.count` or `groupBy` on `eventType` filtered by `siteId`.
- Map DB `eventType` values: `page_view`, `click`, `scroll_depth`, `conversion`.
- Return `400` if `siteId` missing; no auth for local MVP.
- Keep CORS allowing dashboard origin `http://localhost:3000`.

**Files likely touched:**

- `apps/ingest-api/src/server.ts` (or new `src/routes/reports.ts` + register)
- New small module e.g. `apps/ingest-api/src/db/get-overview-totals.ts`

**Files to avoid in 5.1:**

- `packages/tracker/**`
- `apps/demo-site/**`
- `apps/dashboard/**` (dashboard comes in 5.2–5.3)
- `prisma/schema.prisma` (no schema change needed for counts)
- `packages/types` / `packages/analytics-core` (unless adding a shared response type is desired later)

**Verification:**

1. Ingest demo events via demo site smoke.
2. `curl "http://localhost:4000/api/reports/overview?siteId=demo-site"` — totals match DB counts.
3. `npm run typecheck --workspace=@behavior-analytics/ingest-api`

---

# 12. Out of Scope for Phase 5.1

Do **not** implement in Phase 5.1:

- dashboard charts or new chart libraries
- auth or user accounts
- complex date-range filters
- real-time updates (SSE / WebSockets)
- materialized views or background aggregation jobs
- GraphQL
- microfrontends
- production deployment or hosting

---

# Working Style for Cursor Agents

- Open Cursor at repository root: `behavior_analytics/`
- Read this file plus [`docs/phase-4-context.md`](phase-4-context.md) before coding Phase 5
- One sub-step per session (e.g. only 5.1)
- State files to edit and files **not** to touch in the task prompt
- Do not commit unless the user asks
- Do not claim production readiness — local MVP only

**Pattern:**

```txt
One Cursor Agent task = one Phase 5 sub-step (5.1, 5.2, …).
```

---

# How to Start the Next Agent Session (Phase 5.1)

## Step 1 — Read context (no code yet)

```txt
You are working on Behavior Analytics MVP — Phase 5.

Before making any code changes, read:

- README.md
- docs/phase-5-context.md
- docs/phase-4-context.md
- apps/ingest-api/src/server.ts
- apps/ingest-api/src/db/save-analytics-events.ts
- prisma/schema.prisma

Summarize:
1. current ingest and DB state,
2. what Phase 5.1 should deliver,
3. suggested endpoint and response shape,
4. files to edit vs avoid,
5. how to verify locally.

Do not edit files yet.
```

## Step 2 — Phase 5.1 implementation prompt

```txt
Task title:
Phase 5.1 — Reporting API overview endpoint

Use docs/phase-5-context.md.

Goal:
Add GET /api/reports/overview?siteId=demo-site to apps/ingest-api.
Read analytics_events via Prisma and return totals:
pageViews, clicks, scrollDepthEvents, conversions.

Edit only:
- apps/ingest-api/**

Do not edit:
- packages/tracker
- apps/demo-site
- apps/dashboard
- prisma/schema.prisma
- packages/types
- packages/analytics-core

Keep MVP-simple: counts only, no date filters, no auth.

Verification:
- curl the endpoint after demo-site smoke
- npm run typecheck --workspace=@behavior-analytics/ingest-api

Summarize files changed and suggest Phase 5.2 (dashboard API client).
```

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
| PostgreSQL | localhost:5432 |

---

# Related Docs

- [`docs/setup/tracker-local-smoke.en.md`](setup/tracker-local-smoke.en.md) — tracker smoke (still valid before dashboard work)
- [`docs/setup/local-development.en.md`](setup/local-development.en.md) — general local setup (note: Section 2 status text may be outdated)
- [`docs/phase-4-context.md`](phase-4-context.md) — Phase 4 complete handoff
- [`docs/roadmap/roadmap.en.md`](roadmap/roadmap.en.md) — full roadmap
- [`docs/architecture/architecture.en.md`](architecture/architecture.en.md) — architecture
