# Behavior Analytics MVP — Domain Model and Event Taxonomy v1

## 1. Цель документа

Этот документ описывает первую версию domain model и event taxonomy для Behavior Analytics MVP.

Он объясняет:

- какие основные сущности есть в системе;
- какие поведенческие события собирает tracker;
- какие данные должны быть в каждом event;
- как raw events превращаются в dashboard metrics;
- какие privacy boundaries нужно соблюдать.

Этот документ нужно воспринимать как общий product + engineering contract перед началом реализации.

## 2. Продуктовый контекст

Behavior Analytics MVP — это легкий продукт поведенческой аналитики для сайтов.

Продукт состоит из:

- embeddable tracking SDK;
- ingest API;
- PostgreSQL database;
- analytics dashboard;
- demo website.

Цель — помочь небольшим командам понимать:

- page engagement;
- click behavior;
- scroll depth;
- traffic sources;
- simple conversion drop-off.

## 3. Основные domain entities

### 3.1 User

Пользователь, который имеет доступ к dashboard.

User может:

- зарегистрироваться или войти;
- создать или открыть workspace;
- создавать projects/sites;
- смотреть analytics reports;
- управлять project settings.

Пример полей:

```ts
type User = {
  id: string
  email: string
  name?: string
  createdAt: string
  updatedAt: string
}
```

### 3.2 Workspace

Workspace — контейнер для проектов.

Для MVP у одного пользователя может быть один default workspace. Но сама концепция полезна, потому что оставляет путь к будущим team features.

Пример полей:

```ts
type Workspace = {
  id: string
  name: string
  ownerUserId: string
  createdAt: string
  updatedAt: string
}
```

### 3.3 Project / Site

Project представляет сайт, который отслеживается.

Для MVP "Project" и "Site" можно считать одним продуктовым понятием. В UI слово "Project" может быть понятнее, а в tracking payload можно использовать `site_id`.

Пример полей:

```ts
type Project = {
  id: string
  workspaceId: string
  name: string
  domain?: string
  siteKey: string
  createdAt: string
  updatedAt: string
}
```

Важные заметки:

- `id` — внутренний идентификатор.
- `siteKey` или public site identifier используется tracking script-ом.
- Backend должен проверять, что events относятся к известному site/project.

### 3.4 Session

Session представляет период взаимодействия одного посетителя с отслеживаемым сайтом.

Для MVP session может генерироваться tracker-ом на клиенте и обновляться после активности.

Пример полей:

```ts
type Session = {
  id: string
  projectId: string
  startedAt: string
  endedAt?: string
  durationSeconds?: number
  firstPageUrl?: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  deviceType?: "desktop" | "tablet" | "mobile" | "unknown"
}
```

MVP session rule:

- создать новую session, если ее еще нет;
- переиспользовать текущую session во время активного просмотра;
- завершать/обновлять session после неактивности, например через 30 минут.

### 3.5 Page

Нормализованная страница/path внутри отслеживаемого сайта.

Пример полей:

```ts
type Page = {
  id: string
  projectId: string
  path: string
  title?: string
  firstSeenAt: string
  lastSeenAt: string
}
```

Примеры:

- `/`
- `/pricing`
- `/features`
- `/checkout`

### 3.6 Event

Event — это поведенческий сигнал, собранный tracking SDK.

Все конкретные event types имеют common fields и могут добавлять свои event-specific fields.

Пример базового типа:

```ts
type BaseEvent = {
  eventId: string
  eventType:
    | "session_start"
    | "session_end"
    | "page_view"
    | "click"
    | "scroll_depth"
    | "conversion"
  siteId: string
  sessionId: string
  timestamp: string
  pageUrl: string
  path: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  viewportWidth?: number
  viewportHeight?: number
  deviceType?: "desktop" | "tablet" | "mobile" | "unknown"
}
```

### 3.7 Page View

Page view event означает, что посетитель открыл страницу или перешел на нее.

Пример полей:

```ts
type PageViewEvent = BaseEvent & {
  eventType: "page_view"
  pageTitle?: string
}
```

### 3.8 Click Event

Click event означает, что пользователь кликнул по элементу страницы.

Пример полей:

```ts
type ClickEvent = BaseEvent & {
  eventType: "click"
  elementTag?: string
  elementId?: string
  elementClasses?: string[]
  elementTextShort?: string
  selector?: string
  x: number
  y: number
  normalizedX: number
  normalizedY: number
}
```

Важно:

- Не собирать длинный raw text.
- Не собирать input values.
- `elementTextShort` должен быть ограничен и очищен.
- Sensitive elements должны маскироваться или игнорироваться.

### 3.9 Scroll Depth Event

Scroll depth event отправляется, когда пользователь достиг определенного scroll milestone.

MVP milestones:

- 25%
- 50%
- 75%
- 100%

Пример полей:

```ts
type ScrollDepthEvent = BaseEvent & {
  eventType: "scroll_depth"
  depthPercent: 25 | 50 | 75 | 100
}
```

Важно:

- Каждый milestone должен отправляться только один раз на page view.
- Tracker не должен отправлять слишком много scroll events.

### 3.10 Conversion Event

Conversion event представляет значимое действие.

Примеры:

- CTA click;
- form submitted;
- signup started;
- demo requested;
- checkout started.

Пример полей:

```ts
type ConversionEvent = BaseEvent & {
  eventType: "conversion"
  conversionName: string
  conversionValue?: number
}
```

Важно:

- MVP может начать с manually triggered conversion events.
- Tracker должен дать простой public method, например:

```ts
analytics.trackConversion("signup_clicked")
```

### 3.11 Funnel

Funnel — это упорядоченная последовательность шагов.

Для MVP funnels могут быть простыми и строиться на page views или conversion events.

Пример:

```ts
type Funnel = {
  id: string
  projectId: string
  name: string
  steps: FunnelStep[]
}
```

```ts
type FunnelStep = {
  id: string
  order: number
  type: "page_view" | "conversion"
  matchValue: string
}
```

Пример funnel:

1. Page view: `/`
2. Page view: `/pricing`
3. Conversion: `signup_clicked`

### 3.12 Goal

Goal — желательное действие.

Для MVP goal может быть представлен через conversion event name.

Пример полей:

```ts
type Goal = {
  id: string
  projectId: string
  name: string
  conversionName: string
  createdAt: string
}
```

## 4. Event Taxonomy v1

MVP поддерживает шесть event types.

### 4.1 `session_start`

Отправляется, когда начинается новая visitor session.

Используется для:

- session count;
- traffic source attribution;
- device breakdown;
- session duration calculation.

### 4.2 `session_end`

Отправляется, когда tracker считает, что session завершилась.

Используется для:

- session duration;
- engagement calculations.

Важно:

- Browser unload events не всегда надежны.
- Где возможно, нужно использовать `sendBeacon`.
- Backend также может рассчитывать конец session по timestamp последнего event.

### 4.3 `page_view`

Отправляется, когда visitor открывает страницу или переходит на нее.

Используется для:

- top pages;
- page views;
- entry pages;
- page-level reporting.

### 4.4 `click`

Отправляется, когда visitor кликает по trackable page element.

Используется для:

- top clicked elements;
- CTA performance;
- page-level click visualization;
- click maps.

### 4.5 `scroll_depth`

Отправляется, когда visitor достигает scroll milestone.

Используется для:

- scroll depth report;
- page engagement;
- content visibility analysis.

### 4.6 `conversion`

Отправляется, когда происходит значимое conversion action.

Используется для:

- simple funnel analysis;
- goal completion;
- conversion rate reporting.

## 5. Common Event Payload

Все events должны включать common payload.

```ts
type CommonEventPayload = {
  event_id: string
  event_type:
    | "session_start"
    | "session_end"
    | "page_view"
    | "click"
    | "scroll_depth"
    | "conversion"
  site_id: string
  session_id: string
  timestamp: string
  page_url: string
  path: string
  referrer?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  viewport_width?: number
  viewport_height?: number
  device_type?: "desktop" | "tablet" | "mobile" | "unknown"
}
```

## 6. Event-specific Payloads

### 6.1 Click Payload

```ts
type ClickPayload = CommonEventPayload & {
  event_type: "click"
  element_tag?: string
  element_id?: string
  element_classes?: string[]
  element_text_short?: string
  selector?: string
  x: number
  y: number
  normalized_x: number
  normalized_y: number
}
```

### 6.2 Scroll Depth Payload

```ts
type ScrollDepthPayload = CommonEventPayload & {
  event_type: "scroll_depth"
  depth_percent: 25 | 50 | 75 | 100
}
```

### 6.3 Conversion Payload

```ts
type ConversionPayload = CommonEventPayload & {
  event_type: "conversion"
  conversion_name: string
  conversion_value?: number
}
```

### 6.4 Page View Payload

```ts
type PageViewPayload = CommonEventPayload & {
  event_type: "page_view"
  page_title?: string
}
```

## 7. Tracking Rules

### 7.1 Page View Tracking

Tracker должен отправлять `page_view` event:

- при initial page load;
- при client-side route change, если это применимо;
- когда меняется URL path.

### 7.2 Click Tracking

Tracker должен собирать клики только по безопасным и полезным элементам.

Хорошие кандидаты:

- buttons;
- links;
- elements with explicit tracking attributes;
- CTA-like elements.

Элементы, которые нужно игнорировать:

- password fields;
- form input values;
- hidden elements;
- elements marked as private;
- elements matching denylist selectors.

### 7.3 Scroll Tracking

Tracker должен отправлять scroll milestones:

- 25%;
- 50%;
- 75%;
- 100%.

Каждый milestone должен отправляться один раз на page view.

### 7.4 Session Tracking

Tracker должен:

- создать session id, если его нет;
- сохранять его для active session;
- обновлять activity timestamp при активности пользователя;
- завершать session после периода неактивности.

### 7.5 Batching

Tracker должен собирать events в batch перед отправкой на backend.

