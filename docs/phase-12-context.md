# Phase 12 context

## Phase 12 purpose

**Phase 12 — Dashboard Visual Upgrade / Reports UI v2**

Optional handoff for work **after Phase 11 closure** ([`portfolio/phase-11-closure-summary.md`](portfolio/phase-11-closure-summary.md)).

Phase 12 improves the **visual quality and professional feel** of the dashboard/reports UI — without changing the product pipeline, privacy model, or portfolio honesty.

Focus on:

- clearer dashboard layout inspired by professional analytics products (Sentry-like **inspiration only**, not a clone);
- simpler report structure with less excessive nesting;
- improved report charts from **existing real report data**;
- portfolio-friendly polish that reads well in interviews and screenshots.

Phase 12 is **optional**. The project is already **ready for GitHub, recruiters, and technical interview presentation** as a stable local portfolio MVP. Start Phase 12 only when visual dashboard polish is explicitly wanted.

Phase 12 is **not**:

- a backend, tracker, or schema phase;
- deployment, auth, rate limiting, monitoring, date filters, or production hardening;
- fake metrics, demo data fabrication, or production SaaS claims;
- a broad dashboard rewrite in one task.

---

## Stable status before Phase 12

After Phase 11 closure (**2026-06-08**), the project status is:

**Ready for GitHub, recruiter, and technical interview presentation as a local portfolio MVP.**

| Area | Status |
|------|--------|
| Product flow | `demo-site` → tracker → ingest API → Zod → Prisma → PostgreSQL → reporting API → dashboard |
| Portfolio docs | README, screenshots, interview scripts, Q&A, closure summary |
| CI | GitHub Actions — workspace typechecks + Vitest |
| Dashboard UI | Metric cards, tables, CSS-only charts (Phase 7), loading/error/empty/success states |
| Limitations | Explicit and honest — no auth, deployment, date filters, E2E automation, production SaaS |

**GitHub:** https://github.com/KaterynaSukharevska/behavior-analytics

**Entry points:**

- [`README.md`](../README.md) — GitHub portfolio landing page
- [`docs/README.md`](README.md) — documentation index
- [`portfolio/phase-11-closure-summary.md`](portfolio/phase-11-closure-summary.md) — final readiness decision

---

## Implemented product flow (unchanged)

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

## Product / design direction

Phase 12 should make the dashboard feel closer to a **professional analytics product** while staying honest about scope.

Design goals:

1. **Left sidebar** — primary navigation / report sections; stable shell for the dashboard.
2. **Clean main content area** — one clear reading column; reduce stacked hero + status + nested panels where possible.
3. **Report cards** — each report as a focused card with a clear title, short helper text, and visual hierarchy.
4. **Simple analytics hierarchy** — overview first, then detail reports; not too many metrics on one screen.
5. **Performance-style clarity** — inspired by how Sentry and similar tools separate navigation from content; **inspiration only**, not a pixel-perfect clone or trademark imitation.
6. **Real data only** — charts and numbers come from existing reporting API responses after local demo events.
7. **Honest copy** — local MVP, demo site, privacy-conscious tracker; no fake production claims.

Current dashboard layout (before Phase 12) includes a hero section, a local system status card, overview metrics, and a `dashboard-reports` grid — see `apps/dashboard/src/app/page.tsx`. Phase 12 may simplify or relocate these elements into the new shell.

---

## Sentry-like dashboard inspiration (inspiration only)

Use **Sentry** (and similar analytics/performance tools) as **layout inspiration**, not as a clone target.

Borrow ideas such as:

- persistent left sidebar with section labels;
- calm page background and elevated content panels;
- restrained typography and spacing;
- a small set of high-signal metrics above detailed breakdowns;
- tables and simple charts as supporting detail, not decorative noise.

Do **not**:

- copy Sentry branding, colors, logos, or exact component names;
- imply this project is Sentry, is affiliated with Sentry, or matches enterprise observability scope;
- add issue tracking, alerting, distributed tracing, or other Sentry product features;
- present the UI as a deployed multi-tenant SaaS.

---

## What Phase 12 should improve

| Area | Intent |
|------|--------|
| **Layout shell** | Sidebar + main content; less visual clutter |
| **Report structure** | Flatter hierarchy; fewer redundant wrappers |
| **Charts** | Clearer, more polished visuals using **existing** report payloads |
| **Typography / spacing** | More consistent professional feel within plain CSS |
| **Portfolio presentation** | Dashboard reads better live and in screenshots (12.5) |

