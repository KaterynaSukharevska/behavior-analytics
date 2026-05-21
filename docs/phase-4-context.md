# Behavior Analytics MVP — Phase 4 Cursor Context

## Purpose of This File

Phase 4 handoff: **tracker SDK, demo-site integration, and local smoke testing**.

Use this file to understand:

- Phase 4 status (complete),
- tracker capabilities and public API,
- local run and verification steps,
- privacy rules and known limitations,
- the recommended next phase.

**Portfolio-friendly smoke checklist:** [`docs/setup/tracker-local-smoke.en.md`](setup/tracker-local-smoke.en.md)

---

# Phase 4 Status — Complete

| Step | Title | Status |
|------|-------|--------|
| 4.1 | Tracker SDK foundation | Done |
| 4.2 | Demo-site integration | Done |
| 4.3 | Click tracking | Done |
| 4.4 | Scroll depth | Done |
| 4.5 | Conversion events | Done |
| 4.6 | Tracker docs and smoke checklist | Done |

**End-to-end path (local):** demo site → ingest API → PostgreSQL `analytics_events`.

**Next recommended phase:** Phase 5 — dashboard reports (read persisted events; no new tracker features required for a first slice).

---

# 1. Project Purpose

**Behavior Analytics MVP** is a portfolio / career project for a developer returning to IT.

The goal is a modern, readable, product-like behavior analytics MVP suitable for:

- GitHub
- CV and LinkedIn
- live demo
- technical interviews

**Product one-liner:**

> A lightweight behavior analytics tool for websites that helps teams understand page engagement, click behavior, scroll depth, traffic sources, and conversion drop-off.

**Core MVP parts:**

| Part | Location | Role |
|------|----------|------|
| Tracker SDK | `packages/tracker` | Browser script that sends privacy-safe events |
| Ingest API | `apps/ingest-api` | Fastify REST API that validates and stores events |
| Database | PostgreSQL + Prisma | Raw event storage |
| Dashboard | `apps/dashboard` | Next.js UI for reports (later) |
| Demo site | `apps/demo-site` | Next.js marketing site for SDK testing and portfolio demo |

**MVP data strategy:** store raw events first; aggregate at query time first.

**Fixed technical decisions:**

- npm workspaces monorepo only
- Dashboard and demo site: Next.js
- Backend: Fastify
- Database: PostgreSQL (local via Docker Compose)
- DB toolkit: Prisma (root `prisma/` is the only source of truth)
- Shared contracts: TypeScript + Zod
- API style: REST-first
- Tests: Vitest started in `packages/analytics-core`
- Out of scope for MVP: microfrontends, GraphQL, session replay, auth, rate limiting (for now)

---

# 2. Completed Backend Phases

## Phase 0 — Product and Planning Documentation

**Status: done.**

Docs under `docs/product`, `docs/architecture`, `docs/roadmap`, `docs/setup`.

## Phase 1 — Local Development and Repo Foundation

**Status: done.**

- npm workspaces monorepo
- `apps/dashboard`, `apps/demo-site`, `apps/ingest-api`
- Docker Compose PostgreSQL
- Fastify ingest API with `GET /api/health`
- Next.js dashboard and demo-site foundations
- GitHub repo pushed

Handoff: repo structure and local ports verified.

## Phase 2 — Shared Contracts and Validation

**Status: done.**

| Step | Area | Result |
|------|------|--------|
| 2.1 | `packages/types` | Shared TypeScript analytics event types |
| 2.2 | `packages/analytics-core` | Zod schemas for events and ingest request |
| 2.3 | `packages/analytics-core` | Vitest validation tests |
| 2.4 | `apps/ingest-api` | `POST /api/events` validates via `@behavior-analytics/analytics-core` |

Handoff doc: `docs/phase-2-context.md`

## Phase 3 — Raw Event Persistence

**Status: mostly done** (backend ready for tracker integration).

