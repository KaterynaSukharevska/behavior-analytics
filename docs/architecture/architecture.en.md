# Behavior Analytics MVP — Current Technical Architecture

This document describes the current implementation after Phase 5. It is a technical overview for contributors, reviewers, and future Cursor agents.

The project is a local-first portfolio MVP. It is not a production SaaS yet.

---

## Current System

Behavior Analytics MVP has a working local reporting loop:

```txt
demo-site
  -> @behavior-analytics/tracker
  -> ingest-api
  -> Zod validation
  -> Prisma
  -> PostgreSQL analytics_events
  -> reporting API endpoints
  -> dashboard API clients
  -> dashboard UI
```

The implemented product slice collects safe behavior analytics events from a demo website, stores validated raw events, and shows basic reports in a dashboard.

---

## Tech Stack

| Area | Current choice |
|------|----------------|
| Repository | npm workspaces monorepo |
| Language | TypeScript |
| Dashboard | Next.js, React |
| Demo site | Next.js, React |
| Backend | Fastify |
| Runtime validation | Zod via `packages/analytics-core` |
| Shared contracts | TypeScript via `packages/types` |
| Database | PostgreSQL |
| DB access | Prisma |
| Local infrastructure | Docker Compose |
| Tests | Vitest in `packages/analytics-core`; typechecks per workspace |

The project does **not** currently use Tailwind CSS, TanStack Query, Recharts, GraphQL, or microfrontends.

---

## Why a Monorepo

The monorepo keeps the MVP easy to understand and run locally:

- apps and shared packages live in one repository;
- tracker, ingest API, dashboard, and contracts can evolve together;
- shared TypeScript/Zod contracts reduce drift between browser, backend, and dashboard;
- one `npm install` prepares the local workspace.

This is intentionally simpler than a multi-repository or microfrontend setup.

---

## Apps

### `apps/demo-site`

The demo site is a Next.js marketing-style website used to generate analytics events.

Responsibilities:

- run locally at http://localhost:3001;
- mount the tracker in the app layout;
- generate `page_view` events on route changes;
- provide tracked links and CTAs with `data-analytics-id`;
- trigger explicit conversion events;
- provide form fields marked with `data-analytics-ignore` where appropriate.

The demo site is a portfolio/demo surface, not a customer application.

### `apps/ingest-api`

The ingest API is a Fastify backend running locally at http://localhost:4000.

Responsibilities:

- `GET /api/health`;
- `POST /api/events` for validated analytics ingestion;
- reporting endpoints under `GET /api/reports/*`;
- query parameter validation for report requests;
- persistence and reporting reads through Prisma;
- safe public error responses.

Route handlers should stay thin. Database and reporting logic should live in small helpers under `apps/ingest-api/src/db`.

### `apps/dashboard`

The dashboard is a Next.js app running locally at http://localhost:3000.

Current sections:

- overview metric cards;
- page views by path;
- top clicked elements;
- conversions;
- scroll depth summary.

The dashboard does not access the database directly. It calls HTTP reporting endpoints exposed by the ingest API.

---

## Packages

### `packages/types`

Shared TypeScript analytics event types and ingest DTOs.

Supported event types:

- `session_start`;
- `session_end`;
- `page_view`;
- `click`;
- `scroll_depth`;
- `conversion`.

The tracker currently emits `page_view`, `click`, `scroll_depth`, and `conversion`. `session_start` and `session_end` are supported by contracts but not emitted yet.

### `packages/analytics-core`

Zod schemas for runtime validation of analytics events and ingest payloads.

Used by `apps/ingest-api` before storing events.

### `packages/tracker`

Browser tracker SDK used by the demo site.

Responsibilities:

- initialize site id and ingest endpoint;
- manage session id in `sessionStorage`;
- send events with `fetch`;
- emit page view, click, scroll depth, and conversion events;
- keep privacy-safe tracking defaults.

---

## Database

PostgreSQL runs locally through Docker Compose. Prisma schema lives at the repository root in `prisma/schema.prisma`.

The central table is `analytics_events`.

It stores:

- duplicated query columns such as `siteId`, `eventType`, `path`, `timestamp`;
- full validated event JSON in `payload`.

This supports simple query-time reporting without introducing aggregation tables too early.

---

## API Style

The project is REST-first.

Current public local endpoints:

- `GET /api/health`;
- `POST /api/events`;
- `GET /api/reports/overview?siteId=demo-site`;
- `GET /api/reports/page-views-by-path?siteId=demo-site`;
- `GET /api/reports/interactions-summary?siteId=demo-site`;
- `GET /api/reports/scroll-depth-summary?siteId=demo-site`.

GraphQL is intentionally out of scope for this MVP.

---

## Reporting Strategy

Phase 5 uses query-time reporting:

- overview totals use counts by event type;
- page views group `page_view` events by `path`;
- interactions read `element_id` and `conversion_name` from JSON payloads;
- scroll depth reads `depth_percent` from JSON payloads.

This is simple and readable for a portfolio MVP. Aggregation tables, materialized views, background jobs, and date filters can come later if the project needs them.

---

## Frontend Strategy

The dashboard currently uses:

- client components for report sections;
- small typed API clients in `apps/dashboard/src/lib/reports-api.ts`;
- local `useState` / `useEffect` state;
- loading, error, empty, and success states per report section;
- plain global CSS in `apps/dashboard/src/app/globals.css`.

There is no UI library or charting library currently installed for the dashboard reporting slice.

---

## Privacy and Security

Privacy-safe tracking is a core constraint.

The tracker does not collect:

- form values;
- names, emails, phone numbers, or message text;
- cookies;
- `localStorage` contents;
- arbitrary DOM text;
- DOM snapshots;
- session replay data.

Click tracking only records elements with `data-analytics-id`. Conversions are explicit business events from code. Scroll depth uses milestone numbers only.

Current limitations:

- no auth;
- no rate limiting;
- no production deployment;
- no site ownership checks.

---

## Testing and Verification

Current verification:

- `npm run typecheck --workspace=@behavior-analytics/ingest-api`;
- `npm run typecheck --workspace=@behavior-analytics/dashboard`;
- `npm run test --workspace=@behavior-analytics/analytics-core`;
- manual tracker smoke checklist;
- manual dashboard reporting smoke checklist.

Phase 6 should add focused tests around reporting helpers, API endpoints, tracker privacy behavior, and practical dashboard component behavior.

---

## Related Docs

- [`data-flow.en.md`](data-flow.en.md)
- [`api-conventions.en.md`](api-conventions.en.md)
- [`frontend-conventions.en.md`](frontend-conventions.en.md)
- [`css-conventions.en.md`](css-conventions.en.md)
- [`privacy-security.en.md`](privacy-security.en.md)
- [`testing-strategy.en.md`](testing-strategy.en.md)
- [`project-decisions.en.md`](project-decisions.en.md)
- [`../setup/dashboard-reporting-smoke.en.md`](../setup/dashboard-reporting-smoke.en.md)