Existing CSS-only charts (Phase 7) in `page-views-by-path.tsx` and `scroll-depth-summary.tsx` may be refined or extended. Prefer improving current patterns over introducing chart libraries.

Preserve for every report section:

- loading state;
- error state;
- empty state;
- success state.

---

## What Phase 12 must not change

Unless a **separate, explicitly scoped milestone** says otherwise:

| Out of scope | Notes |
|--------------|-------|
| Tracker SDK | Privacy behavior is fixed |
| Ingest API reporting logic | Reuse existing endpoints and helpers |
| Prisma schema / migrations | No new event types or tables for UI polish |
| Demo-site marketing content | Unless a tiny link/copy tweak is required for dashboard consistency |
| CI workflow | No new CI steps unless a dependency is explicitly approved |
| GraphQL / microfrontends | Permanently out of scope |
| Auth, deployment, rate limiting, monitoring | Separate phases only |
| Date filters, pagination, aggregation tables | Not in Phase 12 |
| E2E / Playwright / screenshot automation | Not in Phase 12 |
| Fake metrics or random chart data | Forbidden |
| Production / customer / revenue claims | Forbidden |
| Root README rewrite | Small updates in 12.5 only if screenshots or UI labels change |
| `docs/architecture/testing-strategy.en.md` | Do not edit unless explicitly required |

Phase 12.1 (this document) is **docs-only**. Implementation milestones (12.2+) touch **dashboard UI and CSS** only by default.

---

## Required project rules (from existing documentation)

Future agents must read and follow these before coding:

| Document | Purpose |
|----------|---------|
| [`ai/cursor-working-rules.md`](ai/cursor-working-rules.md) | Agent behavior, scope, privacy, testing |
| [`architecture/architecture.en.md`](architecture/architecture.en.md) | System overview and stack |
| [`architecture/frontend-conventions.en.md`](architecture/frontend-conventions.en.md) | Dashboard component and fetch patterns |
| [`architecture/css-conventions.en.md`](architecture/css-conventions.en.md) | Plain CSS, BEM-like naming |
| [`architecture/api-conventions.en.md`](architecture/api-conventions.en.md) | REST endpoints and errors |
| [`architecture/privacy-security.en.md`](architecture/privacy-security.en.md) | Tracker and API privacy rules |
| [`architecture/project-decisions.en.md`](architecture/project-decisions.en.md) | Monorepo, REST, no microfrontends |
| [`portfolio/phase-11-closure-summary.md`](portfolio/phase-11-closure-summary.md) | Stable MVP readiness decision |
| [`portfolio/final-portfolio-review-checklist.md`](portfolio/final-portfolio-review-checklist.md) | Honesty and screenshot rules |

**Stronger rules override weaker defaults.** If this file and `cursor-working-rules.md` conflict on charts, Phase 12 explicitly allows **dashboard chart polish** using real report data — still prefer CSS-only unless a chart library is justified and approved in the task.

---

## Coding rules for future Cursor agents

1. **Read first** — [`cursor-working-rules.md`](ai/cursor-working-rules.md), this file, and relevant architecture docs before editing.
2. **One task = one milestone** — e.g. 12.2 only (sidebar shell), not 12.2 + 12.3 + 12.4 together.
3. **Small, targeted diffs** — avoid broad rewrites of `page.tsx`, all components, and `globals.css` in one change.
4. **Follow existing patterns** — client report components, `reports-api.ts`, `reports-config.ts`, discriminated load states.
5. **Keep route handlers thin** — if API changes are ever requested separately, logic stays in `apps/ingest-api/src/db/` helpers.
6. **No new packages** unless explicitly justified and approved in the task (chart libraries, UI kits, CSS frameworks).
7. **Preserve states** — loading, error, empty, success for every report section.
8. **Typecheck and test touched workspaces** — run relevant checks after code changes.
9. **Document actual behavior only** — do not claim features that are not implemented.
10. **Git hygiene** — do not use `git add .`; stage only files for the current milestone; be careful with pre-existing modified files; do not edit unrelated files (including `docs/architecture/testing-strategy.en.md` unless explicitly required).
11. **Portfolio honesty** — local MVP, not production SaaS; limitations stay visible in UI copy where appropriate.

