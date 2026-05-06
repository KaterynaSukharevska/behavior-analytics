# Behavior Analytics MVP — Product Definition Document v1

## 1. Product Summary

**Behavior Analytics MVP** is a lightweight website behavior analytics product for small teams, landing pages, marketing websites, and simple product websites.

The product helps users understand how visitors interact with their website by tracking page views, clicks, scroll depth, traffic sources, session engagement, and simple conversion drop-off.

The MVP consists of three main parts:

1. **Tracking SDK** — an embeddable browser script that collects behavior events.
2. **Ingest API** — a backend service that validates and stores events.
3. **Dashboard** — a web application that turns raw events into useful reports and visualizations.

## 2. Product One-liner

A lightweight behavior analytics tool for websites that helps teams understand page engagement, click behavior, scroll depth, traffic sources, and conversion drop-off.

## 3. Why This Product Exists

Many small website owners and marketing teams receive traffic but do not clearly understand what users actually do on their pages.

They may know that people visit a page, but they often do not know:

- where users lose attention;
- how far users scroll;
- which calls-to-action receive clicks;
- which traffic sources bring engaged visitors;
- where a simple conversion flow breaks;
- which pages are worth improving first.

The goal of this product is to make website behavior understandable without the complexity of enterprise analytics tools.

## 4. Target Audience

### Primary Users

- Marketing managers
- Founders
- Freelancers
- Agencies
- Small product owners
- Small product teams

### Primary Website Types

- Landing pages
- Marketing websites
- Small business websites
- Simple SaaS/product websites
- Campaign pages

## 5. Problem Statement

Small teams often have websites with measurable traffic, but they lack a simple and visual way to understand user behavior.

They need answers to practical questions:

- Are visitors actually engaging with the page?
- Which pages keep attention and which ones lose it?
- Do users scroll far enough to see important content?
- Which buttons, links, and CTAs are being clicked?
- Which traffic sources bring higher-quality visits?
- Where does the conversion path break?

Existing analytics tools can be either too broad, too technical, too expensive, or too focused on vanity metrics. This MVP focuses on practical behavior insights.

## 6. Product Goal

The goal of the MVP is to help a user identify where attention and conversion intent are lost on a website page or simple conversion flow.

The product should help the user move from:

> “People visit my website, but I do not know what they do there.”

to:

> “I can see where visitors engage, where they stop, what they click, and where the conversion path breaks.”

## 7. Core Value Proposition

Behavior Analytics MVP gives small teams a clear, visual understanding of website behavior by combining:

- page engagement metrics;
- click behavior;
- scroll depth;
- traffic source breakdown;
- simple funnel analysis;
- per-page click visualization.

The value is not “more data”. The value is **faster understanding of what to improve on a website**.

## 8. Jobs To Be Done

### JTBD 1 — Understand page engagement

When I publish a landing page, I want to know how visitors engage with it, so that I can decide whether the page is effective.

### JTBD 2 — Understand scroll behavior

When I place important content lower on a page, I want to know whether users actually reach it, so that I can improve the page structure.

### JTBD 3 — Understand CTA performance

When I add buttons or links to a page, I want to know which ones receive clicks, so that I can improve conversion paths.

### JTBD 4 — Understand traffic quality

When traffic comes from different sources or campaigns, I want to know which sources bring engaged visitors, so that I can focus on the right channels.

### JTBD 5 — Understand conversion drop-off

When users move through a simple conversion path, I want to know where they drop off, so that I can reduce friction.

## 9. MVP Scope

### 9.1 Tracking SDK

The tracking SDK should support:

- page view tracking;
- session start tracking;
- session end tracking;
- click tracking;
- scroll depth milestones;
- page dwell time;
- session duration;
- referrer capture;
- UTM capture;
- basic viewport/device data;
- custom conversion event.

### 9.2 Ingest API and Storage

The backend should support:

- event ingestion endpoint;
- payload validation;
- batching support;
- raw event storage;
- session association;
- site/project association;
- page normalization;
- basic aggregation for dashboard reports.

### 9.3 Dashboard

The dashboard should include:

- overview page;
- date range filter;
- top pages report;
- traffic sources report;
- top clicks report;
- scroll depth report;
- simple funnel report;
- per-page click visualization;
- project/site settings;
- tracking snippet installation page;
- empty states.

