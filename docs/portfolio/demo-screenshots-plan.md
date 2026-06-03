# Demo screenshots plan

## Purpose

This document plans **manual** screenshots for the Behavior Analytics MVP local demo. It supports portfolio presentation on GitHub, README, interviews, and LinkedIn — without adding image files, automation, or fake data in this step.

Use it **after** the local flow works. Run and verify services first with [`local-demo-checklist.md`](local-demo-checklist.md).

This project is a **local-first portfolio MVP**, not a production SaaS. Screenshots should show real local behavior only.

---

## Recommended screenshot sequence

Capture in this order so data exists before dashboard shots.

| # | Screenshot | Required | Suggested file name |
|---|------------|----------|---------------------|
| 1 | Demo-site page with safe analytics attributes | Yes | `01-demo-site-analytics-attributes.png` |
| 2 | User interaction on demo-site (tracked click or navigation) | Yes | `02-demo-site-tracked-interaction.png` |
| 3 | Ingest API health check | Yes | `03-ingest-api-health.png` |
| 4 | Report endpoint JSON response | Optional | `04-report-endpoint-overview.png` |
| 5 | Dashboard overview (metric cards) | Yes | `05-dashboard-overview.png` |
| 6 | Page views by path (chart + table) | Yes | `06-dashboard-page-views-by-path.png` |
| 7 | Interactions summary (clicks + conversions) | Yes | `07-dashboard-interactions-summary.png` |
| 8 | Scroll depth visualization | Yes | `08-dashboard-scroll-depth.png` |
| 9 | Dashboard full page (all report sections) | Optional | `09-dashboard-full-page.png` |
| 10 | Services running (terminals, cropped) | Optional | `10-local-services-terminals.png` |

Store future assets under a repo folder such as `docs/portfolio/screenshots/` only when you are ready to commit real captures. This plan does not add that folder or images yet.

---

## What each screenshot should show

### 1. Demo-site — safe analytics attributes

- **Show:** Demo site at http://localhost:3001 (e.g. home or pricing) with visible UI; optionally DevTools **Elements** highlighting a `data-analytics-id` on a CTA or nav link (attribute name visible, not arbitrary page text as “tracking data”).
- **Do not show:** Form field values, contact message text, emails, or PII in the page or inspector.

### 2. Demo-site — user interaction

- **Show:** Same session after a tracked action — click on a `data-analytics-id` element or navigation between routes (`/`, `/features`, `/pricing`, etc.).
- **Optional in same frame:** DevTools **Network** with a successful `POST` to `http://localhost:4000/api/events` and response `{ "ok": true, "accepted": 1 }`.
- **Do not show:** Request/response bodies containing personal data (they should not exist in this MVP).

### 3. Ingest API health

- **Show:** Browser tab at http://localhost:4000/api/health with JSON: `{ "ok": true, "service": "ingest-api" }`.
- **Do not show:** `.env`, connection strings, or API keys.

### 4. Report endpoint response (optional)

- **Show:** Browser tab for one report URL, e.g. http://localhost:4000/api/reports/overview?siteId=demo-site with `"ok": true` and plausible counts from your demo session.
- **Use when:** You want to prove REST reporting separate from the dashboard UI (technical interviews).

### 5. Dashboard — overview

- **Show:** http://localhost:3000 — overview section with non-zero metric cards (page views, clicks, scroll depth events, conversions) after generating demo data.
- **Do not show:** Error alerts unless you intentionally document troubleshooting (not for portfolio hero shots).

### 6. Dashboard — page views by path

- **Show:** CSS-only horizontal bar chart and path table with counts matching routes you visited.
- **Proves:** Query-time reporting and lightweight visualization without a chart library.

### 7. Dashboard — interactions summary

- **Show:** **Top clicked elements** (`data-analytics-id` values) and **Conversions** (e.g. `contact_form_submitted`, `pricing_cta_clicked`, `thank_you_page_viewed`).
- **Proves:** Explicit click and conversion modeling, not DOM text collection.

### 8. Dashboard — scroll depth

- **Show:** CSS-only milestone visualization and table (25%, 50%, 75%, 100%) with counts after scrolling a long demo-site page.
- **Proves:** Milestone-based scroll tracking.

### 9. Dashboard — full page (optional)

- **Show:** One scroll capture or stitched view of hero + multiple report sections populated.
- **Use for:** README top image or GitHub social preview.

### 10. Local services (optional)

- **Show:** Cropped terminals with ingest API, dashboard, and demo-site dev commands running — no secrets, no full home directory paths if avoidable.
- **Use for:** “I can run the stack locally” credibility.

---

## What each screenshot proves technically

