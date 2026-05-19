# Behavior Analytics MVP — Phase 4 Cursor Context

## Purpose of This File

This file is the working context for a new Cursor Agent **before starting Phase 4 — Tracker SDK and demo-site integration**.

Use it to understand:

- what the project is,
- what backend phases are already complete,
- current ingest API and database persistence behavior,
- current demo-site and tracker package state,
- privacy and security rules for the tracker,
- Phase 4 goals and breakdown,
- the exact next implementation step.

**Do not implement tracker code while only reading this file.**

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
- **Tracker SDK is not integrated yet** — no events sent to ingest API

## Tracker package (`packages/tracker`)

- Package directory exists in the monorepo
- **SDK foundation is not implemented yet** (no `init()`, queue, transport, or event helpers)
- Demo site does not depend on or load the tracker yet

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
| **4.1** | Tracker SDK foundation | `init()`, `siteId` + `endpoint` config, session id storage, event queue, batching, `fetch` transport, `page_view` helper |
| **4.2** | Demo-site tracker integration | Initialize tracker in demo-site; send `page_view` on route/page load; point at local ingest API; verify row in PostgreSQL |
| **4.3** | Click tracking | Safe click listener; prefer `data-analytics-id`; ignore `data-analytics-ignore`, form fields, passwords; no raw input values |
| **4.4** | Scroll depth | Milestone or max-depth events; avoid noisy spam |
| **4.5** | Conversion events | CTA / form submit / thank-you conversions with explicit safe names |
| **4.6** | Tracker docs and smoke checklist | Local setup, privacy rules, manual verification steps |

**Working style:** one small Cursor task per step; do not combine dashboard, auth, or reporting work.

---

# 9. Exact Next Planned Step

## Phase 4.1 — Tracker SDK foundation

**Status: not started.**

**Goal:** Implement the minimal browser SDK in `packages/tracker` so a host app can call `init({ siteId, endpoint })` and enqueue/send batched events, starting with a `page_view` helper.

**Suggested deliverables:**

- `init(config)` with `siteId` and `endpoint` (ingest URL, e.g. `http://localhost:4000/api/events`)
- Session id generation and persistence (e.g. `sessionStorage`)
- In-memory event queue with simple batching
- `fetch` transport posting the shared ingest request shape
- `trackPageView()` or equivalent aligned with `page_view` contract
- Package build/export suitable for demo-site import

**Do not do in Phase 4.1:**

- Demo-site wiring (Phase 4.2)
- Click, scroll, or conversion listeners (Phases 4.3–4.5)
- Dashboard, auth, rate limits, or Prisma changes

**Files likely to touch (4.1 only):**

- `packages/tracker/**` (new implementation)
- Possibly `packages/tracker/package.json` if missing

**Files not to touch (4.1):**

- `apps/demo-site`
- `apps/ingest-api`
- `apps/dashboard`
- `prisma/schema.prisma`
- `packages/types` / `packages/analytics-core` unless a tiny shared export is strictly required (prefer reusing existing contracts as-is)

**Verification after 4.1:**

- Tracker can be built/imported in isolation
- Unit or manual test that a batched payload matches Zod ingest shape (optional but helpful)
- No requirement to hit PostgreSQL until Phase 4.2

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

- `docs/phase-3-context.md` — Phase 3 handoff (Prisma, persistence, body limit)
- `docs/phase-2-context.md` — Phase 2 handoff (types, Zod, validation)
- `docs/roadmap/roadmap.en.md` — full roadmap
- `docs/architecture/architecture.en.md` — architecture
- `docs/setup/local-development.en.md` — local setup
