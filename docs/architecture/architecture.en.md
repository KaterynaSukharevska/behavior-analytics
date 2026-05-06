# Behavior Analytics MVP — Technical Architecture v1

## 1. Purpose of This Document

This document defines the first version of the technical architecture for Behavior Analytics MVP.

It explains:

- the recommended monorepo structure;
- the responsibilities of each app and package;
- the main data flows;
- API boundaries;
- database direction;
- authentication approach;
- testing strategy;
- local development direction;
- deployment direction.

This document should guide implementation and prevent the project from becoming overcomplicated too early.

## 2. Architecture Goals

The architecture should support a realistic MVP while staying simple enough to build as a portfolio/career project.

Main goals:

- keep the product understandable;
- keep implementation steps clear;
- show modern frontend and full-stack engineering skills;
- support a real end-to-end analytics flow;
- avoid unnecessary enterprise complexity;
- make the project easy to explain in interviews;
- keep privacy and security visible in the design.

## 3. Architecture Principles

### 3.1 MVP-first

Build only what is needed to prove the main product loop:

1. Register a website.
2. Install tracking snippet.
3. Collect behavior events.
4. Store events.
5. Aggregate events.
6. Show useful reports in dashboard.

### 3.2 Monorepo, not microfrontends

The project should use a monorepo.

Microfrontends are not needed for this MVP because they would add complexity without improving the product.

### 3.3 Contract-driven development

Shared contracts should be defined in TypeScript and Zod.

The tracker, backend, and dashboard should agree on:

- event types;
- payload shapes;
- API request/response types;
- validation rules.

### 3.4 Privacy-aware by design

The tracker and backend must be designed around privacy boundaries from the beginning.

The system should not collect sensitive form values, passwords, card data, personal messages, or full DOM snapshots.

### 3.5 Simple before scalable

The first implementation should prefer simple solutions:

- raw event storage first;
- query-time aggregation first;
- one backend service first;
- simple auth first;
- one database first.

Optimization can come later if needed.

## 4. High-level System Overview

The MVP consists of four main runtime parts:

```txt
Demo Site
   |
   | includes tracking script
   v
Tracking SDK
   |
   | batched behavior events
   v
Ingest API / Backend
   |
   | validates and stores events
   v
PostgreSQL
   ^
   | reads aggregated analytics
   |
Dashboard App
```

## 5. Recommended Monorepo Structure

Recommended initial structure:

```txt
behavior_analytics/
  apps/
    dashboard/
    ingest-api/
    demo-site/

  packages/
    tracker/
    types/
    analytics-core/
    config/
    ui/

  docs/
    README.md
    product/
      product-definition.en.md
      product-definition.ru.md
      domain-model-and-event-taxonomy.en.md
      domain-model-and-event-taxonomy.ru.md
    architecture/
      architecture.en.md
      architecture.ru.md
    roadmap/
    setup/

  package.json
  package-lock.json
  tsconfig.base.json
  .gitignore
  README.md
```

## 6. Apps

### 6.1 `apps/dashboard`

The dashboard is the main user-facing web application.

Recommended stack:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui or thin custom UI layer
- TanStack Query
- TanStack Table
- Recharts
- React Hook Form
- Zod

Responsibilities:

- user authentication UI;
- project/site creation;
- tracking snippet page;
- analytics overview;
- pages report;
- traffic sources report;
- clicks report;
- scroll depth report;
- simple funnel report;
- settings screens;
- polished portfolio-ready UI.

The dashboard should not directly access the database. It should communicate with the backend through HTTP API.

### 6.2 `apps/ingest-api`

The ingest API is the backend service.

Recommended stack:

- Fastify
- TypeScript
- PostgreSQL
- Prisma or Drizzle
- Zod
- REST API

Responsibilities:

- health check;
- environment validation;
- event ingestion;
- payload validation;
- batching support;
- project/site API;
- dashboard reporting API;
- auth/session handling or auth integration;
- resource authorization;
- rate limiting;
- logging;
- error handling.

