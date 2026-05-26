# Behavior Analytics MVP

Behavior Analytics MVP is a privacy-conscious website behavior analytics product built as a local-first portfolio project.

It includes a demo site, browser tracker SDK, Fastify ingest API, PostgreSQL raw event storage, reporting API endpoints, and a Next.js dashboard.

## Why This Project Exists

This project demonstrates modern full-stack TypeScript product development for a realistic analytics workflow:

- browser analytics tracking with privacy constraints;
- shared TypeScript contracts and Zod runtime validation;
- Fastify API design with safe public errors;
- PostgreSQL persistence through Prisma;
- query-time reporting endpoints;
- dashboard UI with loading, error, empty, and success states;
- focused Vitest coverage for reporting and tracker privacy behavior.

It is intentionally presented as a portfolio/career project, not as a production SaaS.

## Current Product Flow

```txt
demo-site
  -> @behavior-analytics/tracker
  -> POST /api/events
  -> Zod validation
  -> Prisma
  -> PostgreSQL analytics_events
  -> reporting API endpoints
  -> dashboard API clients
  -> dashboard UI
```

In plain language:

1. The demo site emits safe behavior events.
2. The tracker collects page views, clicks, scroll milestones, and explicit conversions.
3. The ingest API validates incoming events.
4. PostgreSQL stores validated raw events.
5. Reporting endpoints aggregate stored events.
6. The dashboard displays the reports.

## Tech Stack

| Area | Technology |
|------|------------|
| Monorepo | npm workspaces |
| Language | TypeScript |
| Dashboard | Next.js, React |
| Demo site | Next.js, React |
| Ingest API | Fastify |
| Database | PostgreSQL via Docker Compose |
| DB toolkit | Prisma |
| Runtime validation | Zod |
| Testing | Vitest |
| API style | REST-first |

The project does not use GraphQL or microfrontends.

## Current Features

- Page view tracking
- Click tracking through explicit `data-analytics-id` attributes
- Scroll depth tracking for 25%, 50%, 75%, and 100% milestones
- Explicit conversion tracking
- Zod event validation before persistence
- PostgreSQL raw event persistence in `analytics_events`
- Reporting endpoints for overview, page views by path, interactions, and scroll depth
- Dashboard report sections for overview metrics, top paths, clicked elements, conversions, and scroll depth
- Reporting helper tests
- Reporting endpoint tests
- Tracker privacy tests
- Polished local dashboard UI using plain global CSS

## Privacy Principles

Privacy-safe tracking is a core constraint. The tracker does not collect:

- form values;
- names, emails, phone numbers, or message text;
- arbitrary DOM text;
- cookies or `localStorage` contents;
- DOM snapshots;
- session replay data.

Click tracking only records safe explicit identifiers such as `data-analytics-id`. Conversions are explicit business events from code.

## Local URLs

| Service | URL |
|---------|-----|
| Dashboard | http://localhost:3000 |
| Demo Site | http://localhost:3001 |
| Ingest API | http://localhost:4000 |
| Health | http://localhost:4000/api/health |
| Events API | http://localhost:4000/api/events |
| PostgreSQL | localhost:5432 |

## Local Setup

Prerequisites: Node.js 20+, npm, Docker, and Docker Compose.

From the repository root:

```bash
npm install
```

Start PostgreSQL:

```bash
docker compose up -d postgres
docker compose ps
```

Prepare Prisma if needed:

```bash
npm run db:generate
npm run db:migrate
```

Run the local apps in separate terminals:

```bash
npm run dev --workspace=@behavior-analytics/ingest-api
npm run dev --workspace=@behavior-analytics/dashboard
npm run dev --workspace=@behavior-analytics/demo-site
```

Then open:

- dashboard: http://localhost:3000
- demo site: http://localhost:3001
- health check: http://localhost:4000/api/health

## Testing And Typechecks

Basic GitHub Actions CI runs on pull requests and pushes to `main` with Node.js 20 and `npm ci`.

Current CI checks:

```bash
npm run db:generate
npm run typecheck -w @behavior-analytics/types
npm run typecheck -w @behavior-analytics/analytics-core
npm run typecheck -w @behavior-analytics/tracker
npm run typecheck -w @behavior-analytics/ingest-api
npm run typecheck -w @behavior-analytics/dashboard
npm run typecheck -w @behavior-analytics/demo-site
npm run test -w @behavior-analytics/analytics-core
npm run test -w @behavior-analytics/tracker
npm run test -w @behavior-analytics/ingest-api
```

Useful Prisma checks:

```bash
npm run db:validate
npm run db:status
```

## Monorepo Structure

```txt
apps/
  dashboard/          Next.js dashboard UI
  demo-site/          Next.js demo website that emits events
  ingest-api/         Fastify event ingestion and reporting API

packages/
  tracker/            Browser tracking SDK
  types/              Shared TypeScript event types
  analytics-core/     Zod validation schemas and tests
  config/             Shared config placeholder

prisma/               Prisma schema and migrations
docs/                 Product, architecture, setup, and phase docs
scripts/              Local helper scripts
```

## Project Status

Current limitations are intentional for this local MVP:

- no authentication yet;
- no production deployment yet;
- no charts yet;
- no date filters yet;
- no rate limiting yet;
- no aggregation tables or materialized views yet;
- no background jobs;
- no batching or offline retry;
- `session_start` and `session_end` are supported by shared types/schemas but are not emitted by the tracker yet.

## Documentation

Useful documentation:

- [`docs/README.md`](docs/README.md) — documentation index
- [`docs/phase-6-context.md`](docs/phase-6-context.md) — current Phase 6 handoff
- [`docs/architecture/architecture.en.md`](docs/architecture/architecture.en.md) — current technical architecture
- [`docs/architecture/data-flow.en.md`](docs/architecture/data-flow.en.md) — event and reporting data flow
- [`docs/architecture/privacy-security.en.md`](docs/architecture/privacy-security.en.md) — privacy and security rules
- [`docs/setup/local-development.en.md`](docs/setup/local-development.en.md) — local setup notes
- [`docs/setup/tracker-local-smoke.en.md`](docs/setup/tracker-local-smoke.en.md) — tracker smoke checklist
- [`docs/setup/dashboard-reporting-smoke.en.md`](docs/setup/dashboard-reporting-smoke.en.md) — dashboard/reporting smoke checklist