---

## Frontend / CSS rules for future Cursor agents

From [`frontend-conventions.en.md`](architecture/frontend-conventions.en.md) and [`css-conventions.en.md`](architecture/css-conventions.en.md):

**Stack (current):**

- Next.js, React, TypeScript;
- plain global CSS in `apps/dashboard/src/app/globals.css`;
- no Tailwind, shadcn/ui, TanStack Query, or chart libraries unless explicitly added and documented.

**Structure:**

- `apps/dashboard/src/app/page.tsx` — page composition;
- `apps/dashboard/src/components/` — report section components;
- `apps/dashboard/src/lib/reports-api.ts` — typed API clients;
- `apps/dashboard/src/lib/reports-config.ts` — `INGEST_API_BASE_URL`, `DEMO_SITE_ID`.

**Component pattern:**

- small client components per report;
- `useEffect` + `useState` with discriminated load state;
- semantic headings, `role="alert"` for errors, `aria-label` on sections.

**CSS pattern:**

- BEM-like names: `block`, `block__element`, `block--modifier`;
- reuse `metrics-panel`, `metric-card`, `path-table`, `skeleton-line` where they still fit;
- add new semantic classes for sidebar/shell rather than overloading unrelated blocks;
- no inline styles for normal UI;
- reuse existing colors from `globals.css`; avoid duplicate near-colors;
- keep accessibility basics (semantic HTML, tables for tabular data).

**Phase 12 UI libraries:**

- default: **no new UI libraries**;
- chart libraries: only if CSS-only approach is insufficient **and** the task explicitly approves the dependency; then update `frontend-conventions.en.md` and `architecture.en.md`.

---

## Privacy rules (tracker / reporting)

Unchanged from [`privacy-security.en.md`](architecture/privacy-security.en.md). Phase 12 UI work must not encourage or document invasive tracking.

**Tracker must not collect:**

- form values;
- names;
- emails;
- phone numbers;
- message text;
- cookies;
- `localStorage` contents;
- arbitrary DOM text;
- DOM snapshots;
- session replay data.

**Click tracking:**

- opt-in via `data-analytics-id` only;
- ignore `data-analytics-ignore`, `data-private`, and form controls.

**Conversions:**

- explicit business events from code only;
- no form field reads.

**Reporting / dashboard:**

- use existing `GET /api/reports/*` responses;
- do not fabricate metrics in the UI;
- do not display PII in tables or charts;
- safe error messages only — no stack traces or raw backend errors in the UI.

---

## Architecture / API constraints

- **REST-first** — existing four report endpoints; no GraphQL.
- **Query param** — `siteId=demo-site` for all reports.
- **No new endpoints** in Phase 12 unless a future task explicitly scopes backend work (default: **no**).
- **Raw events, query-time reporting** — no aggregation tables or background jobs.
- **Monorepo boundaries** — dashboard changes stay in `apps/dashboard/`; do not split into microfrontends.
- **Error shape** — `{ "ok": false, "error": "ERROR_CODE" }` on the API; map to user-safe messages in `reports-api.ts`.

---

## Current limitations (still true after Phase 12)

Do not present these as implemented:

- no auth
- no rate limiting
- no deployment yet (plan only: [`deployment/deployment-plan.en.md`](deployment/deployment-plan.en.md))
- no production monitoring / logging strategy
- no date filters
- no aggregation tables or materialized views
- no background jobs
- no batching / offline retry
- no `session_start` / `session_end` emission from tracker
- no E2E or screenshot testing automation
- **not production SaaS**

---

## Suggested Phase 12 milestones

### 12.1 — Phase context document (this file)

- Create `docs/phase-12-context.md`.
- Update `docs/README.md` with Phase 12 link.
- **Docs-only** — no app changes.

### 12.2 — Sidebar / dashboard shell

- Add a left sidebar layout and main content region.
- Move or simplify top-of-page hero/status so the shell feels like a product dashboard.
- Plain CSS; reuse existing color palette.
- Keep all four report sections reachable (sidebar labels or in-page anchors).
- **Scope:** layout components + `globals.css` + minimal `page.tsx` composition — not full chart redesign.

### 12.3 — Reports layout simplification

