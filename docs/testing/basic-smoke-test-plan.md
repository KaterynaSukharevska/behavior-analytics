# Basic smoke-test plan

## Purpose

This document plans **manual and future automated smoke checks** for the Behavior Analytics MVP local flow. It is a **plan only** — no E2E tests, Playwright, or new packages are added in this step.

Use it to:

- know what to verify before a demo or interview;
- separate **P0 manual checks today** from **P1/P2 future automation**;
- align with existing Vitest coverage and CI without overclaiming test depth.

This project is a **local-first portfolio MVP**, not production SaaS.

---

## Implemented flow (test scope anchor)

```txt
demo-site → tracker SDK → ingest API → Zod validation → Prisma → PostgreSQL analytics_events → reporting API → dashboard UI
```

---

## Current testing baseline

**What exists today (automated):**

| Layer | Tool | What it covers |
|-------|------|----------------|
| Shared validation | Vitest (`analytics-core`) | Zod schema valid/invalid events |
| Tracker | Vitest (`tracker`) | Privacy rules, click opt-in, ignored selectors |
| Ingest API | Vitest (`ingest-api`) | Reporting helpers, route shapes, safe errors, ingest validation |
| Type safety | `npm run typecheck` per workspace | TypeScript compile checks |
| CI | GitHub Actions | `npm ci`, `db:generate`, workspace typechecks + Vitest for packages above |

**What exists today (manual):**

| Doc | Focus |
|-----|--------|
| [`docs/setup/tracker-local-smoke.en.md`](../setup/tracker-local-smoke.en.md) | Tracker + demo-site events |
| [`docs/setup/dashboard-reporting-smoke.en.md`](../setup/dashboard-reporting-smoke.en.md) | Reporting API + dashboard |
| [`docs/portfolio/local-demo-checklist.md`](../portfolio/local-demo-checklist.md) | End-to-end demo readiness |

**What does not exist today:**

- Playwright, Cypress, or other E2E framework
- Screenshot/visual regression tests
- Automated browser smoke in CI
- Dashboard component tests (optional future)

See also [`docs/architecture/testing-strategy.en.md`](../architecture/testing-strategy.en.md).

---

## Current manual smoke flow

Typical order (from repo root):

1. `docker compose up -d postgres` → `npm run db:generate` / `db:migrate` if needed
2. `npm run dev --workspace=@behavior-analytics/ingest-api`
3. `npm run dev --workspace=@behavior-analytics/dashboard`
4. `npm run dev --workspace=@behavior-analytics/demo-site`
5. Health → demo events → report URLs → dashboard refresh

**Local URLs:**

| Service | URL |
|---------|-----|
| Dashboard | http://localhost:3000 |
| Demo site | http://localhost:3001 |
| Ingest API | http://localhost:4000 |
| Health | http://localhost:4000/api/health |
| Events ingest | POST http://localhost:4000/api/events |

**Reporting endpoints** (`siteId=demo-site`):

- `GET /api/reports/overview?siteId=demo-site`
- `GET /api/reports/page-views-by-path?siteId=demo-site`
- `GET /api/reports/interactions-summary?siteId=demo-site`
- `GET /api/reports/scroll-depth-summary?siteId=demo-site`

---

## What to check before a demo

Minimum gate (also in [`local-demo-checklist.md`](../portfolio/local-demo-checklist.md)):

- [ ] PostgreSQL container up
- [ ] Ingest API health returns `{ "ok": true, "service": "ingest-api" }`
- [ ] Dashboard and demo site load
- [ ] At least one successful `POST /api/events` from demo site (Network tab)
- [ ] One report endpoint returns `"ok": true`
- [ ] Dashboard overview shows non-zero or intentional empty state with clear copy
- [ ] No `.env` secrets visible on screen during screen share

Optional before a code change release locally:

- [ ] `npm run test` on touched workspaces
- [ ] CI-equivalent typechecks for changed packages

---

## P0 smoke checks (manual — do today)

**Priority:** Must pass for “the product works locally.” No automation required yet.

### Infrastructure

- [ ] `http://localhost:4000/api/health` → HTTP 200, `ok: true`
- [ ] PostgreSQL reachable (reports not `ok: false` due to DB)

### Tracker + ingest (demo-site)

- [ ] Navigation sends `page_view` events
- [ ] Click on `data-analytics-id` sends `click` (no click on bare form fields)
- [ ] Long-page scroll sends `scroll_depth` milestones (25/50/75/100)
- [ ] Demo conversion actions send `conversion` with expected names
- [ ] Invalid payloads rejected at ingest (optional: manual bad POST only in dev)

### Persistence + reporting API

- [ ] All four `GET /api/reports/*?siteId=demo-site` return HTTP 200 and `"ok": true`
- [ ] Counts/lists reflect demo session (overview totals increase after events)

### Dashboard UI

- [ ] Overview, page views by path, interactions summary, scroll depth load without error alert
- [ ] Hard refresh after new events updates numbers
- [ ] Stopping ingest API shows safe dashboard error (not raw stack trace)

### Privacy (observe, do not use real PII)

- [ ] Network payloads for events contain no form values, emails, or message text
- [ ] Click payloads use analytics id, not arbitrary DOM text