For MVP, one backend app is enough. Separate services are not needed.

### 6.3 `apps/demo-site`

The demo site is used to test and demonstrate the product.

Responsibilities:

- simulate a real marketing website;
- include the tracking snippet;
- provide pages and CTAs for tracking;
- generate page views, clicks, scroll events, and conversions;
- support the portfolio demo scenario.

Recommended pages:

```txt
/
 /features
 /pricing
 /contact
 /thank-you
```

The demo site is important because the project needs to show a real end-to-end product loop.

## 7. Packages

### 7.1 `packages/tracker`

The embeddable tracking SDK.

Responsibilities:

- initialize tracker with site id/site key;
- create and manage session id;
- collect page views;
- collect clicks;
- collect scroll milestones;
- collect conversion events;
- queue events;
- batch events;
- send events using `sendBeacon` where possible;
- fallback to `fetch`;
- avoid sensitive data collection.

The tracker must stay lightweight and browser-focused.

### 7.2 `packages/types`

Shared TypeScript types and API contracts.

Responsibilities:

- common event types;
- API request/response types;
- shared enums;
- common DTO definitions.

This package should not contain app-specific logic.

### 7.3 `packages/analytics-core`

Shared analytics logic.

Responsibilities:

- event schemas;
- Zod validation schemas;
- event normalization helpers;
- device type helpers;
- UTM/referrer parsing helpers;
- scroll milestone helpers;
- safe element metadata helpers;
- reporting calculation helpers where useful.

This package should stay framework-agnostic.

### 7.4 `packages/config`

Shared technical configuration.

Possible contents:

- TypeScript base config;
- ESLint config later if needed;
- formatting config later if needed.

For MVP, keep this package minimal. Do not create too much tooling too early.

### 7.5 `packages/ui`

Shared UI components.

This package is optional for MVP.

Recommendation:

- do not create many shared UI abstractions too early;
- keep UI local to dashboard unless components are clearly reusable;
- avoid turning the project into a design system project.

## 8. Data Flow

### 8.1 Setup Flow

```txt
User
  -> Dashboard
  -> Create project/site
  -> Backend creates site id/site key
  -> Dashboard shows tracking snippet
  -> User installs snippet on demo site
```

### 8.2 Tracking Flow

```txt
Visitor opens Demo Site
  -> Tracking SDK initializes
  -> SDK creates or reuses session id
  -> SDK sends page_view
  -> SDK collects clicks and scroll milestones
  -> SDK batches events
  -> SDK sends events to Ingest API
  -> API validates payload
  -> API stores raw events in PostgreSQL
```

### 8.3 Reporting Flow

```txt
User opens Dashboard
  -> Dashboard requests reports from Backend
  -> Backend reads raw events / aggregates data
  -> Backend returns report DTOs
  -> Dashboard renders charts, tables, and summaries
```

## 9. API Architecture

The API should be REST-first.

GraphQL is not needed for MVP.

### 9.1 Public Ingest API

Used by tracking SDK.

```txt
POST /api/ingest/events
```

Characteristics:

- accepts batched events;
- uses public site id/site key;
- validates payload with Zod;
- applies rate limiting;
- rejects unknown sites;
- ignores or rejects invalid events;
- never trusts client input blindly.

Example request shape:

```ts
type IngestEventsRequest = {
  site_id: string
  events: AnalyticsEventPayload[]
}
```

### 9.2 Dashboard API

Used by dashboard app.

Recommended endpoints:

```txt
GET  /api/health

GET  /api/projects
POST /api/projects
GET  /api/projects/:projectId
PATCH /api/projects/:projectId

GET  /api/projects/:projectId/overview
GET  /api/projects/:projectId/pages
GET  /api/projects/:projectId/sources
GET  /api/projects/:projectId/clicks
GET  /api/projects/:projectId/scroll-depth
GET  /api/projects/:projectId/funnel
```