## 10. Must-have MVP Features

### Product setup

- User can sign up or log in.
- User can create a workspace or project.
- User can register a website.
- User can copy a tracking snippet.
- User can view setup instructions.

### Tracking

- Page views are collected.
- Clicks are collected.
- Scroll milestones are collected at 25%, 50%, 75%, and 100%.
- Sessions are created and associated with events.
- Referrer and UTM data are captured.
- Conversion events can be sent manually.

### Reporting

- User can select a date range.
- User can see total visits/page views.
- User can see top pages.
- User can see traffic source breakdown.
- User can see top clicked elements.
- User can see scroll depth by page.
- User can see a simple funnel.
- User can inspect a page-level click visualization.

## 11. Non-goals for MVP

The MVP must not include:

- session replay;
- enterprise-level heatmap engine;
- A/B testing platform;
- feature flags;
- visual experiment builder;
- cohort retention analytics;
- advanced segmentation;
- anomaly detection as a core feature;
- warehouse sync;
- CDP-like identity resolution;
- large-scale real-time analytics infrastructure;
- complex multi-user roles;
- billing and subscriptions.

These features may be considered later, but they are not required to prove the MVP.

## 12. Phase 2 Ideas

Possible post-MVP improvements:

- custom event builder;
- goal management UI;
- alerts;
- CSV export;
- compare date ranges;
- multi-user roles;
- enhanced heatmap;
- bot filtering;
- page grouping rules;
- consent integration helper;
- AI summaries;
- AI insights card;
- “what changed” explanations.

## 13. Demo Scenario

A user owns a marketing landing page.

They create a project in Behavior Analytics MVP, register the website, copy the tracking snippet, and install it on the demo site.

Visitors open the site from different sources and interact with the page.

The dashboard shows:

- which pages receive traffic;
- how far users scroll;
- which buttons are clicked;
- which CTA performs best;
- where the funnel breaks;
- which source brings more engaged visitors.

This demo scenario should be strong enough for GitHub, LinkedIn, portfolio presentation, and interviews.

## 14. Success Criteria

The MVP is successful if it can clearly demonstrate the full product loop:

1. Create a project.
2. Install the tracking snippet.
3. Generate user behavior events.
4. Store events in the backend.
5. Aggregate events into reports.
6. Display useful analytics in the dashboard.
7. Explain what a user should improve on the website.

### Career success criteria

The project should demonstrate:

- strong frontend engineering;
- polished dashboard UI;
- product thinking;
- TypeScript quality;
- browser API knowledge;
- data visualization skills;
- backend/API understanding;
- privacy-aware engineering;
- testing discipline;
- professional documentation.

## 15. Key Product Entities

### Workspace

A container for user-owned projects.

### User

A person who can access the dashboard.

### Project / Website

A tracked website or landing page.

### Session

A visitor session on a website.

### Page View

A page visit event.

### Event

A generic behavior event collected by the tracker.

### Page

A normalized website page/path.

### Funnel

A simple ordered set of conversion steps.

### Goal / Conversion Target

A desired action such as button click, form submit, or custom conversion event.

### Source / Campaign

Traffic attribution data based on referrer and UTM parameters.

### Click Aggregate

Grouped click behavior for a page element or coordinate area.

## 16. Event Taxonomy v1

### Event Types

- `session_start`
- `session_end`
- `page_view`
- `click`
- `scroll_depth`
- `conversion`

### Common Event Fields

- `event_id`
- `session_id`
- `site_id`
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

### Click Event Fields

- `element_tag`
- `element_id`
- `element_text_short`
- `x`
- `y`
- `normalized_x`
- `normalized_y`

### Scroll Event Fields

- `depth_percent`

## 17. Privacy and Security Principles

Privacy is a core product quality, not an optional extra.

The MVP should follow these principles:

- do not collect passwords;
- do not collect emails from form fields;
- do not collect phone numbers from form fields;
- do not collect card data;
- do not collect raw form contents;
- mask sensitive elements;
- support denylist selectors;
- support allowlist rules where useful;
- document what is collected;
- document what is not collected;
- avoid unnecessary personal data;
- validate all backend payloads;
- rate limit ingest endpoints;
- protect project resources with authorization checks;
- support project/site data deletion;
- define a simple retention policy.

## 18. Recommended Technical Stack