Рекомендуемое MVP behavior:

- отправлять batch при достижении size limit;
- отправлять batch через time interval;
- отправлять pending events при page visibility change/unload через `sendBeacon`, где возможно;
- использовать `fetch` как fallback.

## 8. Privacy Boundaries

### 8.1 Что мы собираем

MVP может собирать:

- page URL;
- path;
- referrer;
- UTM parameters;
- viewport size;
- device type;
- click coordinates;
- normalized click coordinates;
- limited element metadata;
- scroll milestones;
- session id;
- event timestamp.

### 8.2 Что мы никогда не собираем

MVP не должен собирать:

- passwords;
- raw form input values;
- emails typed into forms;
- phone numbers typed into forms;
- card numbers;
- personal messages;
- sensitive user-generated text;
- full DOM snapshots;
- session replay recordings.

### 8.3 Sensitive Element Handling

Tracker должен игнорировать или маскировать:

- `input[type="password"]`;
- form fields by default;
- elements with `data-private`;
- elements with `data-analytics-ignore`;
- selectors configured in a denylist.

Пример:

```html
<input type="email" data-analytics-ignore />
<button data-analytics-id="signup-cta">Start now</button>
```

### 8.4 Selector Strategy

MVP должен поддерживать:

- automatic safe metadata extraction;
- explicit `data-analytics-id` для важных элементов;
- denylist selectors для sensitive areas;
- optional allowlist mode later.

Рекомендуемые public attributes:

```html
<button data-analytics-id="hero-primary-cta">
  Start free trial
</button>
```

```html
<div data-analytics-ignore>
  Sensitive content
</div>
```

## 9. Reporting Model

Raw events должны превращаться в dashboard metrics.

### 9.1 Overview Metrics

На основе:

- page views;
- sessions;
- unique sessions;
- conversions;
- average session duration.

Пример metrics:

- Total page views
- Total sessions
- Average session duration
- Conversion count
- Conversion rate

### 9.2 Top Pages

На основе `page_view` events, grouped by path.

Metrics:

- page views;
- sessions;
- average dwell time;
- average scroll depth;
- conversion count.

### 9.3 Traffic Sources

На основе:

- referrer;
- UTM source;
- UTM medium;
- UTM campaign.

Metrics:

- sessions by source;
- page views by source;
- conversions by source;
- engagement by source.

### 9.4 Click Report

На основе `click` events, grouped by:

- path;
- selector;
- `data-analytics-id`;
- element text;
- coordinates.

Metrics:

- top clicked elements;
- clicks per page;
- CTA click count;
- click distribution.

### 9.5 Scroll Depth Report

На основе `scroll_depth` events, grouped by path.

Metrics:

- percentage of sessions reaching 25%;
- percentage reaching 50%;
- percentage reaching 75%;
- percentage reaching 100%;
- average max scroll depth.

### 9.6 Funnel Report

На основе page views и conversion events.

Пример funnel:

1. `/`
2. `/pricing`
3. `signup_clicked`

Metrics:

- users/sessions at each step;
- drop-off between steps;
- final conversion rate.

## 10. API Contract Direction

API желательно делать contract-first там, где это практично.

Рекомендуемые endpoints:

```txt
POST /api/ingest/events
GET  /api/projects
POST /api/projects
GET  /api/projects/:projectId/overview
GET  /api/projects/:projectId/pages
GET  /api/projects/:projectId/sources
GET  /api/projects/:projectId/clicks
GET  /api/projects/:projectId/scroll-depth
GET  /api/projects/:projectId/funnel
```

Ingest endpoint должен принимать batched events:

```ts
type IngestRequest = {
  site_id: string
  events: Array<
    | PageViewPayload
    | ClickPayload
    | ScrollDepthPayload
    | ConversionPayload
  >
}
```

## 11. Database Direction

Точная schema будет уточняться позже, но для MVP вероятно нужны:

- `users`
- `workspaces`
- `projects`
- `sessions`
- `events`
- `pages`
- `funnels`
- `goals`

Raw events нужно сохранять первыми. Aggregated tables можно добавить позже, если понадобится.

MVP может начать с query-time aggregation, если объем данных маленький.

## 12. Open Questions

Эти вопросы можно решить на этапе technical architecture:

1. Нужен ли tracker-у anonymous visitor id помимо session id?
2. Хранить raw events в одной таблице или разделять по event type?
3. Делать event aggregation on write, on read или через scheduled job?
4. Нужно ли в MVP domain allowlist validation?
5. Click visualization должна быть coordinate-based, element-based или обе?
6. Funnels должны настраиваться в UI или быть hardcoded для MVP demo?

## 13. Fixed Decisions

Для v1 считаем принятым:

- MVP tracks page views, clicks, scroll milestones, sessions, referrers, UTM data и conversions.
- MVP не собирает raw form values.
- MVP не включает session replay.
- MVP сначала хранит raw events.
- MVP использует shared TypeScript/Zod contracts.
- MVP использует simple reporting до advanced analytics.
- Privacy boundaries являются частью core product design.
