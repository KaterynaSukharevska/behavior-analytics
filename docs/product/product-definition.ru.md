# Behavior Analytics MVP — Product Definition Document v1

## 1. Краткое описание продукта

**Behavior Analytics MVP** — это легкий продукт для анализа поведения пользователей на сайтах: лендингах, маркетинговых страницах, сайтах малого бизнеса и простых продуктовых сайтах.

Продукт помогает понять, как посетители взаимодействуют с сайтом: какие страницы открывают, куда кликают, насколько глубоко скроллят, откуда приходят, как долго остаются и на каком шаге простой conversion flow ломается.

MVP состоит из трех основных частей:

1. **Tracking SDK** — встраиваемый браузерный скрипт, который собирает события поведения.
2. **Ingest API** — backend-сервис, который принимает, валидирует и сохраняет события.
3. **Dashboard** — web-приложение, которое превращает события в понятные отчеты и визуализации.

## 2. One-liner продукта

Легкий инструмент поведенческой аналитики для сайтов, который помогает командам понимать engagement страниц, клики, глубину скролла, источники трафика и conversion drop-off.

## 3. Зачем существует продукт

У многих владельцев сайтов и небольших маркетинговых команд есть трафик, но нет ясного понимания, что пользователи реально делают на страницах.

Они могут знать, что люди заходят на сайт, но часто не понимают:

- где пользователи теряют внимание;
- насколько глубоко они скроллят;
- какие CTA получают клики;
- какие источники трафика приводят более вовлеченных посетителей;
- где ломается простой путь до конверсии;
- какие страницы стоит улучшать первыми.

Цель продукта — сделать поведение пользователей на сайте понятным без сложности enterprise analytics-инструментов.

## 4. Целевая аудитория

### Основные пользователи

- Marketing managers
- Founders
- Freelancers
- Agencies
- Small product owners
- Small product teams

### Основные типы сайтов

- Landing pages
- Marketing websites
- Small business websites
- Simple SaaS/product websites
- Campaign pages

## 5. Problem Statement

У небольших команд часто есть сайты с трафиком, но нет простого и визуального способа понять поведение пользователей.

Им нужны практические ответы:

- Пользователи реально взаимодействуют со страницей?
- Какие страницы удерживают внимание, а какие теряют?
- Доскролливают ли пользователи до важного контента?
- Какие кнопки, ссылки и CTA получают клики?
- Какие источники трафика приводят более качественные визиты?
- Где ломается conversion path?

Существующие analytics-инструменты часто слишком широкие, технические, дорогие или сфокусированы на vanity metrics. Этот MVP фокусируется на практических поведенческих инсайтах.

## 6. Цель продукта

Цель MVP — помочь пользователю найти места, где на сайте теряется внимание и намерение к конверсии.

Продукт должен помочь перейти от:

> “Люди заходят на мой сайт, но я не понимаю, что они там делают.”

к:

> “Я вижу, где посетители вовлекаются, где останавливаются, на что кликают и где ломается путь до конверсии.”

## 7. Core Value Proposition

Behavior Analytics MVP дает небольшим командам понятную визуальную картину поведения пользователей на сайте через:

- метрики engagement;
- click behavior;
- scroll depth;
- traffic source breakdown;
- simple funnel analysis;
- per-page click visualization.

Ценность продукта — не “больше данных”. Ценность продукта — **быстрее понять, что именно улучшать на сайте**.

## 8. Jobs To Be Done

### JTBD 1 — Понять engagement страницы

Когда я публикую лендинг, я хочу понять, как пользователи взаимодействуют с ним, чтобы оценить эффективность страницы.

### JTBD 2 — Понять scroll behavior

Когда я размещаю важный контент ниже на странице, я хочу знать, доходят ли до него пользователи, чтобы улучшить структуру страницы.

### JTBD 3 — Понять эффективность CTA

Когда я добавляю кнопки или ссылки на страницу, я хочу знать, какие из них получают клики, чтобы улучшить conversion path.

### JTBD 4 — Понять качество трафика

Когда трафик приходит из разных источников и кампаний, я хочу знать, какие источники приводят более вовлеченных пользователей, чтобы фокусироваться на правильных каналах.

### JTBD 5 — Понять conversion drop-off

Когда пользователи проходят простой путь к конверсии, я хочу знать, где они отваливаются, чтобы уменьшить friction.

## 9. MVP Scope

### 9.1 Tracking SDK

Tracking SDK должен поддерживать:

- page view tracking;
- session start tracking;
- session end tracking;
- click tracking;
- scroll depth milestones;
- page dwell time;
- session duration;
- referrer capture;
- UTM capture;
- basic viewport/device data;
- custom conversion event.

### 9.2 Ingest API и storage

Backend должен поддерживать:

- endpoint для приема событий;
- payload validation;
- batching support;
- хранение raw events;
- связь событий с session;
- связь событий с site/project;
- нормализацию страниц;
- базовую агрегацию для dashboard-отчетов.

