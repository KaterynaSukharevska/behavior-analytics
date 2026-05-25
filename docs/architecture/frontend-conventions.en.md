# Behavior Analytics MVP — Frontend Conventions

This document describes current frontend conventions for `apps/dashboard`.

The goal is to keep the dashboard beginner-readable, portfolio-friendly, and easy to extend during Phase 6.

---

## Current Frontend Stack

Current dashboard stack:

- Next.js;
- React;
- TypeScript;
- plain global CSS in `apps/dashboard/src/app/globals.css`.

The dashboard does not currently use:

- Tailwind CSS;
- shadcn/ui;
- TanStack Query;
- chart libraries;
- complex state management.

Do not document or depend on those tools unless they are actually added.

---

## Dashboard Structure

Current important paths:

```txt
apps/dashboard/src/app/page.tsx
apps/dashboard/src/app/globals.css
apps/dashboard/src/components/
apps/dashboard/src/lib/reports-api.ts
apps/dashboard/src/lib/reports-config.ts
```

`page.tsx` composes dashboard sections.

Report components live in `components/`.

API clients and response types live in `lib/reports-api.ts`.

Local reporting config lives in `lib/reports-config.ts`.

---

## Report Component Pattern

Each dashboard report section should be a small client component.

Current examples:

- `overview-report.tsx`;
- `page-views-by-path.tsx`;
- `interactions-summary.tsx`;
- `scroll-depth-summary.tsx`.

Each report section should support:

- loading state;
- error state;
- empty state;
- success state.

This keeps dashboard behavior predictable when the ingest API is loading, unavailable, or has no data yet.

---

## Data Fetching Pattern

For now, use the simple existing pattern:

1. component mounts;
2. `useEffect` calls a typed API client;
3. local `useState` stores a discriminated state;
4. cleanup prevents setting state after unmount.

Example state shape:

```ts
type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; report: ReportType };
```

This is enough for the current MVP. Avoid adding global state or query libraries unless the project clearly needs them.

---

## API Client Pattern

Report API code belongs in:

```txt
apps/dashboard/src/lib/reports-api.ts
```

Keep clients small and typed:

- define response types near the fetch function;
- use the shared `fetchReport<T>()` helper when possible;
- map backend error codes to safe user-facing messages;
- do not expose raw stack traces or backend internals in the UI.

Config belongs in:

```txt
apps/dashboard/src/lib/reports-config.ts
```

Current config:

- `INGEST_API_BASE_URL`;
- `DEMO_SITE_ID`.

---

## UI Copy

Copy should be:

- clear;
- short;
- portfolio-friendly;
- honest about local/demo scope.

Use friendly empty states that explain how to generate data through the demo site.

Use safe error messages that suggest restarting the ingest API or refreshing the page.

---

## Component Size

Keep report components readable.

It is fine for a component to include a small table component or skeleton helper in the same file. Extract only when reuse is obvious.

Avoid premature abstractions that make a beginner portfolio project harder to follow.

---

## UI Libraries

Do not add UI libraries by default.

Consider a library only when:

- repeated custom UI becomes harder to maintain;
- charts are needed and manual SVG/HTML would distract from the project;
- the choice improves portfolio clarity.

If a library is introduced later, document it here and update `architecture.en.md`.

---

## Accessibility Basics

Current dashboard sections should continue to use:

- semantic headings;
- tables for tabular data;
- `role="alert"` for error states;
- useful `aria-label` values on report sections.

Keep skeleton placeholders `aria-hidden` where they are visual only.