| Step | Area | Result |
|------|------|--------|
| 3.1 | Prisma foundation | Root `prisma/schema.prisma`, PostgreSQL, `DATABASE_URL` from `.env`; legacy `apps/ingest-api/prisma` removed |
| 3.2 | `AnalyticsEvent` model | Table `analytics_events` with denormalized columns + `payload` JSON |
| 3.3 | Persist validated events | `createMany` after Zod validation in `POST /api/events` |
| 3.4 | Request body size limit | **256 KB**; oversized → `413` + `PAYLOAD_TOO_LARGE` |

Handoff doc: `docs/phase-3-context.md`

**Optional cleanup (non-blocking for Phase 4):** graceful `prisma.$disconnect()` on Fastify shutdown. May already be wired in `apps/ingest-api/src/server.ts`; only revisit if local shutdown causes issues.

**Not in scope yet:** dashboard reports, auth, rate limiting, reporting/query endpoints.

---

# 3. Current Ingest API Behavior

**App:** `apps/ingest-api`  
**Stack:** Fastify, TypeScript, `@fastify/cors`, `@behavior-analytics/analytics-core`

**Local base URL:** http://localhost:4000

## `GET /api/health`

Response:

```json
{
  "ok": true,
  "service": "ingest-api"
}
```

## `POST /api/events`

**Flow:**

1. Request received; body parsed by Fastify (max **256 KB**).
2. Payload validated with Zod from `@behavior-analytics/analytics-core`.
3. Valid events saved to PostgreSQL via Prisma `createMany`.
4. Response returns accepted count.

**Responses:**

| Condition | HTTP | Body |
|-----------|------|------|
| Valid payload | `200` | `{ "ok": true, "accepted": number }` |
| Invalid Zod payload | `400` | `{ "ok": false, "error": "INVALID_ANALYTICS_PAYLOAD" }` |
| Body &gt; 256 KB | `413` | `{ "ok": false, "error": "PAYLOAD_TOO_LARGE" }` |
| DB failure | `500` | `{ "ok": false, "error": "EVENT_PERSISTENCE_FAILED" }` |

**Operational notes:**

- API stays alive after oversized requests.
- Request bodies are **not** logged.
- CORS allows `http://localhost:3000` (dashboard) and `http://localhost:3001` (demo site).

**Relevant source files:**

- `apps/ingest-api/src/server.ts`
- `apps/ingest-api/src/db/prisma.ts`
- `apps/ingest-api/src/db/save-analytics-events.ts`

---

# 4. Current Database Persistence Behavior

## Connection

```txt
postgresql://postgres:postgres@localhost:5432/behavior_analytics
```

Copy `.env.example` to `.env` at the repository root before Prisma or ingest-api work.

## `AnalyticsEvent` model (Prisma)

Stores:

- `id` — row id (`cuid`)
- `eventId`, `siteId`, `sessionId`, `eventType`, `timestamp`
- `pageUrl`, `path`, `deviceType`
- `payload` — full validated event JSON
- `createdAt` — ingest time

**Design:** common query fields are duplicated as columns; the full validated raw event lives in `payload` for later dashboard/report queries.

## Persistence on ingest

After Zod validation, `saveAnalyticsEvents()` maps each event to a row and calls `prisma.analyticsEvent.createMany()`.

**Prisma workflow (from repo root):**

```bash
docker compose up -d
npm run db:validate
npm run db:migrate
npm run db:generate
```

---

# 5. Current Demo-Site and Tracker State

## Demo site (`apps/demo-site`)

- Next.js app on **http://localhost:3001**
- Pages: `/`, `/features`, `/pricing`, `/contact`, `/thank-you`
- CTAs and navigation suitable for analytics demos
- Useful attributes already on key elements:
  - `data-analytics-id` on important CTAs and nav links
  - `data-analytics-ignore` on form fields
- **Tracker integrated** (Phase 4.2): `AnalyticsTracker` client component in root layout
- `init({ siteId: "demo-site", endpoint: "http://localhost:4000/api/events" })`
- `trackPageView()` on App Router pathname changes (`/`, `/features`, `/pricing`, `/contact`, `/thank-you`)
- Optional debug: set `NEXT_PUBLIC_BA_TRACKER_DEBUG=1` for `console.debug` page_view logs

