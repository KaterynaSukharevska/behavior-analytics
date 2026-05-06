# Behavior Analytics MVP — Technical Architecture v1

## 1. Цель документа

Этот документ описывает первую версию technical architecture для Behavior Analytics MVP.

Он объясняет:

- рекомендуемую структуру monorepo;
- ответственность каждого app и package;
- основные data flows;
- API boundaries;
- направление базы данных;
- подход к authentication;
- testing strategy;
- local development direction;
- deployment direction.

Документ нужен, чтобы направлять реализацию и не дать проекту стать слишком сложным слишком рано.

## 2. Architecture Goals

Архитектура должна поддерживать реалистичный MVP и оставаться достаточно простой для portfolio/career project.

Главные цели:

- сохранить продукт понятным;
- сделать шаги реализации ясными;
- показать современные frontend и full-stack engineering skills;
- поддержать реальный end-to-end analytics flow;
- избежать лишней enterprise complexity;
- сделать проект легко объяснимым на интервью;
- показать privacy и security в дизайне.

## 3. Architecture Principles

### 3.1 MVP-first

Строим только то, что нужно для доказательства главного product loop:

1. Зарегистрировать сайт.
2. Установить tracking snippet.
3. Собрать behavior events.
4. Сохранить events.
5. Агрегировать events.
6. Показать полезные reports в dashboard.

### 3.2 Monorepo, not microfrontends

Проект должен использовать monorepo.

Microfrontends не нужны для этого MVP, потому что они добавят complexity без пользы для продукта.

### 3.3 Contract-driven development

Shared contracts нужно описывать через TypeScript и Zod.

Tracker, backend и dashboard должны одинаково понимать:

- event types;
- payload shapes;
- API request/response types;
- validation rules.

### 3.4 Privacy-aware by design

Tracker и backend должны с самого начала проектироваться вокруг privacy boundaries.

Система не должна собирать sensitive form values, passwords, card data, personal messages или full DOM snapshots.

### 3.5 Simple before scalable

Первая реализация должна выбирать простые решения:

- raw event storage first;
- query-time aggregation first;
- one backend service first;
- simple auth first;
- one database first.

Оптимизация может прийти позже, если понадобится.

## 4. High-level System Overview

MVP состоит из четырех основных runtime parts:

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

Рекомендуемая начальная структура:

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

Dashboard — основное user-facing web application.

Рекомендуемый stack:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui или thin custom UI layer
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

Dashboard не должен напрямую ходить в database. Он должен общаться с backend через HTTP API.

### 6.2 `apps/ingest-api`

Ingest API — backend service.

Рекомендуемый stack:

- Fastify
- TypeScript
- PostgreSQL
- Prisma или Drizzle
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
- auth/session handling или auth integration;
- resource authorization;
- rate limiting;
- logging;
- error handling.

Для MVP одного backend app достаточно. Separate services не нужны.

### 6.3 `apps/demo-site`

Demo site используется для тестирования и демонстрации продукта.

Responsibilities:

- имитировать реальный marketing website;
- подключать tracking snippet;
- иметь страницы и CTAs для tracking;
- генерировать page views, clicks, scroll events и conversions;
- поддерживать portfolio demo scenario.

Рекомендуемые pages:

```txt
/
 /features
 /pricing
 /contact
 /thank-you
```

Demo site важен, потому что проект должен показывать реальный end-to-end product loop.

## 7. Packages

### 7.1 `packages/tracker`

Embeddable tracking SDK.

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

Tracker должен оставаться lightweight и browser-focused.

### 7.2 `packages/types`

Shared TypeScript types and API contracts.

Responsibilities:

- common event types;
- API request/response types;
- shared enums;
- common DTO definitions.

Этот package не должен содержать app-specific logic.

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

Этот package должен оставаться framework-agnostic.

### 7.4 `packages/config`

Shared technical configuration.

Возможное содержимое:

- TypeScript base config;
- ESLint config later if needed;
- formatting config later if needed.

Для MVP этот package должен быть минимальным. Не нужно создавать слишком много tooling слишком рано.

### 7.5 `packages/ui`

Shared UI components.

Этот package optional для MVP.

Рекомендация:

- не создавать много shared UI abstractions слишком рано;
- держать UI локально в dashboard, пока components не стали явно reusable;
- не превращать проект в design system project.

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

API должен быть REST-first.

GraphQL не нужен для MVP.

### 9.1 Public Ingest API

Используется tracking SDK.

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

Пример request shape:

```ts
type IngestEventsRequest = {
  site_id: string
  events: AnalyticsEventPayload[]
}
```

### 9.2 Dashboard API

Используется dashboard app.

Рекомендуемые endpoints:

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

