# Behavior Analytics MVP — Data Flow

This document explains how data moves through the current local MVP after Phase 5.

---

## Full Local Flow

```txt
demo-site
  -> tracker SDK
  -> POST /api/events
  -> Zod validation
  -> Prisma
  -> PostgreSQL analytics_events
  -> reporting API endpoints
  -> dashboard API clients
  -> dashboard UI
```

The flow is local-first and designed for a portfolio MVP. It proves the core product loop without production infrastructure.

---

## 1. Demo Site Generates Behavior

`apps/demo-site` is a Next.js demo website running at http://localhost:3001.

It includes:

- pages for navigation and page view events;
- links and CTAs with `data-analytics-id` for safe click tracking;
- scrollable pages for scroll depth events;
- explicit conversion actions such as contact submit, pricing CTA click, and thank-you page view.

---

## 2. Tracker SDK Sends Events

The browser tracker lives in `packages/tracker`.

The demo site initializes it with:

```txt
siteId: demo-site
endpoint: http://localhost:4000/api/events
```

The tracker currently emits:

- `page_view`;
- `click`;
- `scroll_depth`;
- `conversion`.

Contracts also support:

- `session_start`;
- `session_end`.

Those two event types are defined in shared types and validation schemas but are not emitted by the tracker yet.

---

## 3. Ingest API Receives Events

`apps/ingest-api` exposes:

```http
POST /api/events
```

Request body shape:

```json
{
  "site_id": "demo-site",
  "events": []
}
```

The ingest API:

1. parses the request body with Fastify;
2. applies a 256 KB body limit;
3. validates with Zod schemas from `packages/analytics-core`;
4. stores validated events with Prisma.

Invalid payloads return a safe error:

```json
{ "ok": false, "error": "INVALID_ANALYTICS_PAYLOAD" }
```

---

## 4. Zod Validates Runtime Payloads

`packages/analytics-core` contains Zod schemas for analytics events and ingest requests.

Validation makes sure the backend stores only known event shapes. Shared TypeScript types in `packages/types` describe the same event model for compile-time use.

---

## 5. Prisma Stores Raw Events

The database table is `analytics_events`, defined by `prisma/schema.prisma`.

Each row stores common fields as columns:

- `eventId`;
- `siteId`;
- `sessionId`;
- `eventType`;
- `timestamp`;
- `pageUrl`;
- `path`;
- `deviceType`;
- `createdAt`.

It also stores the full validated event in:

- `payload` JSON.

---

## Duplicated Columns vs `payload` JSON

The project deliberately stores both:

- duplicated query columns for common filters and counts;
- complete JSON payload for event-specific fields.

Examples:

- `path` is duplicated as a column for page view reporting;
- `eventType` is duplicated as a column for overview counts;
- `payload.element_id` is used for click reporting;
- `payload.conversion_name` is used for conversion reporting;
- `payload.depth_percent` is used for scroll depth reporting.

This keeps the database model simple while leaving enough detail for dashboard reports.

---

## 6. Reporting API Reads Stored Events

Reporting endpoints live in `apps/ingest-api`.

Current endpoints:

| Endpoint | What it reads |
|----------|---------------|
| `GET /api/reports/overview` | Counts by `eventType` |
| `GET /api/reports/page-views-by-path` | `page_view` rows grouped by `path` |
| `GET /api/reports/interactions-summary` | Click `element_id` and conversion `conversion_name` from JSON payload |
| `GET /api/reports/scroll-depth-summary` | Scroll `depth_percent` from JSON payload |

For MVP-sized local data, some JSON payload reports fetch relevant rows and aggregate in TypeScript. This is acceptable for clarity and avoids premature SQL complexity.

---

## 7. Dashboard API Clients Fetch Reports

The dashboard does not access PostgreSQL directly.

Dashboard clients live in:

```txt
apps/dashboard/src/lib/reports-api.ts
```

Config lives in:

```txt
apps/dashboard/src/lib/reports-config.ts
```

The dashboard currently uses `siteId = "demo-site"` and the local ingest API URL `http://localhost:4000`.

---

## 8. Dashboard UI Displays Reports

`apps/dashboard` shows:

1. overview metric cards;
2. page views by path;
3. top clicked elements;
4. conversions;
5. scroll depth summary.

Each report section has:

- loading state;
- error state;
- empty state;
- success state.

---

## Manual Verification

Use:

- [`../setup/tracker-local-smoke.en.md`](../setup/tracker-local-smoke.en.md) to generate and verify tracker events;
- [`../setup/dashboard-reporting-smoke.en.md`](../setup/dashboard-reporting-smoke.en.md) to verify reporting APIs and dashboard UI.
