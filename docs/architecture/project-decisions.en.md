# Behavior Analytics MVP — Project Decisions

This document records lightweight architecture decisions for the current MVP.

These are not formal enterprise ADRs. They are practical notes for contributors, reviewers, and future Cursor agents.

---

## 1. npm Workspaces

**Decision:** use npm workspaces.

**Why:**

- npm is familiar and simple;
- one install command prepares apps and packages;
- no extra package manager is needed for the portfolio MVP.

**Current status:** implemented.

---

## 2. Monorepo

**Decision:** keep apps and packages in one repository.

**Why:**

- shared TypeScript/Zod contracts are easy to update;
- the tracker, ingest API, demo site, and dashboard evolve together;
- local setup is easier for a portfolio project.

**Not chosen:** separate repositories or microfrontends.

---

## 3. Next.js for Dashboard and Demo Site

**Decision:** use Next.js for both `apps/dashboard` and `apps/demo-site`.

**Why:**

- good React portfolio signal;
- simple local dev server setup;
- App Router works well for route-based page view tracking;
- demo site and dashboard can share general React/TypeScript patterns.

**Current status:** implemented.

---

## 4. Fastify for Ingest API

**Decision:** use Fastify for `apps/ingest-api`.

**Why:**

- lightweight backend;
- easy route handlers;
- good TypeScript support;
- simple enough for a local MVP.

**Current status:** implemented.

---

## 5. Prisma for DB Access

**Decision:** use Prisma with PostgreSQL.

**Why:**

- readable schema;
- beginner-friendly database workflow;
- good portfolio/interview explainability;
- simple client for inserts and reporting reads.

**Current status:** implemented at root `prisma/schema.prisma`.

---

## 6. PostgreSQL

**Decision:** use PostgreSQL as the local database.

**Why:**

- realistic full-stack choice;
- supports JSON payload storage;
- runs locally through Docker Compose;
- enough for MVP reporting.

**Current status:** implemented.

---

## 7. Raw Events First

**Decision:** store validated raw events first.

**Why:**

- preserves event details for future reports;
- avoids premature aggregation design;
- keeps Phase 3 and Phase 5 easy to explain.

**Current status:** `analytics_events` stores duplicated query columns plus full JSON `payload`.

---

## 8. Query-Time Reporting Before Aggregation Tables

**Decision:** compute dashboard reports from raw events at query time.

**Why:**

- local demo data is small;
- reporting logic stays readable;
- no background jobs or materialized views are needed yet.

**Current status:** implemented for overview, paths, interactions, and scroll depth.

**Future:** aggregation tables may be considered only if data volume or performance requires them.

---

## 9. REST-First API

**Decision:** use REST endpoints.

**Why:**

- easy to test with curl;
- beginner-readable;
- fits current dashboard needs;
- avoids GraphQL complexity.

**Current status:** implemented.

**Not chosen:** GraphQL.

---

## 10. No Microfrontends

**Decision:** no microfrontends.

**Why:**

- one dashboard app is enough;
- microfrontends would add complexity without improving the MVP;
- portfolio clarity matters more than architecture novelty.

**Current status:** intentionally out of scope.

---

## 11. No Charts Until Reporting Foundation Is Stable

**Decision:** start with metric cards and tables before charts.

**Why:**

- verifies data correctness first;
- avoids adding chart dependencies too early;
- keeps Phase 5 focused on reporting foundations.

**Current status:** implemented. Dashboard has cards and tables, no chart library.

**Future:** Phase 6 may add simple charts after tests and polish.

---

## 12. Privacy-Safe Tracker Defaults

**Decision:** the tracker must avoid sensitive data by default.

**Why:**

- behavior analytics can easily become invasive;
- the portfolio should demonstrate privacy-aware engineering;
- safer defaults reduce future risk.

**Current status:** implemented for click, scroll, and conversion tracking.

See [`privacy-security.en.md`](privacy-security.en.md).