## Tracker package (`packages/tracker`)

- **`init({ siteId, endpoint })` and `trackPageView()` implemented** (Phase 4.1)
- Session id in `sessionStorage` (`behavior_analytics_session_id`)
- Direct `fetch` to ingest endpoint; no queue, batching, retry, or offline support yet
- Internal imports use extensionless paths for Next.js bundler compatibility
- **Click tracking** (Phase 4.3): `startClickTracking()` runs automatically from `init()`; only elements with `data-analytics-id` are tracked
- **Scroll depth** (Phase 4.4): `startScrollTracking()` runs automatically from `init()`; milestones 25/50/75/100 once per path
- **Conversions** (Phase 4.5): `trackConversion(name)` — explicit names only; no form values

## Other apps

- **Dashboard** (`apps/dashboard`): foundation only; **no reports wired to DB yet**
- Phase 4 does **not** include dashboard work

## Local services (quick reference)

| Service | URL |
|---------|-----|
| Dashboard | http://localhost:3000 |
| Demo site | http://localhost:3001 |
| Ingest API | http://localhost:4000 |
| Health | http://localhost:4000/api/health |
| Events | http://localhost:4000/api/events |
| PostgreSQL | localhost:5432 |

## Shared ingest contract (for tracker authors)

Supported `event_type` values (from Phase 2):

- `session_start`, `session_end`, `page_view`, `click`, `scroll_depth`, `conversion`

Ingest request shape:

```ts
{
  site_id: string
  events: AnalyticsEventPayload[]
}
```

Align tracker payloads with `packages/types` and `packages/analytics-core` schemas.

---

# 6. Privacy and Security Rules for the Tracker

The tracker must **not** collect:

- passwords
- raw form input values
- emails typed into forms
- phone numbers typed into forms
- card numbers
- personal messages
- sensitive user-generated text
- full DOM snapshots
- session replay recordings

The tracker **must** respect:

- `input[type="password"]` — ignored
- form fields — ignored by default
- `data-private`
- `data-analytics-ignore`
- `data-analytics-id` — preferred safe identifier for clicks/CTAs
- selector denylist — later
- sanitized and shortened element text — later

**Click tracking behavior (Phase 4.3):**

- Document-level `click` listener attached once after `init()` in the browser
- Events are sent only when the click target resolves to an element with `data-analytics-id` (walk up from `event.target`)
- Clicks are skipped when the target is inside `data-analytics-ignore`, `data-private`, or sensitive tags (`input`, `textarea`, `select`, `option`, password inputs)
- Payload includes: `element_tag`, `element_id` (from `data-analytics-id`), `x` / `y` / `normalized_x` / `normalized_y`
- Payload does **not** include: `element_text_short`, `element_classes`, form values, cookies, or arbitrary DOM text

**Scroll depth behavior (Phase 4.4):**

- `window` `scroll` listener (passive) with 200ms throttle
- Depth from `scrollY` and `documentElement` scroll metrics only (no DOM text or element content)
- Milestones: **25, 50, 75, 100** — each sent at most once per `pathname`
- Milestone state resets when `window.location.pathname` changes
- `depth_percent` in payload is the milestone value (25/50/75/100), not a continuous stream

**Conversion behavior (Phase 4.5):**

- Public API: `trackConversion(conversionName, optionalData?)` — caller supplies an explicit safe name
- Optional `conversion_value` number only; no user text or form fields
- Demo-site conversion names:
  - `contact_form_submitted` — contact page “Submit demo request” button (no form data read)
  - `pricing_cta_clicked` — pricing hero “Contact sales” CTA
  - `thank_you_page_viewed` — fired when `/thank-you` route loads
- Payload does **not** include: names, emails, messages, cookies, or `localStorage`

**Implementation discipline for Phase 4:**

