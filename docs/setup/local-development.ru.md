# Behavior Analytics MVP — Local Development Setup v1

## 1. Цель документа

Этот документ описывает local development setup для Behavior Analytics MVP.

Он объясняет:

- required tools;
- recommended versions;
- local folder structure;
- npm usage;
- роль Docker;
- PostgreSQL local setup;
- environment variables;
- recommended ports;
- first local run plan;
- troubleshooting notes.

Документ написан до implementation, поэтому часть команд станет финальной после создания repo foundation.

## 2. Текущий статус проекта

Проект сейчас находится на этапе documentation and planning.

Уже создано:

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

Этот документ нужно положить сюда:

```txt
behavior_analytics/
  docs/
    setup/
      local-development.en.md
      local-development.ru.md
```

## 3. Required Tools

Для local development нужны:

- GitHub account
- Git
- Cursor
- Node.js
- npm
- Docker Desktop
- Terminal / PowerShell / Git Bash
- Browser, желательно Chrome

## 4. Recommended Versions

### Node.js

Используем современную LTS-версию Node.js.

Рекомендация:

```txt
Node.js 22 LTS or newer stable LTS
```

Проект не должен зависеть от экспериментального Node.js-only behavior.

### npm

Используем npm как package manager.

Принятое решение:

```txt
Use npm, not pnpm.
```

В проект нужно commit-ить:

```txt
package-lock.json
```

В проект не нужно commit-ить:

```txt
pnpm-lock.yaml
yarn.lock
```

если package manager decision не изменится позже.

## 5. Version Check Commands

В терминале выполни:

```bash
node -v
npm -v
git --version
docker --version
docker compose version
```

Ожидаемая идея:

```txt
Node.js: v22.x or newer LTS
npm: 10.x or 11.x
Git: installed
Docker: installed
Docker Compose: installed
```

## 6. Recommended Local Root Folder

Текущая локальная папка проекта:

```txt
behavior_analytics/
```

Рекомендуемая структура до кода:

```txt
behavior_analytics/
  docs/
```

Рекомендуемая структура после repo foundation:

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

## 7. Зачем нужен Docker

Docker используется для local infrastructure.

Для этого MVP Docker в первую очередь нужен для:

- локального PostgreSQL;
- одинакового database setup;
- чтобы не устанавливать PostgreSQL вручную на Windows;
- чтобы setup было проще воспроизвести позже;
- чтобы проект был ближе к реальной разработке.

Docker не нужен потому, что dashboard или backend обязательно должны сразу быть containerized.

Initial Docker scope должен быть простым:

```txt
PostgreSQL only
```

Optional later:

```txt
pgAdmin
Mailpit
Redis
```

Не добавляем лишние services слишком рано.

## 8. Local Services

### PostgreSQL

Рекомендуемая local database:

```txt
PostgreSQL running via Docker Compose
```

Рекомендуемая local database config:

```txt
Database name: behavior_analytics
User: postgres
Password: postgres
Host: localhost
Port: 5432
```

Рекомендуемый connection string:

```txt
postgresql://postgres:postgres@localhost:5432/behavior_analytics
```

## 9. Recommended Local Ports

Используем предсказуемые ports:

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

В проекте должен быть root `.env.example`.

Рекомендуемая первая версия:

```txt
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/behavior_analytics

INGEST_API_PORT=4000
INGEST_API_URL=http://localhost:4000

DASHBOARD_URL=http://localhost:3000
DEMO_SITE_URL=http://localhost:3001

NODE_ENV=development
```

Позже можно добавить переменные для:

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

Проект должен использовать npm workspaces.

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

Это можно уточнить во время implementation.

## 12. First Implementation Setup Plan

Когда начнется implementation, repo foundation нужно создавать в таком порядке:

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

Создать `docker-compose.yml` with PostgreSQL.

First target:

```bash
docker compose up -d
```

Потом проверить:

```bash
docker ps
```

### Step 4 — Add minimal apps

Начать с minimal runnable apps:

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

Начать minimal:

```txt
packages/types
packages/analytics-core
packages/tracker
```

Не overbuild package abstractions слишком рано.

## 13. First Local Run Target

Первый local milestone:

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

Эти команды будут полезны после появления code foundation:

```bash
npm install
docker compose up -d
npm run dev
```

Для отдельных apps проект может позже поддерживать команды:

```bash
npm run dev --workspace apps/ingest-api
npm run dev --workspace apps/dashboard
npm run dev --workspace apps/demo-site
```

Точные команды нужно финализировать после создания package names.

## 15. Git and GitHub Direction

GitHub не обязательно создавать до завершения local planning.

Рекомендуемый порядок:

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

Cursor нужно открывать в project root:

```txt
behavior_analytics/
```

Не внутри:

```txt
docs/
apps/
packages/
```

Так Cursor лучше понимает весь project context.

Recommended Cursor workflow:

- one task at a time;
- use documentation as project context;
- ask Cursor to edit specific files;
- avoid generating too many files at once;
- keep changes reviewable;
- run commands after each meaningful step.

## 17. Windows Notes

Проект готовится на Windows.

Рекомендуемые terminal options:

- PowerShell
- Git Bash
- Cursor terminal
- WSL terminal if preferred

Docker Desktop on Windows requires WSL 2.

Useful WSL check:

```bash
wsl --version
```

Docker нужно ставить под правильную architecture:

- AMD64/x64 для большинства Intel/AMD Windows laptops;
- ARM64 только для ARM-based machines.

## 18. Docker Troubleshooting Notes

Если Docker Desktop installation зависает на шаге вроде:

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

Не устанавливаем и не настраиваем слишком много слишком рано.

В начале не нужно:

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

Первый setup должен быть маленьким.

## 20. Setup Success Criteria

Local development setup готов, когда:

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

После сохранения setup document базовой документации достаточно, чтобы начинать implementation.

Рекомендуемая next phase:

```txt
Phase 1 — Local Development and Repo Foundation
```

Первый implementation task:

```txt
Create initial monorepo foundation with npm workspaces, root configs, docs folder preserved, and Docker Compose PostgreSQL.
```