### 9.3 Dashboard

Dashboard должен включать:

- overview page;
- date range filter;
- top pages report;
- traffic sources report;
- top clicks report;
- scroll depth report;
- simple funnel report;
- per-page click visualization;
- project/site settings;
- tracking snippet installation page;
- empty states.

## 10. Must-have MVP Features

### Product setup

- Пользователь может зарегистрироваться или войти.
- Пользователь может создать workspace или project.
- Пользователь может зарегистрировать сайт.
- Пользователь может скопировать tracking snippet.
- Пользователь может посмотреть инструкцию по установке.

### Tracking

- Собираются page views.
- Собираются clicks.
- Собираются scroll milestones на 25%, 50%, 75% и 100%.
- Создаются sessions, связанные с events.
- Сохраняются referrer и UTM-данные.
- Можно отправить conversion event вручную.

### Reporting

- Пользователь может выбрать date range.
- Пользователь видит total visits/page views.
- Пользователь видит top pages.
- Пользователь видит traffic source breakdown.
- Пользователь видит top clicked elements.
- Пользователь видит scroll depth by page.
- Пользователь видит simple funnel.
- Пользователь может открыть page-level click visualization.

## 11. Non-goals for MVP

В MVP не входят:

- session replay;
- enterprise-level heatmap engine;
- A/B testing platform;
- feature flags;
- visual experiment builder;
- cohort retention analytics;
- advanced segmentation;
- anomaly detection as a core feature;
- warehouse sync;
- CDP-like identity resolution;
- large-scale real-time analytics infrastructure;
- complex multi-user roles;
- billing and subscriptions.

Эти функции можно рассматривать позже, но они не нужны для доказательства MVP.

## 12. Phase 2 Ideas

Возможные улучшения после MVP:

- custom event builder;
- goal management UI;
- alerts;
- CSV export;
- compare date ranges;
- multi-user roles;
- enhanced heatmap;
- bot filtering;
- page grouping rules;
- consent integration helper;
- AI summaries;
- AI insights card;
- “what changed” explanations.

## 13. Demo Scenario

У пользователя есть marketing landing page.

Он создает project в Behavior Analytics MVP, регистрирует сайт, копирует tracking snippet и устанавливает его на demo site.

Посетители заходят на сайт из разных источников и взаимодействуют со страницей.

Dashboard показывает:

- какие страницы получают трафик;
- насколько глубоко пользователи скроллят;
- на какие кнопки кликают;
- какой CTA работает лучше;
- где ломается funnel;
- какой источник приводит более вовлеченных пользователей.

Этот demo-сценарий должен быть достаточно сильным для GitHub, LinkedIn, portfolio presentation и interviews.

## 14. Success Criteria

MVP успешен, если он показывает полный продуктовый цикл:

1. Создать project.
2. Установить tracking snippet.
3. Сгенерировать события поведения пользователя.
4. Сохранить events в backend.
5. Агрегировать events в reports.
6. Показать полезную аналитику в dashboard.
7. Объяснить, что пользователю стоит улучшить на сайте.

### Career success criteria

Проект должен демонстрировать:

- strong frontend engineering;
- polished dashboard UI;
- product thinking;
- TypeScript quality;
- browser API knowledge;
- data visualization skills;
- backend/API understanding;
- privacy-aware engineering;
- testing discipline;
- professional documentation.

## 15. Key Product Entities

### Workspace

Контейнер для проектов пользователя.

### User

Пользователь, который имеет доступ к dashboard.

### Project / Website

Отслеживаемый сайт или landing page.

### Session

Сессия посетителя на сайте.

### Page View

Событие посещения страницы.

### Event

Общее поведенческое событие, собранное tracker-ом.

### Page

Нормализованная страница или path сайта.

### Funnel

Простая последовательность шагов к конверсии.

### Goal / Conversion Target

Желательное действие: click, form submit или custom conversion event.

### Source / Campaign

Данные атрибуции трафика на основе referrer и UTM.

### Click Aggregate

Сгруппированное поведение кликов по элементу или области страницы.

## 16. Event Taxonomy v1

### Event Types

- `session_start`
- `session_end`
- `page_view`
- `click`
- `scroll_depth`
- `conversion`

### Common Event Fields

- `event_id`
- `session_id`
- `site_id`
- `timestamp`
- `page_url`
- `path`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `viewport_width`
- `viewport_height`
- `device_type`

### Click Event Fields

- `element_tag`
- `element_id`
- `element_text_short`
- `x`
- `y`
- `normalized_x`
- `normalized_y`

### Scroll Event Fields

- `depth_percent`

## 17. Privacy and Security Principles

Privacy — это core quality продукта, а не бонус.

MVP должен соблюдать принципы:

