# Phase 11 context

## Phase 11 purpose

**Phase 11 — Interview Demo Readiness & Final Portfolio QA**

Handoff for work **after Phase 10** demo evidence and screenshot assets.

Phase 11 is about making the project **easy to present** in interviews and recruiter conversations — without adding product features.

Focus on:

- running the final portfolio review checklist;
- verifying README, screenshots, limitations, and local demo docs stay consistent;
- rehearsing the demo flow and talk track;
- fixing **small** documentation gaps discovered during review;
- keeping honest local MVP / portfolio framing.

Phase 11 is **not**:

- a new product feature phase;
- deployment, auth, rate limiting, or monitoring implementation;
- screenshot recapture or README marketing rewrites.

---

## Project summary

Behavior Analytics MVP is:

- a portfolio/career project for a developer returning to IT;
- a **privacy-conscious website behavior analytics** MVP;
- a full-stack **TypeScript** implementation;
- **local-first** by design;
- intentionally **not** a production SaaS.

**GitHub:** https://github.com/KaterynaSukharevska/behavior-analytics

**Entry points:**

- [`README.md`](../README.md) — GitHub portfolio landing page (flow, stack, limitations, demo screenshots)
- [`docs/README.md`](README.md) — documentation index

---

## Implemented product flow

```txt
demo-site
  → tracker SDK
  → ingest API
  → Zod validation
  → Prisma
  → PostgreSQL analytics_events
  → reporting API
  → dashboard UI
```

| Service | URL |
|---------|-----|
| Dashboard | http://localhost:3000 |
| Demo site | http://localhost:3001 |
| Ingest API | http://localhost:4000 |
| Health | http://localhost:4000/api/health |
| Events ingest | POST http://localhost:4000/api/events |
| PostgreSQL | localhost:5432 |

Reporting endpoints (`siteId=demo-site`):

- `GET /api/reports/overview?siteId=demo-site`
- `GET /api/reports/page-views-by-path?siteId=demo-site`
- `GET /api/reports/interactions-summary?siteId=demo-site`
- `GET /api/reports/scroll-depth-summary?siteId=demo-site`

---

## Stack (unchanged)

- npm workspaces
- Next.js dashboard and demo-site
- Fastify ingest API
- PostgreSQL via Docker Compose
- Prisma, TypeScript, Zod, Vitest
- REST-first, GitHub Actions CI
- No GraphQL, no microfrontends

---

## Current portfolio assets (after Phase 10)

| Asset | Location |
|-------|----------|
| Screenshot folder + naming guide | [`docs/assets/screenshots/README.md`](assets/screenshots/README.md) |
| Local demo PNGs (6 files) | [`docs/assets/screenshots/`](assets/screenshots/) |
| README demo evidence section | [`README.md`](../README.md) — **Demo Screenshots** |
| Final portfolio review checklist | [`docs/portfolio/final-portfolio-review-checklist.md`](portfolio/final-portfolio-review-checklist.md) |
| Local demo run/verify checklist | [`docs/portfolio/local-demo-checklist.md`](portfolio/local-demo-checklist.md) |
| Interview walkthrough | [`docs/portfolio/interview-walkthrough-script.md`](portfolio/interview-walkthrough-script.md) |
| Demo-day fallback | [`docs/portfolio/demo-day-fallback-script.md`](portfolio/demo-day-fallback-script.md) |
| Technical highlights | [`docs/portfolio/technical-highlights.md`](portfolio/technical-highlights.md) |
| Pitches, Q&A, storyline | [`docs/portfolio/`](portfolio/) (see [`docs/README.md`](README.md)) |

**Optional (present in repo):** [`docs/portfolio/project-post-draft.md`](portfolio/project-post-draft.md) — LinkedIn/GitHub post drafts (adapt before publishing; not auto-published).

Committed screenshots include at minimum the three embedded in README plus additional dashboard/health captures per the asset guide.

---

## Completed phases summary (1–10)

| Phase | Focus |
|-------|--------|
| **1** | Monorepo, apps, Fastify API, Docker PostgreSQL, GitHub repo |
| **2** | Shared event types, Zod schemas, Vitest tests |
| **3** | Prisma/PostgreSQL persistence, POST `/api/events`, safe errors |
| **4** | Tracker SDK and demo-site integration |
| **5** | Reporting API endpoints, dashboard clients/UI, architecture docs |
| **6** | Reporting/tracker tests, dashboard polish, README/portfolio docs |
| **7** | Cursor working rules, GitHub Actions CI, CSS-only charts, handoff |
| **8** | Portfolio/interview documentation polish |
| **9** | Local demo reliability docs, screenshot plan, interview storyline, smoke planning |
| **10** | Demo evidence and screenshot assets (see below) |

---

## Phase 10 completion summary

Phase 10 is **effectively complete** through **10.4**. Required milestones:

| Milestone | Output |
|-----------|--------|
| **10.1** | [`docs/assets/screenshots/README.md`](assets/screenshots/README.md) — folder path, naming, privacy rules |
| **10.2** | Six real local demo PNGs under [`docs/assets/screenshots/`](assets/screenshots/) |
| **10.3** | Root [`README.md`](../README.md) — **Demo Screenshots** section (3 embeds, honest local-demo framing) |
| **10.4** | [`docs/portfolio/final-portfolio-review-checklist.md`](portfolio/final-portfolio-review-checklist.md) |

**10.5 (optional):** [`docs/portfolio/project-post-draft.md`](portfolio/project-post-draft.md) — **file exists in repo**; LinkedIn/GitHub copy for manual adaptation. Treat as optional polish, not a blocker for Phase 11.

Phase 10 did **not** change app/API/tracker source code, CI, or dependencies.

---

