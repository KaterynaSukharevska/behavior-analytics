# Behavior Analytics MVP — Roadmap v1

## 1. Цель документа

Этот roadmap описывает рекомендуемую последовательность реализации Behavior Analytics MVP.

Цель — сохранить проект сфокусированным, реалистичным и пригодным для portfolio/career целей.

Roadmap должен помогать отвечать:

- что строить сначала;
- что должно подождать;
- как избежать overengineering;
- как перейти от документации к working product;
- как создать сильную GitHub/portfolio/interview story.

## 2. Roadmap Principles

### 2.1 Product loop first

Проект должен в первую очередь закрыть полный product loop:

1. Создать project/site.
2. Установить tracking snippet.
3. Собрать behavior events.
4. Сохранить events.
5. Показать reports в dashboard.
6. Объяснить, что означают данные.

Маленький законченный loop лучше, чем много несвязанных features.

### 2.2 Documentation before code, but not forever

Документация должна направлять проект, а не заменять implementation.

Первый слой документации должен включать:

- Product Definition
- Domain Model and Event Taxonomy
- Technical Architecture
- Roadmap
- Local Development Setup

После этого нужно переходить к implementation.

### 2.3 MVP before advanced analytics

MVP не должен включать:

- session replay;
- A/B testing;
- feature flags;
- enterprise heatmaps;
- advanced segmentation;
- complex real-time infrastructure;
- billing;
- multi-user roles.

Это может подождать.

### 2.4 Portfolio quality matters

Это не только technical project. Это еще и career asset.

Каждый phase должен создавать видимые доказательства:

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

Создать минимальную документацию, с которой можно начинать implementation в ясном направлении.

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

- Product idea понятна.
- MVP scope определен.
- Non-goals явно прописаны.
- Core domain entities documented.
- Event taxonomy documented.
- Architecture direction documented.
- Implementation sequence clear.

### Status

Current phase.

## 5. Phase 1 — Local Development and Repo Foundation

### Goal

Создать чистую monorepo foundation, которую можно запускать локально.

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

- Repository имеет понятную структуру.
- npm workspaces настроены.
- TypeScript baseline существует.
- PostgreSQL запускается локально через Docker.
- Project можно открыть в Cursor.
- Setup documented.

## 6. Phase 2 — Shared Contracts and Domain Types

### Goal

Создать shared TypeScript/Zod contracts, которые будут использовать tracker, backend и dashboard.

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

- Shared event contracts существуют.
- Payload schemas валидируются через Zod.
- Tests покрывают schema validation.
- Backend и tracker могут импортировать same contracts.

## 7. Phase 3 — Backend Foundation

### Goal

Создать Fastify backend foundation.

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

Создать embeddable tracking SDK.

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

Создать realistic demo website, который может генерировать behavior data.

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

Создать dashboard shell и basic project management flow.

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

На этом этапе auth может быть простым или mocked, если нужно.

Важно подготовить protected dashboard structure без того, чтобы потратить слишком много времени на auth complexity.

### Success Criteria

- Dashboard runs locally.
- User can see project list.
- User can create a project/site.
- User can view tracking snippet.
- UI has basic polish and structure.

## 11. Phase 7 — End-to-End Tracking Flow

### Goal

Соединить tracker, demo site, backend, database и dashboard.

### Deliverables

- Demo site sends real events.
- Backend validates and stores events.
- Database contains raw events.
- Dashboard can display basic event counts.
- Local setup instructions are updated.

### Success Criteria

Следующий flow работает локально:

1. Start PostgreSQL.
2. Start ingest API.
3. Start dashboard.
4. Start demo site.
5. Create project.
6. Copy/use tracking snippet.
7. Visit demo site.
8. Generate events.
9. See data in dashboard.

Это первый major milestone.

## 12. Phase 8 — Reporting and Aggregation

### Goal

Построить useful MVP analytics reports.

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

- Reports calculated from stored events.
- Date range filters work.
- Report DTOs typed.
- Basic tests cover report calculations.

## 13. Phase 9 — Analytics UI Polish

### Goal

Превратить raw reports в polished dashboard experience.

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

Сделать privacy и security видимыми в implementation.

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

- Privacy boundaries implemented.
- Security basics covered.
- README can explain privacy-aware design.
- Tests cover sensitive data handling.

## 15. Phase 11 — Testing and QA

### Goal

Добавить достаточно tests, чтобы показать engineering maturity.

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

- Main product flow tested.
- Critical logic has unit tests.
- API has integration coverage.
- E2E demo flow works.

## 16. Phase 12 — Portfolio Packaging

### Goal

Подготовить project как career asset.

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

- Project understandable in 2 minutes.
- GitHub looks professional.
- Demo scenario clear.
- Project can be discussed confidently in interviews.

## 17. Phase 13 — Deployment

### Goal

Задеплоить MVP, чтобы его можно было показать.

### Possible deployment direction

- Dashboard: Vercel or similar.
- Demo site: Vercel or similar.
- Ingest API: Render, Fly.io, Railway, or similar.
- Database: managed PostgreSQL.

### Success Criteria

- Dashboard publicly accessible.
- Demo site publicly accessible.
- Tracking works in deployed environment.
- Reports show real demo data.
- Environment variables documented.

## 18. Suggested Implementation Order

Рекомендуемый порядок:

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

Не делать слишком рано:

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

После сохранения roadmap следующий рекомендуемый документ:

```txt
docs/setup/local-development.en.md
docs/setup/local-development.ru.md
```

Этот документ должен объяснить:

- required tools;
- Node.js/npm;
- Docker Desktop;
- PostgreSQL local setup;
- recommended ports;
- env files;
- first local run plan.

После setup document можно начинать implementation.
