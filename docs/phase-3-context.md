# Behavior Analytics MVP — Phase 3 Cursor Context

## Purpose of This File

This file is the working context for a new Cursor Agent after **Phase 3.1 — Prisma foundation**.

Use it to understand:

- what the project is,
- what has already been completed,
- the current technical state,
- what Phase 3.1 delivered,
- what is still missing,
- what the next implementation step is,
- what Cursor should and should not touch.

---

# 1. Project Purpose

**Behavior Analytics MVP** is a portfolio / career project for a developer returning to IT.

The goal is a modern, readable, product-like behavior analytics MVP suitable for:

- GitHub
- CV and LinkedIn
- live demo
- technical interviews

The product helps teams understand website behavior: page engagement, clicks, scroll depth, traffic sources, and conversion drop-off.

Core pieces:

- **Tracker SDK** (`packages/tracker`) — browser script that sends privacy-safe events
- **Ingest API** (`apps/ingest-api`) — Fastify REST API that validates and stores events
- **Dashboard** (`apps/dashboard`) — Next.js UI for reports
- **Demo site** (`apps/demo-site`) — Next.js marketing site for SDK testing and portfolio demo

**MVP data strategy:** store raw events first; aggregate at query time first.

---

# 2. Completed Phases

## Phase 0 — Product and Planning Documentation

**Status: done.**

Docs under `docs/product`, `docs/architecture`, `docs/roadmap`, `docs/setup`.

## Phase 1 — Local Development and Repo Foundation

**Status: done.**

- npm workspaces monorepo
- `apps/dashboard`, `apps/demo-site`, `apps/ingest-api`
- Docker Compose PostgreSQL
- Fastify ingest API with `GET /api/health`
- Next.js dashboard and demo-site placeholders
- Local ports verified

## Phase 2 — Shared Contracts and Validation

**Status: done.**

| Step | Area | Result |
|------|------|--------|
| 2.1 | `packages/types` | Shared TypeScript analytics event types |
| 2.2 | `packages/analytics-core` | Zod schemas for events and ingest request |
| 2.3 | `packages/analytics-core` | Vitest validation tests started |
| 2.4 | `apps/ingest-api` | `POST /api/events` validates via `@behavior-analytics/analytics-core` |

Handoff doc: `docs/phase-2-context.md`

## Phase 3.1 — Prisma Foundation

**Status: done / repaired.**

Prisma is the chosen DB toolkit for beginner-friendly readability, portfolio clarity, and interview explainability.

## Phase 3.2 — AnalyticsEvent Prisma Model

**Status: done.**

- `AnalyticsEvent` model added to root `prisma/schema.prisma`
- Migration `20260518085508_add_analytics_event` creates `analytics_events` table
- Prisma Client regenerated at repo root
- `POST /api/events` persists validated events to `analytics_events` (Phase 3.3)

---

# 3. Current Technical State

## Fixed decisions

| Area | Choice |
|------|--------|
| Package manager | npm workspaces only |
| Repo layout | monorepo |
| Dashboard | Next.js |
| Demo site | Next.js |
| Backend | Fastify |
| Database | PostgreSQL |
| Local DB | Docker Compose |
| DB toolkit | **Prisma** |
| Contracts | TypeScript + Zod |
| API style | REST-first |
| Tests | Vitest started |
| Aggregation | query-time first |
| Out of scope for MVP | microfrontends, GraphQL |

## Repository layout (relevant paths)

```txt
behavior_analytics/
  apps/
    dashboard/
    demo-site/
    ingest-api/
  packages/
    types/
    analytics-core/
    tracker/
    config/
  prisma/
    schema.prisma          ← canonical Prisma schema (root)
  docs/
    phase-2-context.md
    phase-3-context.md     ← this file
  docker-compose.yml
  .env.example
  package.json             ← root db:* scripts
```

## Local services and ports

| Service | URL |
|---------|-----|
| Dashboard | http://localhost:3000 |
| Demo Site | http://localhost:3001 |
| Ingest API | http://localhost:4000 |
| Health | http://localhost:4000/api/health |
| Events | http://localhost:4000/api/events |
| PostgreSQL | localhost:5432 |