Reports должны возвращать dashboard-ready DTOs.

Пример overview response:

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

Рекомендуемая database:

- PostgreSQL

Рекомендуемый ORM/query layer:

- Prisma или Drizzle

Оба варианта приемлемы. Решение можно финализировать перед implementation.

### 10.1 MVP Tables

Начальные tables, которые вероятно нужны:

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

Для MVP сначала храним raw events.

Плюсы:

- проще debug;
- проще менять reports;
- проще объяснять в portfolio;
- не нужно преждевременно проектировать сложные aggregation.

### 10.3 Aggregation Direction

MVP может начать с query-time aggregation.

Позже, если понадобится, можно добавить:

- daily aggregate tables;
- scheduled aggregation jobs;
- materialized views;
- background worker.

Не нужно начинать со сложного analytics pipeline.

## 11. Authentication and Authorization

Auth не должен стать главным проектом.

Рекомендуемые MVP options:

1. Managed auth, например Clerk.
2. Auth.js.
3. Simple secure cookie session auth.

Выбор должен оптимизировать delivery speed и portfolio quality.

### 11.1 Auth Requirements

Dashboard должен поддерживать:

- sign up;
- log in;
- log out;
- protected dashboard routes;
- authenticated API calls.

### 11.2 Authorization Requirements

Backend должен гарантировать:

- users могут открывать только свои workspace/projects;
- report endpoints проверяют project ownership;
- project settings защищены;
- raw event data не exposed publicly.

### 11.3 Public Tracking Is Different

Tracking endpoint не может требовать user login, потому что его вызывают public websites.

Вместо этого нужно использовать:

- public site id/site key;
- project/site validation;
- rate limiting;
- optional domain allowlist later.

## 12. Tracker Architecture

Tracker должен быть маленьким browser SDK.

### 12.1 Public API Direction

Пример usage:

```html
<script src="https://example.com/tracker.js" data-site-id="site_123"></script>
```

или:

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

Возможные internal modules:

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

1. `navigator.sendBeacon()` для unload/visibility events.
2. `fetch()` для normal batching.
3. Retry только для простых безопасных случаев.

### 12.4 Performance Requirements

Tracker должен:

- быть lightweight;
- не блокировать page rendering;
- debounce/throttle noisy events;
- не отправлять слишком много scroll events;
- не собирать large payloads;
- fail silently и не ломать host website.

## 13. Dashboard Architecture

Dashboard должен быть UI-heavy и polished.

### 13.1 Main Screens

Рекомендуемые MVP screens:

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

Dashboard должен включать:

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

Рекомендуется:

- TanStack Query для server state;
- typed API client;
- Zod validation where useful;
- avoid overcomplicated global state.

## 14. Local Development Architecture

Local development должен быть простым и воспроизводимым.

### 14.1 Required Tools

- Node.js
- npm
- Git
- Docker Desktop
- PostgreSQL via Docker

### 14.2 Local Services

Рекомендуемые Docker services:

```txt
postgres
```

Optional later:

```txt
pgadmin
mailpit
```

В начале не нужно слишком много services.

### 14.3 Local Ports

Рекомендуемые ports:

```txt
Dashboard: 3000
Ingest API: 4000
Demo Site: 3001
PostgreSQL: 5432
```

## 15. Environment Configuration

Каждый app должен использовать environment variables.

Пример root `.env.example` direction:

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

Используем Vitest.

Покрыть:

- event schema validation;
- event normalization;
- scroll milestone logic;
- click metadata extraction;
- privacy masking;
- queue/batching logic;
- report calculations.

### 16.2 Integration Tests

Покрыть:

- ingest endpoint validation;
- database writes;
- project creation API;
- report API;
- auth-protected endpoints;
- authorization checks.

### 16.3 E2E Tests

Используем Playwright.

Покрыть main product flow:

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

Deployment — не первый implementation step, но architecture должна оставаться deployable.

Возможное deployment direction:

- Dashboard: Vercel, Render, Fly.io или similar.
- Ingest API: Render, Fly.io, Railway или similar.
- Database: managed PostgreSQL.
- Demo Site: Vercel или та же платформа, что dashboard.

Для MVP нужно выбрать самый простой надежный deployment path.

## 19. CI Direction

Initial CI должен быть простым.

Рекомендуемые checks:

```txt
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

Не нужно overbuild CI до того, как появится реальный code.

## 20. Documentation Direction

Documentation должна включать:

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

Для portfolio и interviews эта architecture должна демонстрировать:

- product decomposition;
- frontend architecture;
- backend API design;
- browser SDK design;
- data modeling;
- privacy-aware engineering;
- testing strategy;
- pragmatic MVP thinking;
- ability to avoid overengineering.
