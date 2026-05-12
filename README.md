# Behavior Analytics MVP

A lightweight behavior analytics tool for websites that helps teams understand engagement, clicks, scroll depth, traffic sources, and conversion drop-off.

This is a real product-style MVP project built as a portfolio piece. It focuses on modern frontend and full-stack workflow: dashboard UI, a browser tracking SDK, event ingestion, reporting, privacy-safe defaults, and a fully local development environment.

## Current Status

**Early foundation stage.** The monorepo skeleton, local infrastructure, and placeholder apps are in place. Feature implementation is in progress.

What currently works:

- npm workspaces monorepo with shared config
- PostgreSQL running locally via Docker Compose
- Fastify ingest API with a health endpoint (`/api/health`)
- Next.js dashboard (placeholder)
- Next.js demo marketing site (placeholder, used later for SDK testing)

## Local Apps and Ports

| Service        | URL                                  |
| -------------- | ------------------------------------ |
| Dashboard      | http://localhost:3000                 |
| Demo Site      | http://localhost:3001                 |
| Ingest API     | http://localhost:4000                 |
| Health check   | http://localhost:4000/api/health      |
| PostgreSQL     | localhost:5432                        |

## Tech Stack

| Layer            | Technology                  |
| ---------------- | --------------------------- |
| Monorepo         | npm workspaces              |
| Language         | TypeScript                  |
| Dashboard        | Next.js, React              |
| Demo Site        | Next.js, React              |
| Ingest API       | Fastify                     |
| Database         | PostgreSQL                  |
| Infrastructure   | Docker Compose              |
| Contracts        | Zod (planned / in progress) |
| Testing          | Vitest, Playwright (planned)|

## Monorepo Structure

```
apps/
  dashboard/          Next.js dashboard
  ingest-api/         Fastify event ingestion API
  demo-site/          Next.js demo marketing site

packages/
  tracker/            Browser tracking SDK (planned)
  types/              Shared TypeScript types (planned)
  analytics-core/     Core analytics logic (planned)
  config/             Shared config and constants (planned)

docs/                 Product, architecture, roadmap, and setup docs
```

## Getting Started

Prerequisites: Node.js 20+, npm, Docker, Docker Compose.

```bash
# Install dependencies
npm install

# Start PostgreSQL
docker compose up -d
docker compose ps

# Start the ingest API
npm run dev --workspace=@behavior-analytics/ingest-api

# Start the dashboard
npm run dev --workspace=@behavior-analytics/dashboard

# Start the demo site
npm run dev --workspace=@behavior-analytics/demo-site
```

## MVP Scope

Planned feature set for the MVP:

- Page views and sessions
- Click tracking
- Scroll depth
- Dwell time
- Traffic sources and attribution
- Custom conversion events
- Dashboard reports
- Demo website for end-to-end testing

## Non-Goals

The MVP intentionally excludes:

- Session replay
- Full enterprise heatmap engine
- A/B testing platform
- Billing or payments
- Microfrontend architecture
- GraphQL API

## Privacy Principles

Tracking is privacy-safe by design. The system will not collect:

- Passwords or credentials
- Raw form input values
- Sensitive user-generated text
- Full DOM snapshots
- Session replay recordings

Form fields are ignored by default via `data-analytics-ignore` attributes.

## Roadmap

| Phase | Focus                                          |
| ----- | ---------------------------------------------- |
| 1     | Local foundation (monorepo, Docker, apps)      |
| 2     | Shared contracts and event schemas             |
| 3     | Ingest API and database persistence            |
| 4     | Tracker SDK                                    |
| 5     | Dashboard reports                              |
| 6     | Polish, tests, deployment, portfolio packaging |

## Documentation

Detailed docs live in the `docs/` folder:

- [`docs/product`](docs/product) — product definition, domain model, event taxonomy
- [`docs/architecture`](docs/architecture) — system architecture
- [`docs/roadmap`](docs/roadmap) — roadmap and phasing
- [`docs/setup`](docs/setup) — local development setup