## Shared event types (Phase 2)

Supported `event_type` values:

- `session_start`
- `session_end`
- `page_view`
- `click`
- `scroll_depth`
- `conversion`

Ingest request shape:

```ts
{
  site_id: string
  events: AnalyticsEventPayload[]
}
```

---

# 4. Phase 3.1 — Prisma Foundation Result

## Why Prisma

Selected for:

- readable schema and migrations in a portfolio repo,
- straightforward local workflow,
- easy to explain in interviews.

## What was set up

- **Schema location:** `prisma/schema.prisma` at the **repository root** only (no app-local Prisma folder)
- **Provider:** PostgreSQL
- **Connection:** `DATABASE_URL` from project root `.env` (see `.env.example`)
- **Root scripts** in `package.json`:
  - `npm run db:validate` → `prisma validate` (run from repo root)
  - `npm run db:migrate` → `prisma migrate dev` (run from repo root)
  - `npm run db:generate` → `prisma generate` (run from repo root)
  - `npm run db:status` → `prisma migrate status` (run from repo root)
- **Prisma** and **@prisma/client** available for the monorepo (ingest-api also lists client dependency)

## Current root schema (Phase 3.2)

`AnalyticsEvent` model maps to table `analytics_events`:

- Row id: `cuid()`
- Denormalized query columns: `eventId`, `siteId`, `sessionId`, `eventType`, `timestamp`, `pageUrl`, `path`, `deviceType`
- Full validated event JSON in `payload`
- `createdAt` for ingest-time ordering
- Indexes on `siteId`, `sessionId`, `eventType`, `timestamp`, `createdAt`

Migration: `prisma/migrations/20260518085508_add_analytics_event/`

**Phase 3.3:** ingest API writes validated events to this table via Prisma.

---

# 5. Current Database Status

## Connection string

```txt
postgresql://postgres:postgres@localhost:5432/behavior_analytics
```

Copy `.env.example` to `.env` in the project root before Prisma or DB-dependent work.

## Docker PostgreSQL

```bash
docker compose up -d
docker compose ps
```

Database name: `behavior_analytics`  
User / password: `postgres` / `postgres`  
Host / port: `localhost` / `5432`

## Prisma workflow (from project root)

```bash
npm run db:validate
npm run db:migrate
npm run db:generate
```

The `analytics_events` table exists. Phase 3.3 persists validated ingest payloads into this table.

---

# 6. Current Ingest API Behavior

**App:** `apps/ingest-api`  
**Stack:** Fastify, TypeScript, `@fastify/cors`, `@behavior-analytics/analytics-core`

## `GET /api/health`

Response:

```json
{
  "ok": true,
  "service": "ingest-api"
}
```

## `POST /api/events`

- Parses body with `IngestEventsRequestSchema` from `@behavior-analytics/analytics-core`
- **Valid payload** → `200` with:

```json
{
  "ok": true,
  "accepted": 1
}
```

(`accepted` is the number of events in the request.)

- **Invalid payload** → `400` with:

```json
{
  "ok": false,
  "error": "INVALID_ANALYTICS_PAYLOAD"
}
```

## Persistence (Phase 3.3)

After Zod validation, events are saved to `analytics_events` via Prisma `createMany`.

- Success: `{ "ok": true, "accepted": number }` (unchanged shape)
- Invalid payload: `400` with `{ "ok": false, "error": "INVALID_ANALYTICS_PAYLOAD" }`
- DB failure: `500` with `{ "ok": false, "error": "EVENT_PERSISTENCE_FAILED" }` (no payload logged)

CORS allows `http://localhost:3000` and `http://localhost:3001`.

---

# 7. What Is Still Missing

## Database / backend

- [x] `AnalyticsEvent` Prisma model (Phase 3.2)
- [x] Migration for events table (`20260518085508_add_analytics_event`)
- [x] Raw event persistence in `POST /api/events` (Phase 3.3)
- [x] Prisma Client usage inside ingest-api
- [ ] Request size limits
- [ ] Rate limiting
- [ ] Auth and project/site ownership checks
- [ ] Reporting / query endpoints for dashboard

