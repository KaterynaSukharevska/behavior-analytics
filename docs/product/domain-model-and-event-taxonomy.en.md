# Behavior Analytics MVP — Domain Model and Event Taxonomy v1

## 1. Purpose of This Document

This document defines the first version of the domain model and event taxonomy for the Behavior Analytics MVP.

It explains:

- what core entities exist in the system;
- what behavior events are collected by the tracker;
- what data each event should contain;
- how raw events become dashboard metrics;
- what privacy boundaries must be respected.

This document should be treated as the shared product and engineering contract before implementation begins.

## 2. Product Context

Behavior Analytics MVP is a lightweight website behavior analytics product.

The product consists of:

- an embeddable tracking SDK;
- an ingest API;
- a PostgreSQL database;
- an analytics dashboard;
- a demo website.

The goal is to help small teams understand:

- page engagement;
- click behavior;
- scroll depth;
- traffic sources;
- simple conversion drop-off.

## 3. Core Domain Entities

### 3.1 User

A person who can access the dashboard.

A user can:

- sign up or log in;
- create or access a workspace;
- create projects/sites;
- view analytics reports;
- manage project settings.

Example fields:

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

A workspace is a container for projects.

For MVP, one user may have one default workspace. The concept is still useful because it keeps the product ready for future team features.

Example fields:

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

A project represents a website being tracked.

For MVP, "Project" and "Site" can be treated as the same product concept. In the UI, "Project" may be more user-friendly, while "site_id" may be used in tracking payloads.

Example fields:

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

Important notes:

- `id` is internal.
- `siteKey` or public site identifier is used by the tracking script.
- The backend must validate that events belong to a known site/project.

### 3.4 Session

A session represents one visitor's interaction period on a tracked website.

For MVP, a session can be generated client-side by the tracker and refreshed after inactivity.

Example fields:

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

- create a new session when no session exists;
- reuse the current session during active browsing;
- expire the session after inactivity, for example after 30 minutes.

### 3.5 Page

A normalized page/path inside a tracked site.

Example fields:

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

Examples:

- `/`
- `/pricing`
- `/features`
- `/checkout`

### 3.6 Event

An event is a behavior signal collected by the tracking SDK.

All specific event types share common fields and may include event-specific fields.

Example base type:

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

A page view event represents a visitor opening or navigating to a page.

Example fields:

```ts
type PageViewEvent = BaseEvent & {
  eventType: "page_view"
  pageTitle?: string
}
```

### 3.8 Click Event

A click event represents a user click on a page element.

Example fields:

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

Important:

- Do not collect long raw text.
- Do not collect input values.
- `elementTextShort` must be limited and sanitized.
- Sensitive elements must be masked or ignored.

### 3.9 Scroll Depth Event

A scroll depth event is emitted when a user reaches a scroll milestone.

MVP milestones:

- 25%
- 50%
- 75%
- 100%

Example fields:

```ts
type ScrollDepthEvent = BaseEvent & {
  eventType: "scroll_depth"
  depthPercent: 25 | 50 | 75 | 100
}
```

Important:

- Each milestone should be sent only once per page view.
- The tracker should avoid sending too many scroll events.

### 3.10 Conversion Event

A conversion event represents a meaningful action.

Examples:

- CTA click;
- form submitted;
- signup started;
- demo requested;
- checkout started.

Example fields:

```ts
type ConversionEvent = BaseEvent & {
  eventType: "conversion"
  conversionName: string
  conversionValue?: number
}
```

Important:

- MVP can start with manually triggered conversion events.
- The tracker should expose a simple public method such as:

```ts
analytics.trackConversion("signup_clicked")
```

### 3.11 Funnel

A funnel is an ordered sequence of steps.

For MVP, funnels can be simple and based on page views or conversion events.

Example:

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

Example funnel:

1. Page view: `/`
2. Page view: `/pricing`
3. Conversion: `signup_clicked`

### 3.12 Goal

A goal is a desired action.

For MVP, a goal can be represented by a conversion event name.

Example fields:

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

The MVP supports six event types.

### 4.1 `session_start`

Sent when a new visitor session begins.

Used for:

- session count;
- traffic source attribution;
- device breakdown;
- session duration calculation.

### 4.2 `session_end`

Sent when the tracker believes the session has ended.

Used for:

- session duration;
- engagement calculations.

Important:

- Browser unload events are not always reliable.
- `sendBeacon` should be used where possible.
- Backend may also calculate session end based on last event timestamp.

### 4.3 `page_view`

Sent when a visitor opens or navigates to a page.

Used for:

- top pages;
- page views;
- entry pages;
- page-level reporting.