- Capture only safe metadata (ids, paths, coarse device type, etc.).
- Never send raw input values or full DOM trees.
- Keep batching and retry logic simple for MVP.

---

# 7. Phase 4 Goal

**Build the tracker SDK foundation and connect it to the demo site** so real analytics events flow from the browser → ingest API → PostgreSQL.

**In scope for Phase 4:**

- Tracker `init()`, config, session, queue, batching, transport
- Demo-site integration and manual smoke verification
- Click, scroll depth, and conversion events (incrementally)
- Tracker setup docs and privacy checklist

**Explicitly out of scope for Phase 4:**

- Dashboard reports and charts
- Auth and site ownership
- Rate limiting
- AI insights
- Session replay or DOM snapshots
- Over-engineered batching/retry/backoff

---

# 8. Recommended Phase 4 Breakdown

| Step | Title | Summary |
|------|-------|---------|
| **4.1** | Tracker SDK foundation | **Done** — `init()`, `siteId` + `endpoint`, session id storage, `fetch` transport, `trackPageView()` |
| **4.2** | Demo-site tracker integration | **Done** — `AnalyticsTracker` in layout; `page_view` on route change; local ingest endpoint |
| **4.3** | Click tracking | **Done** — auto `startClickTracking()` on `init()`; `data-analytics-id` required; privacy ignores |
| **4.4** | Scroll depth | **Done** — milestones 25/50/75/100; once per path; throttled scroll handler |
| **4.5** | Conversion events | **Done** — `trackConversion()`; demo-site contact/pricing/thank-you |
| **4.6** | Tracker docs and smoke checklist | **Done** — [`docs/setup/tracker-local-smoke.en.md`](setup/tracker-local-smoke.en.md) |

**Working style:** one small Cursor task per step; do not combine dashboard, auth, or reporting work.

---

# 9. Exact Next Planned Step

## Phase 4.1 — Tracker SDK foundation

**Status: done.**

**Delivered:**

- `init({ siteId, endpoint })` and `trackPageView(optionalData?)` in `packages/tracker`
- Session id via `sessionStorage` key `behavior_analytics_session_id` (`crypto.randomUUID()` with fallback)
- `POST` ingest body: `{ site_id, events: [ page_view event ] }` per `@behavior-analytics/types` / analytics-core contract
- Device type from `navigator.userAgent` only (no DOM text or form reads)
- Direct `fetch`, no queue/batch/retry yet

**Verification after 4.1:**

- `npm run typecheck --workspace=@behavior-analytics/tracker` passes
- End-to-end DB check waits for Phase 4.2 (demo-site integration)

---

## Phase 4.2 — Demo-site tracker integration

**Status: done.**

**Delivered:**

- `apps/demo-site/src/components/analytics-tracker.tsx` — client-only `init` + `trackPageView` on `usePathname()` changes
- `apps/demo-site/src/lib/tracker-config.ts` — `demo-site` site id and local ingest URL
- Root layout mounts `<AnalyticsTracker />` (no visible UI)
- `apps/demo-site/next.config.ts` — `transpilePackages` for workspace tracker/types

**Local verification (manual):**

1. `docker compose up -d`
2. `npm run dev --workspace=@behavior-analytics/ingest-api`
3. `npm run dev --workspace=@behavior-analytics/demo-site`
4. Open each route: `/`, `/features`, `/pricing`, `/contact`, `/thank-you`
5. Browser **Network** tab: `POST http://localhost:4000/api/events` → `{ "ok": true, "accepted": 1 }`
6. Database: `node scripts/query-demo-events.mjs` (from repo root) or Prisma Studio

**Optional debug:** `NEXT_PUBLIC_BA_TRACKER_DEBUG=1` in `.env.local` for console logs (no UI).

---

## Phase 4.3 — Click tracking

**Status: done.**

**Delivered:**

