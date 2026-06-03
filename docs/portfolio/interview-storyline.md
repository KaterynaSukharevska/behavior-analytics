# Interview storyline

## Purpose

This document ties together **what to say** and **in what order** when presenting Behavior Analytics MVP in interviews or portfolio reviews.

Use it with:

- [`local-demo-checklist.md`](local-demo-checklist.md) — run the stack before you speak
- [`interview-walkthrough-script.md`](interview-walkthrough-script.md) — timed 5–7 minute script
- [`technical-highlights.md`](technical-highlights.md) — skills mapping
- [`qa-and-objection-handling.md`](qa-and-objection-handling.md) — longer Q&A answers
- [`demo-day-fallback-script.md`](demo-day-fallback-script.md) — when live demo fails

This is a **local-first portfolio MVP**, not a production SaaS. Say that early and once more near the end.

---

## Implemented flow (anchor this in every answer)

```txt
demo-site → tracker SDK → ingest API → Zod validation → Prisma → PostgreSQL analytics_events → reporting API → dashboard UI
```

Local URLs:

| What | URL |
|------|-----|
| Demo site | http://localhost:3001 |
| Dashboard | http://localhost:3000 |
| Ingest API health | http://localhost:4000/api/health |
| Events ingest | POST http://localhost:4000/api/events |
| Reports | GET http://localhost:4000/api/reports/*?siteId=demo-site |

---

## 5-minute project explanation

**Goal:** Problem, architecture, one live path, privacy, limitations — no deep file tour.

| Time | Topic | What to say (short) |
|------|--------|---------------------|
| 0:00–0:45 | Problem & scope | “I wanted to show full-stack TypeScript with privacy-conscious behavior analytics — page views, explicit clicks, scroll milestones, and conversions — as a portfolio MVP, not a production product.” |
| 0:45–1:30 | Architecture | Walk the flow above. Name four layers: demo + tracker, ingest API, database, dashboard via REST reports. |
| 1:30–3:00 | Live demo (compressed) | Demo site: navigate, one tracked click, quick scroll. Dashboard: refresh, show overview numbers and one chart section. |
| 3:00–4:00 | Privacy & validation | “We don’t collect form values, PII, cookies, localStorage, DOM text, or replay. Clicks use `data-analytics-id`. Ingest validates with Zod before Prisma writes to PostgreSQL.” |
| 4:00–5:00 | Quality & limits | “Vitest on reporting and tracker privacy; GitHub Actions CI on typecheck/tests. No auth, deployment, or date filters yet — documented on purpose.” |

If live demo fails, switch to [`demo-day-fallback-script.md`](demo-day-fallback-script.md) and README architecture sections.

---

## 10-minute technical walkthrough

**Goal:** Same story with more engineering depth and optional API proof.

| Time | Topic | Depth |
|------|--------|--------|
| 0:00–1:00 | Problem, scope, stack | npm workspaces, TypeScript, Next.js ×2, Fastify, Prisma, PostgreSQL, Zod, Vitest, REST |
| 1:00–2:30 | Architecture & boundaries | Monorepo packages: `tracker`, `types`, `analytics-core`, apps; dashboard never talks to DB directly |
| 2:30–5:00 | Live demo (full) | Follow **Recommended demo order** below; optional health + one report URL in browser |
| 5:00–6:30 | Privacy, validation, persistence | See dedicated sections below |
| 6:30–8:00 | Reports & dashboard | Four report endpoints; four UI sections; CSS-only charts |
| 8:00–9:00 | Tests & CI | What Vitest covers; what CI runs |
| 9:00–10:00 | Limitations & next steps | Honest gaps; one planned improvement |

---

## Recommended demo order

Run services first ([`local-demo-checklist.md`](local-demo-checklist.md)).

1. **Ingest health** — http://localhost:4000/api/health → `{ "ok": true, "service": "ingest-api" }`
2. **Demo site home** — http://localhost:3001 — point out `data-analytics-id` on a CTA or nav link
3. **Generate events** — navigate `/`, `/features`, `/pricing`, `/contact`; tracked click; scroll home for depth; one conversion (contact submit, pricing CTA, or `/thank-you`)
4. **Optional API proof** — http://localhost:4000/api/reports/overview?siteId=demo-site
5. **Dashboard** — http://localhost:3000 — hard refresh
6. **Report sections in order** — overview → page views by path → interactions summary → scroll depth summary

