# Project post draft (GitHub / LinkedIn)

Optional copy for sharing **Behavior Analytics MVP** on LinkedIn, in a GitHub repository update, or with recruiters. Adapt tone and length to the channel; do not publish claims this repo does not support.

**Before posting:** run [`final-portfolio-review-checklist.md`](final-portfolio-review-checklist.md) and confirm screenshots/README still match what you say.

**Repository:** https://github.com/KaterynaSukharevska/behavior-analytics

---

## Project intro (reference)

**Behavior Analytics MVP** is a **privacy-conscious website behavior analytics** project built as a **local-first portfolio/career MVP** in TypeScript. It demonstrates an end-to-end flow from a demo website through a tracker SDK, ingest API, validated persistence, reporting API, and dashboard UI — for interviews and portfolio review, not as a production SaaS.

---

## What this project demonstrates

- Full-stack **TypeScript** in an npm workspaces monorepo
- **Next.js** demo site and **dashboard** UI
- **Fastify** ingest API and REST reporting endpoints
- Browser **tracker SDK** (page views, opt-in clicks, scroll depth, explicit conversions)
- **Zod** runtime validation at API boundaries
- **Prisma** + **PostgreSQL** event persistence
- Query-time **reporting API** and dashboard report sections
- Focused **Vitest** tests and **GitHub Actions CI** (typechecks + core workspace tests)

Implemented flow:

```txt
demo-site → tracker SDK → ingest API → Zod → Prisma → PostgreSQL → reporting API → dashboard UI
```

---

## Honest scope (say this clearly)

- **Local MVP** — runs on `localhost` (dashboard `3000`, demo site `3001`, ingest API `4000`)
- **Not production SaaS** — no deployed product, no paying customers, no live traffic claims
- **Not implemented yet:** auth, deployment, rate limiting, date filters, production monitoring/logging strategy, E2E automation
- **Intentional trade-offs:** query-time reporting on raw events, CSS-only dashboard charts (no chart library)

---

## Privacy framing

The tracker is designed **not** to collect:

- form values, names, emails, or phone numbers
- cookies or `localStorage` contents
- arbitrary DOM text, DOM snapshots, or session replay data

Clicks use explicit safe identifiers such as **`data-analytics-id`**. Conversions are **explicit** events from code (for example `contact_form_submitted`, `pricing_cta_clicked`, `thank_you_page_viewed`).

---

## Screenshot / demo evidence note

README includes **local demo screenshots** under `docs/assets/screenshots/`. They show a real `localhost` run — **not customer data**, not production metrics, and **not edited analytics values**. Demo-site UI may include fictional marketing copy; dashboard numbers reflect your local session only.

---

## Variant A — LinkedIn-style post

Copy, edit, and add your repo link. Keep hashtags minimal if you use any (e.g. `#TypeScript` `#WebDevelopment`).

---

I finished a portfolio project I use to demonstrate full-stack TypeScript work: **Behavior Analytics MVP** — privacy-conscious website behavior analytics as a **local-first MVP**.

The flow is: demo site → tracker SDK → Fastify ingest API → Zod validation → Prisma/PostgreSQL → REST reporting → Next.js dashboard.

**What I focused on**

- End-to-end event pipeline with clear boundaries (ingest vs reporting vs UI)
- Privacy constraints by design (no form values, PII, cookies/localStorage, arbitrary DOM text, or session replay)
- Opt-in click tracking via `data-analytics-id` and explicit conversion events
- Runtime validation with Zod, persistence with Prisma, and focused Vitest tests
- GitHub Actions CI for core workspace typechecks and tests

**Honest scope:** this is a **portfolio/career project**, not a production SaaS. There is no deployment, auth, rate limiting, or date filters yet — by design for a controlled demo.

Screenshots in the README are from a **local demo** on localhost, not customer or production data.

Repo: https://github.com/KaterynaSukharevska/behavior-analytics

If you are hiring for full-stack TypeScript roles, I am happy to walk through the architecture, privacy choices, and trade-offs in a short call or interview.

---

## Variant B — GitHub / repository update style

Shorter, factual tone for a release note, pinned discussion, or profile README cross-post.

---

### Behavior Analytics MVP — local portfolio demo

Privacy-conscious website behavior analytics implemented as a **local-first TypeScript MVP** (not production SaaS).

**Stack:** Next.js (demo site + dashboard), Fastify ingest API, tracker SDK, Zod, Prisma/PostgreSQL, REST reporting, Vitest, GitHub Actions CI.

**Flow:** `demo-site → tracker → ingest API → validation → PostgreSQL → reporting API → dashboard`

**Privacy:** no form values, names/emails/phones, cookies/localStorage, arbitrary DOM text, or session replay; clicks via `data-analytics-id`; explicit conversions only.

**Current limits:** no auth, deployment, rate limiting, date filters, or production monitoring yet.

**Demo evidence:** README embeds screenshots from a real localhost run (`docs/assets/screenshots/`). Not customer or production data.

Docs: portfolio checklists, interview scripts, and architecture notes under `docs/`.

---

## What to avoid in either variant

- Production SaaS, “live product,” or enterprise scale claims
- Customer logos, user counts, revenue, or ROI you cannot verify from this repo
- “Revolutionary,” “disruptive,” or inflated metric language
- Implying auth, deployment, or advanced ops features are already shipped

---

## Related documentation

- [`../../README.md`](../../README.md) — GitHub entry point and screenshot section
- [`final-portfolio-review-checklist.md`](final-portfolio-review-checklist.md) — pre-share readiness
- [`30-second-60-second-120-second-pitch.md`](30-second-60-second-120-second-pitch.md) — spoken pitch versions
- [`technical-highlights.md`](technical-highlights.md) — architecture → skills map
- [`../assets/screenshots/README.md`](../assets/screenshots/README.md) — screenshot assets and privacy rules
