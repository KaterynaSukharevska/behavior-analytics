# Q&A and objection handling

## Goal

This document helps prepare concise, honest answers for interviews, portfolio reviews, and recruiter conversations about Behavior Analytics MVP.

Use it to answer questions clearly without overclaiming scope.

---

## Project purpose questions

**Q: What is this project?**  
A: Behavior Analytics MVP is a privacy-conscious website behavior analytics project built as a local-first portfolio/career MVP.

**Q: Who is it for?**  
A: It is primarily for recruiter/interviewer portfolio review and technical discussion, not for production customer use.

**Q: Why did you build it?**  
A: I built it to demonstrate practical full-stack TypeScript skills across frontend, backend, validation, persistence, reporting, testing, and documentation in one coherent project.

**Q: What does the project demonstrate?**  
A: It demonstrates an end-to-end analytics flow: demo-site event generation, tracker SDK behavior, Fastify ingest/reporting APIs, Zod validation, Prisma/PostgreSQL persistence, and dashboard reporting UI.

---

## Architecture questions

**Q: Why use a monorepo?**  
A: It keeps related apps/packages in one place, which makes shared contracts and coordinated changes easier.

**Q: Why npm workspaces?**  
A: npm workspaces provide a lightweight native setup for managing multiple packages/apps without extra tooling overhead.

**Q: Why Fastify for the API?**  
A: Fastify gives a clean, typed Node API structure with straightforward route handling and good fit for this MVP scope.

**Q: Why Next.js for the dashboard and demo-site?**  
A: Next.js is practical for quickly building React-based UI apps with shared TypeScript patterns across demo and dashboard.

**Q: Why REST instead of GraphQL?**  
A: REST keeps this MVP simple and explicit, and it matches the project’s current report endpoint design.

**Q: Why PostgreSQL and Prisma?**  
A: PostgreSQL provides reliable event storage, and Prisma offers a clear developer workflow for schema-based persistence and queries.

**Q: Why Zod?**  
A: Zod adds runtime input validation, so incoming event payloads are checked before persistence.

These are practical choices for this project scope, not the only valid choices.

---

## Privacy questions

**Q: What makes this privacy-conscious?**  
A: Tracking is intentionally limited to behavior signals needed for the MVP and avoids collecting sensitive user content.

**Q: What data does the tracker avoid collecting?**  
A: It intentionally does not collect form values, names, emails, phone numbers, cookies, localStorage contents, arbitrary DOM text, DOM snapshots, or session replay data.

**Q: How does click tracking avoid collecting sensitive content?**  
A: Click tracking is opt-in and based on explicit identifiers such as `data-analytics-id`, rather than collecting raw text/content from the DOM.

**Q: Why not use cookies or session replay?**  
A: This MVP prioritizes simple, privacy-safe behavior analytics for portfolio demonstration, so those features are intentionally out of scope.

---

## MVP trade-off questions

**Q: Why is there no authentication yet?**  
A: Auth is a later hardening step; this phase focuses on a clear local MVP and portfolio narrative first.

**Q: Why is there no rate limiting yet?**  
A: Rate limiting is planned as future hardening, not part of the current local-first MVP scope.

**Q: Why is it not deployed yet?**  
A: Deployment is documented as a plan, but intentionally not implemented yet to keep scope controlled and honest.

**Q: Why are there no date filters yet?**  
A: Date filters are a useful next iteration, but current phases focused on core flow and reliable baseline reports first.

**Q: Why are there no aggregation tables or materialized views?**  
A: Current report volume/scope is MVP-level and query-time reporting is sufficient for demonstration.

**Q: Why are there no background jobs?**  
A: Background jobs were intentionally deferred to avoid premature complexity in a portfolio-first MVP.

**Q: Why no chart library?**  
A: The dashboard uses simple CSS-only visuals to keep dependencies low and implementation easy to explain.

**Q: Why no E2E tests yet?**  
A: Testing currently focuses on high-value unit/integration behavior; E2E is a planned future improvement.

---

## Technical depth questions

**Q: How does the end-to-end event flow work?**  
A: `demo-site -> tracker SDK -> POST /api/events -> Zod validation -> Prisma/PostgreSQL -> GET /api/reports/* -> dashboard UI`.

**Q: Where does validation happen?**  
A: Validation happens in the ingest path using Zod before events are persisted.

**Q: How are events stored?**  
A: Valid events are stored in PostgreSQL (`analytics_events`) through Prisma.

**Q: How does the dashboard get report data?**  
A: It fetches report data from REST endpoints (`/api/reports/overview`, `page-views-by-path`, `interactions-summary`, `scroll-depth-summary`) for `siteId=demo-site`.

**Q: What tests exist?**  
A: The project includes reporting helper tests, reporting endpoint tests, and tracker privacy tests via Vitest.

**Q: What does CI check?**  
A: GitHub Actions CI runs workspace typechecks and current Vitest suites for implemented workspaces.

---

## Limitations and honest answers

When asked about limitations, answer directly and calmly: this is an intentionally scoped local MVP and these gaps are known, documented, and planned.

Current limitations:

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

## Good answer to: “What would you improve next?”

"Next, I’d continue in small phases: implement deployment from the existing plan, add basic auth and rate limiting, introduce date filters, add E2E smoke coverage, improve batching/offline retry behavior, and deepen reporting capabilities. I’d also add a basic monitoring/logging strategy. I’d keep each step scoped and only present features after they are implemented."

---

## What not to say

Do not claim:

- production readiness
- enterprise analytics
- advanced security hardening
- real-time large-scale analytics
- session replay
- cookie-based tracking
- deployed SaaS
- complete monitoring/observability
- complete GDPR/legal compliance
