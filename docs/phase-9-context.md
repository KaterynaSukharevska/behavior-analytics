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

## Recommended Phase 9 first step

Recommended default:

**Phase 9.1 — demo media and screenshot capture plan**

This should be docs-only or mostly docs-only, and define:

- which screenshots to capture;
- what local state/data should be visible;
- where screenshots could be stored if later added;
- what must not be faked;
- how each screenshot supports README and interview storytelling.

Do not add actual screenshots in this step unless explicitly requested.

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

Create `docs/portfolio/demo-media-plan.md` as a docs-only Phase 9.1 milestone. It should list recommended screenshots, local demo state, capture order, what not to fake, and how each screenshot supports README/interviews. Do not add screenshot tooling, app code, dependencies, or fake images.
