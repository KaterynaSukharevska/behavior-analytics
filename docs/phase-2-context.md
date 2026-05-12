# Behavior Analytics MVP — Phase 2 Cursor Context

## Purpose of This File

This file is the working context for a new Cursor Agent before starting Phase 2.

Use it to help Cursor understand:

- what the project is,
- what has already been completed,
- what the current repository looks like,
- what the next implementation phase is,
- what Cursor should and should not touch.

---

# Project Overview

## What This Project Is

**Behavior Analytics MVP** is a real portfolio / career project for a developer returning to IT after a long break.

The goal is to build a modern, realistic, portfolio-quality MVP that can be used for:

- CV
- LinkedIn
- GitHub
- demo
- interviews
- practice with modern frontend/full-stack workflow

The project should strengthen the profile as:

- Frontend Engineer
- UI-heavy Frontend Engineer
- UI Developer
- Product-leaning Frontend Engineer
- Design-to-code / polished interfaces candidate

---

# Product Idea

Working name:

**Behavior Analytics MVP**

One-liner:

> A lightweight behavior analytics tool for websites that helps teams understand page engagement, click behavior, scroll depth, traffic sources, and conversion drop-off.

The product consists of:

- a tracking script / SDK installed on a website,
- an ingest API that receives and stores analytics events,
- a dashboard that displays understandable analytics reports,
- a demo website used for testing and portfolio demonstration.

---

# MVP Focus

The MVP should help answer:

- Which pages receive the most traffic?
- Where does traffic come from?
- Which pages hold attention better or worse?
- How far do users scroll?
- Which elements are clicked most often?
- Which CTAs perform better?
- At which step do users drop off before conversion?

MVP feature focus:

- page views
- sessions
- click tracking
- scroll depth
- dwell time
- traffic sources
- custom conversion events
- simple funnel / conversion drop-off
- dashboard reports
- demo website

---

# Target Audience

Main target segment:

- landing pages
- marketing sites
- small business websites
- simple product websites
- campaign pages

Main users:

- marketing manager
- founder
- agency / freelancer
- small product owner
- small product team

---

# MVP Non-goals

Do not include in MVP:

- session replay
- full enterprise heatmap engine
- A/B testing platform
- feature flags
- billing/subscriptions
- microfrontends
- GraphQL
- complex multi-user roles
- warehouse sync
- CDP-like identity resolution
- enterprise-scale real-time analytics pipeline

---

# Fixed Technical Decisions

## Accepted

- Product: Behavior Analytics MVP for websites
- Architecture: monorepo
- Package manager: npm only
- Dashboard: Next.js
- Demo site: Next.js
- Backend: Fastify
- Database: PostgreSQL
- Local database: Docker Compose PostgreSQL
- Shared contracts: TypeScript + Zod
- API style: REST-first
- Testing planned: Vitest + Playwright
- Raw events stored first
- Query-time aggregation first
- No microfrontends
- No GraphQL for MVP

## Open Decisions

Can be finalized later:

- Prisma or Drizzle
- Auth.js, Clerk, or simple secure session auth
- Deployment platform
- Exact click visualization approach
- Whether background aggregation is needed in MVP
- Whether AI insights belong in Phase 2 or later

---

# Current Repository

GitHub repo:

```txt
https://github.com/KaterynaSukharevska/behavior-analytics
```

Current local project folder:

```txt
behavior_analytics/
```

Current monorepo structure:

```txt
behavior_analytics/
  apps/
    dashboard/
    ingest-api/
    demo-site/

  packages/
    tracker/
    types/
    analytics-core/
    config/

  docs/
    README.md

    product/
      product-definition.en.md
      product-definition.ru.md
      domain-model-and-event-taxonomy.en.md
      domain-model-and-event-taxonomy.ru.md

    architecture/
      architecture.en.md
      architecture.ru.md

    roadmap/
      roadmap.en.md
      roadmap.ru.md

    setup/
      local-development.en.md
      local-development.ru.md

  package.json
  package-lock.json
  tsconfig.base.json
  .gitignore
  README.md
  docker-compose.yml
  .env.example
```

