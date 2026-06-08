# Phase 11.2 — Live demo rehearsal notes

## Purpose

Document a **practical interview demo flow** for Behavior Analytics MVP after Phase 11.1 portfolio review.

This milestone records **how to present** the local stack — tab order, timing, talking points, and friction — so Kateryna can rehearse before interviews. It does **not** change product code.

**Related:**

- Phase 11.1 outcomes: [`phase-11-final-review-notes.md`](phase-11-final-review-notes.md)
- Run checklist: [`local-demo-checklist.md`](local-demo-checklist.md)
- Timed script: [`interview-walkthrough-script.md`](interview-walkthrough-script.md)
- Screen-by-screen talk track: [`interview-storyline.md`](interview-storyline.md)

---

## Demo goal

Show one honest end-to-end story in **5 or 10 minutes**:

```txt
demo-site → tracker SDK → ingest API → Zod validation → Prisma → PostgreSQL → reporting API → dashboard UI
```

Frame it as a **local-first portfolio MVP** — not production SaaS, not deployed, no real customers.

---

## Live execution status (this rehearsal)

| Check | Result | Notes |
|-------|--------|-------|
| PostgreSQL (Docker) | **Verified** | `docker compose ps` — postgres healthy on :5432 |
| Ingest API health | **Verified** | `GET /api/health` → `{"ok":true,"service":"ingest-api"}` |
| Demo site | **Verified** | `http://localhost:3001` → HTTP 200 |
| Dashboard | **Verified** | `http://localhost:3000` → HTTP 200; report-related content in page |
| Report endpoints | **Verified** | All four `GET /api/reports/*?siteId=demo-site` returned HTTP 200 with non-zero demo data |
| Browser UI walkthrough | **Not run by agent** | Clicks, scroll, form submit, and hard-refresh UX should be rehearsed manually in the browser |

**Rehearsal date:** 2026-06-08  
**Environment:** Services were already running locally; API layer probed via HTTP. Full browser demo (Network tab, scroll milestones, dashboard refresh) is the next manual step for Kateryna.

---

## Before the interview — prep checklist (5 minutes)

1. Run [`local-demo-checklist.md`](local-demo-checklist.md) **Before the demo** and **Start local services** sections.
2. Confirm ports **3000, 3001, 4000, 5432** are free.
3. Start in order: **PostgreSQL → ingest API → dashboard → demo site** (four terminals).
4. Open tabs in this order (left to right):

| Tab | URL | Why |
|-----|-----|-----|
| 1 | http://localhost:4000/api/health | Quick “API is up” proof |
| 2 | http://localhost:3001 | Event source / tracker demo |
| 3 | http://localhost:3000 | Dashboard (refresh after events) |
| 4 (optional) | http://localhost:4000/api/reports/overview?siteId=demo-site | REST proof without UI |
| 5 (optional) | GitHub repo README (Demo Screenshots) | Fallback if live demo fails |

Keep [`demo-day-fallback-script.md`](demo-day-fallback-script.md) open in a separate window.

---

## Recommended interview tab order

Use this order during the **live** portion (after a 30-second intro):

1. **Health** — prove ingest API is running.
2. **Demo site home** — point at `data-analytics-id` on a nav link or CTA.
3. **Demo site navigation** — `/features` → `/pricing` → `/contact` (page views).
4. **One tracked click** — e.g. nav or pricing CTA (not a form field).
5. **Scroll** on home — slow scroll through 25% → 100% (takes ~15–30 seconds).
6. **One conversion** — fastest: open `/thank-you` **or** submit contact form **or** pricing “Contact sales”.
7. **Optional API tab** — overview JSON in browser.
8. **Dashboard** — hard refresh (`Ctrl+Shift+R`), then top-to-bottom report sections.

---

## 5-minute demo flow

**Total ~5:00** — compressed; skip Network tab and API JSON unless asked.

| Time | Where | What to do / say |
|------|--------|------------------|
| 0:00–0:30 | Intro (no screen) | “Privacy-conscious behavior analytics MVP — local portfolio project, full-stack TypeScript, not production SaaS.” |
| 0:30–1:00 | Health tab | Show JSON health; name Fastify ingest + reporting on one service. |
| 1:00–2:30 | Demo site | Open home; show `data-analytics-id`; visit 2–3 routes; one tracked click; quick scroll on home (at least 50%+). |
| 2:30–3:15 | Demo site or voice | Privacy: no form values, PII, cookies, DOM text, replay; clicks opt-in; Zod before DB. |
| 3:15–4:30 | Dashboard | Hard refresh; overview cards → page views chart → interactions → scroll depth. Mention CSS-only charts. |
| 4:30–5:00 | Voice | Limitations: no auth, deployment, date filters; Vitest + GitHub Actions CI on repo. |

