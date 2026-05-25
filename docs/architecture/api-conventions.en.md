# Behavior Analytics MVP — API Conventions

This document defines the current API conventions for the local MVP.

---

## API Style

The project is **REST-first**.

Current backend app:

```txt
apps/ingest-api
```

Local base URL:

```txt
http://localhost:4000
```

GraphQL is intentionally out of scope. Microservice splitting is also out of scope.

---

## Endpoint Naming

Use simple resource-like paths:

```txt
GET  /api/health
POST /api/events
GET  /api/reports/<report-name>
```

Report endpoint names use kebab-case:

- `overview`;
- `page-views-by-path`;
- `interactions-summary`;
- `scroll-depth-summary`.

---

## Current Endpoints

### Health

```http
GET /api/health
```

Success:

```json
{ "ok": true, "service": "ingest-api" }
```

### Event ingest

```http
POST /api/events
```

Valid payload success:

```json
{ "ok": true, "accepted": 1 }
```

Invalid payload:

```json
{ "ok": false, "error": "INVALID_ANALYTICS_PAYLOAD" }
```

Oversized body:

```json
{ "ok": false, "error": "PAYLOAD_TOO_LARGE" }
```

Persistence failure:

```json
{ "ok": false, "error": "EVENT_PERSISTENCE_FAILED" }
```

### Overview report

```http
GET /api/reports/overview?siteId=demo-site
```

Returns totals for page views, clicks, scroll depth events, and conversions.

### Page views by path

```http
GET /api/reports/page-views-by-path?siteId=demo-site
```

Returns top paths by page view count.

### Interactions summary

```http
GET /api/reports/interactions-summary?siteId=demo-site
```

Returns top clicked element ids and conversion names.

### Scroll depth summary

```http
GET /api/reports/scroll-depth-summary?siteId=demo-site
```

Returns scroll milestone counts for 25, 50, 75, and 100 percent.

---

## Query Parameters

Reporting endpoints currently require:

```txt
siteId
```

Rules:

- missing `siteId` returns `400`;
- empty or blank `siteId` returns `400`;
- valid `siteId` is trimmed before use.

Current safe error:

```json
{ "ok": false, "error": "INVALID_SITE_ID" }
```

The MVP currently uses `siteId=demo-site`.

---

## Validation

Use runtime validation at the backend boundary.

Current behavior:

- ingest payloads are validated with Zod from `packages/analytics-core`;
- reporting query parameters are validated in route handlers with a small helper;
- report responses are built from typed helper return values.

Future APIs should keep validation close to the route boundary.

---

## Error Response Style

Public error responses should be safe JSON:

```json
{ "ok": false, "error": "ERROR_CODE" }
```

Rules:

- do not expose stack traces;
- do not expose raw Prisma errors;
- do not expose request bodies;
- log internal errors on the server when useful;
- keep error codes stable and readable.

Examples:

- `INVALID_SITE_ID`;
- `INVALID_ANALYTICS_PAYLOAD`;
- `PAYLOAD_TOO_LARGE`;
- `EVENT_PERSISTENCE_FAILED`;
- `REPORTING_OVERVIEW_FAILED`;
- `REPORTING_PAGE_VIEWS_BY_PATH_FAILED`;
- `REPORTING_INTERACTIONS_SUMMARY_FAILED`;
- `REPORTING_SCROLL_DEPTH_SUMMARY_FAILED`.

---

## Route Handler Pattern

Route handlers should stay thin:

1. parse and validate request inputs;
2. call a small DB/reporting helper;
3. return a response shape;
4. catch errors and return a safe error code.

DB/reporting helpers should live under:

```txt
apps/ingest-api/src/db/
```

Current examples:

- `get-overview-totals.ts`;
- `get-page-views-by-path.ts`;
- `get-interactions-summary.ts`;
- `get-scroll-depth-summary.ts`.

---

## Response Shape Guidelines

Use clear, small JSON responses.

For single report objects:

```json
{
  "siteId": "demo-site",
  "totals": {}
}
```

For lists:

```json
{
  "siteId": "demo-site",
  "items": []
}
```

For specialized grouped reports:

```json
{
  "siteId": "demo-site",
  "clicks": [],
  "conversions": []
}
```

Use camelCase in API responses even when stored event payload fields use snake_case.

---

## Out of Scope For Now

- auth and user accounts;
- site ownership checks;
- API keys;
- rate limiting;
- date range filters;
- pagination;
- GraphQL;
- background aggregation.
