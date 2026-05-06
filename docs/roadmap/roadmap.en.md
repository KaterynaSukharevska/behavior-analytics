# Behavior Analytics MVP — Roadmap v1

## 1. Purpose of This Document

This roadmap defines the recommended implementation sequence for Behavior Analytics MVP.

The goal is to keep the project focused, realistic, and portfolio-ready.

This roadmap should help answer:

- what should be built first;
- what should wait;
- how to avoid overengineering;
- how to move from documentation to working product;
- how to create a strong GitHub/portfolio/interview story.

## 2. Roadmap Principles

### 2.1 Product loop first

The project should prioritize the full product loop:

1. Create a project/site.
2. Install tracking snippet.
3. Collect behavior events.
4. Store events.
5. Show reports in dashboard.
6. Explain what the data means.

A small complete loop is better than many disconnected features.

### 2.2 Documentation before code, but not forever

Documentation should guide the project, not replace implementation.

The first documentation layer should include:

- Product Definition
- Domain Model and Event Taxonomy
- Technical Architecture
- Roadmap
- Local Development Setup

After that, implementation should begin.

### 2.3 MVP before advanced analytics

The MVP should not include:

- session replay;
- A/B testing;
- feature flags;
- enterprise heatmaps;
- advanced segmentation;
- complex real-time infrastructure;
- billing;
- multi-user roles.

These can wait.

### 2.4 Portfolio quality matters

This is not only a technical project. It is also a career asset.

Each phase should create visible evidence:

- clean code;
- meaningful commits;
- good README updates;
- screenshots;
- demo scenario;
- architecture explanation;
- tests.

## 3. Phase Overview

```txt
Phase 0 — Product and Planning Documentation
Phase 1 — Local Development and Repo Foundation
Phase 2 — Shared Contracts and Domain Types
Phase 3 — Backend Foundation
Phase 4 — Tracker SDK Foundation
Phase 5 — Demo Site Foundation
Phase 6 — Dashboard Foundation
Phase 7 — End-to-End Tracking Flow
Phase 8 — Reporting and Aggregation
Phase 9 — Analytics UI Polish
Phase 10 — Security and Privacy Hardening
Phase 11 — Testing and QA
Phase 12 — Portfolio Packaging
Phase 13 — Deployment
```

## 4. Phase 0 — Product and Planning Documentation

### Goal

Create the minimum documentation needed to start implementation with a clear direction.

### Deliverables

- `docs/README.md`
- `docs/product/product-definition.en.md`
- `docs/product/product-definition.ru.md`
- `docs/product/domain-model-and-event-taxonomy.en.md`
- `docs/product/domain-model-and-event-taxonomy.ru.md`
- `docs/architecture/architecture.en.md`
- `docs/architecture/architecture.ru.md`
- `docs/roadmap/roadmap.en.md`
- `docs/roadmap/roadmap.ru.md`
- `docs/setup/local-development.en.md`
- `docs/setup/local-development.ru.md`

### Success Criteria

- The product idea is clear.
- MVP scope is defined.
- Non-goals are explicit.
- Core domain entities are documented.
- Event taxonomy is documented.
- Architecture direction is documented.
- Implementation sequence is clear.

### Status

Current phase.

## 5. Phase 1 — Local Development and Repo Foundation

### Goal

Create a clean monorepo foundation that can run locally.

### Deliverables

Root setup:

- `package.json`
- `package-lock.json`
- `tsconfig.base.json`
- `.gitignore`
- `README.md`

Folder structure:

```txt
apps/
  dashboard/
  ingest-api/
  demo-site/

packages/
  tracker/
  types/
  analytics-core/
  config/

docs/
```

Tooling:

- npm workspaces;
- TypeScript baseline;
- basic scripts;
- formatting/linting direction;
- Docker Compose for PostgreSQL;
- `.env.example`.

### Recommended root scripts

```json
{
  "scripts": {
    "dev": "npm run dev --workspaces",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "typecheck": "npm run typecheck --workspaces"
  }
}
```

### Success Criteria

- Repository has clear structure.
- npm workspaces are configured.
- TypeScript baseline exists.
- PostgreSQL can run locally via Docker.
- The project can be opened in Cursor.
- The setup is documented.

## 6. Phase 2 — Shared Contracts and Domain Types

### Goal

Create shared TypeScript/Zod contracts that will be used by tracker, backend, and dashboard.

### Deliverables

In `packages/types`:

- event type definitions;
- API DTO definitions;
- shared enums.