## Current limitations (still true)

Do not present these as implemented:

- no auth
- no rate limiting
- no deployment yet (plan only: [`deployment/deployment-plan.en.md`](deployment/deployment-plan.en.md))
- no production monitoring/logging strategy
- no date filters
- no aggregation tables or materialized views
- no background jobs
- no batching/offline retry
- no `session_start` / `session_end` emission from tracker
- no E2E or screenshot **automation**
- **not production SaaS**

---

## Recommended Phase 11 goal

Make the project **interview-ready** as a local MVP portfolio piece:

1. **Execute** the final portfolio review checklist and record outcomes.
2. **Rehearse** the live demo path (or fallback with screenshots).
3. **Align** docs/README claims with what actually runs locally.
4. **Fix only small gaps** found during review (targeted doc edits).
5. **Stay honest** — local demo, privacy constraints, explicit limitations.

---

## Candidate Phase 11 milestones

### 11.1 — Run final portfolio review checklist

- Work through [`final-portfolio-review-checklist.md`](portfolio/final-portfolio-review-checklist.md).
- Record outcome: Ready / Ready with notes / Not ready.
- Save notes in a small doc (e.g. `docs/portfolio/phase-11-review-notes.md`) or checklist template — **docs only**.

### 11.2 — Interview demo rehearsal notes

- Dry-run per [`local-demo-checklist.md`](portfolio/local-demo-checklist.md) and [`interview-walkthrough-script.md`](portfolio/interview-walkthrough-script.md).
- Optional short doc: “how to present this project” (timing, tab order, what to say per screen).
- Link fallback script if live demo is risky.

### 11.3 — Small consistency fixes from review

- Fix broken links, stale “no images yet” text, or contradictions between README and portfolio docs.
- **Narrow edits only** — no broad rewrites.

### 11.4 — Optional post draft (only if skipped in Phase 10)

- **Skip if** [`project-post-draft.md`](portfolio/project-post-draft.md) already meets your needs (it exists in repo).
- Otherwise adapt or extend post copy — docs only, no auto-publish.

### 11.5 — Phase 11 closure

- Summarize readiness decision and recommend next phase (e.g. deployment plan implementation, date filters, auth — **only when explicitly requested**).

---

## Recommended first Phase 11 step

**Start with 11.1** — run [`docs/portfolio/final-portfolio-review-checklist.md`](portfolio/final-portfolio-review-checklist.md) and record review notes.

Before the review:

- Skim root [`README.md`](../README.md) (Demo Screenshots, Limitations, CI badge).
- Confirm local stack can start per [`local-demo-checklist.md`](portfolio/local-demo-checklist.md) if you plan a live dry-run.

Do **not** start app feature work in 11.1.

---

## What Phase 11 should NOT do

- app, API, tracker, Prisma/schema, dashboard, or demo-site **code** changes
- new dependencies or CI workflow changes
- recapture, edit, or add screenshot PNGs unless explicitly requested
- Playwright/Cypress or E2E implementation
- deployment, auth, rate limiting, date filters, chart libraries, production monitoring
- root README **rewrites** (small link/fixes from review notes are OK in 11.3)
- production SaaS, customer, traffic, or revenue claims
- fake metrics or invented portfolio outcomes
- broad documentation cleanup unrelated to review findings

---

## Cursor cost-control rules

- Read [`docs/ai/cursor-working-rules.md`](ai/cursor-working-rules.md) and this file first.
- **One Cursor task = one milestone** (e.g. 11.1 only).
- Prefer **docs-only** changes; avoid whole-repo scans.
- Summarize relevant rules in 5 bullets before editing.
- Use `git status --short` for docs tasks; do not run full test suites unless code changed.
- Do not refactor unrelated files; ignore pre-existing unrelated diffs (e.g. `docs/architecture/testing-strategy.en.md` if already modified).

---

## Verification expectations

**Docs-only (11.1–11.5):**

```bash
git status --short
npm test
```

- Manually inspect new/changed markdown links.
- Root `npm test` may still be a placeholder echo script — report what actually ran.
- No `npm test` workspace runs required unless code changes (should not happen by default).

**If live demo dry-run (11.2):**

- Follow [`local-demo-checklist.md`](portfolio/local-demo-checklist.md).
- Health OK, dashboard sections load, fallback script ready.

---

## Future-agent guardrails

Before editing in Phase 11:

1. Read [`cursor-working-rules.md`](ai/cursor-working-rules.md) and this file.
2. State whether the task conflicts with project rules; stop if yes.
3. List exact files to touch; keep patches narrow.
4. Document **actual** implementation only — not aspirational architecture.
5. Preserve honest framing: local MVP, privacy-conscious tracker, explicit limitations.
6. Do not claim Phase 10.5 is missing if [`project-post-draft.md`](portfolio/project-post-draft.md) exists.
7. Do not edit or “fix” unrelated pre-modified files unless the task explicitly includes them.

Every final Cursor response should include: files changed, what changed, commands run, git status, what was intentionally not changed, and suggested next small step.

---

## Related documentation

- [`phase-10-context.md`](phase-10-context.md) — Phase 10 handoff (demo evidence)
- [`phase-9-context.md`](phase-9-context.md) — Phase 9 completion summary
- [`portfolio/final-portfolio-review-checklist.md`](portfolio/final-portfolio-review-checklist.md) — primary Phase 11.1 tool
- [`portfolio/local-demo-checklist.md`](portfolio/local-demo-checklist.md) — live demo verification
- [`portfolio/demo-day-fallback-script.md`](portfolio/demo-day-fallback-script.md) — when live demo fails
- [`testing/basic-smoke-test-plan.md`](testing/basic-smoke-test-plan.md) — P0 smoke priorities