---

# Current Local Apps / Ports

Currently working locally:

```txt
Dashboard:   http://localhost:3000
Demo Site:   http://localhost:3001
Ingest API:  http://localhost:4000
Health API:  http://localhost:4000/api/health
PostgreSQL:  localhost:5432
```

Health endpoint currently returns:

```json
{
  "ok": true,
  "service": "ingest-api"
}
```

PostgreSQL runs via Docker Compose and was verified as healthy:

```txt
behavior_analytics_postgres   Up ... healthy   0.0.0.0:5432->5432/tcp
```

---

# Current App Status

## apps/dashboard

Status: minimal foundation done.

Stack:

- Next.js
- React
- TypeScript
- App Router
- plain CSS

Currently:

- runs on localhost:3000
- renders simple Behavior Analytics placeholder page
- shows current local system status
- does not connect to backend yet
- no Tailwind yet
- no shadcn/ui yet
- no charts yet
- no auth yet

---

## apps/ingest-api

Status: minimal foundation done.

Stack:

- Fastify
- TypeScript
- tsx
- Zod installed/planned
- @fastify/cors

Currently:

- runs on localhost:4000
- has GET /api/health
- returns `{ ok: true, service: "ingest-api" }`
- does not connect to DB yet
- no ingest events endpoint yet
- no auth yet
- no reporting endpoints yet

---

## apps/demo-site

Status: minimal foundation done.

Stack:

- Next.js
- React
- TypeScript
- App Router
- plain CSS

Currently:

- runs on localhost:3001
- includes simple marketing site pages:
  - `/`
  - `/features`
  - `/pricing`
  - `/contact`
  - `/thank-you`
- has CTA buttons and navigation
- has useful future analytics attributes:
  - `data-analytics-id` on important CTAs
  - `data-analytics-ignore` on form fields
- does not include tracker SDK yet
- does not connect to backend yet

---

# Docker / Database

Docker Compose currently contains PostgreSQL only.

Recommended local DB:

```txt
Database name: behavior_analytics
User: postgres
Password: postgres
Host: localhost
Port: 5432
```

Connection string:

```txt
postgresql://postgres:postgres@localhost:5432/behavior_analytics
```

Common commands:

```bash
docker compose up -d
docker compose ps
docker compose down
```

---

# npm / Workspace Commands

Package manager decision:

```txt
npm only
not pnpm
not yarn
```

Install dependencies:

```bash
npm install
```

Run ingest API:

```bash
npm run dev --workspace=@behavior-analytics/ingest-api
```

Run dashboard:

```bash
npm run dev --workspace=@behavior-analytics/dashboard
```

Run demo site:

```bash
npm run dev --workspace=@behavior-analytics/demo-site
```

Typical local startup:

```bash
# 1. Open Docker Desktop first.

# 2. In project root:
docker compose up -d

# 3. Start API in one terminal:
npm run dev --workspace=@behavior-analytics/ingest-api

# 4. Start dashboard in second terminal:
npm run dev --workspace=@behavior-analytics/dashboard

# 5. Start demo-site in third terminal:
npm run dev --workspace=@behavior-analytics/demo-site
```

---

# Completed Work

## Phase 0 — Product and Planning Documentation

Status: done / mostly done.

Created docs:

- Product Definition
- Domain Model and Event Taxonomy
- Technical Architecture
- Roadmap
- Local Development Setup

Docs are located under:

```txt
docs/product
docs/architecture
docs/roadmap
docs/setup
```

---

## Phase 1 — Local Development and Repo Foundation

Status: done.

Completed:

- root monorepo foundation
- npm workspaces
- package-lock.json
- tsconfig.base.json
- .gitignore
- .env.example
- docker-compose.yml
- PostgreSQL via Docker
- Fastify ingest-api foundation
- /api/health endpoint
- Next.js dashboard foundation
- Next.js demo-site foundation
- local ports verified
- Git initialized
- GitHub repository created
- project pushed to GitHub
- root README polished for portfolio

---

# Current GitHub / Git Status