Optional closing: mention tests/CI from README or GitHub Actions badge — no need to run CI live.

---

## What to say on each screen

### Demo site (http://localhost:3001)

- “This is the event source for the MVP — a Next.js demo site with the tracker SDK.”
- “Clicks are opt-in: only elements with `data-analytics-id` send click events.”
- “Conversions are explicit in code — for example contact submit, pricing CTA, thank-you page.”
- “I'm not collecting what users type in forms — that's intentional.”

### Browser Network tab (optional)

- “Here’s `POST /api/events` to the ingest API — validated and stored, not sent to the dashboard directly.”

### Ingest health (http://localhost:4000/api/health)

- “Fastify ingest API is up — same service handles ingest and reporting routes.”

### Report endpoint in browser (optional)

- “Dashboard data comes from REST — e.g. overview aggregates for `siteId=demo-site`.”

### Dashboard (http://localhost:3000)

| Section | What to say |
|---------|-------------|
| **Overview** | “Aggregate counts from stored events — page views, clicks, scroll depth events, conversions.” |
| **Page views by path** | “Query-time grouping by path; CSS-only bars — no chart library.” |
| **Interactions summary** | “Top clicks show analytics IDs, not button text; conversions list explicit event names.” |
| **Scroll depth** | “Milestone events at 25/50/75/100% — useful for engagement without replay.” |

If a card shows **loading**, **empty**, or **error**, name the state calmly and use the checklist troubleshooting — do not blame “the stack” vaguely.

---

## How to explain the architecture

**One sentence:**  
“A TypeScript monorepo where the demo site emits events through a tracker package, a Fastify API validates and stores them in PostgreSQL, and a Next.js dashboard reads REST report endpoints.”

**Layers to name:**

1. **Presentation** — `apps/demo-site`, `apps/dashboard` (Next.js)
2. **Collection** — `packages/tracker` (browser SDK)
3. **Contracts & validation** — `packages/types`, `packages/analytics-core` (Zod)
4. **API** — `apps/ingest-api` (Fastify, REST)
5. **Data** — Prisma → `analytics_events` in PostgreSQL

**Design choices worth mentioning:**

- REST-first (no GraphQL)
- Shared schemas at the boundary
- Query-time reporting (no aggregation tables yet)
- Local-first for interviewability

---

## How to explain privacy-first tracking

**Lead with:** “Privacy constraints were a design requirement, not an afterthought.”

**Does not collect:**

- form values, names, emails, phone numbers, message text
- cookies, localStorage contents
- arbitrary DOM text, DOM snapshots, session replay data

**Does collect (MVP):**

- `page_view` — path/context from navigation
- `click` — only with `data-analytics-id` (ignores `data-analytics-ignore`, `data-private`, form controls)
- `scroll_depth` — milestones 25/50/75/100
- `conversion` — explicit names: `contact_form_submitted`, `pricing_cta_clicked`, `thank_you_page_viewed`

**Sound bite:** “We measure declared behavior signals, not page content or identity.”

---

## How to explain validation and persistence

**Validation:**

- Incoming events hit `POST /api/events`
- Zod schemas in `analytics-core` validate shape and types at runtime
- Invalid payloads are rejected before database writes
- Public API errors stay safe (no stack traces to clients)

**Persistence:**

- Valid events persist via Prisma to PostgreSQL table `analytics_events`
- Raw events stored; reports aggregate at query time
- `siteId=demo-site` scopes the demo dataset

**Sound bite:** “Validate at the boundary, then persist — same pattern I’d use in production, with more hardening later.”

---

## How to explain reports and dashboard

**Reporting API (implemented):**

- `GET /api/reports/overview?siteId=demo-site`
- `GET /api/reports/page-views-by-path?siteId=demo-site`
- `GET /api/reports/interactions-summary?siteId=demo-site`
- `GET /api/reports/scroll-depth-summary?siteId=demo-site`

