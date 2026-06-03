# Phase 10 context

## Phase 10 purpose

**Phase 10 — Demo Evidence & Screenshot Assets**

Handoff for work **after Phase 9** portfolio and interview documentation polish.

Phase 10 is about **demo evidence** for portfolio and interviews:

- real screenshots from a verified local demo;
- clear asset storage and naming;
- optional README/GitHub visual polish.

Phase 10 is **not**:

- a new product feature phase;
- deployment implementation;
- production hardening (auth, rate limiting, monitoring, etc.).

Keep everything local-first, honest, and privacy-conscious.

---

## Current state after Phase 9

Phase 9 focused on portfolio presentation and quality planning **without** app/API changes.

**Completed in Phase 9:**

| Milestone | Output |
|-----------|--------|
| **9.1** | [`docs/portfolio/local-demo-checklist.md`](portfolio/local-demo-checklist.md) — demo reliability, health/reports/dashboard verification, clean restart |
| **9.2** | [`docs/portfolio/demo-screenshots-plan.md`](portfolio/demo-screenshots-plan.md) — screenshot sequence and capture rules (plan only) |
| **9.3** | [`docs/portfolio/interview-storyline.md`](portfolio/interview-storyline.md) — 5-/10-minute storyline and per-screen talk track |
| **9.4A** | Root [`README.md`](../README.md) — GitHub portfolio entry point polish |
| **9.4B** | [`docs/testing/basic-smoke-test-plan.md`](testing/basic-smoke-test-plan.md) — P0/P1/P2 smoke planning (no E2E yet) |

**Entry points:**

- [`README.md`](../README.md) — main GitHub portfolio landing page
- [`docs/README.md`](README.md) — documentation index

**Still not in repo:** committed screenshot image files (planned for Phase 10).

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

Local URLs (demo evidence captures use these):

| Service | URL |
|---------|-----|
| Dashboard | http://localhost:3000 |
| Demo site | http://localhost:3001 |
| Ingest API | http://localhost:4000 |
| Health | http://localhost:4000/api/health |
| Events ingest | POST http://localhost:4000/api/events |

Reporting endpoints (`siteId=demo-site`):

- `GET /api/reports/overview?siteId=demo-site`
- `GET /api/reports/page-views-by-path?siteId=demo-site`
- `GET /api/reports/interactions-summary?siteId=demo-site`
- `GET /api/reports/scroll-depth-summary?siteId=demo-site`

**Before any screenshot work:** run [`docs/portfolio/local-demo-checklist.md`](portfolio/local-demo-checklist.md) and follow [`docs/portfolio/demo-screenshots-plan.md`](portfolio/demo-screenshots-plan.md).

---

## Current stack (unchanged)

- npm workspaces
- Next.js dashboard and demo-site
- Fastify ingest API
- PostgreSQL via Docker Compose
- Prisma, TypeScript, Zod, Vitest
- REST-first, GitHub Actions CI
- No GraphQL, no microfrontends

---

## Current limitations (still true)

- no auth
- no rate limiting
- no deployment yet
- no production monitoring/logging strategy
- no date filters
- no aggregation tables or materialized views
- no background jobs
- no batching/offline retry
- no `session_start` / `session_end` emission from tracker
- no E2E/screenshot **automation** (manual screenshots in Phase 10 are OK)
- not production SaaS

---

## Recommended Phase 10 direction

Phase 10 should produce **evidence assets**, not new backend/frontend features:

1. Capture **real** screenshots from a local demo session.
2. Store them in a clear folder, e.g. `docs/portfolio/screenshots/` or `docs/portfolio/assets/`.
3. Optionally embed or link **selected** images in [`README.md`](../README.md).
4. Keep captions honest: local MVP, demo data, no fake customers or inflated metrics.
5. Preserve privacy-safe demo content only.

Primary planning doc: [`docs/portfolio/demo-screenshots-plan.md`](portfolio/demo-screenshots-plan.md).

Supporting docs:

- [`docs/portfolio/local-demo-checklist.md`](portfolio/local-demo-checklist.md)
- [`docs/portfolio/interview-storyline.md`](portfolio/interview-storyline.md)
- [`docs/testing/basic-smoke-test-plan.md`](testing/basic-smoke-test-plan.md) — P0 checks before capture

---

## Candidate Phase 10 milestones

### 10.1 — Screenshot asset folder and naming convention