**If time is tight:** skip scroll depth table detail; show overview + page views only.

---

## 10-minute demo flow

**Total ~10:00** — aligns with [`interview-storyline.md`](interview-storyline.md) 10-minute walkthrough.

| Time | Topic | Actions |
|------|--------|---------|
| 0:00–1:00 | Problem & scope | Why behavior analytics; privacy constraints; local MVP purpose. |
| 1:00–2:30 | Architecture | Draw or narrate monorepo layers: demo-site, tracker, ingest API, Zod, Prisma/PostgreSQL, REST reports, dashboard. |
| 2:30–5:00 | Live demo (full) | Health → demo site (all main routes) → tracked clicks → full scroll milestones → one conversion → optional overview URL. |
| 5:00–6:30 | Privacy & validation | What is **not** collected; `data-analytics-id`; explicit conversions; Zod at ingest. |
| 6:30–8:00 | Dashboard deep dive | All four sections; optional Network tab showing `POST /api/events`. |
| 8:00–9:00 | Tests & CI | Point to README CI badge; Vitest on reporting + tracker privacy (no need to run tests live). |
| 9:00–10:00 | Limitations & next steps | Honest gaps; deployment plan exists but not implemented; small phased improvements. |

---

## What to say — privacy-first tracking

**Lead:** “Privacy constraints were a design requirement, not an afterthought.”

**Does not collect:**

- form values, names, emails, phone numbers, message text
- cookies, `localStorage` contents
- arbitrary DOM text, DOM snapshots, session replay data

**Does collect (MVP):**

| Event | How |
|-------|-----|
| `page_view` | Route navigation |
| `click` | Only elements with `data-analytics-id` (ignores form fields, `data-private`, `data-analytics-ignore`) |
| `scroll_depth` | Milestones 25%, 50%, 75%, 100% per path per session |
| `conversion` | Explicit code: `contact_form_submitted`, `pricing_cta_clicked`, `thank_you_page_viewed` |

**Sound bite:** “We measure declared behavior signals, not page content or identity.”

**Live demo tip:** On the contact page, type in the form but explain that **submitting** may fire a conversion event — the **field values are not** sent to analytics.

---

## What to say — architecture

**One sentence:**  
“A TypeScript monorepo where the demo site emits events through a tracker package, a Fastify API validates and stores them in PostgreSQL, and a Next.js dashboard reads REST report endpoints.”

**Layers to name:**

1. **Presentation** — `apps/demo-site`, `apps/dashboard` (Next.js)
2. **Collection** — `packages/tracker`
3. **Contracts & validation** — `packages/types`, `packages/analytics-core` (Zod)
4. **API** — `apps/ingest-api` (Fastify, REST)
5. **Data** — Prisma → `analytics_events` in PostgreSQL

**Design choices worth one line each:**

- REST-first (no GraphQL)
- Dashboard never talks to the database directly
- Query-time reporting (no aggregation tables yet)
- Local-first for interviewability

**Optional API proof line:**  
“Overview at `/api/reports/overview?siteId=demo-site` is the same data the dashboard cards use.”

---

## What to say — limitations

Say these plainly — they show scope discipline:

- no auth
- no rate limiting
- no deployment yet (plan only in docs)
- no production monitoring / logging strategy
- no date filters on reports
- no aggregation tables, background jobs, or offline retry
- no `session_start` / `session_end` from tracker yet
- no E2E or screenshot test automation
- **not production SaaS**

**Good “what’s next” answer (updated for Phase 11):**  
“Portfolio presentation is in good shape with docs and local demo evidence. Next technical steps would be small and explicit — for example deployment from the existing plan, then date filters or auth — only when implemented and tested.”

---

## Possible interviewer questions during demo