### 4.4 `click`

Sent when a visitor clicks a trackable page element.

Used for:

- top clicked elements;
- CTA performance;
- page-level click visualization;
- click maps.

### 4.5 `scroll_depth`

Sent when a visitor reaches a scroll milestone.

Used for:

- scroll depth report;
- page engagement;
- content visibility analysis.

### 4.6 `conversion`

Sent when a meaningful conversion action happens.

Used for:

- simple funnel analysis;
- goal completion;
- conversion rate reporting.

## 5. Common Event Payload

All events should include a common payload.

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

The tracker should send a `page_view` event:

- on initial page load;
- on client-side route change, if applicable;
- when the URL path changes.

### 7.2 Click Tracking

The tracker should collect clicks only for safe and useful elements.

Good candidates:

- buttons;
- links;
- elements with explicit tracking attributes;
- CTA-like elements.

Elements to ignore:

- password fields;
- form input values;
- hidden elements;
- elements marked as private;
- elements matching denylist selectors.

### 7.3 Scroll Tracking

The tracker should emit scroll milestones:

- 25%;
- 50%;
- 75%;
- 100%.

Each milestone should be sent once per page view.

### 7.4 Session Tracking

The tracker should:

- create a session id if one does not exist;
- persist it for the active session;
- refresh activity timestamp on user activity;
- expire the session after inactivity.

### 7.5 Batching

The tracker should batch events before sending them to the backend.

Recommended MVP behavior:

- send a batch when it reaches a size limit;
- send a batch after a time interval;
- send pending events on page visibility change/unload using `sendBeacon` where possible;
- use `fetch` as fallback.

## 8. Privacy Boundaries

### 8.1 What We Collect

The MVP may collect:

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

### 8.2 What We Never Collect

The MVP must not collect:

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

The tracker must ignore or mask:

- `input[type="password"]`;
- form fields by default;
- elements with `data-private`;
- elements with `data-analytics-ignore`;
- selectors configured in a denylist.

Example:

```html
<input type="email" data-analytics-ignore />
<button data-analytics-id="signup-cta">Start now</button>
```

### 8.4 Selector Strategy

MVP should support:

- automatic safe metadata extraction;
- explicit `data-analytics-id` for important elements;
- denylist selectors for sensitive areas;
- optional allowlist mode later.

Recommended public attributes:

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

Raw events should be transformed into dashboard metrics.

### 9.1 Overview Metrics

Based on:

- page views;
- sessions;
- unique sessions;
- conversions;
- average session duration.

Example metrics:

- Total page views
- Total sessions
- Average session duration
- Conversion count
- Conversion rate

### 9.2 Top Pages

Based on `page_view` events grouped by path.

Metrics:

- page views;
- sessions;
- average dwell time;
- average scroll depth;
- conversion count.

### 9.3 Traffic Sources

Based on:

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

Based on `click` events grouped by:

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

Based on `scroll_depth` events grouped by path.

Metrics:

- percentage of sessions reaching 25%;
- percentage reaching 50%;
- percentage reaching 75%;
- percentage reaching 100%;
- average max scroll depth.

### 9.6 Funnel Report

Based on page views and conversion events.

Example funnel:

1. `/`
2. `/pricing`
3. `signup_clicked`

Metrics:

- users/sessions at each step;
- drop-off between steps;
- final conversion rate.

## 10. API Contract Direction

The API should be contract-first where practical.

Recommended endpoints:

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

The ingest endpoint should accept batched events:

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

The exact schema can be refined later, but MVP likely needs:

- `users`
- `workspaces`
- `projects`
- `sessions`
- `events`
- `pages`
- `funnels`
- `goals`

Raw events should be stored first. Aggregated tables can be added later if needed.

MVP can start with query-time aggregation if the data volume is small.

## 12. Open Questions

These questions can be answered during technical architecture:

1. Should the tracker use anonymous visitor id in addition to session id?
2. Should raw events be stored in a single table or separated by event type?
3. Should event aggregation happen on write, on read, or via scheduled job?
4. Should MVP include domain allowlist validation?
5. Should click visualization be coordinate-based, element-based, or both?
6. Should funnels be configurable in UI or hardcoded for MVP demo?

## 13. Fixed Decisions

The following decisions are accepted for v1:

- MVP tracks page views, clicks, scroll milestones, sessions, referrers, UTM data, and conversions.
- MVP does not collect raw form values.
- MVP does not include session replay.
- MVP stores raw events first.
- MVP uses shared TypeScript/Zod contracts.
- MVP uses simple reporting before advanced analytics.
- Privacy boundaries are part of the core product design.
