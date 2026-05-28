# 30-second, 60-second, and 120-second pitch

## Goal

This document helps present Behavior Analytics MVP clearly in short recruiter and interviewer conversations.

Use these versions to stay concise, confident, and honest about current scope.

---

## 30-second pitch

"Behavior Analytics MVP is a privacy-conscious website behavior analytics project I built as a full-stack TypeScript portfolio MVP. It includes a demo-site, a tracker SDK, a Fastify ingest API, PostgreSQL persistence, REST reporting endpoints, and a Next.js dashboard. I use it to demonstrate practical end-to-end engineering skills in interviews while keeping scope local-first and honest."

---

## 60-second pitch

"The problem I wanted to solve was how to understand website behavior without collecting sensitive user data. I built a local-first analytics MVP where the flow is: `demo-site -> tracker SDK -> ingest API -> validation -> database -> reporting API -> dashboard`.  
I used TypeScript across a monorepo, Zod for runtime validation, Fastify for ingest/reporting APIs, Prisma with PostgreSQL for persistence, and a Next.js dashboard for report visualization.  
The tracker follows privacy constraints by design, and I added focused tests plus GitHub Actions CI checks to keep core behavior reliable. It’s a portfolio project, not a production SaaS claim."

---

## 120-second pitch

"Behavior Analytics MVP is a portfolio/career project designed to show full-stack TypeScript engineering in a realistic but controlled scope.  
The core idea is privacy-conscious behavior analytics: collect useful event signals while intentionally avoiding sensitive data collection.

Architecture-wise, I used npm workspaces to keep apps and shared packages together. The implemented flow is: `demo-site -> tracker SDK -> ingest API -> Zod validation -> Prisma -> PostgreSQL analytics_events -> REST reporting API -> Next.js dashboard`.  
The demo-site generates page views, clicks, scroll depth milestones, and conversion events. The ingest API validates input before persistence, and report endpoints power dashboard sections for overview, page views by path, interactions summary, and scroll depth summary.

Privacy was a design constraint from the start: no form values, names, emails, phone numbers, cookies, localStorage contents, arbitrary DOM text, DOM snapshots, or session replay data. Click tracking uses explicit identifiers like `data-analytics-id`.

Engineering practices demonstrated include TypeScript contracts, runtime validation with Zod, REST API design with Fastify, data persistence with Prisma/PostgreSQL, focused Vitest coverage, and GitHub Actions CI checks.

Current limitations are intentional: no auth, no rate limiting, no deployment yet, and no date filters or E2E testing yet. Next steps could include deployment implementation from the existing plan, basic auth/rate limiting, date filters, stronger smoke/E2E coverage, and deeper reporting capabilities."

---

## One-sentence version

Behavior Analytics MVP is a local-first, privacy-conscious full-stack TypeScript portfolio project that tracks safe website behavior events and visualizes reports through a Fastify/Prisma/PostgreSQL backend and a Next.js dashboard.

---

## Recruiter-friendly version

"I built a small analytics product to demonstrate practical full-stack skills. It tracks basic website behavior safely, stores events in a database, and shows simple reports in a dashboard. I designed it as a local portfolio MVP with clear documentation and realistic engineering trade-offs, not as a production SaaS."

---

## Technical interviewer version

"This project uses an npm workspace monorepo with shared TypeScript types and Zod validation schemas. The demo-site emits events through a tracker SDK to a Fastify ingest API. Valid events are stored via Prisma in PostgreSQL, and REST reporting endpoints feed a Next.js dashboard. I added focused Vitest tests around reporting and tracker privacy behavior, and GitHub Actions CI runs typechecks/tests for core workspaces."

---

## What to avoid saying

Do not claim:

- production readiness
- deployed SaaS
- enterprise analytics
- complete GDPR/legal compliance
- session replay
- cookie-based tracking
- real-time large-scale analytics
- advanced security hardening

---

## Current honest framing

- this is a local-first portfolio MVP
- it demonstrates full-stack TypeScript skills
- it is privacy-conscious by design
- it is not production SaaS
- future work could include deployment, auth, rate limiting, date filters, E2E tests, and better reporting depth
