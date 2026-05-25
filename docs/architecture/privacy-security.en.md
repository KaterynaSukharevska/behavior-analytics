# Behavior Analytics MVP — Privacy and Security

This document consolidates current privacy and security rules for the MVP.

The project is local-first and not production deployed yet, but privacy-safe tracking is already a core design constraint.

---

## Privacy Principle

Collect only the behavior metadata needed for the MVP reports.

Do not collect sensitive content, raw user input, or full page content.

---

## Tracker Must Not Collect

The tracker must not collect:

- form values;
- names;
- emails;
- phone numbers;
- message text;
- passwords;
- cookies;
- `localStorage` contents;
- arbitrary DOM text;
- `innerHTML`;
- DOM snapshots;
- session replay data.

The tracker currently stores its own session id in `sessionStorage`.

---

## Safe Click Tracking

Click tracking is opt-in through `data-analytics-id`.

Rules:

- only track clicks that resolve to an element with `data-analytics-id`;
- walk up from the click target to find the nearest tracked element;
- ignore clicks inside `data-analytics-ignore`;
- ignore clicks inside `data-private`;
- ignore sensitive controls such as inputs, textareas, selects, options, and password fields.

Click payloads may include:

- safe element id from `data-analytics-id`;
- element tag;
- pointer coordinates;
- normalized pointer coordinates;
- page URL and path;
- session id;
- device type.

Click payloads must not include:

- form values;
- arbitrary text content;
- CSS class lists unless explicitly reviewed later;
- DOM snapshots.

---

## Safe Conversion Tracking

Conversions are explicit business events from code.

Current demo conversion names:

- `contact_form_submitted`;
- `pricing_cta_clicked`;
- `thank_you_page_viewed`.

Conversion tracking must not read form input values.

Optional conversion value may be numeric only. Do not send names, emails, phone numbers, messages, or free-text user input as conversion data.

---

## Safe Scroll Tracking

Scroll tracking records milestone numbers only:

- 25;
- 50;
- 75;
- 100.

It uses scroll position math and does not read DOM text or page content.

---

## Event Ingest Safety

The ingest API validates events with Zod before storing them.

Current safeguards:

- `POST /api/events` validates payload shape;
- request body limit is 256 KB;
- oversized bodies return `PAYLOAD_TOO_LARGE`;
- invalid analytics payloads return `INVALID_ANALYTICS_PAYLOAD`;
- request bodies are not logged intentionally.

---

## Reporting API Safety

Reporting endpoints require a non-empty `siteId`.

Missing or blank `siteId` returns:

```json
{ "ok": false, "error": "INVALID_SITE_ID" }
```

Database/reporting failures return safe error codes such as:

- `REPORTING_OVERVIEW_FAILED`;
- `REPORTING_PAGE_VIEWS_BY_PATH_FAILED`;
- `REPORTING_INTERACTIONS_SUMMARY_FAILED`;
- `REPORTING_SCROLL_DEPTH_SUMMARY_FAILED`.

Public API responses should not expose:

- stack traces;
- raw Prisma errors;
- SQL details;
- environment variables;
- raw request bodies.

---

## Current Limitations

The MVP currently has:

- no auth;
- no user accounts;
- no site ownership checks;
- no API keys;
- no rate limiting;
- no production deployment;
- no HTTPS/hosting configuration;
- no audit logging.

These limitations are acceptable for local portfolio development, but they must be addressed before any production use.

---

## Phase 6 Privacy/Security Opportunities

Practical next steps:

- add tests for click privacy helpers;
- add reporting/API tests for safe errors;
- document production gaps before deployment;
- consider rate limiting for ingest;
- consider site keys or ownership checks before multi-site support.