In `packages/analytics-core`:

- Zod schemas for event payloads;
- event normalization helpers;
- scroll milestone helpers;
- privacy-related helper types;
- basic report calculation helpers if useful.

### Must include

- `session_start`
- `session_end`
- `page_view`
- `click`
- `scroll_depth`
- `conversion`

### Success Criteria

- Shared event contracts exist.
- Payload schemas are validated with Zod.
- Tests cover schema validation.
- Backend and tracker can import the same contracts.

## 7. Phase 3 — Backend Foundation

### Goal

Create the Fastify backend foundation.

### Deliverables

In `apps/ingest-api`:

- Fastify server;
- health endpoint;
- environment validation;
- database connection;
- basic error handling;
- logging;
- request size limits;
- CORS configuration;
- initial project/site endpoints;
- initial ingest endpoint shape.

Recommended endpoints:

```txt
GET  /api/health
POST /api/ingest/events
GET  /api/projects
POST /api/projects
```

### Database deliverables

- initial migration setup;
- tables for projects/sites;
- raw events table;
- sessions table if needed early.

### Success Criteria

- Backend runs locally.
- Health endpoint works.
- Database connection works.
- Project can be created.
- Ingest endpoint validates payload.
- Invalid events are rejected safely.

## 8. Phase 4 — Tracker SDK Foundation

### Goal

Create the embeddable tracking SDK.

### Deliverables

In `packages/tracker`:

- `init()` method;
- tracker config;
- session id generation;
- event queue;
- batching;
- transport with `fetch`;
- `sendBeacon` support for unload/visibility;
- page view tracking;
- click tracking;
- scroll milestone tracking;
- manual conversion tracking.

### Public API direction

```ts
analytics.init({
  siteId: "site_123",
  endpoint: "http://localhost:4000/api/ingest/events",
})

analytics.trackConversion("signup_clicked")
```

### Success Criteria

- Tracker can initialize on a page.
- Tracker can send page view events.
- Tracker can send click events.
- Tracker can send scroll events.
- Tracker batches events.
- Tracker does not collect sensitive form values.
- Unit tests cover key tracker logic.

## 9. Phase 5 — Demo Site Foundation

### Goal

Create a realistic demo website that can generate behavior data.

### Deliverables

In `apps/demo-site`:

- landing page;
- features page;
- pricing page;
- contact page;
- thank-you page;
- CTA buttons;
- scrollable content sections;
- tracking snippet integration;
- manual conversion trigger.

Recommended pages:

```txt
/
 /features
 /pricing
 /contact
 /thank-you
```

### Success Criteria

- Demo site runs locally.
- Tracking SDK is installed.
- Visiting pages generates page views.
- Clicking CTAs generates click events.
- Scrolling generates scroll depth events.
- Conversion action can be triggered.

## 10. Phase 6 — Dashboard Foundation

### Goal

Create the dashboard shell and basic project management flow.

### Deliverables

In `apps/dashboard`:

- Next.js app;
- layout;
- navigation;
- dashboard home;
- project list;
- create project page;
- project settings page;
- tracking snippet page;
- empty states;
- loading states;
- error states.

### Auth direction

At this stage, auth can be simple or mocked if necessary.

The important thing is to prepare protected dashboard structure without spending too much time on auth complexity.

### Success Criteria

- Dashboard runs locally.
- User can see project list.
- User can create a project/site.
- User can view tracking snippet.
- UI has basic polish and structure.

## 11. Phase 7 — End-to-End Tracking Flow

### Goal

Connect tracker, demo site, backend, database, and dashboard.

### Deliverables

- Demo site sends real events.
- Backend validates and stores events.
- Database contains raw events.
- Dashboard can display basic event counts.
- Local setup instructions are updated.

### Success Criteria

The following flow works locally:

1. Start PostgreSQL.
2. Start ingest API.
3. Start dashboard.
4. Start demo site.
5. Create project.
6. Copy/use tracking snippet.
7. Visit demo site.
8. Generate events.
9. See data in dashboard.

This is the first major milestone.

## 12. Phase 8 — Reporting and Aggregation

### Goal

Build useful MVP analytics reports.

### Deliverables

Backend report endpoints:

```txt
GET /api/projects/:projectId/overview
GET /api/projects/:projectId/pages
GET /api/projects/:projectId/sources
GET /api/projects/:projectId/clicks
GET /api/projects/:projectId/scroll-depth
GET /api/projects/:projectId/funnel
```

Report types:

- overview metrics;
- top pages;
- traffic sources;
- top clicks;
- scroll depth by page;
- simple funnel.

### Success Criteria

- Reports are calculated from stored events.
- Date range filters work.
- Report DTOs are typed.
- Basic tests cover report calculations.

## 13. Phase 9 — Analytics UI Polish

### Goal

Turn raw reports into a polished dashboard experience.

### Deliverables

Dashboard UI:

- metric cards;
- time series chart;
- top pages table;
- sources chart/table;
- top clicks table;
- scroll depth visualization;
- simple funnel visualization;
- per-page click visualization;
- empty states;
- loading skeletons;
- error handling.

### Success Criteria

- Dashboard looks portfolio-ready.
- Reports are readable.
- Charts are meaningful.
- Empty states explain what to do next.
- Demo scenario can be shown visually.

## 14. Phase 10 — Security and Privacy Hardening

### Goal

Make privacy and security visible in implementation.

### Deliverables

Tracker:

- ignore form field values;
- ignore password fields;
- support `data-analytics-ignore`;
- support `data-analytics-id`;
- sanitize element text;
- limit payload size.

Backend:

- payload validation;
- request size limits;
- ingest rate limiting;
- CORS configuration;
- project ownership checks;
- avoid sensitive logs;
- safe error responses.

Documentation:

- privacy behavior;
- what is collected;
- what is never collected;
- data deletion direction.

### Success Criteria

- Privacy boundaries are implemented.
- Security basics are covered.
- README can explain privacy-aware design.
- Tests cover sensitive data handling.

## 15. Phase 11 — Testing and QA

### Goal

Add enough tests to show engineering maturity.

### Deliverables

Unit tests:

- event schemas;
- tracker batching;
- scroll milestones;
- click metadata;
- privacy masking;
- report calculations.

Integration tests:

- ingest API;
- database writes;
- project API;
- report API.

E2E tests:

- create project;
- install/use tracker on demo site;
- generate events;
- verify dashboard data.

### Success Criteria

- Main product flow is tested.
- Critical logic has unit tests.
- API has integration coverage.
- E2E demo flow works.

## 16. Phase 12 — Portfolio Packaging

### Goal

Prepare the project as a career asset.

### Deliverables

- root `README.md`;
- architecture overview;
- screenshots;
- demo GIF/video if possible;
- setup guide;
- demo script;
- CV bullet points;
- LinkedIn project post draft;
- interview explanation notes.

### Suggested portfolio positioning

> Behavior Analytics MVP is a privacy-aware website behavior analytics product built with a tracking SDK, event ingestion backend, and polished analytics dashboard. It demonstrates modern frontend engineering, product thinking, data visualization, browser APIs, TypeScript, testing, and full product delivery.

### Success Criteria

- The project is understandable in 2 minutes.
- GitHub looks professional.
- Demo scenario is clear.
- The project can be discussed confidently in interviews.

## 17. Phase 13 — Deployment

### Goal

Deploy the MVP so it can be shared.

### Possible deployment direction

- Dashboard: Vercel or similar.
- Demo site: Vercel or similar.
- Ingest API: Render, Fly.io, Railway, or similar.
- Database: managed PostgreSQL.

### Success Criteria

- Dashboard is publicly accessible.
- Demo site is publicly accessible.
- Tracking works in deployed environment.
- Reports show real demo data.
- Environment variables are documented.

## 18. Suggested Implementation Order

The recommended order is:

```txt
1. Finish docs baseline
2. Create repo foundation
3. Add shared contracts
4. Build backend health + database
5. Build tracker basics
6. Build demo site
7. Build dashboard shell
8. Connect end-to-end flow
9. Add reports
10. Polish UI
11. Harden privacy/security
12. Add tests
13. Package portfolio
14. Deploy
```

## 19. What Not To Do Early

Avoid these too early:

- advanced heatmaps;
- session replay;
- microfrontends;
- complex auth roles;
- billing;
- multi-tenant enterprise features;
- Kafka/event streaming;
- data warehouse sync;
- Kubernetes;
- complex design system;
- AI insights as core MVP.

## 20. Current Next Step

After this roadmap is saved, the next recommended document is:

```txt
docs/setup/local-development.en.md
docs/setup/local-development.ru.md
```

That document should explain:

- required tools;
- Node.js/npm;
- Docker Desktop;
- PostgreSQL local setup;
- recommended ports;
- env files;
- first local run plan.

After the setup document, implementation can begin.
