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

- [`../README.md`](../README.md) — project overview, stack, ports, and roadmap
- [`setup/local-development.en.md`](setup/local-development.en.md) — local setup notes
- [`setup/tracker-local-smoke.en.md`](setup/tracker-local-smoke.en.md) — tracker/demo-site smoke checklist
- [`setup/dashboard-reporting-smoke.en.md`](setup/dashboard-reporting-smoke.en.md) — dashboard/reporting smoke checklist
- [`deployment/deployment-plan.en.md`](deployment/deployment-plan.en.md) — future deployment planning notes
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

## Setup Docs

- [`setup/local-development.en.md`](setup/local-development.en.md)
- [`setup/local-development.ru.md`](setup/local-development.ru.md)
- [`setup/tracker-local-smoke.en.md`](setup/tracker-local-smoke.en.md)
- [`setup/dashboard-reporting-smoke.en.md`](setup/dashboard-reporting-smoke.en.md)

---

## Deployment Docs

- [`deployment/deployment-plan.en.md`](deployment/deployment-plan.en.md) — plan only; deployment is not implemented yet

---

## Phase Handoffs

- [`phase-2-context.md`](phase-2-context.md) — shared contracts and validation
- [`phase-3-context.md`](phase-3-context.md) — Prisma/PostgreSQL persistence
- [`phase-4-context.md`](phase-4-context.md) — tracker SDK and demo-site integration
- [`phase-5-context.md`](phase-5-context.md) — dashboard reporting foundation
- [`phase-6-context.md`](phase-6-context.md) — polish, tests, and portfolio readiness

Phase handoffs are useful implementation history. For stable current conventions, prefer the architecture docs above.
