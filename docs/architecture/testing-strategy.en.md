# Behavior Analytics MVP — Testing Strategy

This document describes the current verification approach and practical Phase 6 testing priorities.

The goal is focused confidence, not enterprise-heavy test coverage.

---

## Current Automated Checks

### TypeScript typechecks

Run per workspace:

```bash
npm run typecheck --workspace=@behavior-analytics/ingest-api
npm run typecheck --workspace=@behavior-analytics/dashboard
npm run typecheck --workspace=@behavior-analytics/tracker
npm run typecheck --workspace=@behavior-analytics/analytics-core
```

Root `typecheck` is currently a placeholder, so prefer workspace commands.

### Analytics-core tests

`packages/analytics-core` has Vitest tests for Zod schemas.

Run:

```bash
npm run test --workspace=@behavior-analytics/analytics-core
```

These tests currently cover basic valid/invalid event validation behavior.

---

## Current Manual Smoke Tests

### Tracker smoke

Doc:

```txt
docs/setup/tracker-local-smoke.en.md
```

Covers:

- starting local services;
- generating page views, clicks, scroll depth, and conversions;
- checking browser Network requests;
- querying stored demo events.

### Dashboard reporting smoke

Doc:

```txt
docs/setup/dashboard-reporting-smoke.en.md
```

Covers:

- full local startup;
- generating demo events;
- checking all reporting API endpoints with curl;
- checking dashboard sections;
- checking safe error behavior when ingest API is stopped.

---

## Phase 6 Testing Priorities

### 1. Reporting helpers

Add focused unit tests for helpers under:

```txt
apps/ingest-api/src/db/
```

Priority helpers:

- overview totals;
- page views by path;
- interactions summary;
- scroll depth summary.

Tests should verify:

- correct grouping;
- correct count mapping;
- missing JSON fields are ignored;
- sorting rules;
- top 10 limits where applicable;
- valid scroll milestones only.

If direct Prisma/database testing is too heavy at first, extract tiny pure aggregation helpers and test those.

### 2. API endpoints

Add tests for Fastify routes when practical.

Focus:

- `INVALID_SITE_ID` for missing/blank query;
- success response shapes;
- safe `500` error codes from reporting failures;
- ingest payload validation errors;
- body size behavior if practical.

### 3. Tracker privacy behavior

Add tests around privacy-sensitive tracker helpers.

Priority:

- `data-analytics-id` required for clicks;
- `data-analytics-ignore` ignored;
- `data-private` ignored;
- form fields ignored;
- password inputs ignored;
- conversion tracking does not read form data.

### 4. Dashboard components

Component tests are useful but not the first priority.

If added, focus on:

- loading state;
- error state;
- empty state;
- success state for each report component.

Avoid over-testing visual details. Test behavior and visible copy.

---

## What Not To Overbuild

Do not add heavy test infrastructure before the core risk is clear.

Avoid:

- large E2E framework setup as the first Phase 6 step;
- brittle screenshot tests;
- testing implementation details of React hooks;
- mocking every browser API unless needed.

---

## Suggested Phase 6 Order

1. Ensure typechecks pass for changed workspaces.
2. Add tests for pure reporting aggregation logic.
3. Add API route tests for validation and safe error responses.
4. Add tracker privacy tests.
5. Add dashboard state tests only if they remain easy to maintain.

---

## Manual Checks Still Matter

Because this is an analytics product, manual smoke testing remains valuable.

After meaningful tracker, ingest, reporting, or dashboard changes, run the relevant smoke doc:

- tracker changes → `tracker-local-smoke.en.md`;
- reporting/dashboard changes → `dashboard-reporting-smoke.en.md`.