- Reduce nested UI (duplicate headers, redundant wrappers).
- Consistent report card pattern across overview, page views, interactions, scroll depth.
- Preserve loading/error/empty/success behavior.
- **Scope:** dashboard components and CSS only.

### 12.4 — Simple charts

- Polish or extend CSS-only charts for page views and scroll depth (and overview if appropriate).
- Data from existing API types only — no mock arrays.
- Consider small SVG/HTML enhancements before adding a chart library.
- **Scope:** report components + CSS; no backend changes.

### 12.5 — Visual polish and screenshot / docs update

- Spacing, typography, empty states, sidebar active states.
- Recapture screenshots **only if explicitly requested** in the task; follow [`assets/screenshots/README.md`](assets/screenshots/README.md) privacy rules.
- Small README or portfolio doc tweaks if UI labels change — no marketing rewrite.
- Run [`portfolio/local-demo-checklist.md`](portfolio/local-demo-checklist.md) after visual changes.

---

## Recommended first implementation step after this docs task

**Start with 12.2 — Sidebar / dashboard shell.**

Before coding:

1. Read [`cursor-working-rules.md`](ai/cursor-working-rules.md) and this file.
2. Skim `apps/dashboard/src/app/page.tsx`, `globals.css`, and one report component.
3. List exact files to touch (likely `page.tsx`, new `components/dashboard-shell.tsx` or similar, `globals.css`).
4. State the 5-bullet rule summary and any conflicts.

Do **not** combine 12.2 with 12.3 or 12.4 in one Cursor task.

---

## Verification expectations

**12.1 (docs-only):**

```bash
npm run typecheck
git status --short
```

- Manually verify new markdown links in `docs/phase-12-context.md` and `docs/README.md`.
- No workspace test runs required unless code changed.

**12.2+ (dashboard code):**

```bash
npm run typecheck -w @behavior-analytics/dashboard
npm run test
```

(Adjust if only CSS/component files change — at minimum dashboard typecheck.)

**Manual smoke (after UI milestones):**

- Follow [`setup/dashboard-reporting-smoke.en.md`](setup/dashboard-reporting-smoke.en.md) or [`portfolio/local-demo-checklist.md`](portfolio/local-demo-checklist.md).
- Dashboard loads at http://localhost:3000 with ingest API running.
- All four report sections still show loading → success (or empty/error) correctly.
- Charts reflect real data after demo-site events — not hardcoded demo numbers.
- No new privacy violations in UI copy or sample data display.

---

## Future-agent guardrails

Before editing in Phase 12:

1. Read [`cursor-working-rules.md`](ai/cursor-working-rules.md) and this file.
2. Confirm the task maps to **one** milestone (12.2, 12.3, 12.4, or 12.5).
3. State whether the task conflicts with project rules; **stop** if it requires auth, deployment, date filters, fake data, or broad rewrites without approval.
4. List exact files to touch; keep patches narrow.
5. Do not use `git add .`; stage only intentional files.
6. Ignore or do not “fix” unrelated pre-modified files unless the task includes them.
7. Do not touch tracker, ingest API, Prisma, CI, or demo-site unless the task explicitly says so.
8. Do not edit `docs/architecture/testing-strategy.en.md` unless explicitly required.
9. Preserve honest framing: local portfolio MVP, privacy-conscious analytics, explicit limitations.
10. Do not invent implemented features in docs or UI labels.

Every final Cursor response should include:

- relevant rules followed (5 bullets);
- conflict check;
- files changed;
- what changed;
- commands run and results;
- git status summary;
- what was intentionally not changed;
- suggested next small step.

---

## Related documentation

- [`phase-11-context.md`](phase-11-context.md) — Phase 11 handoff (interview demo readiness)
- [`portfolio/phase-11-closure-summary.md`](portfolio/phase-11-closure-summary.md) — stable MVP closure
- [`phase-7-context.md`](phase-7-context.md) — CSS-only charts introduction
- [`architecture/frontend-conventions.en.md`](architecture/frontend-conventions.en.md) — dashboard patterns
- [`architecture/css-conventions.en.md`](architecture/css-conventions.en.md) — CSS approach
- [`portfolio/local-demo-checklist.md`](portfolio/local-demo-checklist.md) — live demo verification
- [`assets/screenshots/README.md`](assets/screenshots/README.md) — screenshot privacy and naming (for 12.5)
