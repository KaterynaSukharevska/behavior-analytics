# Final portfolio review checklist

Use this checklist when you want to confirm the Behavior Analytics MVP is **ready to show** on GitHub, in a portfolio review, or in a technical interview — as a **local-first portfolio project**, not as a production SaaS.

Complete it after local setup works and Phase 10 demo evidence (screenshots, README embeds) is in place. For day-of-interview prep, also use [`interview-prep-checklist.md`](interview-prep-checklist.md).

---

## How to use this checklist

- Work top to bottom; check boxes only when you have verified the item yourself.
- If something fails, note it under **Final show-readiness decision** (blockers/notes).
- Do not claim features, deployment, or customers that are not implemented.

**Related docs:**

| Topic | Document |
|-------|----------|
| Run the live demo | [`local-demo-checklist.md`](local-demo-checklist.md) |
| Screenshot files and privacy | [`../assets/screenshots/README.md`](../assets/screenshots/README.md) |
| Capture sequence (reference) | [`demo-screenshots-plan.md`](demo-screenshots-plan.md) |
| GitHub entry point | [`../../README.md`](../../README.md) |

---

## 1. README review

Open root [`README.md`](../../README.md) on GitHub or locally.

- [ ] **Project purpose** is clear in the first sections (privacy-conscious behavior analytics, full-stack TypeScript MVP).
- [ ] **Local MVP framing** is honest (local-first portfolio/career project; not production SaaS).
- [ ] **Implemented flow** is described (`demo-site` → tracker → ingest API → Prisma/PostgreSQL → reporting API → dashboard).
- [ ] **Demo Screenshots** section exists and embeds 1–3 images from `docs/assets/screenshots/`.
- [ ] Screenshot section states images are from a **real local demo**, not production or customer data.
- [ ] **Current Limitations** section is visible and includes items such as no auth, no deployment, no date filters.
- [ ] **CI badge/link** is present and points to GitHub Actions (if the workflow exists in the repo).
- [ ] No wording implies **deployed production**, **paying customers**, **enterprise scale**, or **live SaaS metrics**.
- [ ] Portfolio doc table links to key interview/demo docs (local demo checklist, screenshots, pitches, fallback).

---

## 2. Screenshot review

Review files under [`docs/assets/screenshots/`](../assets/screenshots/) and how they appear in the README.

- [ ] Required portfolio PNGs exist (at minimum the three embedded in README):
  - [ ] `dashboard-overview-local-demo.png`
  - [ ] `dashboard-page-views-local-demo.png`
  - [ ] `demo-site-home-local-demo.png`
- [ ] Additional captures exist if you rely on them in interviews (optional set documented in [`../assets/screenshots/README.md`](../assets/screenshots/README.md)).
- [ ] Screenshots were captured from a **real local demo** (`localhost:3000`, `3001`, `4000`), not stock art or mocked UI.
- [ ] **No PII**: no real names, emails, phone numbers, or form values visible.
- [ ] **No secrets**: no `.env`, API keys, `DATABASE_URL`, or private tokens in frame.
- [ ] **No browser profile noise**: unrelated tabs, bookmarks, account avatars, or notifications cropped out or absent.
- [ ] **No session/cookie storage** panels shown as “analytics data.”
- [ ] Dashboard/report numbers were **not edited or invented** in an image editor.
- [ ] README **alt text** is honest (mentions local demo; does not imply production customers).
- [ ] Demo-site marketing copy in screenshots is understood as **fictional demo UI**, not real business results.

---

## 3. Local demo review

Follow [`local-demo-checklist.md`](local-demo-checklist.md) for commands and troubleshooting. Confirm you can explain the flow in one minute.