Repository was pushed successfully to GitHub.

The push succeeded with:

```txt
[new branch] main -> main
branch 'main' set up to track 'origin/main'
```

Remote was switched from SSH to HTTPS because SSH key was not configured.

Current remote should be:

```txt
https://github.com/KaterynaSukharevska/behavior-analytics.git
```

Useful commands:

```bash
git status
git add .
git commit -m "message"
git push
```

---

# Current Next Step

Phase 1 is closed.

The next big stage is:

```txt
Phase 2 — Shared Contracts and Domain Types
```

Recommended breakdown:

1. Phase 2.1 — create shared event types in `packages/types`
2. Phase 2.2 — create Zod event schemas in `packages/analytics-core`
3. Phase 2.3 — add validation tests
4. Phase 2.4 — connect ingest-api to shared schemas

The immediate next implementation task should be:

```txt
Phase 2.1 — Shared TypeScript event types
```

---

# Phase 2.1 Goal

Define the basic analytics event model.

The task should:

- define event type union,
- define common event fields,
- define specific event payload types,
- define ingest request/response DTOs,
- keep this framework-agnostic,
- not connect backend yet,
- not add database yet,
- not overengineer.

Expected target area:

```txt
packages/types
```

Possibly later:

```txt
packages/analytics-core
```

But Phase 2.1 should focus only on TypeScript types first.

---

# Event Taxonomy v1

Supported event types:

- `session_start`
- `session_end`
- `page_view`
- `click`
- `scroll_depth`
- `conversion`

Common event fields direction:

- `event_id`
- `event_type`
- `site_id`
- `session_id`
- `timestamp`
- `page_url`
- `path`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `viewport_width`
- `viewport_height`
- `device_type`

Click-specific fields:

- `element_tag`
- `element_id`
- `element_classes`
- `element_text_short`
- `selector`
- `x`
- `y`
- `normalized_x`
- `normalized_y`

Scroll-specific fields:

- `depth_percent`

Conversion-specific fields:

- `conversion_name`
- `conversion_value`

Ingest request shape direction:

```ts
type IngestEventsRequest = {
  site_id: string
  events: AnalyticsEventPayload[]
}
```

---

# Privacy / Security Principles

Privacy is core product quality.

Tracker must not collect:

- passwords
- raw form input values
- emails typed into forms
- phone numbers typed into forms
- card numbers
- personal messages
- sensitive user-generated text
- full DOM snapshots
- session replay recordings

Tracker should support / respect:

- `input[type="password"]` ignored
- form fields ignored by default
- `data-private`
- `data-analytics-ignore`
- `data-analytics-id`
- selector denylist
- sanitized and shortened element text

Backend should include later:

- payload validation
- request size limits
- ingest rate limiting
- CORS configuration
- project ownership checks
- no sensitive logging
- safe error responses

---

# Important Working Style

Use Cursor for implementation.

Preferred workflow:

- open Cursor at `behavior_analytics/` root,
- one small task at a time,
- use docs as project context,
- avoid generating too many files at once,
- keep changes reviewable,
- prefer simple MVP implementation,
- avoid overengineering,
- run checks after meaningful steps,
- update docs only when decisions change,
- commit after each meaningful milestone.

For Cursor prompts:

- use clear phase/task title,
- specify exact files/folders to edit,
- specify what not to edit,
- specify verification commands,
- keep tasks small and reviewable.

Current preferred pattern:

```txt
One Cursor Agent task = one small implementation step.
```

---

# How to Start Phase 2 in a New Cursor Agent

## Step 1 — Open Cursor in the project root

Open Cursor at:

```txt
behavior_analytics/
```

Do not open Cursor inside:

```txt
apps/dashboard
packages/types
apps/ingest-api
```

Cursor should show:

```txt
apps/
packages/
docs/
package.json
docker-compose.yml
README.md
```

---

## Step 2 — Check Git status

In Cursor terminal:

```bash
git status
```

If the tree is clean, continue.

If there are uncommitted files, commit them first:

```bash
git add .
git commit -m "Complete local monorepo foundation"
git push
```

