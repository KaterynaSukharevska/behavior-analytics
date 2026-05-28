# Technical highlights

## Goal

This document helps present Behavior Analytics MVP as a full-stack TypeScript portfolio project in a concise, recruiter-friendly way.

---

## Architecture map

| Area | What was built | Skill demonstrated | Interview explanation |
|------|----------------|--------------------|-----------------------|
| monorepo/workspaces | npm workspace monorepo with apps and shared packages | Monorepo organization and modular boundaries | "I split frontend, backend, tracker, and shared contracts into clear workspaces." |
| demo-site | Next.js demo website that emits analytics events | Frontend integration and event-driven UX | "The demo-site is the event source I use to generate realistic analytics data." |
| tracker SDK | Browser tracker package with page view, click, scroll depth, conversion tracking | SDK design and browser event instrumentation | "I built a reusable tracker layer instead of hardcoding tracking in pages." |
| privacy rules | Explicit privacy-safe collection constraints in tracker behavior/docs/tests | Privacy-aware product engineering | "Tracking is intentionally constrained to avoid PII and sensitive content." |
| ingest API | Fastify API for event ingestion and reporting routes | API design and service boundaries | "The API receives events and serves report data over REST endpoints." |
| Zod validation | Runtime validation before persistence | Defensive input validation | "Events are validated at runtime before they reach the database." |
| Prisma/PostgreSQL persistence | Prisma-backed writes/queries to `analytics_events` in PostgreSQL | Data modeling and persistence flow | "Validated events are stored as raw records for reporting queries." |
| reporting API | REST report endpoints for overview, paths, interactions, scroll depth | Aggregation and response shaping | "Dashboard data comes from explicit reporting endpoints." |
| dashboard UI | Next.js dashboard sections for report states and results | Data-fetching UI and state handling | "Each report section handles loading, error, empty, and success states." |
| CSS-only charts | Simple charts for page views and scroll depth without chart library | Lean visualization implementation | "I kept charts dependency-free using CSS for lightweight visuals." |
| tests | Vitest coverage for reporting helpers/endpoints and tracker privacy | Automated testing discipline | "I added focused tests around behavior that matters most to reliability/privacy." |
| GitHub Actions CI | Basic CI workflow running typechecks/tests | Build verification and engineering hygiene | "CI validates core workspaces on pushes/PRs." |
| documentation | Phase handoffs, setup guides, and portfolio docs | Technical communication and maintainability | "I document architecture, setup, and limits so the project is easy to review." |

---

## End-to-end flow

- User interactions happen on the demo-site.
- Tracker SDK emits safe events such as `page_view`, `click`, `scroll_depth`, and `conversion`.
- Ingest API receives events via `POST /api/events`.
- Zod validates event payloads before persistence.
- Prisma writes validated events to PostgreSQL (`analytics_events`).
- Reporting endpoints aggregate events for dashboard use.
- Dashboard fetches report data and renders overview, paths, interactions, and scroll depth sections.

---

## Backend highlights

- Fastify API handles both ingest and reporting endpoints.
- Validation path is explicit: incoming events are runtime-validated before DB writes.
- Prisma/PostgreSQL persistence stores validated analytics events in a queryable table.
- Reporting endpoints are REST-first:
  - `GET /api/reports/overview?siteId=demo-site`
  - `GET /api/reports/page-views-by-path?siteId=demo-site`
  - `GET /api/reports/interactions-summary?siteId=demo-site`
  - `GET /api/reports/scroll-depth-summary?siteId=demo-site`
- Error behavior is safe/public-facing (no raw internals in normal API responses).
- Scope is intentionally MVP-level: no auth/rate limiting/queues/aggregation tables/production monitoring in current implementation.

---

## Frontend highlights

- Next.js dashboard presents report data with clear loading/error/empty/success states.
- Next.js demo-site acts as a controlled local event source for demonstrations.
- Dashboard fetches report data from API endpoints, not direct database access.
- Visual reporting is intentionally simple and explainable.
- Page views and scroll depth charts are CSS-only (no chart library dependency).

---

## Privacy highlights

The tracker intentionally does **not** collect:

- form values
- names
- emails
- phone numbers
- cookies
- localStorage contents
- arbitrary DOM text
- DOM snapshots
- session replay data

Click tracking is safe and explicit through identifiers such as `data-analytics-id`.

---

## Testing and CI highlights

- Vitest is used for focused automated coverage.
- Reporting helper tests validate aggregation behavior.
- Reporting endpoint tests validate route behavior and safe responses.
- Tracker privacy tests verify sensitive data is not collected.
- GitHub Actions CI runs core checks on push/PR.
- CI currently runs workspace typechecks and tests for the implemented packages/apps.

---

## How this helps in interviews

- Demonstrates full-stack TypeScript understanding across frontend, backend, and shared contracts.
- Shows practical REST API design for ingest and reporting.
- Shows runtime validation mindset with Zod at system boundaries.
- Shows database persistence and reporting flow with Prisma/PostgreSQL.
- Demonstrates privacy-aware product thinking, not just event collection.
- Demonstrates dashboard/reporting UI implementation with clear state handling.
- Demonstrates testing discipline with focused automated coverage.
- Demonstrates documentation discipline and structured project communication.
- Demonstrates ability to build a realistic MVP in small, controlled phases.

---

## Current limitations

- no auth
- no rate limiting
- no deployment yet
- no production monitoring/logging strategy
- no date filters
- no aggregation tables or materialized views
- no background jobs
- no batching or offline retry
- no `session_start` / `session_end` emission
- no E2E/screenshot testing
- not production SaaS

---

## What not to overclaim

Do not claim:

- production readiness
- enterprise analytics
- real-time large-scale analytics
- session replay
- cookie-based tracking
- advanced security hardening
- deployed SaaS
- advanced data warehouse architecture
