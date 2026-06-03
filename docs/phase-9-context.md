# Phase 9 context

## Purpose

This file is a handoff for the next phase after Phase 8 portfolio packaging.

It helps future agents continue safely without losing architecture decisions, privacy constraints, and scope rules.

---

## Current project summary

Behavior Analytics MVP is:

- a portfolio/career project for a developer returning to IT;
- a privacy-conscious website behavior analytics MVP;
- a full-stack TypeScript implementation;
- local-first by design;
- intentionally not a production SaaS.

---

## Implemented product flow

`demo-site -> tracker SDK -> ingest API -> Zod validation -> Prisma/PostgreSQL -> reporting API -> dashboard UI`

- Demo-site produces user behavior events for the MVP flow.
- Tracker SDK emits privacy-conscious analytics events.
- Ingest API receives events and applies validation boundaries.
- Zod validates runtime payloads before persistence.
- Prisma stores validated events in PostgreSQL (`analytics_events`).
- Reporting API endpoints aggregate/read report data.
- Dashboard renders overview, page views by path, interactions summary, and scroll depth summary.

---

## Current stack

- npm workspaces
- Next.js dashboard
- Next.js demo-site
- Fastify ingest API
- PostgreSQL via Docker Compose
- Prisma
- TypeScript
- Zod
- Vitest
- REST-first
- GitHub Actions CI
- No GraphQL
- No microfrontends

---

## Completed phases 1-8

- **Phase 1:** local foundation (monorepo, apps, Docker/PostgreSQL, initial API/dashboard/demo setup).
- **Phase 2:** shared event types and Zod schemas.
- **Phase 3:** Prisma/PostgreSQL persistence and `POST /api/events`.
- **Phase 4:** tracker SDK and demo-site integration.
- **Phase 5:** reporting API and dashboard report sections.
- **Phase 6:** focused tests, UI polish, README/docs improvements, deployment planning doc.
- **Phase 7:** Cursor rules, GitHub Actions CI, README CI badge, CSS-only dashboard charts.
- **Phase 8:** portfolio/interview documentation and root README polish.

---

## Phase 8 output

Phase 8 documentation output:

- `docs/portfolio/local-demo-checklist.md` — step-by-step local demo checklist.
- `docs/portfolio/interview-walkthrough-script.md` — timed 5-7 minute interview walkthrough.
- `docs/portfolio/technical-highlights.md` — architecture-to-skills interview mapping.
- `docs/portfolio/qa-and-objection-handling.md` — concise answers to common objections/questions.
- `docs/portfolio/30-second-60-second-120-second-pitch.md` — short pitch variants for different interview contexts.
- `docs/portfolio/interview-prep-checklist.md` — quick pre-interview readiness checklist.
- `docs/portfolio/demo-day-fallback-script.md` — fallback narrative when live local demo is unavailable.

Root `README.md` now acts as the main portfolio entry point and links to this documentation set.

---

## Current limitations

- no auth
- no rate limiting
- no deployment yet
- no production monitoring/logging strategy
- no date filters
- no aggregation tables or materialized views
- no background jobs
- no batching/offline retry
- no `session_start` / `session_end` emission
- no E2E/screenshot testing
- not production SaaS

---

## Privacy constraints that must remain true

Tracker must not collect:

- form values
- names
- emails
- phone numbers
- message text
- cookies
- localStorage contents
- arbitrary DOM text
- DOM snapshots
- session replay data

Click tracking rules that must remain true:

- only safe explicit identifiers such as `data-analytics-id`
- ignores `data-analytics-ignore`
- ignores `data-private`
- ignores form fields
- no DOM text collection

---

## Phase 9 candidate directions

### A. Demo media / screenshot assets preparation

- **What it would improve:** presentation quality in README, GitHub, and interview walkthroughs.
- **Why useful:** makes project outcomes easier to scan quickly.
- **Why keep small:** define capture plan and quality rules first, avoid tooling/automation expansion.

### B. Deployment readiness planning or very small deployment prep

- **What it would improve:** path from local MVP to first hosted demonstration.
- **Why useful:** clarifies practical next steps without overclaiming production readiness.
- **Why keep small:** planning-first or one narrow prep change only, no broad infrastructure rollout.