## Apps and packages

- [ ] Dashboard connected to backend data
- [ ] Tracker SDK (`packages/tracker`) integrated on demo-site
- [ ] Demo-site sending real events to ingest API
- [ ] Dashboard charts and real reports

## Operations / hardening (later)

- [ ] Production deployment choices finalized
- [ ] Structured logging without sensitive payloads
- [ ] Broader test coverage beyond started Vitest tests

---

# 8. Next Planned Step

## Phase 3.3 — Persist validated events in `POST /api/events`

**Status: done.**

## Next planned step — Phase 3.4 (suggested)

**Goal:** Harden ingest API boundaries before dashboard work.

**Candidates (pick one small task at a time):**

- request body size limit on `POST /api/events`
- graceful Prisma disconnect on server shutdown
- ingest API integration test with a test database or mocked Prisma
Do not add auth, reporting, or dashboard wiring in the same step.

---

# Privacy and Security Rules

Tracker must **not** collect:

- passwords
- raw form input values
- emails or phone numbers typed into forms
- card numbers
- personal messages or sensitive user-generated text
- full DOM snapshots
- session replay recordings

Backend principles:

- safe validation errors (no internal details leaked)
- no sensitive logging
- payload validation (done for ingest)
- request size limits, rate limiting, auth — **later**

Demo-site already uses `data-analytics-id` and `data-analytics-ignore` on relevant elements for future tracker work.

---

# Working Style for Cursor Agents

- Open Cursor at repository root: `behavior_analytics/`
- One small task per agent session
- Read this file + `docs/phase-2-context.md` before coding
- Specify files to edit and files **not** to touch
- Run verification commands after meaningful changes
- Do not commit unless the user asks

**Pattern:**

```txt
One Cursor Agent task = one small implementation step.
```

---

# How to Start the Next Agent Session

## Step 1 — Read context (no code yet)

```txt
You are working on Behavior Analytics MVP.

Before making any code changes, read:

- README.md
- docs/phase-3-context.md
- prisma/schema.prisma
- apps/ingest-api/src/server.ts
- packages/analytics-core/src/index.ts

Summarize:
1. project purpose,
2. completed phases,
3. current ingest API behavior,
4. Phase 3.1 result,
5. what Phase 3.2 should do.

Do not edit files yet.
```

## Step 2 — Phase 3.2 implementation prompt (when ready)

```txt
Task title:
Phase 3.2 — Add AnalyticsEvent Prisma model

Use docs/phase-3-context.md.

Goal:
Add the AnalyticsEvent model to prisma/schema.prisma at the repo root,
create a migration, and regenerate Prisma Client.

Edit only:
- prisma/schema.prisma
- prisma/migrations/ (via prisma migrate dev)

Do not edit:
- apps/ingest-api POST /api/events handler yet
- apps/dashboard
- apps/demo-site
- packages/tracker
- packages/types
- packages/analytics-core

Requirements:
- Model name: AnalyticsEvent (map to a clear table name if needed)
- Store fields needed for raw event persistence aligned with shared contracts
- Include indexes useful for later reporting (site_id, session_id, event_type)
- Run: npm run db:validate, npm run db:migrate, npm run db:generate

Verification:
- prisma validate passes
- migration applies cleanly
- Prisma Client generates

Summarize files changed and suggest the next task (wire POST /api/events to DB).
```

---

# Quick Reference Commands

```bash
# From project root
docker compose up -d
npm install
npm run db:validate
npm run db:migrate
npm run db:generate

npm run dev --workspace=@behavior-analytics/ingest-api
npm run dev --workspace=@behavior-analytics/dashboard
npm run dev --workspace=@behavior-analytics/demo-site
```

---

# Related Docs

- `docs/phase-2-context.md` — Phase 2 handoff
- `docs/roadmap/roadmap.en.md` — full roadmap
- `docs/architecture/architecture.en.md` — architecture
- `docs/setup/local-development.en.md` — local setup