- `packages/tracker/src/click-privacy.ts` — ignore rules and `data-analytics-id` target resolution
- `packages/tracker/src/click-tracking.ts` — document listener + `click` ingest payload
- `init()` calls `startClickTracking()` in the browser (also exported for manual use)
- Demo-site CTAs/nav already use `data-analytics-id`; form fields use `data-analytics-ignore`

**Local verification (manual):**

1. Start DB, ingest API, and demo site (same as Phase 4.2)
2. Open http://localhost:3001 and click nav links / hero CTAs / pricing CTAs
3. Network: `POST /api/events` with `{ "ok": true, "accepted": 1 }` per click
4. Database: `node scripts/query-demo-events.mjs click` — rows with `eventType: "click"`, `payload.element_id` set, no form values in payload

---

## Phase 4.4 — Scroll depth

**Status: done.**

**Delivered:**

- `packages/tracker/src/scroll-tracking.ts` — throttled scroll listener, milestone logic, ingest send
- `init()` calls `startScrollTracking()` in the browser (also exported manually)
- Anti-spam: each milestone once per path; reset on pathname change

**Local verification (manual):**

1. Start DB, ingest API, demo site (same as prior phases)
2. Open http://localhost:3001 and scroll slowly through the home page
3. Network: up to four `POST /api/events` for milestones 25 → 50 → 75 → 100 (`accepted: 1` each)
4. Database: `node scripts/query-demo-events.mjs scroll_depth` — `payload.depth_percent` in `25|50|75|100`; no duplicate milestones for the same path in one session

---

## Phase 4.5 — Conversion events

**Status: done.**

**Delivered:**

- `packages/tracker/src/conversion-tracking.ts` — `trackConversion(conversionName, optionalData?)`
- `apps/demo-site/src/lib/conversion-names.ts` — shared conversion name constants
- Contact: `ContactFormActions` — `contact_form_submitted` on submit button (no form reads)
- Pricing: `ConversionLink` on primary “Contact sales” — `pricing_cta_clicked`
- Thank-you: `AnalyticsTracker` — `thank_you_page_viewed` on `/thank-you`

**Local verification (manual):**

1. Start DB, ingest API, demo site
2. Contact → click **Submit demo request** → Network `POST` with `conversion_name: "contact_form_submitted"`
3. Pricing → click **Contact sales** → `pricing_cta_clicked`
4. Open `/thank-you` → `thank_you_page_viewed`
5. Database: `node scripts/query-demo-events.mjs conversion` — verify `payload.conversion_name`; no PII fields

---

## Phase 4.6 — Tracker docs and smoke checklist

**Status: done.**

**Delivered:** [`docs/setup/tracker-local-smoke.en.md`](setup/tracker-local-smoke.en.md) (setup, browser/DB smoke, privacy, limitations). This file updated with consolidated Phase 4 status.

---

# 10. Local Run and Smoke Checklist

## Startup (three terminals, repo root)

```bash
docker compose up -d
npm run dev --workspace=@behavior-analytics/ingest-api
npm run dev --workspace=@behavior-analytics/demo-site
```

| Service | URL |
|---------|-----|
| Demo site | http://localhost:3001 |
| Ingest API | http://localhost:4000/api/events |
| Health | http://localhost:4000/api/health |

## Browser smoke

1. Open http://localhost:3001
2. **Navigate** — `/`, `/features`, `/pricing`, `/contact`, `/thank-you` → `page_view` POSTs
3. **Click** nav / CTAs with `data-analytics-id` → `click` POSTs
4. **Scroll** home page → up to four `scroll_depth` POSTs (25, 50, 75, 100)
5. **Convert** — contact Submit demo request; pricing Contact sales; visit `/thank-you`
6. **Network tab** — each `POST /api/events` → `{ "ok": true, "accepted": 1 }`

Optional: `NEXT_PUBLIC_BA_TRACKER_DEBUG=1` in `apps/demo-site/.env.local`.

## Database smoke

```bash
node scripts/query-demo-events.mjs
node scripts/query-demo-events.mjs page_view
node scripts/query-demo-events.mjs click
node scripts/query-demo-events.mjs scroll_depth
node scripts/query-demo-events.mjs conversion
```

