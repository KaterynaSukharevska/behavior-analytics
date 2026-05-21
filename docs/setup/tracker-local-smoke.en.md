# Tracker SDK — Local Setup and Smoke Checklist

This guide explains how the Behavior Analytics browser tracker works in the current MVP, how to run it locally with the demo site, and how to verify that events reach PostgreSQL.

**Scope:** local development only. This is not a production deployment guide.

---

## What works today

The tracker package (`packages/tracker`) sends four event types from the demo site (`apps/demo-site`):

| Event type | How it is triggered |
|------------|---------------------|
| `page_view` | Route change in the Next.js App Router |
| `click` | Click on an element with `data-analytics-id` |
| `scroll_depth` | Scroll milestones 25%, 50%, 75%, 100% (once per path) |
| `conversion` | Explicit `trackConversion()` calls in the demo site |

Events are validated by the ingest API and stored in the `analytics_events` table.

---

## Prerequisites

- Node.js 20+ and npm
- Docker Desktop (for PostgreSQL)
- Copy `.env.example` to `.env` at the repo root (for `DATABASE_URL`)

From the repository root:

```bash
npm install
docker compose up -d
npm run db:generate   # if Prisma Client is not generated yet
```

---

## Local startup

Run these in **separate terminals** from the repo root:

```bash
# 1. Database (once per session)
docker compose up -d

# 2. Ingest API — http://localhost:4000
npm run dev --workspace=@behavior-analytics/ingest-api

# 3. Demo site — http://localhost:3001
npm run dev --workspace=@behavior-analytics/demo-site
```

Optional: dashboard placeholder at http://localhost:3000 (`npm run dev --workspace=@behavior-analytics/dashboard`).

Health check: http://localhost:4000/api/health → `{ "ok": true, "service": "ingest-api" }`.

---

## Tracker public API

```ts
import {
  init,
  trackPageView,
  trackConversion,
  startClickTracking,
  startScrollTracking,
} from "@behavior-analytics/tracker";

init({
  siteId: "demo-site",
  endpoint: "http://localhost:4000/api/events",
});

// page_view — called by demo-site on route change
await trackPageView();

// conversion — explicit, safe names only
await trackConversion("contact_form_submitted");

// click + scroll — started automatically inside init() in the browser
```

Demo-site wiring: `apps/demo-site/src/components/analytics-tracker.tsx` (client-only; does not run during SSR).

---

## Browser smoke checklist

Use Chrome DevTools → **Network** → filter by `events` or `4000`.

1. Open http://localhost:3001
2. **Page views:** visit `/`, `/features`, `/pricing`, `/contact`, `/thank-you`  
   - Expect `POST http://localhost:4000/api/events` per navigation  
   - Response: `{ "ok": true, "accepted": 1 }`
3. **Clicks:** click nav links or hero CTAs (elements with `data-analytics-id`)  
   - Payload includes `event_type: "click"` and `element_id` from the attribute
4. **Scroll depth:** on a long page (e.g. home), scroll slowly  
   - Up to four events with `depth_percent`: 25, 50, 75, 100  
   - Same milestone should not repeat on the same path
5. **Conversions:**
   - Contact → **Submit demo request** → `conversion_name: "contact_form_submitted"`
   - Pricing → **Contact sales** → `pricing_cta_clicked`
   - Visit `/thank-you` → `thank_you_page_viewed`

**Optional debug:** in `apps/demo-site/.env.local`:

```env
NEXT_PUBLIC_BA_TRACKER_DEBUG=1
```

Reload and check the browser console for `[behavior-analytics]` debug lines (no UI changes).

---

## Database smoke checklist

From the repo root (ingest API and DB must be running):

```bash
# Latest demo-site events (all types)
node scripts/query-demo-events.mjs

# Filter by event type
node scripts/query-demo-events.mjs page_view
node scripts/query-demo-events.mjs click
node scripts/query-demo-events.mjs scroll_depth
node scripts/query-demo-events.mjs conversion
```

Confirm:

- `siteId` is `demo-site`
- `eventType` matches the filter
- `payload` JSON matches the event (e.g. `depth_percent`, `conversion_name`, `element_id`)
- No form values, emails, or message text in `payload`

Alternative: Prisma Studio (`npx prisma studio` from repo root) → table `analytics_events`.

---

## Privacy guarantees (MVP)

The tracker **does not** collect:

- Form field values
- Names, emails, phone numbers, or message text typed by users
- Cookies
- `localStorage` contents (except its own session id in `sessionStorage`)
- Arbitrary DOM text or innerHTML
- Full DOM snapshots
- Session replay data

**Click tracking** only fires for elements with `data-analytics-id`. Clicks on `data-analytics-ignore`, `data-private`, or sensitive inputs are skipped.

**Scroll tracking** uses scroll position math only.

**Conversions** use explicit names supplied in code — never raw form data.

---

## Known limitations

| Area | Current MVP state |
|------|-----------------|
| Dashboard | Placeholder UI; no live reports from DB |
| Reporting API | No query/aggregation endpoints for the dashboard yet |
| Auth | No site keys or ownership checks |
| Rate limiting | Not implemented on ingest |
| Offline / retry | No queue; failed `fetch` is not retried |
| Batching | One event per `POST` (simple transport) |
| Production deploy | Local-only workflow documented here |
| Session replay / heatmaps | Out of scope |
| `session_start` / `session_end` | In schema; not sent by tracker yet |

---

## Demo-site conversion names

| Name | When |
|------|------|
| `contact_form_submitted` | Contact page “Submit demo request” button |
| `pricing_cta_clicked` | Pricing hero “Contact sales” link |
| `thank_you_page_viewed` | `/thank-you` route loads |

Constants: `apps/demo-site/src/lib/conversion-names.ts`.

---

## Related documentation

- [`docs/phase-4-context.md`](../phase-4-context.md) — full Phase 4 handoff for Cursor agents
- [`docs/setup/local-development.en.md`](local-development.en.md) — general local setup
- [`packages/types`](../../packages/types) — event TypeScript types
- [`packages/analytics-core`](../../packages/analytics-core) — Zod validation schemas

---

## Suggested next phase

**Phase 5 — Dashboard reports:** read persisted events from PostgreSQL and show basic metrics in `apps/dashboard` (page views, top paths, clicks, scroll milestones, conversions). No new tracker features required for a first dashboard slice.