### C. Local demo reliability improvements

- **What it would improve:** fewer failures during interview/demo sessions.
- **Why useful:** stronger confidence when presenting live.
- **Why keep small:** tighten docs/checklists and low-risk reliability fixes only.

### D. Basic E2E/smoke test planning

- **What it would improve:** clearer future quality strategy for key demo paths.
- **Why useful:** helps prioritize what to automate later.
- **Why keep small:** planning doc first; do not add heavy tooling immediately.

### E. Date filters planning only

- **What it would improve:** reporting usability and future product depth.
- **Why useful:** common interview question about analytics usefulness over time.
- **Why keep small:** scope/design planning only, no endpoint/UI implementation yet.

### F. Auth/rate-limiting planning only

- **What it would improve:** security hardening roadmap clarity.
- **Why useful:** shows awareness of production boundaries.
- **Why keep small:** planning-only artifacts, no implementation in default Phase 9 start.

---

## Phase 9.1 completed (local demo reliability docs)

Phase 9.1 updated portfolio demo documentation for interview/demo readiness:

- expanded [`docs/portfolio/local-demo-checklist.md`](portfolio/local-demo-checklist.md) with before-demo prep, service order, health/report/dashboard verification, common error states, clean restart, and what the demo proves technically;
- light pointers in root [`README.md`](../README.md) and [`docs/README.md`](README.md).

No app, API, tracker, database, CI, or dependency changes.

---

## Phase 9.2 completed (screenshot / media planning docs)

Phase 9.2 added [`docs/portfolio/demo-screenshots-plan.md`](portfolio/demo-screenshots-plan.md):

- recommended capture sequence aligned with the implemented local flow;
- what each shot shows and proves technically;
- optional shots, privacy-safe rules, suggested file names, and usage (README, GitHub, interviews, LinkedIn);
- local capture checklist.

Indexed from [`docs/README.md`](README.md) and root [`README.md`](../README.md). No image files, screenshot tooling, or app/API changes.

---

## Phase 9.3 completed (interview storytelling docs)

Phase 9.3 added [`docs/portfolio/interview-storyline.md`](portfolio/interview-storyline.md):

- 5- and 10-minute explanation outlines;
- recommended demo order and per-screen talk track;
- sections on architecture, privacy, validation/persistence, reports, tests/CI, limitations, and follow-up Q&A.

Indexed from [`docs/README.md`](README.md) and root [`README.md`](../README.md). No code, screenshots, or dependency changes.

---

## Recommended Phase 9 next step

Pick one small milestone, for example:

- commit real screenshots under `docs/portfolio/screenshots/` after a verified local demo (only when explicitly requested; use [`demo-screenshots-plan.md`](portfolio/demo-screenshots-plan.md));
- deployment-readiness planning tweaks in docs only from [`deployment/deployment-plan.en.md`](deployment/deployment-plan.en.md).

Do not add fake images or production claims.

---

## What Phase 9 should not do by default

- do not start auth automatically
- do not start deployment implementation automatically
- do not add rate limiting automatically
- do not add new analytics features automatically
- do not add date filters automatically
- do not add chart libraries
- do not add GraphQL
- do not add microfrontends
- do not add new packages without clear need
- do not rewrite architecture
- do not weaken privacy rules
- do not claim production readiness

---

## Cursor rules for Phase 9

- read `docs/ai/cursor-working-rules.md` first
- summarize relevant rules in 5 bullets before editing
- keep each task small
- one Cursor task = one small milestone
- include an out-of-scope section in prompts
- report files changed, commands run, git status, and intentionally unchanged areas
- avoid broad rewrites
- prefer docs/planning before implementation when scope is unclear

---

## Suggested next Cursor prompt

After a successful local demo, add real screenshot files under `docs/portfolio/screenshots/` and optional README embeds — only when explicitly requested. Use [`docs/portfolio/demo-screenshots-plan.md`](portfolio/demo-screenshots-plan.md). Or add a short docs-only deployment-readiness checklist derived from [`deployment/deployment-plan.en.md`](deployment/deployment-plan.en.md). Do not fake metrics or add Playwright.