---

## Step 3 — Create this context file

Recommended file path:

```txt
docs/phase-2-context.md
```

This file should contain the context you are reading now.

---

## Step 4 — Open a new Cursor Agent

In Cursor:

1. Open Chat / Agent panel.
2. Click **New Chat** or **+**.
3. Choose **Agent** mode if Cursor asks.
4. Make sure the opened workspace is `behavior_analytics`.

Important:

Do not continue the old Phase 1 chat.

---

## Step 5 — First message to the new Agent

Before asking Cursor to write code, ask it to read and summarize the context.

Use this prompt:

```txt
You are working on Behavior Analytics MVP.

Before making any code changes, read the project context:

- README.md
- docs/phase-2-context.md
- package.json
- tsconfig.base.json

Then briefly summarize:
1. what this project is,
2. what is already completed,
3. what Phase 2 is about,
4. what the first implementation step should be.

Do not edit files yet.
Do not implement anything yet.
```

---

## Step 6 — Phase 2.1 Cursor Prompt

After Cursor summarizes the context correctly, use this implementation prompt:

```txt
Task title:
Phase 2.1 — Create shared TypeScript analytics event types

Use the context from docs/phase-2-context.md.

Goal:
Create the shared TypeScript event type foundation in packages/types.

Exact area to inspect/edit:
Inspect:
- root package.json
- tsconfig.base.json
- packages/types only

Edit only:
- packages/types

Do not edit:
- apps/dashboard
- apps/demo-site
- apps/ingest-api
- packages/tracker
- packages/analytics-core
- docker-compose.yml
- database files
- docs, unless absolutely necessary

Requirements:
Create or update the package foundation for:

@behavior-analytics/types

Add clean, framework-agnostic TypeScript types for the analytics event model.

Supported event types:
- session_start
- session_end
- page_view
- click
- scroll_depth
- conversion

Create types for:
- AnalyticsEventType
- DeviceType
- AnalyticsEventBase
- SessionStartEvent
- SessionEndEvent
- PageViewEvent
- ClickEvent
- ScrollDepthEvent
- ConversionEvent
- AnalyticsEventPayload
- IngestEventsRequest
- IngestEventsResponse

Click-specific fields:
- element_tag
- element_id
- element_classes
- element_text_short
- selector
- x
- y
- normalized_x
- normalized_y

Scroll-specific fields:
- depth_percent

Conversion-specific fields:
- conversion_name
- conversion_value

Privacy:
Do not add fields for raw input values, emails, phone numbers, passwords, card numbers, messages, DOM snapshots, or session replay data.

Implementation style:
- TypeScript only
- no Zod yet
- no runtime validation yet
- no backend integration yet
- no database integration yet
- no tracker implementation yet
- keep files minimal
- prefer a simple src/index.ts export

Verification:
Run the relevant package typecheck/build command.
If no package-level typecheck exists, add the minimal script needed and run it.

At the end, summarize:
1. files changed,
2. types added,
3. verification command used,
4. suggested next task.
```

---

# After Cursor Finishes Phase 2.1

Check:

```bash
git status
```

If needed:

```bash
npm install
```

Run verification command, for example:

```bash
npm run typecheck --workspace=@behavior-analytics/types
```

Or, if Cursor added another script, use the command it reports.

Then commit:

```bash
git add .
git commit -m "Add shared analytics event types"
git push
```

---

# Expected Result of Phase 2.1

Expected target files may look like:

```txt
packages/types/
  package.json
  tsconfig.json
  src/
    index.ts
```

Expected output:

- clean shared TypeScript event types,
- no backend integration,
- no database integration,
- no Zod yet,
- no dashboard changes,
- no demo-site changes.

---

# Next Task After Phase 2.1

After Phase 2.1 is completed and committed, the next task should be:

```txt
Phase 2.2 — Add Zod analytics event schemas in packages/analytics-core
```

The right sequence is:

```txt
TypeScript types
→ Zod runtime schemas
→ validation tests
→ ingest-api integration
```

Do not ask Cursor to implement all of Phase 2 at once.