---

## P1 smoke checks (future automation candidates)

**Priority:** High value once E2E is explicitly approved; still out of scope until implemented.

| Check | Suggested approach |
|-------|-------------------|
| Health endpoint always `ok: true` when API up | HTTP client test or Playwright API request |
| Report endpoints shape + `ok: true` after seed events | Test DB fixture + supertest/Fastify inject |
| Ingest accepts valid demo `page_view` payload | API integration test with test database |
| Ingest rejects invalid payload | Already partly covered by Vitest; extend if gaps |
| Dashboard fetches reports (smoke) | Playwright: load `/`, wait for success text/metrics |
| Demo-site → ingest round trip | Playwright: click nav, assert Network `POST /api/events` 200 |

P1 should reuse **demo-site routes and `siteId=demo-site`** only — no production URLs.

---

## P2 checks (intentionally deferred)

Low priority for this MVP; document so they are not mistaken for missing P0:

- Visual/CSS regression on charts
- Cross-browser matrix (Safari, Firefox mobile, etc.)
- Load/performance testing on ingest
- Auth, rate limit, and multi-tenant site isolation tests
- Date-filter reporting (not implemented)
- `session_start` / `session_end` tracker emission (not implemented)
- Deployed-environment smoke (no deployment yet)
- Screenshot comparison against README assets

---

## What should not be automated yet

Do **not** add tooling or CI jobs for these until scope is explicitly chosen:

- Playwright/Cypress install and browser CI runners
- Screenshot golden files
- Full demo-site UI coverage of every page copy
- Session replay or DOM snapshot assertions
- Tests that require real user PII fixtures
- Production deployment smoke without hosted environment
- Chart pixel-perfect assertions

Keep manual demo checklist for interviews until P1 E2E exists and is stable.

---

## Privacy-safe testing rules

Smoke tests (manual or future automated) must **not** use or assert collection of:

- real personal data
- names, emails, phone numbers, message text
- form values
- cookies or `localStorage` contents
- arbitrary DOM text, DOM snapshots, session replay data

**Do use:**

- demo-site built-in flows only;
- synthetic `siteId=demo-site` data;
- explicit `data-analytics-id` elements;
- explicit conversion names: `contact_form_submitted`, `pricing_cta_clicked`, `thank_you_page_viewed`.

**Do not** paste production customer data into forms for “realistic” tests.

---

## Suggested future test layers

| Layer | Scope | When |
|-------|--------|------|
| Unit | Zod, pure helpers, tracker helpers | Now (Vitest) — maintain |
| API integration | Fastify routes + test DB | Before E2E if gaps remain |
| Contract | Report JSON shapes | Optional small schema tests |
| Browser smoke | Demo-site + dashboard happy path | After P1 approval |
| Deployed smoke | Health + one event + one report | After first deployment |

Layers build upward; do not skip unit/API confidence for brittle E2E only.

---

## Suggested future file / test naming

If E2E is added later, prefer clear names under a single folder, for example:

```txt
tests/e2e/
  smoke-health.spec.ts
  smoke-ingest-page-view.spec.ts
  smoke-reports-overview.spec.ts
  smoke-dashboard-overview.spec.ts
```

Or workspace-local:

```txt
apps/ingest-api/src/__tests__/smoke-reports.integration.test.ts
```

Naming conventions:

- prefix `smoke-` for few critical paths;
- suffix `.integration.test.ts` for DB-backed API tests;
- avoid `test-everything.spec.ts`;
- one behavioral assertion per test where possible.

No files are created by this plan document.

---

## When to add Playwright or E2E tests

Consider Playwright (or similar) only when **all** are true:

1. P0 manual smoke is boring and repeated often (regression fear).
2. Vitest coverage exists for validation, privacy, and reporting helpers/routes.
3. You accept CI complexity (browser install, slower runs, flakiness management).
4. Scope is **one happy path**: demo-site page view → ingest → overview report → dashboard metric visible.
5. Portfolio story stays honest: “small E2E smoke for demo path,” not “full QA automation.”

**Defer Playwright if:**

- you mainly need interview demos (manual checklist is enough);
- local setup is still changing weekly;
- CI budget/time is limited.

---

## Out of scope (this plan and current MVP)

- Implementing smoke tests or adding Playwright/Cypress
- Screenshot testing automation
- Changing app, API, tracker, Prisma schema, CI, or `package.json`
- Claiming automated E2E or production readiness
- Testing auth, rate limits, date filters, aggregation tables, background jobs
- Collecting or asserting PII in fixtures

---

## Related documentation

- [`docs/architecture/testing-strategy.en.md`](../architecture/testing-strategy.en.md) — strategy and Phase 6 priorities
- [`docs/portfolio/local-demo-checklist.md`](../portfolio/local-demo-checklist.md) — pre-demo manual gate
- [`docs/setup/tracker-local-smoke.en.md`](../setup/tracker-local-smoke.en.md) — tracker smoke steps
- [`docs/setup/dashboard-reporting-smoke.en.md`](../setup/dashboard-reporting-smoke.en.md) — reporting + dashboard smoke
- [`README.md`](../../README.md) — CI commands and limitations