- [ ] **Dashboard** loads: http://localhost:3000
- [ ] **Demo site** loads: http://localhost:3001
- [ ] **Ingest API health** returns JSON: http://localhost:4000/api/health → `{ "ok": true, "service": "ingest-api" }`
- [ ] You can **generate events** on the demo site (page views, `data-analytics-id` clicks, scroll depth, explicit conversions).
- [ ] **Dashboard report sections** show success with data after refresh (overview, page views by path, interactions, scroll depth).
- [ ] You can explain the **event flow** in plain language: tracker → `POST /api/events` → Zod → Prisma → PostgreSQL → `GET /api/reports/*` → dashboard.
- [ ] You know the **fallback** if live demo fails: [`demo-day-fallback-script.md`](demo-day-fallback-script.md) plus README screenshots and architecture docs.

---

## 4. Portfolio / interview docs review

Confirm supporting docs exist and match what you will say aloud.

- [ ] [`local-demo-checklist.md`](local-demo-checklist.md) — run/verify/troubleshoot local stack
- [ ] [`interview-walkthrough-script.md`](interview-walkthrough-script.md) — timed walkthrough
- [ ] [`interview-storyline.md`](interview-storyline.md) — 5-/10-minute storyline (if you use it)
- [ ] [`technical-highlights.md`](technical-highlights.md) — architecture → skills map
- [ ] [`qa-and-objection-handling.md`](qa-and-objection-handling.md) — honest Q&A
- [ ] [`30-second-60-second-120-second-pitch.md`](30-second-60-second-120-second-pitch.md) — short pitches
- [ ] [`interview-prep-checklist.md`](interview-prep-checklist.md) — last-minute prep
- [ ] [`demo-day-fallback-script.md`](demo-day-fallback-script.md) — when services are down
- [ ] [`demo-screenshots-plan.md`](demo-screenshots-plan.md) — capture rules and optional shots
- [ ] [`../assets/screenshots/README.md`](../assets/screenshots/README.md) — asset folder and naming

---

## 5. Technical honesty review

Cross-check README, [`docs/architecture/architecture.en.md`](../architecture/architecture.en.md), and [`docs/architecture/privacy-security.en.md`](../architecture/privacy-security.en.md) if needed.

- [ ] **Implemented features** in README match what runs locally (tracker events, ingest, Prisma persistence, four report endpoints, dashboard sections, Vitest + CI).
- [ ] **Limitations** are explicit where asked (no auth, no rate limiting, no deployment, no date filters, no E2E automation).
- [ ] You do **not** describe auth, deployment, rate limiting, or date filters as **already shipped**.
- [ ] You do **not** claim **GraphQL** or **microfrontends** (REST + npm workspaces only).
- [ ] **Privacy rules** are accurate: no form values, cookies, `localStorage`, arbitrary DOM text, or session replay; clicks via `data-analytics-id`; explicit conversions only.
- [ ] **CSS-only charts** are described correctly (no chart library dependency for current dashboard visuals).
- [ ] **CI** is described as workspace typechecks + Vitest, not full production QA.
- [ ] You do not cite **fake user counts**, **customer logos**, or **revenue/ROI** from this MVP.

---

## 6. Final show-readiness decision

Pick one outcome and add notes.

### Outcome (check one)

- [ ] **Ready** — README, screenshots, docs, and live demo are aligned; honest framing is consistent.
- [ ] **Ready with notes** — acceptable to show; minor gaps documented below (e.g. optional screenshots missing, README typo).
- [ ] **Not ready yet** — blockers must be fixed before sharing widely.

### Blockers / notes (fill in)

```txt
Date reviewed:
Outcome:
Blockers (if any):
Notes (optional extras to improve later):
```

**Examples of valid “Ready with notes” items:** only three README screenshots while more exist in folder; demo-site hero uses fictional marketing copy; no deployment yet by design.

**Examples of “Not ready yet” blockers:** README claims production; screenshots show secrets/PII; live demo does not run; dashboard always errors; limitations section removed or contradicted elsewhere.

---

## Related documentation

- [`../../README.md`](../../README.md) — GitHub portfolio entry point
- [`../README.md`](../README.md) — full docs index
- [`../phase-10-context.md`](../phase-10-context.md) — Phase 10 handoff (demo evidence)
- [`../testing/basic-smoke-test-plan.md`](../testing/basic-smoke-test-plan.md) — P0 smoke priorities before demos
