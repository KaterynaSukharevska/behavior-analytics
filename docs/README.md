# Behavior Analytics MVP Documentation

This folder contains product, architecture, setup, roadmap, smoke testing, and phase handoff documentation for the Behavior Analytics MVP project.

Behavior Analytics MVP is a local-first portfolio project with:

- browser tracker SDK;
- Fastify ingest API;
- PostgreSQL persistence through Prisma;
- Next.js dashboard reports;
- Next.js demo website.

---

## Start Here

- [`../README.md`](../README.md) — **GitHub portfolio entry point** — overview, flow, stack, limitations, links to portfolio docs
- [`setup/local-development.en.md`](setup/local-development.en.md) — local setup notes
- [`setup/tracker-local-smoke.en.md`](setup/tracker-local-smoke.en.md) — tracker/demo-site smoke checklist
- [`setup/dashboard-reporting-smoke.en.md`](setup/dashboard-reporting-smoke.en.md) — dashboard/reporting smoke checklist
- [`portfolio/local-demo-checklist.md`](portfolio/local-demo-checklist.md) — **start here for live demos** — run, verify, and troubleshoot the local flow (health, reports, dashboard cards, clean restart)
- [`portfolio/demo-screenshots-plan.md`](portfolio/demo-screenshots-plan.md) — screenshot sequence, privacy rules, and capture framing (plan only)
- [`assets/screenshots/README.md`](assets/screenshots/README.md) — **screenshot asset folder** — where files live, naming convention, privacy rules
- [`portfolio/interview-walkthrough-script.md`](portfolio/interview-walkthrough-script.md) — 5-7 minute interview walkthrough narrative
- [`portfolio/interview-storyline.md`](portfolio/interview-storyline.md) — 5- and 10-minute storyline, screen-by-screen talk track, architecture and follow-up Q&A
- [`portfolio/technical-highlights.md`](portfolio/technical-highlights.md) — recruiter-friendly map of architecture to skills and interview points
- [`portfolio/qa-and-objection-handling.md`](portfolio/qa-and-objection-handling.md) — concise interview Q&A and objection-handling answers
- [`portfolio/30-second-60-second-120-second-pitch.md`](portfolio/30-second-60-second-120-second-pitch.md) — short spoken pitch versions for interviews and recruiters
- [`portfolio/interview-prep-checklist.md`](portfolio/interview-prep-checklist.md) — quick pre-interview checklist for demo and talk-track readiness
- [`portfolio/final-portfolio-review-checklist.md`](portfolio/final-portfolio-review-checklist.md) — **final GitHub/portfolio readiness** — README, screenshots, local demo, docs, technical honesty
- [`portfolio/phase-11-final-review-notes.md`](portfolio/phase-11-final-review-notes.md) — **Phase 11.1 review outcomes** — checklist results, pass/needs-fix notes, follow-ups
- [`portfolio/phase-11-demo-rehearsal-notes.md`](portfolio/phase-11-demo-rehearsal-notes.md) — **Phase 11.2 demo rehearsal** — tab order, 5/10-min flows, talking points, friction
- [`portfolio/phase-11-closure-summary.md`](portfolio/phase-11-closure-summary.md) — **Phase 11 closure** — final readiness decision and honest limitations
- [`portfolio/project-post-draft.md`](portfolio/project-post-draft.md) — optional LinkedIn / GitHub post copy (honest local MVP framing; not auto-published)
- [`portfolio/demo-day-fallback-script.md`](portfolio/demo-day-fallback-script.md) — 2-3 minute fallback narrative when live demo is unavailable
- [`ai/cursor-working-rules.md`](ai/cursor-working-rules.md) — short working rules for Cursor agents
- [`deployment/deployment-plan.en.md`](deployment/deployment-plan.en.md) — future deployment planning notes
- [`phase-8-context.md`](phase-8-context.md) — current Phase 8 handoff for portfolio presentation polish
- [`phase-9-context.md`](phase-9-context.md) — Phase 9 handoff (portfolio polish and smoke planning)
- [`phase-10-context.md`](phase-10-context.md) — Phase 10 handoff — demo evidence and screenshot assets
- [`phase-11-context.md`](phase-11-context.md) — Phase 11 handoff — interview demo readiness and final portfolio QA
- [`phase-12-context.md`](phase-12-context.md) — **optional** Phase 12 handoff — dashboard visual upgrade / reports UI v2
- [`phase-7-context.md`](phase-7-context.md) — current Phase 7 handoff for CI and portfolio polish
- [`phase-6-context.md`](phase-6-context.md) — current Phase 6 handoff for polish, tests, and portfolio readiness
- [`phase-5-context.md`](phase-5-context.md) — dashboard reporting foundation handoff

---

## Architecture Docs

- [`architecture/architecture.en.md`](architecture/architecture.en.md) — current technical architecture
- [`architecture/data-flow.en.md`](architecture/data-flow.en.md) — event and reporting data flow
- [`architecture/api-conventions.en.md`](architecture/api-conventions.en.md) — REST API conventions and errors
- [`architecture/frontend-conventions.en.md`](architecture/frontend-conventions.en.md) — dashboard frontend patterns
- [`architecture/css-conventions.en.md`](architecture/css-conventions.en.md) — plain CSS conventions
- [`architecture/privacy-security.en.md`](architecture/privacy-security.en.md) — privacy and security rules
- [`architecture/testing-strategy.en.md`](architecture/testing-strategy.en.md) — current checks and Phase 6 testing priorities
- [`testing/basic-smoke-test-plan.md`](testing/basic-smoke-test-plan.md) — P0/P1/P2 smoke checks, manual demo gate, future E2E planning (no Playwright yet)
- [`architecture/project-decisions.en.md`](architecture/project-decisions.en.md) — lightweight decision notes

