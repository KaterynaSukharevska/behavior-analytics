# Cursor Working Rules

Short rules for Cursor agents working on Behavior Analytics MVP.

## 1. Project Identity

- This is a local-first, privacy-conscious analytics MVP for portfolio/career use.
- It is not a production SaaS and is not deployed yet.
- One task should equal one small milestone.

## 2. Architecture Rules

- Use npm workspaces.
- Keep the current stack: Next.js dashboard, Next.js demo-site, Fastify ingest API, PostgreSQL + Prisma, TypeScript + Zod + Vitest.
- Keep APIs REST-first.
- Do not add GraphQL, microfrontends, or enterprise architecture.
- Do not add new packages unless clearly needed and justified.
- Avoid broad rewrites; follow existing file boundaries and helper patterns.

## 3. Privacy Rules

- Preserve privacy-first tracker behavior.
- Do not collect form values, names, emails, phone numbers, message text, cookies, `localStorage`, arbitrary DOM text, DOM snapshots, or session replay data.
- Click tracking must stay opt-in via `data-analytics-id` and ignore `data-analytics-ignore`, `data-private`, and form controls.
- Conversions must remain explicit business events from code.

## 4. Testing Rules

- Prefer focused tests around changed behavior.
- Run workspace checks relevant to touched files.
- Use Vitest for current test coverage.
- Do not introduce heavy E2E or screenshot testing unless explicitly requested.

## 5. Documentation Rules

- Document actual implementation only, not aspirational architecture.
- Keep docs honest about limitations: no auth, no charts, no date filters, no deployment, no CI/CD unless actually added.
- Update docs when behavior, setup, or architecture changes.

## 6. Out-Of-Scope Defaults

Do not start these unless explicitly requested:

- auth
- charts
- date filters
- deployment implementation
- rate limiting
- aggregation tables or materialized views
- background jobs
- batching/offline retry
- GraphQL
- microfrontends

## 7. Cursor Agent Behavior

- Read the relevant context docs before editing.
- Keep changes minimal, beginner-readable, and portfolio-friendly.
- Preserve loading/error/empty/success states in dashboard reports.
- Keep route handlers thin and reporting logic in small helpers.
- Do not claim production or deployed status unless it is actually implemented and verified.

## 8. Required Start Behavior

Before editing, Cursor agents must:

- Read this rules file.
- Read the relevant phase or context document.
- Summarize the relevant project rules they will follow in 5 bullets.
- Mention any conflicts with project rules before editing.
- Ask only if the task is truly ambiguous; otherwise proceed with the smallest safe change.

## 9. Required Final Response

Every final Cursor response for a task must include:

- Files changed
- What changed
- Commands run and results
- Git status summary
- What was intentionally not changed
- Whether the task is complete or blocked
