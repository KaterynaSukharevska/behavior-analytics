# Interview walkthrough script

## Goal

Use this script to present the current Behavior Analytics MVP clearly in portfolio reviews and recruiter/interviewer conversations.

This is a practical 5-7 minute walkthrough for the implemented local MVP, not a production SaaS pitch.

---

## 30-second project summary

"Behavior Analytics MVP is a privacy-conscious website behavior analytics project I built to demonstrate full-stack TypeScript skills. It includes a Next.js demo site, a browser tracker SDK, a Fastify ingest API with Zod validation, Prisma with PostgreSQL storage, REST reporting endpoints, and a Next.js dashboard. I use it as a portfolio/interview project to show an end-to-end analytics flow while keeping scope local-first and honest about current limitations."

---

## 5-7 minute walkthrough

### 0:00-0:45 — Problem and product idea

- Explain the core problem: understanding user behavior on a site with privacy-safe analytics.
- Clarify scope: this project is a local-first MVP for portfolio/interview storytelling.
- Mention supported behavior events: page views, explicit clicks, scroll depth milestones, and conversions.

### 0:45-1:45 — Architecture overview

- Walk through the implemented flow:
  - `demo-site -> tracker SDK -> ingest API -> Zod validation -> Prisma -> PostgreSQL analytics_events -> reporting API -> dashboard`.
- Highlight separation of concerns:
  - demo UI and event generation,
  - tracker collection logic,
  - API ingest/reporting,
  - dashboard presentation.
- Note REST-first design and shared TypeScript + Zod contracts.

### 1:45-3:00 — Live demo flow

- Open the demo site at `http://localhost:3001`.
- Navigate between pages to generate `page_view` events.
- Click elements with `data-analytics-id` to generate `click` events.
- Scroll a long page to generate 25/50/75/100 `scroll_depth` events.
- Trigger conversions from implemented demo actions.

### 3:00-4:15 — Privacy and validation choices

- Explain what is intentionally not collected:
  - form values, names, emails, phone numbers, cookies, localStorage contents,
  - arbitrary DOM text, DOM snapshots, session replay data.
- Mention click tracking is opt-in via explicit identifiers like `data-analytics-id`.
- Explain that ingest uses Zod runtime validation before persistence.

### 4:15-5:30 — Dashboard and reporting

- Open dashboard at `http://localhost:3000`.
- Show current report sections:
  - overview,
  - page views by path,
  - interactions summary,
  - scroll depth summary.
- Mention these reports are backed by REST endpoints and local PostgreSQL data.
- Note page views and scroll depth visuals are simple CSS-only charts (no chart library added).

### 5:30-6:30 — Tests, CI, and engineering practices

- Mention TypeScript across apps/packages.
- Mention focused Vitest coverage for validation/tracker/reporting behavior.
- Mention GitHub Actions CI runs typechecks/tests for current workspaces.
- Emphasize small, readable architecture and clear docs for maintainability.

### 6:30-7:00 — Limitations and next steps

- State current limitations honestly (no auth/rate limiting/deployment/etc.).
- Explain that Phase 11 portfolio QA (review notes and demo rehearsal docs) is complete; next technical work stays small and explicit — e.g. deployment from the existing plan when requested — and only claim what is fully implemented.

---

## Live demo sequence

- [ ] Open demo site: `http://localhost:3001`
- [ ] Generate `page_view` by navigating across pages (`/`, `/features`, `/pricing`, `/contact`, `/thank-you`)
- [ ] Click tracked elements that use `data-analytics-id`
- [ ] Scroll a long page to trigger `scroll_depth` milestones (25/50/75/100)
- [ ] Trigger conversion events from existing demo actions
- [ ] Open dashboard: `http://localhost:3000`
- [ ] Verify overview, page views by path, interactions summary, and scroll depth summary
- [ ] Optional: show API health `http://localhost:4000/api/health`
- [ ] Optional: show a report endpoint such as `http://localhost:4000/api/reports/overview?siteId=demo-site`

---

## Architecture talking points

- **npm workspaces** organize apps and shared packages in one TypeScript monorepo.
- **Separation of responsibilities** between demo-site, tracker SDK, ingest API, and dashboard.
- **Shared contracts and validation** with TypeScript types and Zod runtime checks.
- **Prisma/PostgreSQL persistence** stores validated analytics events in `analytics_events`.
- **REST reporting endpoints** provide aggregated data for dashboard sections.
- **Dashboard data flow** consumes reporting API responses, not direct DB access.
- **Local-first setup** keeps the project easy to run and explain in interviews.

---

## Privacy talking points

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

Safe click tracking uses explicit identifiers such as `data-analytics-id`.

---

## Engineering talking points

- TypeScript across the monorepo
- Zod runtime validation at ingest boundaries
- Fastify API for ingest and reports
- Prisma for DB access
- PostgreSQL for analytics event storage
- Vitest tests for core analytics behavior
- GitHub Actions CI for repeatable checks
- Simple CSS-only charts for dashboard visuals without adding a chart library

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
- no `session_start` / `session_end` emission from tracker
- no E2E/screenshot testing
- not production SaaS

---

## Good answer to: “What would you build next?”

"Next, I’d keep improving portfolio presentation quality: tighten the demo narrative, add curated screenshots, and improve walkthrough docs. After that, I’d move into small technical increments such as deployment implementation from the existing plan, then date filters, basic auth/rate limiting, and stronger smoke/E2E testing. I’d keep each step scoped and only claim what is fully implemented."

---

## What not to claim

Do **not** claim:

- production readiness
- enterprise analytics
- session replay
- cookie-based tracking
- real user monitoring at scale
- advanced security hardening
- deployed SaaS

This project is intentionally a local-first MVP for learning and portfolio presentation.
