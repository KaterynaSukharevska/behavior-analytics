# Interview prep checklist

## Goal

Use this checklist shortly before a recruiter call, interview, portfolio review, or demo recording.

It helps you prepare a calm, clear project presentation or live demo.

---

## 30 minutes before the interview

- [ ] Open the repository locally.
- [ ] Open root `README.md`.
- [ ] Open portfolio docs:
  - `docs/portfolio/30-second-60-second-120-second-pitch.md`
  - `docs/portfolio/interview-walkthrough-script.md`
  - `docs/portfolio/technical-highlights.md`
  - `docs/portfolio/qa-and-objection-handling.md`
  - `docs/portfolio/local-demo-checklist.md`
- [ ] Decide if you will run a live local demo.
- [ ] If demoing live, quickly confirm local services are available.
- [ ] Prepare browser tabs in advance (see section below).
- [ ] Prepare terminal tabs only if needed for local run/health checks.
- [ ] Open your GitHub repository page.
- [ ] Avoid last-minute code changes before the call.

---

## Demo dry-run checklist

Follow existing documented commands from `README.md` and `docs/portfolio/local-demo-checklist.md`.

- [ ] Start PostgreSQL/Docker if needed.
- [ ] Start ingest API.
- [ ] Start dashboard.
- [ ] Start demo-site.
- [ ] Open health endpoint: `http://localhost:4000/api/health`.
- [ ] Generate a few demo events from the demo-site.
- [ ] Refresh dashboard.
- [ ] Verify all report sections render:
  - overview
  - page views by path
  - interactions summary
  - scroll depth summary

If commands are unclear, use `docs/portfolio/local-demo-checklist.md` as the source of truth.

---

## Browser tabs to prepare

- [ ] GitHub repository page
- [ ] root `README.md`
- [ ] dashboard: `http://localhost:3000`
- [ ] demo-site: `http://localhost:3001`
- [ ] ingest API health: `http://localhost:4000/api/health`
- [ ] `docs/portfolio/local-demo-checklist.md`
- [ ] `docs/portfolio/interview-walkthrough-script.md`
- [ ] `docs/portfolio/qa-and-objection-handling.md`
- [ ] `docs/portfolio/technical-highlights.md`

---

## 2-minute rehearsal

- [ ] Say the 30-second pitch once.
- [ ] Explain the end-to-end flow once.
- [ ] Explain privacy constraints once.
- [ ] Explain one trade-off honestly.
- [ ] Explain one next improvement as future work.

---

## Fallback plan if local demo fails

- [ ] Do not panic; stay calm and continue.
- [ ] Switch to README + portfolio docs walkthrough.
- [ ] Show screenshots if you already have them.
- [ ] Explain the intended local flow clearly.
- [ ] Show repository structure briefly (`apps`, `packages`, `docs`, `prisma`).
- [ ] Show tests/CI summary if useful.
- [ ] Avoid live debugging for too long during the interview.

No screenshot tooling or automation is required for this fallback.

---

## Key talking points to remember

- privacy-conscious analytics
- full-stack TypeScript
- tracker SDK to dashboard flow
- Zod validation
- Prisma/PostgreSQL persistence
- REST reporting API
- dashboard visualization
- tests and CI
- small phased development

---

## Do not overclaim

Do not claim:

- production readiness
- deployed SaaS
- enterprise analytics
- complete GDPR/legal compliance
- session replay
- cookie-based tracking
- real-time large-scale analytics
- advanced security hardening

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

## Good closing answer

"This project demonstrates practical full-stack TypeScript work across tracking, validation, API design, persistence, reporting, testing, and documentation, while keeping privacy as a core design constraint. It is intentionally a local-first portfolio MVP, and the next improvements are future work: deployment implementation, basic auth/rate limiting, date filters, stronger E2E smoke coverage, and deeper reporting depth."