**Dashboard:**

- Fetches from ingest API (env: `NEXT_PUBLIC_INGEST_API_URL`, default local 4000)
- Each section: loading → success, or empty/error with user-safe messaging
- Visuals: CSS-only charts for page views and scroll depth

**Sound bite:** “The dashboard is a read-only client of the reporting API — same separation I’d keep in a larger system.”

---

## How to explain tests and CI

**Tests (Vitest):**

- Reporting helpers — aggregation logic
- Reporting endpoints — HTTP behavior and safe responses
- Tracker privacy — sensitive data not collected

**CI (GitHub Actions):**

- On PRs and pushes to `main`
- `npm ci`, `db:generate`, workspace typechecks, workspace tests for implemented packages

**Sound bite:** “I tested boundaries that matter — validation, privacy, and report correctness — not every UI pixel.”

Do not claim E2E or screenshot automation — not implemented.

---

## How to explain current limitations honestly

Say clearly: **“This is a portfolio MVP running locally; I document what’s not built yet.”**

| Limitation | One-line honest answer |
|------------|-------------------------|
| No auth | Anyone with API URL could post in a real deploy — planned hardening |
| No rate limiting | Acceptable for local demo only |
| No deployment | Plan in `docs/deployment/deployment-plan.en.md`; not implemented |
| No date filters | Reports are all-time for `siteId` |
| No aggregation tables | Query-time reporting on raw events |
| No background jobs | Synchronous ingest path only |
| No session_start/end from tracker | Types exist; tracker doesn’t emit yet |
| No E2E tests | Unit/integration focus with Vitest |
| Not production SaaS | Intentional scope for learning and interviews |

---

## What I would improve next

Pick **two or three** — do not list everything as if committed.

1. **First hosted demo** — follow deployment plan: managed Postgres, ingest API, dashboard, then configurable demo-site tracker URL.
2. **Ingest hardening** — CORS for production, simple site keys, rate limiting.
3. **Reporting UX** — date filters, then consider aggregation if volume grows.
4. **Quality** — E2E smoke for demo path; optional real screenshots in README ([`demo-screenshots-plan.md`](demo-screenshots-plan.md)).
5. **Tracker product** — batching/offline retry; session events if product needs them.

Close with: “I’d keep shipping in small phases and only claim what’s merged and verified.”

---

## Common interviewer follow-up questions

Short answer ideas — expand with [`qa-and-objection-handling.md`](qa-and-objection-handling.md) if needed.

| Question | Short answer idea |
|----------|-------------------|
| Why monorepo? | Shared types and Zod schemas stay in sync between tracker, API, and tests. |
| Why Fastify? | Lightweight Node API, clear routes, good fit for ingest + reports at MVP size. |
| Why not GraphQL? | REST matches current four reports; simpler to explain in interviews. |
| Why PostgreSQL? | Reliable event storage; familiar SQL; Prisma for schema and migrations. |
| Why Zod if you have TypeScript? | Runtime validation at the API boundary — types alone don’t catch bad JSON. |
| How do you avoid collecting PII? | Product rules in tracker + tests; clicks need `data-analytics-id`; no form field reads. |
| How would you scale reports? | Date filters, indexes, then aggregation tables or materialized views — not in MVP yet. |
| Is this deployed? | No — local-first; deployment is documented as a plan only. |
| How do you know it works? | Local checklist, Vitest, CI; I can run the full demo in front of you. |
| What was hardest? | Pick something real for you: e.g. privacy rules + validation + dashboard states, or monorepo wiring. |
| What would you do differently? | Example: configurable tracker endpoint earlier if deployment was day one — now in deployment plan. |
| Returning to IT — why this project? | Shows current TypeScript full-stack, testing, and product trade-offs in one coherent story. |

---

## Related documentation

- [`30-second-60-second-120-second-pitch.md`](30-second-60-second-120-second-pitch.md) — elevator pitches
- [`interview-prep-checklist.md`](interview-prep-checklist.md) — 30 minutes before the call
- [`demo-screenshots-plan.md`](demo-screenshots-plan.md) — backup visuals when live demo fails
