# Demo day fallback script

## Goal

Use this script when a live local demo cannot be shown during an interview or recording.

It helps you continue with a clear, professional narrative using existing project documentation.

---

## When to use this

Use this fallback when:

- Docker/PostgreSQL is not running
- local ports are busy
- API or dashboard is unavailable
- screen sharing or network issues interrupt flow
- there is not enough interview time for a full live demo

---

## 2-3 minute fallback narrative

"I’ll walk through the project without running the local demo right now.  
Behavior Analytics MVP is a local-first, privacy-conscious portfolio project built to demonstrate practical full-stack TypeScript skills.

The implemented flow is: `demo-site -> tracker SDK -> ingest API -> Zod validation -> Prisma/PostgreSQL -> reporting API -> dashboard UI`.  
The demo-site generates behavior events, the tracker emits safe analytics events, the API validates inputs, PostgreSQL stores validated events, and reporting endpoints feed dashboard sections.

Privacy was a core design constraint: the tracker intentionally avoids collecting form values, names, emails, phone numbers, cookies, localStorage contents, arbitrary DOM text, DOM snapshots, and session replay data. Click tracking is explicit via identifiers like `data-analytics-id`.

What is implemented today includes the end-to-end flow, focused reporting/validation/privacy tests, CI checks, and documentation for setup and interview presentation.

This is intentionally not production SaaS yet: there is no auth, no rate limiting, no deployment, and no date filters yet.  
Next improvements are future work in small phases: deployment implementation, auth/rate limiting, stronger E2E smoke coverage, and deeper reporting depth."  

---

## What to show instead of the live demo

- [ ] root `README.md`
- [ ] `docs/portfolio/technical-highlights.md`
- [ ] `docs/portfolio/interview-walkthrough-script.md`
- [ ] `docs/portfolio/qa-and-objection-handling.md`
- [ ] `docs/portfolio/local-demo-checklist.md`
- [ ] GitHub Actions/CI status (if available)
- [ ] selected source folders only if useful (`apps`, `packages`, `prisma`, `docs`)

---

## Architecture explanation without running the app

- demo-site is the source of behavior events.
- tracker SDK emits privacy-conscious analytics events.
- ingest API accepts events via REST.
- Zod validates payloads before persistence.
- Prisma stores validated events in PostgreSQL (`analytics_events`).
- reporting API endpoints aggregate/read data.
- dashboard renders overview, page views by path, interactions summary, and scroll depth summary.

---

## How to answer “Can you still explain how it works?”

"Yes. The demo-site generates user behavior events, and the tracker SDK emits privacy-conscious analytics events. The Fastify ingest API validates requests, with Zod protecting runtime boundaries. Prisma stores valid events in PostgreSQL. Reporting endpoints aggregate and return report data, and the dashboard renders those report sections in the UI."

---

## What not to do during fallback

- do not debug for too long during the interview
- do not invent fake screenshots or fake data
- do not claim the app is deployed
- do not claim production readiness
- do not over-explain every file
- do not hide limitations

---

## Honest limitations to mention if asked

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

## Good closing line

"Even without a live run today, this project shows practical full-stack TypeScript delivery with privacy-conscious product thinking, built in small phases with clear next improvements."