Verify `siteId: "demo-site"`, correct `eventType`, safe `payload` (no form values or PII).

---

# 11. Tracker Public API (Summary)

| Function | Role |
|----------|------|
| `init({ siteId, endpoint })` | Config; starts click + scroll listeners in browser |
| `trackPageView(optionalData?)` | Send `page_view` |
| `trackConversion(name, optionalData?)` | Send explicit `conversion` |
| `startClickTracking()` | Manual start (also called by `init`) |
| `startScrollTracking()` | Manual start (also called by `init`) |

Package: `packages/tracker`. Demo integration: `apps/demo-site/src/components/analytics-tracker.tsx`.

---

# 12. Known Limitations (MVP)

- **No dashboard reports** — `apps/dashboard` is a placeholder
- **No reporting/query API** for the dashboard
- **No auth** or per-site API keys
- **No rate limiting** on ingest
- **No offline queue or retry** — direct `fetch`, one event per request
- **No production deployment** docs or hosting setup yet
- **No** session replay, heatmaps, or DOM snapshots
- **`session_start` / `session_end`** — in contracts; not emitted by tracker yet

---

# Working Style for Cursor Agents

- Open Cursor at repository root: `behavior_analytics/`
- Read this file plus `docs/phase-3-context.md` and `docs/phase-2-context.md` before coding
- One small task per session (e.g. only 4.1)
- State files to edit and files **not** to touch in the task prompt
- Do not commit unless the user asks

**Pattern:**

```txt
One Cursor Agent task = one Phase 4 sub-step (4.1, 4.2, …).
```

---

# How to Start the Next Agent Session

## Step 1 — Read context (no code yet)

```txt
You are working on Behavior Analytics MVP.

Before making any code changes, read:

- README.md
- docs/phase-4-context.md
- docs/phase-3-context.md
- packages/types (analytics event types)
- packages/analytics-core (Zod schemas)
- apps/ingest-api/src/server.ts

Summarize:
1. project purpose,
2. completed backend phases,
3. current ingest API behavior,
4. current database persistence behavior,
5. current demo-site state,
6. privacy rules for the tracker,
7. Phase 4 goal and breakdown,
8. what Phase 4.1 should do.

Do not edit files yet.
```

## Step 2 — Phase 4.1 implementation prompt (when ready)

```txt
Task title:
Phase 4.1 — Tracker SDK foundation

Use docs/phase-4-context.md.

Goal:
Implement the minimal tracker SDK in packages/tracker:
- init({ siteId, endpoint })
- session id generation/storage
- basic event queue and batching
- fetch transport to POST /api/events
- page_view event helper

Edit only:
- packages/tracker/**

Do not edit:
- apps/demo-site
- apps/ingest-api
- apps/dashboard
- prisma/schema.prisma
- packages/types
- packages/analytics-core

Keep MVP-simple: no click/scroll/conversion yet, no over-engineered retry logic.

Verification:
- package builds or typechecks
- payload shape matches existing ingest contract

Summarize files changed and suggest Phase 4.2 (demo-site integration).
```

---

# Quick Reference Commands

```bash
# From project root
docker compose up -d
npm install
npm run db:validate
npm run db:generate

npm run dev --workspace=@behavior-analytics/ingest-api
npm run dev --workspace=@behavior-analytics/demo-site
npm run dev --workspace=@behavior-analytics/dashboard
```

---

# Related Docs

- [`docs/setup/tracker-local-smoke.en.md`](setup/tracker-local-smoke.en.md) — tracker smoke checklist (primary for humans)
- `docs/phase-3-context.md` — Phase 3 handoff (Prisma, persistence, body limit)
- `docs/phase-2-context.md` — Phase 2 handoff (types, Zod, validation)
- `docs/roadmap/roadmap.en.md` — full roadmap
- `docs/architecture/architecture.en.md` — architecture
- `docs/setup/local-development.en.md` — general local setup
