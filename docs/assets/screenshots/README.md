# Screenshot assets

This folder holds **real screenshot image files** for the Behavior Analytics MVP portfolio (GitHub README, interviews, LinkedIn). Phase 10.2 added the six required `*-local-demo.png` captures from a verified local stack.

## Where screenshots live

Store committed captures here:

```txt
docs/assets/screenshots/
  dashboard-overview-local-demo.png
  ...
```

Do not scatter screenshots under `apps/` or package folders. Keep assets in this one place so links stay predictable.

## Before you capture anything

1. Run the local stack and verify the demo per [`docs/portfolio/local-demo-checklist.md`](../../portfolio/local-demo-checklist.md).
2. Follow the capture sequence and framing rules in [`docs/portfolio/demo-screenshots-plan.md`](../../portfolio/demo-screenshots-plan.md).

Screenshots must come from a **real local demo** on `localhost` (dashboard `3000`, demo-site `3001`, ingest API `4000`). Do not use stock images, mocked UIs, or edited frames.

## Recommended categories (required set)

Use descriptive, stable filenames. PNG is fine for UI clarity; WebP is optional later for smaller README size.

| Category | Filename | What to show |
|----------|----------|--------------|
| Dashboard — overview | `dashboard-overview-local-demo.png` | Sidebar + overview metrics at http://localhost:3000 after demo data exists |
| Dashboard — page views | `dashboard-page-views-local-demo.png` | Page views by path (CSS bar chart + table) |
| Dashboard — interactions | `dashboard-interactions-local-demo.png` | Click/conversion bar charts and tables for tracked `data-analytics-id` values |
| Dashboard — scroll depth | `dashboard-scroll-depth-local-demo.png` | Scroll milestone distribution chart and table |
| Demo site | `demo-site-home-local-demo.png` | Demo site UI (e.g. home) with safe `data-analytics-id` visible where useful |
| Ingest API health | `ingest-api-health-local-demo.png` | http://localhost:4000/api/health JSON (`ok`, `service`) |

### Optional extra captures

For a fuller portfolio set (interviews, README hero), add files per [`demo-screenshots-plan.md`](../../portfolio/demo-screenshots-plan.md). Numbered names from that plan are also valid if you prefer order in filenames, for example:

- `01-demo-site-analytics-attributes.png`
- `02-demo-site-tracked-interaction.png`
- `03-ingest-api-health.png`
- `05-dashboard-overview.png` through `08-dashboard-scroll-depth.png`

Pick **one naming style** per repo commit batch (descriptive `*-local-demo.png` or numbered `01-…`) and keep README links consistent.

## Naming rules

- Use lowercase, hyphens, and `.png` (or `.webp` if you standardize on WebP later).
- Include `local-demo` in descriptive names so captions stay honest.
- Do not rename files after linking them from README without updating those links.
- One screenshot per purpose; avoid duplicate angles.

## Privacy-safe screenshot rules

Screenshots must **not** show:

- real personal data (names, emails, phone numbers, message text, form values);
- cookies, `localStorage`, or arbitrary DOM text presented as tracking data;
- secrets (`.env`, `DATABASE_URL`, API keys, tokens);
- unrelated browser tabs, personal bookmarks, or OS notifications;
- private terminal paths or command history that might expose secrets.

**Safe to show:**

- localhost demo-site and dashboard UI;
- `data-analytics-id` on demo elements (not user-typed input);
- health and report JSON for `siteId=demo-site` with metrics from **your** demo session;
- cropped terminals without secrets.

Do **not** edit images to invent metrics, customers, or UI that did not exist in the local run.

## Honest portfolio framing

When you caption or embed these images:

- say **local-first portfolio MVP**, not production SaaS;
- do not claim deployment, auth, or enterprise scale unless actually implemented;
- do not use fake customer logos, fake metrics, or inflated numbers;
- if a report is empty, **regenerate demo data** — do not Photoshop numbers.

## Phase history

- **10.1** — folder path, naming, and privacy rules (guide only).
- **10.2** — six required PNG files captured from localhost (see table above).
- **10.3** — three captures embedded in root README **Demo Screenshots** section; three additional PNGs in this folder remain available for interviews and fallback.
- **12.5** — Phase 12 dashboard visual upgrade (sidebar shell, simplified reports, CSS-only charts). When recapturing dashboard PNGs, include the **left sidebar**, **Reports** header, and **real chart visuals** from a local demo session. Existing Phase 10 files may show the pre–Phase 12 layout until manually replaced.

### Phase 12 dashboard capture notes

For updated portfolio screenshots after the Phase 12 UI work:

| Shot | Framing tips |
|------|----------------|
| Overview | Sidebar visible; overview metric grid with proportion meters; real `demo-site` totals |
| Page views | Horizontal bar chart plus table; scroll or crop so chart labels are readable |
| Interactions | Clicks and conversions bar charts (and tables); both columns if width allows |
| Scroll depth | Milestone distribution chart plus table |

Use the same privacy and honesty rules as Phase 10. Regenerate demo data on the demo site before capture — do not edit metrics in an image editor.

## Related documentation

- [`docs/portfolio/demo-screenshots-plan.md`](../../portfolio/demo-screenshots-plan.md) — full sequence, optional shots, and technical proof per image
- [`docs/portfolio/local-demo-checklist.md`](../../portfolio/local-demo-checklist.md) — pre-capture verification
- [`docs/phase-10-context.md`](../../phase-10-context.md) — Phase 10 milestones and out-of-scope defaults
