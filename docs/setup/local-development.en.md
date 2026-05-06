# Behavior Analytics MVP — Local Development Setup v1

## 1. Purpose of This Document

This document describes the local development setup for Behavior Analytics MVP.

It explains:

- required tools;
- recommended versions;
- local folder structure;
- npm usage;
- Docker role;
- PostgreSQL local setup;
- environment variables;
- recommended ports;
- first local run plan;
- troubleshooting notes.

This document is written before implementation, so some commands will become final after the repository foundation is created.

## 2. Current Project Status

The project is currently in the documentation and planning phase.

Already created:

```txt
behavior_analytics/
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
```

This document should be placed in:

```txt
behavior_analytics/
  docs/
    setup/
      local-development.en.md
      local-development.ru.md
```

## 3. Required Tools

The local development environment should include:

- GitHub account
- Git
- Cursor
- Node.js
- npm
- Docker Desktop
- Terminal / PowerShell / Git Bash
- Browser, preferably Chrome

## 4. Recommended Versions

### Node.js

Use a modern LTS version of Node.js.

Recommended:

```txt
Node.js 22 LTS or newer stable LTS
```

The project should avoid depending on experimental Node.js-only behavior.

### npm

Use npm as the package manager.

Current accepted decision:

```txt
Use npm, not pnpm.
```

The project should commit:

```txt
package-lock.json
```

The project should not commit:

```txt
pnpm-lock.yaml
yarn.lock
```

unless the package manager decision changes later.

## 5. Version Check Commands

Run these commands in terminal:

```bash
node -v
npm -v
git --version
docker --version
docker compose version
```

Expected idea:

```txt
Node.js: v22.x or newer LTS
npm: 10.x or 11.x
Git: installed
Docker: installed
Docker Compose: installed
```

## 6. Recommended Local Root Folder

Current local project folder:

```txt
behavior_analytics/
```

Recommended structure before code:

```txt
behavior_analytics/
  docs/
```

Recommended structure after repo foundation:

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
    architecture/
    roadmap/
    setup/

  package.json
  package-lock.json
  tsconfig.base.json
  .gitignore
  README.md
  docker-compose.yml
  .env.example
```

## 7. Why Docker Is Needed

Docker is used for local infrastructure.

For this MVP, Docker is mainly needed for:

- running PostgreSQL locally;
- keeping database setup consistent;
- avoiding manual PostgreSQL installation on Windows;
- making setup easier to reproduce later;
- keeping the project closer to real-world development.

Docker is not needed because the dashboard or backend must be containerized immediately.

Initial Docker scope should be simple:

```txt
PostgreSQL only
```

Optional later:

```txt
pgAdmin
Mailpit
Redis
```

Do not add extra services too early.

## 8. Local Services

### PostgreSQL

Recommended local database:

```txt
PostgreSQL running via Docker Compose
```

Recommended local database config:

```txt
Database name: behavior_analytics
User: postgres
Password: postgres
Host: localhost
Port: 5432
```

Recommended connection string:

```txt
postgresql://postgres:postgres@localhost:5432/behavior_analytics
```

## 9. Recommended Local Ports

Use predictable ports:

```txt
Dashboard: 3000
Demo Site: 3001
Ingest API: 4000
PostgreSQL: 5432
```

Port usage:

| Service | Port | Description |
|---|---:|---|
| Dashboard | 3000 | Main analytics dashboard |
| Demo Site | 3001 | Website used to generate tracking data |
| Ingest API | 4000 | Backend API for events and dashboard data |
| PostgreSQL | 5432 | Local database |

## 10. Environment Variables

The project should include a root `.env.example`.

Recommended first version:

```txt
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/behavior_analytics

INGEST_API_PORT=4000
INGEST_API_URL=http://localhost:4000

DASHBOARD_URL=http://localhost:3000
DEMO_SITE_URL=http://localhost:3001

NODE_ENV=development
```

Later, more variables can be added for:

- auth provider;
- session secret;
- CORS origins;
- tracking site keys;
- deployment URLs.

Important rules:

- never commit real secrets;
- commit `.env.example`;
- add `.env` to `.gitignore`;
- validate required env variables on app startup.

## 11. npm Workspaces Direction

The project should use npm workspaces.

Root `package.json` direction:

```json
{
  "name": "behavior-analytics",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspaces",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "typecheck": "npm run typecheck --workspaces"
  }
}
```

This can be refined during implementation.

## 12. First Implementation Setup Plan

When implementation starts, create the repo foundation in this order:

### Step 1 — Create root files

```txt
package.json
package-lock.json
tsconfig.base.json
.gitignore
README.md
.env.example
docker-compose.yml
```

### Step 2 — Create folders

```txt
apps/
  dashboard/
  ingest-api/
  demo-site/