| Screenshot | Technical proof (implemented MVP only) |
|------------|----------------------------------------|
| 1–2 | Demo-site + tracker SDK; opt-in clicks via `data-analytics-id`; events sent to ingest API |
| 3 | Fastify ingest API is up; health endpoint works |
| 4 | REST reporting API returns aggregated JSON for `siteId=demo-site` |
| 5–8 | Dashboard consumes reporting API; loading/success states; CSS-only charts; four report areas |
| 9 | End-to-end local product surface in one view |
| 10 | Local dev workflow (npm workspaces, multi-service run) |

Aligned flow:

```txt
demo-site → tracker SDK → ingest API → Zod validation → Prisma → PostgreSQL → reporting API → dashboard UI
```

---

## Optional screenshots

- Report endpoint JSON (any of the four `GET /api/reports/*` URLs)
- Dashboard full-page composite
- Terminal “services running” crop
- Health + one report side-by-side (advanced README layout)
- Demo-site Network tab only (if not combined with shot 2)

Skip optional shots if time is short; required shots 1–3 and 5–8 are enough for most interviews.

---

## What not to show

Do **not** capture or publish:

| Category | Examples to avoid |
|----------|-------------------|
| Personal / sensitive data | Real names, emails, phone numbers, message text, form values |
| Tracker privacy violations | Cookies, `localStorage`, arbitrary DOM text, DOM snapshots, session replay |
| Secrets | `.env`, `DATABASE_URL`, passwords, tokens, private API keys |
| Browser noise | Unrelated tabs, bookmarks with personal sites, email/chat notifications |
| Terminal noise | Full paths to home folders, secret env exports, unrelated command history |
| False product claims | “Production”, “deployed”, “enterprise scale”, fake customer logos/metrics |
| Unimplemented features | Auth UI, date filters, deployment dashboards, chart libraries |

Do **not** edit screenshots to invent metrics or UI that did not exist in the local run.

---

## Privacy-safe screenshot rules

- Capture only the **demo-site** and **dashboard** on localhost; use demo content built for the MVP.
- Prefer showing **`data-analytics-id`** on elements, not user-typed input.
- If DevTools is open, show **Network** or **Elements** on safe endpoints/attributes — not Application → Cookies or Local Storage.
- Blur or crop personal OS notifications, email, and file paths before sharing publicly.
- Conversions in screenshots should be the **explicit demo names** only (`contact_form_submitted`, `pricing_cta_clicked`, `thank_you_page_viewed`).
- If a report is empty, **regenerate demo data** — do not Photoshop numbers.

---

## Suggested file names for future assets

Use a consistent prefix and order (see table above). PNG is fine for UI clarity; WebP is optional for README size later.

Example folder layout (when you add images in a future task):

```txt
docs/portfolio/screenshots/
  01-demo-site-analytics-attributes.png
  02-demo-site-tracked-interaction.png
  03-ingest-api-health.png
  ...
  README.md   # optional: one-line caption per image
```

Keep filenames stable so README and interview docs can link predictably.

---

## Where screenshots can be used later

| Channel | Suggested shots | Notes |
|---------|-----------------|-------|
| **README** | 9 (full page) or 5+6; optional 3 | Near “Implemented flow” or Local Demo; link to this plan |
| **GitHub repository preview** | 9 or 6 | Social preview / About section; no production claims in caption |
| **Interview walkthrough** | 1→2→5→6→7→8 live; screenshots as backup | Pair with [`interview-walkthrough-script.md`](interview-walkthrough-script.md) |
| **LinkedIn / portfolio post** | 9 + 1 or 5 | Short caption: local MVP, privacy-conscious, TypeScript full-stack |

Always caption honestly: local demo, portfolio project, not production SaaS.

---

## Local capture checklist

Before capturing:

- [ ] Completed [`local-demo-checklist.md`](local-demo-checklist.md) (services up, health OK, demo data generated)
- [ ] Dashboard shows success states with non-zero data where expected
- [ ] Browser zoom ~100%; light mode or dark mode — pick one and stay consistent
- [ ] Close unrelated tabs and notifications
- [ ] Crop to app content; hide bookmarks bar if possible

During capture:

- [ ] Follow sequence 1→8 (required minimum)
- [ ] One screenshot per purpose; avoid duplicate angles
- [ ] Re-check Network shot: only `localhost:4000` ingest traffic
- [ ] No secrets in frame

After capture:

- [ ] Review each image for PII, secrets, and misleading crops
- [ ] Rename files per table above
- [ ] Store locally until a later task commits them to the repo
- [ ] Update README/links only when images actually exist

---

## Related documentation

- [`local-demo-checklist.md`](local-demo-checklist.md) — run and verify before screenshots
- [`interview-walkthrough-script.md`](interview-walkthrough-script.md) — live demo narrative
- [`technical-highlights.md`](technical-highlights.md) — what to say about each layer
- [`qa-and-objection-handling.md`](qa-and-objection-handling.md) — honest limits if asked about production
- [`demo-day-fallback-script.md`](demo-day-fallback-script.md) — use screenshots when live demo fails
