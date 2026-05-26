# Behavior Analytics MVP - Phase 7 Cursor Context

## Purpose of This File

Phase 7 handoff: **project operations and portfolio polish**.

Use this file to understand:

- what Phase 7 changed;
- which files matter for CI and dashboard chart work;
- what was intentionally not changed;
- how to continue safely in the next phase.

---

## 1. Phase 7 Summary

Phase 7 focused on making the existing local MVP easier to present and safer to maintain:

- basic GitHub Actions CI;
- README portfolio polish and CI badge;
- simple dashboard charts using existing report data.

Phase 7 did **not** introduce production deployment, authentication, rate limiting, or backend architecture changes. The project remains a local-first portfolio/career MVP, not a production SaaS.

---

## 2. Completed Phase 7 Milestones

- **7.1 Basic CI** - added a minimal GitHub Actions workflow for existing checks.
- **7.2 CI badge and README portfolio polish** - added the CI badge and kept README wording portfolio-focused.
- **7.3 Simple dashboard charts** - added CSS-only visual charts to existing dashboard reports.

---

## 3. Basic CI Details

Workflow location:

- `.github/workflows/ci.yml`

Current CI behavior:

- runs on pull requests;
- runs on pushes to `main`;
- uses Node.js 20;
- installs dependencies with `npm ci`;
- runs `npm run db:generate`;
- runs existing workspace typecheck commands;
- runs existing workspace Vitest tests.

The CI workflow intentionally does **not** add:

- deployment;
- Docker publishing;
- preview environments;
- linting;
- new tools;
- new packages.

---

## 4. README / Portfolio Polish Details

README updates made during Phase 7:

- CI badge added near the top of `README.md`;
- wording keeps the project framed as a local-first portfolio/career MVP;
- README does not claim production or deployed status.

The project should continue to describe what is actually implemented, not aspirational production architecture.

---

## 5. Dashboard Charts Details

Dashboard charts added during Phase 7:

- CSS-only charts were added without chart libraries.
- `PageViewsByPath` now shows horizontal bars using existing `{ path, pageViews }[]` report data.
- `ScrollDepthSummary` now shows a simple milestone/bar visualization using existing `{ depthPercent, events }[]` report data.
- Existing loading, error, empty, and success states were preserved.
- Existing tables/textual details were preserved.
- Existing backend reporting endpoints were reused.

No backend changes or new report endpoints were added.

Important dashboard files:

- `apps/dashboard/src/app/page.tsx`
- `apps/dashboard/src/components/page-views-by-path.tsx`
- `apps/dashboard/src/components/scroll-depth-summary.tsx`
- `apps/dashboard/src/app/globals.css`
- `apps/dashboard/src/lib/reports-api.ts`

---

## 6. Important Local Runtime Note

Dashboard reports require the ingest API and PostgreSQL to be running locally.

If dashboard report cards show error states, check these first:

- Docker/PostgreSQL is running;
- Prisma migrations/client setup are ready;
- ingest API is running and reachable;
- dashboard points to the expected ingest API URL.

Example local services:

- dashboard: http://localhost:3000
- demo-site: http://localhost:3001
- ingest-api: http://localhost:4000
- health: http://localhost:4000/api/health

---

## 7. Verification Completed

Verification documented for Phase 7:

- `npm run typecheck -w @behavior-analytics/dashboard`
- CI passed on GitHub after push.
- Basic visual browser check confirmed the page views chart renders with local data.

Scroll depth was not separately documented as visually checked. It uses the same CSS-only chart pattern and existing report state handling, but future work should visually confirm it when local scroll-depth data is available.

---

## 8. What Was Intentionally Not Changed

Phase 7 intentionally did not add:

- auth;
- deployment implementation;
- rate limiting;
- monitoring/logging strategy;
- date filters;
- new reporting endpoints;
- chart library;
- E2E or screenshot testing;
- aggregation tables or materialized views;
- background jobs.

---

## 9. Current Project State After Phase 7

Phase 1-7 are complete.

The project now has:

- a working local full-stack analytics flow;
- privacy-conscious tracker behavior;
- Fastify ingest API with Zod validation;
- Prisma/PostgreSQL persistence;
- reporting API endpoints;
- dashboard UI reports with loading/error/empty/success states;
- basic CI;
- a more portfolio-friendly dashboard with simple charts.

The project is still local-first and is not a production SaaS.

---

## 10. Recommended Next Directions

Good next directions:

- **A. Demo/README screenshots and portfolio presentation polish** - best next step for GitHub, CV, LinkedIn, or interviews.
- **B. Basic deployment planning or actual simple deployment** - choose only if a live demo URL becomes the top priority.
- **C. Small dashboard UX polish** - keep it narrow and based on existing reports.
- **D. Security hardening planning** - document rate limiting/auth boundaries before implementing them.
- **E. Session events or batching/offline retry later** - useful later, but not the next default step.

Avoid starting large backend, auth, deployment, or data-model work unless it is explicitly selected as the next phase.

---

## 11. Recommended Next First Step

Recommended default: add screenshots or demo media for portfolio presentation.

Alternative: choose deployment as Phase 8 only if ready to accept the extra setup work and keep the deployment scope small.

Keep using small Cursor prompts: one task should equal one small milestone.