- Document or create `docs/portfolio/screenshots/` (or `docs/portfolio/assets/`) with a short `README.md` in that folder.
- Align filenames with `demo-screenshots-plan.md` (e.g. `01-demo-site-analytics-attributes.png`).
- **Do not** add binary screenshots unless explicitly requested.

### 10.2 — Capture local demo screenshots

- Run local stack; generate demo data per checklist.
- Capture required shots per `demo-screenshots-plan.md`.
- Review for privacy/secrets before commit.

### 10.3 — README screenshot embedding/linking polish

- Add 1–3 images or a small gallery section to root README.
- Alt text: honest, local MVP framing.
- No fake metrics in captions.

### 10.4 — Final portfolio review checklist

- Docs-only checklist: README, screenshots, portfolio links, limitations visible, CI badge, interview docs linked.

### 10.5 — Optional: short LinkedIn/GitHub post draft (docs-only)

- One short markdown draft in `docs/portfolio/` — not published by the repo automatically.

---

## Recommended first milestone

**Start with Phase 10.1** — very small docs/assets preparation:

- define screenshot folder path and naming rules in a folder `README.md`;
- cross-link from `demo-screenshots-plan.md` if paths differ;
- optional one-line pointer in root README only if useful.

**Do not** add actual PNG/WebP files in 10.1 unless the task explicitly asks for captures.

---

## Privacy-safe screenshot rules

Screenshots must **not** show:

- real personal data
- names, emails, phone numbers, message text
- form values (typed user input)
- cookies or `localStorage` contents
- secrets (`.env`, `DATABASE_URL`, API keys)
- private browser tabs or unrelated bookmarks
- private terminal paths or command history with secrets
- arbitrary DOM text presented as “tracking data”
- session replay claims or imagery

**Safe to show:**

- localhost demo-site and dashboard UI
- `data-analytics-id` on demo elements
- health JSON and report JSON with `siteId=demo-site` demo metrics
- cropped terminals without secrets

Do not edit images to invent metrics or customers.

---

## Out of scope by default (Phase 10)

- app, API, tracker, Prisma/schema, CI, or `package.json` changes
- new dependencies
- Playwright, Cypress, or E2E implementation
- screenshot automation or visual regression tooling
- deployment, auth, rate limiting, date filters
- production SaaS or “live product” claims
- fake metrics, fake customers, or fake screenshots
- real PII in demo forms for “realism”

---

## Cursor execution rules for Phase 10

- Read [`docs/ai/cursor-working-rules.md`](ai/cursor-working-rules.md) and this file first.
- **Very small prompts** — one Cursor task = one milestone (e.g. 10.1 only).
- Prefer **docs/assets-only** changes; avoid whole-repo scans.
- Summarize relevant rules in 5 bullets before editing.
- Each prompt should state:
  - **exact files/areas** to touch;
  - **out of scope**;
  - **acceptance criteria**;
  - **verification** (e.g. `git status --short`);
  - **final report format** (files changed, commands, what was not changed).
- Avoid broad README rewrites; targeted links/embeds only.
- Keep Cursor usage cheap — do not refactor unrelated docs.

---

## Verification expectations

**Docs/assets-only (10.1, 10.4, 10.5):**

```bash
git status --short
```

- Manually inspect new/changed markdown links.
- No `npm test` required unless code changes (should not happen by default).

**When adding image files (10.2+):**

- Confirm files are reasonable size for GitHub.
- Re-read each image for PII/secrets before commit.
- Optional: run local demo checklist again to ensure UI matches claims.

---

## Suggested next Cursor prompt (Phase 10.1)

Create `docs/portfolio/screenshots/README.md` documenting the screenshot asset folder, naming convention from [`demo-screenshots-plan.md`](portfolio/demo-screenshots-plan.md), and privacy review checklist before commit. Do not add image binaries unless explicitly requested. Do not change app/API/tracker/CI/packages.

---

## Related documentation

- [`phase-9-context.md`](phase-9-context.md) — Phase 9 completion summary
- [`phase-8-context.md`](phase-8-context.md) — Phase 8 portfolio polish context
- [`portfolio/demo-screenshots-plan.md`](portfolio/demo-screenshots-plan.md) — capture sequence and file names
- [`portfolio/local-demo-checklist.md`](portfolio/local-demo-checklist.md) — pre-capture demo verification
- [`deployment/deployment-plan.en.md`](deployment/deployment-plan.en.md) — not Phase 10; deployment still plan-only