| Question | Short honest answer |
|----------|---------------------|
| Is this deployed? | No — runs on localhost; deployment is documented as a future plan. |
| Real users / customers? | No — demo site generates events for portfolio demonstration. |
| How do you avoid collecting PII? | Tracker rules + opt-in clicks + tests; form values never sent. |
| Why PostgreSQL? | Reliable event storage; Prisma for schema and queries. |
| Why not GraphQL? | REST keeps the MVP simple and matches report endpoints. |
| How do you validate events? | Zod schemas in `analytics-core` at ingest before Prisma write. |
| What if the demo breaks live? | Fall back to README screenshots + architecture docs + [`demo-day-fallback-script.md`](demo-day-fallback-script.md). |
| Scale / performance? | MVP scope; query-time aggregation is fine for demo volume; no materialized views yet. |
| Security? | Local MVP; no auth or rate limiting yet — documented as limitations. |

---

## Friction points found

### From live API probe (2026-06-08)

| Friction | Severity | Mitigation for interview |
|----------|----------|---------------------------|
| **Four terminals** required (postgres + 3 apps) | Medium | Start stack 10–15 min before; use clean restart checklist if stuck |
| **Dashboard needs hard refresh** after new events | Low | Say “reports are pull-based”; refresh once before showing cards |
| **Scroll milestones take time** on home page | Low | In 5-min demo, scroll to 50%+ only; mention 25/50/75/100 exist |
| **Overview JSON has no `ok: true` on success** (only `siteId` + `totals`) | Low doc mismatch | Success = HTTP 200 + totals object; errors use `ok: false` — optional fix in 11.3 checklist wording |
| **Existing DB data** from past sessions | Low | Numbers may not match actions live; narrate “aggregated from stored events” or use fresh DB if you need exact counts |

### From portfolio docs (11.1 carryover)

| Friction | Severity | Mitigation |
|----------|----------|------------|
| [`interview-walkthrough-script.md`](interview-walkthrough-script.md) still says “next work in Phase 8” | Low | Use updated “what’s next” line in this doc until 11.3 fixes script |
| Root README lists phase-10 as “current handoff” | Low | Point interviewers to Phase 11 context in `docs/` if asked about project status |
| Only 3 of 6 screenshots in README | Low | Use extra PNGs from [`../assets/screenshots/`](../assets/screenshots/) in fallback |

### Browser rehearsal still recommended

The agent verified **HTTP/API and page load** only. Before the first interview, manually confirm:

- [ ] Network tab shows `POST /api/events` with `{ "ok": true, "accepted": 1 }` (or similar)
- [ ] Dashboard cards move from loading → success with non-zero metrics after refresh
- [ ] Contact form submit fires `contact_form_submitted` without sending field text

---

## Small follow-up candidates for Phase 11.3

Docs-only fixes from rehearsal + 11.1 (no code unless explicitly requested later):

| Item | File |
|------|------|
| Update stale “Phase 8” next-step line | `interview-walkthrough-script.md` |
| Align “`ok: true` on all report success bodies” wording | `local-demo-checklist.md` (overview returns `siteId` + `totals` on success) |
| README phase handoff → Phase 11 | `README.md` |
| Link final review checklist in README portfolio table | `README.md` |
| Screenshots README embed guidance (10.3 done) | `docs/assets/screenshots/README.md` |

---

## Explicit out-of-scope confirmation (11.2)

Not changed or attempted:

- App, API, tracker, dashboard, demo-site source code
- Tests, package files, CI config, Prisma/schema
- Screenshot PNG files
- `docs/architecture/testing-strategy.en.md`
- Phase 11.3 consistency edits (deferred)

---

## Quick rehearsal script (read aloud once)

1. “This is a **local portfolio MVP** for privacy-conscious website analytics — not a deployed product.”
2. “**Health** shows the Fastify API is up.”
3. “On the **demo site**, navigation and opt-in clicks send events to `POST /api/events`; I don’t collect form text or cookies.”
4. “**Zod** validates before **Prisma** writes to PostgreSQL.”
5. “The **dashboard** reads four REST report endpoints — here are overview, paths, interactions, and scroll depth.”
6. “**Limitations** are intentional: no auth, deployment, or date filters yet; **CI and Vitest** cover core behavior on GitHub.”

---

## Related documentation

- [`phase-11-final-review-notes.md`](phase-11-final-review-notes.md) — Phase 11.1 checklist outcomes
- [`local-demo-checklist.md`](local-demo-checklist.md) — full run/verify/troubleshoot steps
- [`demo-day-fallback-script.md`](demo-day-fallback-script.md) — when live demo fails
- [`../assets/screenshots/README.md`](../assets/screenshots/README.md) — committed demo images for fallback