Dashboard API characteristics:

- protected by auth;
- checks project ownership;
- returns typed DTOs;
- supports date range filters;
- avoids exposing raw sensitive event data.

### 9.3 API Response Direction

Reports should return dashboard-ready DTOs.

Example overview response:

```ts
type OverviewReportResponse = {
  dateRange: {
    from: string
    to: string
  }
  totals: {
    pageViews: number
    sessions: number
    conversions: number
    conversionRate: number
    averageSessionDurationSeconds: number
  }
  trend: Array<{
    date: string
    pageViews: number
    sessions: number
    conversions: number
  }>
}
```

## 10. Database Architecture

Recommended database:

- PostgreSQL

Recommended ORM/query layer:

- Prisma or Drizzle

Both are acceptable. The decision can be finalized before implementation.

### 10.1 MVP Tables

Initial tables likely needed:

```txt
users
workspaces
projects
sessions
events
pages
goals
funnels
funnel_steps
```

### 10.2 Raw Events First

For MVP, store raw events first.

Benefits:

- easier debugging;
- easier reporting changes;
- easier portfolio explanation;
- avoids premature aggregation design.

### 10.3 Aggregation Direction

MVP can start with query-time aggregation.

Later, if needed, add:

- daily aggregate tables;
- scheduled aggregation jobs;
- materialized views;
- background worker.

Do not start with a complex analytics pipeline.

## 11. Authentication and Authorization

Auth should not become the main project.

Recommended MVP options:

1. Managed auth, for example Clerk.
2. Auth.js.
3. Simple secure cookie session auth.

The choice should optimize for delivery speed and portfolio quality.

### 11.1 Auth Requirements

The dashboard should support:

- sign up;
- log in;
- log out;
- protected dashboard routes;
- authenticated API calls.

### 11.2 Authorization Requirements

The backend must ensure:

- users can access only their own workspace/projects;
- report endpoints verify project ownership;
- project settings are protected;
- raw event data is not publicly exposed.

### 11.3 Public Tracking Is Different

Tracking endpoint cannot require user login because it is called from public websites.

Instead, it should use:

- public site id/site key;
- project/site validation;
- rate limiting;
- optional domain allowlist later.

## 12. Tracker Architecture

The tracker should be a small browser SDK.

### 12.1 Public API Direction

Example usage:

```html
<script src="https://example.com/tracker.js" data-site-id="site_123"></script>
```

or:

```ts
analytics.init({
  siteId: "site_123",
  endpoint: "https://api.example.com/api/ingest/events",
})
```

Manual conversion event:

```ts
analytics.trackConversion("signup_clicked")
```

### 12.2 Internal Tracker Modules

Possible internal modules:

```txt
config
session
queue
transport
pageview
click
scroll
conversion
privacy
utils
```

### 12.3 Transport

Preferred transport order:

1. `navigator.sendBeacon()` for unload/visibility events.
2. `fetch()` for normal batching.
3. Retry only simple safe cases.

### 12.4 Performance Requirements

The tracker should:

- be lightweight;
- avoid blocking page rendering;
- debounce or throttle noisy events;
- avoid sending too many scroll events;
- avoid collecting large payloads;
- fail silently without breaking the host website.

## 13. Dashboard Architecture

The dashboard should be UI-heavy and polished.

### 13.1 Main Screens

Recommended MVP screens:

```txt
Login / Sign up
Dashboard home
Project list
Create project
Project overview
Pages report
Sources report
Clicks report
Scroll depth report
Funnel report
Tracking snippet page
Project settings
```

### 13.2 UI Requirements

The dashboard should include:

- clear navigation;
- date range filter;
- metric cards;
- charts;
- tables;
- empty states;
- loading states;
- error states;
- responsive layout;
- clean visual hierarchy.

### 13.3 Data Fetching

Recommended:

- TanStack Query for server state;
- typed API client;
- Zod validation where useful;
- avoid overcomplicated global state.

## 14. Local Development Architecture

Local development should be simple and reproducible.

### 14.1 Required Tools

- Node.js
- npm
- Git
- Docker Desktop
- PostgreSQL via Docker

### 14.2 Local Services

Recommended Docker services:

```txt
postgres
```

Optional later:

```txt
pgadmin
mailpit
```

Avoid too many services at the beginning.

### 14.3 Local Ports

Recommended ports:

```txt
Dashboard: 3000
Ingest API: 4000
Demo Site: 3001
PostgreSQL: 5432
```

## 15. Environment Configuration

Each app should use environment variables.

Example root `.env.example` direction:

```txt
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/behavior_analytics
INGEST_API_PORT=4000
DASHBOARD_URL=http://localhost:3000
DEMO_SITE_URL=http://localhost:3001
```

Rules:

- never commit real secrets;
- provide `.env.example`;
- validate required env variables on startup;
- keep local defaults developer-friendly.

## 16. Testing Strategy

### 16.1 Unit Tests

Use Vitest.

Cover:

- event schema validation;
- event normalization;
- scroll milestone logic;
- click metadata extraction;
- privacy masking;
- queue/batching logic;
- report calculations.

### 16.2 Integration Tests

Cover:

- ingest endpoint validation;
- database writes;
- project creation API;
- report API;
- auth-protected endpoints;
- authorization checks.

### 16.3 E2E Tests

Use Playwright.

Cover main product flow:

1. Sign up or log in.
2. Create project.
3. Copy tracking snippet.
4. Open demo site.
5. Generate page views/clicks/scrolls.
6. Verify dashboard reports show data.

## 17. Security Architecture

MVP security requirements:

- validate all input;
- limit request body size;
- rate limit ingest endpoint;
- restrict CORS;
- use secure cookies for dashboard auth;
- check resource ownership;
- avoid raw sensitive data collection;
- avoid logging sensitive payloads;
- document privacy behavior;
- provide project/site data deletion direction.

## 18. Deployment Direction

Deployment is not the first implementation step, but architecture should stay deployable.

Possible deployment direction:

- Dashboard: Vercel, Render, Fly.io, or similar.
- Ingest API: Render, Fly.io, Railway, or similar.
- Database: managed PostgreSQL.
- Demo Site: Vercel or same platform as dashboard.

For MVP, choose the simplest reliable deployment path.

## 19. CI Direction

Initial CI should be simple.

Recommended checks:

```txt
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

Do not overbuild CI before the project has real code.

## 20. Documentation Direction

Documentation should include:

```txt
docs/
  README.md
  product/
  architecture/
  roadmap/
  setup/
```

Minimum useful docs:

- Product Definition
- Domain Model and Event Taxonomy
- Technical Architecture
- Roadmap
- Local Development Setup
- Demo Script
- Portfolio Story

## 21. Key Architecture Decisions

Accepted:

- Use monorepo.
- Do not use microfrontends.
- Use Next.js for dashboard.
- Use Fastify for backend.
- Use PostgreSQL for storage.
- Use TypeScript across the project.
- Use Zod for contracts and validation.
- Use npm, not pnpm.
- Use REST API for MVP.
- Store raw events first.
- Keep analytics pipeline simple.
- Keep privacy boundaries in the core design.

Open:

- Prisma or Drizzle.
- Auth.js, Clerk, or custom secure session auth.
- Deployment platform.
- Exact click visualization approach.
- Whether background aggregation is needed in MVP.

## 22. What This Architecture Should Demonstrate

For portfolio and interviews, this architecture should demonstrate:

- product decomposition;
- frontend architecture;
- backend API design;
- browser SDK design;
- data modeling;
- privacy-aware engineering;
- testing strategy;
- pragmatic MVP thinking;
- ability to avoid overengineering.