- не собирать passwords;
- не собирать emails из form fields;
- не собирать phone numbers из form fields;
- не собирать card data;
- не собирать raw form contents;
- маскировать sensitive elements;
- поддерживать denylist selectors;
- поддерживать allowlist rules там, где это полезно;
- документировать, что собирается;
- документировать, что не собирается;
- избегать лишних personal data;
- валидировать все backend payloads;
- rate limit для ingest endpoints;
- защищать project resources через authorization checks;
- поддерживать удаление данных project/site;
- определить простую retention policy.

## 18. Recommended Technical Stack

### Dashboard

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui или thin custom UI layer
- React Hook Form
- Zod
- TanStack Query
- TanStack Table
- Recharts

### Tracking SDK

- TypeScript
- Browser-native APIs
- Lightweight bundling
- Event queue
- Batching
- `navigator.sendBeacon()`
- `fetch` fallback

### Backend

- Fastify
- TypeScript
- PostgreSQL
- Prisma или Drizzle
- Zod validation
- REST API

### Testing

- Vitest
- Playwright

## 19. High-level Architecture

Проект должен использовать monorepo с apps и packages.

### Apps

- `apps/dashboard` — Next.js dashboard application
- `apps/ingest-api` — Fastify backend для ingestion и dashboard API
- `apps/demo-site` — demo website для тестирования и showcase

### Packages

- `packages/tracker` — embeddable tracking SDK
- `packages/types` — shared types and contracts
- `packages/analytics-core` — schemas, normalization, analytics helpers
- `packages/ui` — shared UI components if needed
- `packages/config` — shared TypeScript/lint/build configuration

## 20. Recommended Implementation Phases

### Phase 0 — Product Definition

Определить audience, pain points, MVP scope, non-goals, demo scenario и success criteria.

### Phase 1 — Domain and Data Design

Определить entities, event taxonomy, ingestion flow, reporting model и privacy boundaries.

### Phase 2 — Technical Architecture

Определить monorepo structure, app/package boundaries, auth strategy, backend shape, DB strategy, contracts, testing strategy и deployment model.

### Phase 3 — Repo and Tooling Foundation

Настроить monorepo, npm workspaces, TypeScript config, linting, formatting, package boundaries, build scripts и CI baseline.

### Phase 4 — Backend Foundation

Создать Fastify app, health check, env validation, DB connection, migrations, logging, error handling и auth/session baseline.

### Phase 5 — Tracker SDK Foundation

Создать tracker init/config, session handling, event queue, batching, transport, pageview tracking, click tracking и scroll tracking.

### Phase 6 — Dashboard Foundation

Создать auth flow, dashboard shell, project creation, project settings, snippet installation page, navigation и empty states.

### Phase 7 — End-to-End Data Flow

Соединить tracker, ingest API, database, demo site и dashboard data.

### Phase 8 — Aggregation and Reporting

Реализовать overview metrics, pages report, sources report, clicks report, scroll report, funnel calculations и click aggregation.

### Phase 9 — Analytics UI

Собрать polished dashboard screens, charts, tables, filters, funnel view, click visualization и responsive UX.

### Phase 10 — Security and Privacy Hardening

Добавить masking rules, payload restrictions, rate limits, auth/resource protection, data handling rules и documentation.

### Phase 11 — Testing and QA

Покрыть unit tests, integration tests, E2E tests и regression scenarios.

### Phase 12 — Docs, Demo, and Portfolio Packaging

Подготовить README, architecture explanation, setup guide, screenshots, demo script, project story для LinkedIn/CV/interviews.

## 21. Portfolio Positioning

Этот проект нужно представлять как профессиональный product-style portfolio project, а не как учебный clone/tutorial.

Suggested positioning:

> Behavior Analytics MVP is a privacy-aware website behavior analytics product built with a tracking SDK, event ingestion backend, and polished analytics dashboard. It demonstrates modern frontend engineering, product thinking, data visualization, browser APIs, TypeScript, testing, and full product delivery.

## 22. Open Decisions

Эти решения можно финализировать позже:

- exact auth provider: Auth.js, Clerk или custom session auth;
- exact ORM: Prisma или Drizzle;
- exact hosting platform;
- whether to add billing after MVP;
- how advanced click visualization should be in v1;
- whether AI insights belong in Phase 2 or later.

## 23. Current Fixed Decisions

Считаем принятым:

- product: Behavior Analytics MVP for websites;
- focus: engagement, click behavior, scroll depth, traffic sources, conversion friction;
- ICP: landing pages, marketing sites, simple websites, small teams;
- MVP: tracker, ingest API, dashboard;
- not in MVP: A/B tests, session replay, feature flags, advanced analytics;
- architecture: monorepo;
- dashboard: Next.js;
- backend: Fastify and PostgreSQL;
- shared contracts: TypeScript and Zod;
- testing: Vitest and Playwright;
- package manager: npm, not pnpm.