Russian architecture docs may lag behind English docs.

---

## Product Docs

- [`product/product-definition.en.md`](product/product-definition.en.md)
- [`product/domain-model-and-event-taxonomy.en.md`](product/domain-model-and-event-taxonomy.en.md)
- [`product/product-definition.ru.md`](product/product-definition.ru.md)
- [`product/domain-model-and-event-taxonomy.ru.md`](product/domain-model-and-event-taxonomy.ru.md)

Some product docs include future concepts such as users/workspaces/projects. The current implementation is still local/demo-site focused.

---

## Roadmap Docs

- [`roadmap/roadmap.en.md`](roadmap/roadmap.en.md)
- [`roadmap/roadmap.ru.md`](roadmap/roadmap.ru.md)

---

## Portfolio Docs

- [`portfolio/local-demo-checklist.md`](portfolio/local-demo-checklist.md) — manual local demo checklist for portfolio, interviews, and screenshots (health, reports, troubleshooting, clean restart)
- [`portfolio/demo-screenshots-plan.md`](portfolio/demo-screenshots-plan.md) — which screenshots to capture, what they prove, and privacy-safe capture rules
- [`assets/screenshots/README.md`](assets/screenshots/README.md) — committed screenshot storage path and naming guide (image files added in Phase 10.2+)
- [`portfolio/interview-walkthrough-script.md`](portfolio/interview-walkthrough-script.md) — 5-7 minute interview walkthrough script and talking points
- [`portfolio/interview-storyline.md`](portfolio/interview-storyline.md) — interview storytelling: demo order, what to say per screen, limitations, follow-ups
- [`portfolio/technical-highlights.md`](portfolio/technical-highlights.md) — concise technical highlights for recruiter/interview review
- [`portfolio/qa-and-objection-handling.md`](portfolio/qa-and-objection-handling.md) — practical answers to common interview/recruiter objections
- [`portfolio/30-second-60-second-120-second-pitch.md`](portfolio/30-second-60-second-120-second-pitch.md) — concise 30s, 60s, and 120s project pitch templates
- [`portfolio/interview-prep-checklist.md`](portfolio/interview-prep-checklist.md) — practical checklist to prepare 30 minutes before interviews
- [`portfolio/final-portfolio-review-checklist.md`](portfolio/final-portfolio-review-checklist.md) — final portfolio/GitHub show-readiness review (README, screenshots, honesty, readiness decision)
- [`portfolio/phase-11-final-review-notes.md`](portfolio/phase-11-final-review-notes.md) — Phase 11.1 recorded review notes and follow-up candidates
- [`portfolio/phase-11-demo-rehearsal-notes.md`](portfolio/phase-11-demo-rehearsal-notes.md) — Phase 11.2 live demo rehearsal notes and interview flow
- [`portfolio/phase-11-closure-summary.md`](portfolio/phase-11-closure-summary.md) — Phase 11.5 final closure and portfolio readiness decision
- [`portfolio/project-post-draft.md`](portfolio/project-post-draft.md) — draft LinkedIn and GitHub/repository update posts (adapt before publishing)
- [`portfolio/demo-day-fallback-script.md`](portfolio/demo-day-fallback-script.md) — calm fallback script for interviews when local services are unavailable

---

## Testing Docs

- [`testing/basic-smoke-test-plan.md`](testing/basic-smoke-test-plan.md) — manual smoke priorities, demo pre-checks, privacy-safe test rules, when to consider Playwright (plan only)
- [`architecture/testing-strategy.en.md`](architecture/testing-strategy.en.md) — Vitest/CI baseline and testing priorities

---

## Setup Docs

- [`setup/local-development.en.md`](setup/local-development.en.md)
- [`setup/local-development.ru.md`](setup/local-development.ru.md)
- [`setup/tracker-local-smoke.en.md`](setup/tracker-local-smoke.en.md)
- [`setup/dashboard-reporting-smoke.en.md`](setup/dashboard-reporting-smoke.en.md)

---

## Deployment Docs

- [`deployment/deployment-plan.en.md`](deployment/deployment-plan.en.md) — plan only; deployment is not implemented yet

---

## AI Agent Docs

- [`ai/cursor-working-rules.md`](ai/cursor-working-rules.md) — concise project rules for Cursor agents

---

## Phase Handoffs

- [`phase-2-context.md`](phase-2-context.md) — shared contracts and validation
- [`phase-3-context.md`](phase-3-context.md) — Prisma/PostgreSQL persistence
- [`phase-4-context.md`](phase-4-context.md) — tracker SDK and demo-site integration
- [`phase-5-context.md`](phase-5-context.md) — dashboard reporting foundation
- [`phase-6-context.md`](phase-6-context.md) — polish, tests, and portfolio readiness
- [`phase-7-context.md`](phase-7-context.md) — CI, README polish, and simple dashboard charts
- [`phase-8-context.md`](phase-8-context.md) — portfolio presentation polish context and planning
- [`phase-9-context.md`](phase-9-context.md) — post-Phase 8 handoff and Phase 9 completion summary
- [`phase-10-context.md`](phase-10-context.md) — Phase 10 handoff — demo evidence and screenshot assets
- [`phase-11-context.md`](phase-11-context.md) — Phase 11 handoff — interview demo readiness and final portfolio QA
- [`phase-12-context.md`](phase-12-context.md) — **optional** Phase 12 handoff — dashboard visual upgrade / reports UI v2

Phase handoffs are useful implementation history. For stable current conventions, prefer the architecture docs above. Phase 11 closed the portfolio MVP as show-ready; Phase 12 is optional visual polish only.
