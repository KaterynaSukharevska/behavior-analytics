# Behavior Analytics MVP

[![CI](https://github.com/KaterynaSukharevska/behavior-analytics/actions/workflows/ci.yml/badge.svg)](https://github.com/KaterynaSukharevska/behavior-analytics/actions/workflows/ci.yml)

Behavior Analytics MVP is a privacy-conscious website behavior analytics product built as a local-first portfolio/career project.

It includes a demo site, browser tracker SDK, Fastify ingest API, PostgreSQL raw event storage, reporting API endpoints, and a Next.js dashboard.

## What This Project Demonstrates

- full-stack TypeScript application structure across frontend, backend, and shared packages;
- privacy-conscious tracker SDK design;
- Fastify ingest API and REST reporting endpoints;
- Zod runtime validation at API boundaries;
- Prisma/PostgreSQL persistence for analytics events;
- Next.js dashboard reporting UI;
- CSS-only visual reporting for page views and scroll depth;
- Vitest tests and GitHub Actions CI checks;
- phased MVP delivery with clear scope boundaries.

## Why This Project Exists

This project demonstrates modern full-stack TypeScript product development for a realistic analytics workflow:

- browser analytics tracking with privacy constraints;
- shared TypeScript contracts and Zod runtime validation;
- Fastify API design with safe public errors;
- PostgreSQL persistence through Prisma;
- query-time reporting endpoints;
- dashboard UI with loading, error, empty, and success states;
- focused Vitest coverage for reporting and tracker privacy behavior.
- basic GitHub Actions CI for pull requests and pushes to `main`.

It is intentionally presented as a local-first portfolio/career project, not as a production SaaS.

## Implemented Flow

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

- This is the implemented MVP flow used in local demos and interview walkthroughs.
- Dashboard sections currently include overview, page views by path, interactions summary, and scroll depth summary.
- The architecture is intentionally REST-first and beginner-readable.

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

## Local Demo

Use the existing setup commands in this README, then run a short local demo with:

- Dashboard: http://localhost:3000
- Demo Site: http://localhost:3001
- Ingest API: http://localhost:4000
- Health: http://localhost:4000/api/health

Recommended demo walkthrough docs:

- [`docs/portfolio/local-demo-checklist.md`](docs/portfolio/local-demo-checklist.md) — step-by-step local demo runbook with health checks, report verification, error-state troubleshooting, and a clean-restart checklist (use this before interviews).
- [`docs/portfolio/demo-screenshots-plan.md`](docs/portfolio/demo-screenshots-plan.md) — screenshot/media plan for README and interviews (capture locally; do not fake metrics).
- [`docs/portfolio/interview-walkthrough-script.md`](docs/portfolio/interview-walkthrough-script.md) — structured 5-7 minute interview walkthrough.
- [`docs/portfolio/interview-storyline.md`](docs/portfolio/interview-storyline.md) — 5-/10-minute storyline and screen-by-screen talking points.

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

## Portfolio And Interview Docs

Use these docs after reading this README:

- [`docs/portfolio/local-demo-checklist.md`](docs/portfolio/local-demo-checklist.md) — local demo setup and verification checklist.
- [`docs/portfolio/demo-screenshots-plan.md`](docs/portfolio/demo-screenshots-plan.md) — planned screenshot sequence and privacy-safe capture rules.
- [`docs/portfolio/interview-walkthrough-script.md`](docs/portfolio/interview-walkthrough-script.md) — timed interview walkthrough narrative.
- [`docs/portfolio/interview-storyline.md`](docs/portfolio/interview-storyline.md) — interview storytelling aligned with the live demo flow.
- [`docs/portfolio/technical-highlights.md`](docs/portfolio/technical-highlights.md) — architecture-to-skills mapping for recruiter review.
- [`docs/portfolio/qa-and-objection-handling.md`](docs/portfolio/qa-and-objection-handling.md) — concise answers to common interview questions.
- [`docs/portfolio/30-second-60-second-120-second-pitch.md`](docs/portfolio/30-second-60-second-120-second-pitch.md) — short spoken pitch versions.
- [`docs/portfolio/interview-prep-checklist.md`](docs/portfolio/interview-prep-checklist.md) — quick pre-interview readiness checklist.
- [`docs/portfolio/demo-day-fallback-script.md`](docs/portfolio/demo-day-fallback-script.md) — fallback narrative when live demo is unavailable.

## Current Limitations

Current limitations are intentional for this local-first MVP:

- no auth yet;
- no rate limiting yet;
- no deployment implementation yet;
- no production monitoring/logging strategy yet;
- no date filters yet;
- no aggregation tables or materialized views yet;
- no background jobs;
- no batching or offline retry;
- `session_start` and `session_end` are supported by shared types/schemas but are not emitted by the tracker yet;
- no E2E/screenshot testing yet;
- not production SaaS.

## Documentation

Useful documentation:

- [`docs/README.md`](docs/README.md) — documentation index
- [`docs/phase-9-context.md`](docs/phase-9-context.md) — latest handoff context and Phase 9 planning options
- [`docs/phase-8-context.md`](docs/phase-8-context.md) — current Phase 8 handoff for portfolio presentation polish
- [`docs/portfolio/local-demo-checklist.md`](docs/portfolio/local-demo-checklist.md) — manual local demo checklist for portfolio and interviews
- [`docs/portfolio/interview-walkthrough-script.md`](docs/portfolio/interview-walkthrough-script.md) — 5-7 minute interview walkthrough script
- [`docs/portfolio/technical-highlights.md`](docs/portfolio/technical-highlights.md) — recruiter-friendly technical highlights and interview mapping
- [`docs/portfolio/qa-and-objection-handling.md`](docs/portfolio/qa-and-objection-handling.md) — interview Q&A and objection-handling guide
- [`docs/portfolio/30-second-60-second-120-second-pitch.md`](docs/portfolio/30-second-60-second-120-second-pitch.md) — concise project pitch versions for recruiter/interview conversations
- [`docs/portfolio/interview-prep-checklist.md`](docs/portfolio/interview-prep-checklist.md) — quick pre-interview checklist for demo readiness
- [`docs/portfolio/demo-day-fallback-script.md`](docs/portfolio/demo-day-fallback-script.md) — fallback script for no-live-demo interview situations
- [`docs/phase-6-context.md`](docs/phase-6-context.md) — current Phase 6 handoff
- [`docs/architecture/architecture.en.md`](docs/architecture/architecture.en.md) — current technical architecture
- [`docs/architecture/data-flow.en.md`](docs/architecture/data-flow.en.md) — event and reporting data flow
- [`docs/architecture/privacy-security.en.md`](docs/architecture/privacy-security.en.md) — privacy and security rules
- [`docs/setup/local-development.en.md`](docs/setup/local-development.en.md) — local setup notes
- [`docs/setup/tracker-local-smoke.en.md`](docs/setup/tracker-local-smoke.en.md) — tracker smoke checklist
- [`docs/setup/dashboard-reporting-smoke.en.md`](docs/setup/dashboard-reporting-smoke.en.md) — dashboard/reporting smoke checklist