### Dashboard

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui or a thin custom UI layer
- React Hook Form
- Zod
- TanStack Query
- TanStack Table
- Recharts

### Tracking SDK

- TypeScript
- Browser-native APIs
- Lightweight bundling
- Event queue
- Batching
- `navigator.sendBeacon()`
- `fetch` fallback

### Backend

- Fastify
- TypeScript
- PostgreSQL
- Prisma or Drizzle
- Zod validation
- REST API

### Testing

- Vitest
- Playwright

## 19. High-level Architecture

The project should use a monorepo with apps and packages.

### Apps

- `apps/dashboard` — Next.js dashboard application
- `apps/ingest-api` — Fastify backend for ingestion and dashboard API
- `apps/demo-site` — demo website used for testing and showcase

### Packages

- `packages/tracker` — embeddable tracking SDK
- `packages/types` — shared types and contracts
- `packages/analytics-core` — schemas, normalization, analytics helpers
- `packages/ui` — shared UI components if needed
- `packages/config` — shared TypeScript/lint/build configuration

## 20. Recommended Implementation Phases

### Phase 0 — Product Definition

Define audience, pain points, MVP scope, non-goals, demo scenario, and success criteria.

### Phase 1 — Domain and Data Design

Define entities, event taxonomy, ingestion flow, reporting model, and privacy boundaries.

### Phase 2 — Technical Architecture

Define monorepo structure, app/package boundaries, auth strategy, backend shape, DB strategy, contracts, testing strategy, and deployment model.

### Phase 3 — Repo and Tooling Foundation

Set up monorepo, npm workspaces, TypeScript config, linting, formatting, package boundaries, build scripts, and CI baseline.

### Phase 4 — Backend Foundation

Create Fastify app, health check, env validation, DB connection, migrations, logging, error handling, and auth/session baseline.

### Phase 5 — Tracker SDK Foundation

Create tracker init/config, session handling, event queue, batching, transport, pageview tracking, click tracking, and scroll tracking.

### Phase 6 — Dashboard Foundation

Create auth flow, dashboard shell, project creation, project settings, snippet installation page, navigation, and empty states.

### Phase 7 — End-to-End Data Flow

Connect tracker, ingest API, database, demo site, and dashboard data.

### Phase 8 — Aggregation and Reporting

Implement overview metrics, pages report, sources report, clicks report, scroll report, funnel calculations, and click aggregation.

### Phase 9 — Analytics UI

Build polished dashboard screens, charts, tables, filters, funnel view, click visualization, and responsive UX.

### Phase 10 — Security and Privacy Hardening

Add masking rules, payload restrictions, rate limits, auth/resource protection, data handling rules, and documentation.

### Phase 11 — Testing and QA

Cover unit tests, integration tests, E2E tests, and regression scenarios.

### Phase 12 — Docs, Demo, and Portfolio Packaging

Prepare README, architecture explanation, setup guide, screenshots, demo script, project story for LinkedIn/CV/interviews.

## 21. Portfolio Positioning

This project should be presented as a professional product-style portfolio project, not as a tutorial clone.

Suggested positioning:

> Behavior Analytics MVP is a privacy-aware website behavior analytics product built with a tracking SDK, event ingestion backend, and polished analytics dashboard. It demonstrates modern frontend engineering, product thinking, data visualization, browser APIs, TypeScript, testing, and full product delivery.

## 22. Open Decisions

The following decisions can be finalized later:

- exact auth provider: Auth.js, Clerk, or custom session auth;
- exact ORM: Prisma or Drizzle;
- exact hosting platform;
- whether to add billing after MVP;
- how advanced click visualization should be in v1;
- whether AI insights belong in Phase 2 or later.

## 23. Current Fixed Decisions

The following decisions are accepted:

- product: Behavior Analytics MVP for websites;
- focus: engagement, click behavior, scroll depth, traffic sources, conversion friction;
- ICP: landing pages, marketing sites, simple websites, small teams;
- MVP: tracker, ingest API, dashboard;
- not in MVP: A/B tests, session replay, feature flags, advanced analytics;
- architecture: monorepo;
- dashboard: Next.js;
- backend: Fastify and PostgreSQL;
- shared contracts: TypeScript and Zod;
- testing: Vitest and Playwright;
- package manager: npm, not pnpm.