packages/
  tracker/
  types/
  analytics-core/
  config/
```

### Step 3 — Add local PostgreSQL

Create `docker-compose.yml` with PostgreSQL.

First target:

```bash
docker compose up -d
```

Then verify:

```bash
docker ps
```

### Step 4 — Add minimal apps

Start with minimal runnable apps:

```txt
apps/ingest-api
apps/dashboard
apps/demo-site
```

Recommended first health check:

```txt
GET http://localhost:4000/api/health
```

### Step 5 — Add shared packages

Start minimal:

```txt
packages/types
packages/analytics-core
packages/tracker
```

Do not overbuild package abstractions too early.

## 13. First Local Run Target

The first local milestone should be:

```txt
PostgreSQL runs via Docker.
Ingest API runs on port 4000.
Dashboard runs on port 3000.
Demo site runs on port 3001.
Health endpoint returns OK.
```

Minimum expected URLs:

```txt
http://localhost:3000
http://localhost:3001
http://localhost:4000/api/health
```

## 14. Suggested First Commands After Repo Is Created

These commands will become useful after the code foundation exists:

```bash
npm install
docker compose up -d
npm run dev
```

For individual apps, the project may later support commands such as:

```bash
npm run dev --workspace apps/ingest-api
npm run dev --workspace apps/dashboard
npm run dev --workspace apps/demo-site
```

Exact commands should be finalized after package names are created.

## 15. Git and GitHub Direction

GitHub does not need to be created before local planning is finished.

Recommended order:

1. Create local folder and docs.
2. Create repo foundation locally.
3. Initialize Git.
4. Make first commit.
5. Create GitHub repository.
6. Push local project to GitHub.

Recommended first commit message:

```txt
docs: add initial product and architecture documentation
```

Recommended branch strategy for this project:

- one main branch is enough at the beginning;
- use feature branches later when implementation becomes more structured.

## 16. Cursor Usage

Cursor should be opened at the project root:

```txt
behavior_analytics/
```

Not inside:

```txt
docs/
apps/
packages/
```

This helps Cursor understand the full project context.

Recommended Cursor workflow:

- one task at a time;
- use documentation as project context;
- ask Cursor to edit specific files;
- avoid generating too many files at once;
- keep changes reviewable;
- run commands after each meaningful step.

## 17. Windows Notes

This project is being prepared on Windows.

Recommended terminal options:

- PowerShell
- Git Bash
- Cursor terminal
- WSL terminal if preferred

Docker Desktop on Windows requires WSL 2.

Useful WSL check:

```bash
wsl --version
```

Docker should be installed as the correct architecture for the machine:

- AMD64/x64 for most Intel/AMD Windows laptops;
- ARM64 only for ARM-based machines.

## 18. Docker Troubleshooting Notes

If Docker Desktop installation hangs on a step such as:

```txt
Create docker-users group
```

Possible actions:

1. Wait a few minutes.
2. Run installer as Administrator.
3. Restart Windows.
4. Check that WSL 2 is installed.
5. Re-run Docker Desktop installer.
6. Check Windows features:
   - Windows Subsystem for Linux
   - Virtual Machine Platform
7. Check Docker Desktop logs if needed.

Useful commands:

```bash
wsl --version
wsl --status
docker --version
docker compose version
```

## 19. What Not To Install Yet

Do not install or configure too much too early.

Not needed at the beginning:

- Kubernetes;
- Redis;
- Kafka;
- ClickHouse;
- cloud infrastructure;
- complex CI/CD;
- analytics warehouse;
- monitoring stack;
- payment system;
- microfrontend tooling.

Keep the first setup small.

## 20. Setup Success Criteria

Local development setup is ready when:

- Node.js works;
- npm works;
- Git works;
- Docker Desktop works;
- PostgreSQL can run locally;
- project root folder exists;
- docs are saved;
- Cursor can open the project root;
- the next implementation step can begin.

## 21. Next Step After This Document

After saving this setup document, the documentation baseline is enough to start implementation.

Recommended next phase:

```txt
Phase 1 — Local Development and Repo Foundation
```

First implementation task:

```txt
Create initial monorepo foundation with npm workspaces, root configs, docs folder preserved, and Docker Compose PostgreSQL.
```
