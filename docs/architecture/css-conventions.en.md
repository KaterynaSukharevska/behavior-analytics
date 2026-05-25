# Behavior Analytics MVP — CSS Conventions

This document describes the current CSS approach for the dashboard.

---

## Current Approach

The dashboard uses plain global CSS:

```txt
apps/dashboard/src/app/globals.css
```

There is no Tailwind CSS, CSS Modules, Sass, or component library styling layer currently.

This is intentional for the MVP: plain CSS is easy to inspect and explain in interviews.

---

## Naming Style

Use semantic class names that describe UI purpose, not visual appearance only.

Good examples from the current dashboard:

- `metrics-panel`;
- `metrics-panel__header`;
- `metrics-panel__alert`;
- `metrics-panel__alert--error`;
- `metric-card`;
- `path-table`;
- `skeleton-line`.

The current style is BEM-like:

```txt
block
block__element
block--modifier
block__element--modifier
```

Use this pattern for new dashboard classes.

---

## Reusable Patterns

Prefer reusing existing patterns before adding new styles.

Current reusable patterns:

- `metrics-panel` for report sections;
- `metrics-panel__header` for report headings and explanatory text;
- `metrics-panel__alert` for info/error states;
- `metric-cards` and `metric-card` for metric summaries;
- `path-table` for simple report tables;
- `skeleton-line` for loading placeholders.

Note: `path-table` is currently used beyond page paths. If table use grows in Phase 6, consider renaming or adding a more generic `report-table` class.

---

## Layout and Spacing

Keep spacing consistent:

- dashboard page max width is controlled by `.page`;
- report sections use `margin-top: 2rem`;
- cards and panels use rounded corners and light borders;
- table cell padding should stay consistent across report tables.

Avoid one-off spacing values unless a specific layout requires them.

---

## Typography

Current typography is simple:

- base font stack is defined in `:root`;
- headings use modest sizes;
- supporting text uses muted colors and readable line-height;
- numeric metrics use larger, heavier text.

When adding new UI:

- keep headings short;
- avoid large jumps in font size;
- keep report labels and helper text readable.

---

## Colors

Colors are currently hard-coded in `globals.css`.

Common colors include:

- page background: `#f5f7fb`;
- main text: `#162033`;
- muted text: `#55627b`;
- link blue: `#1e56d9`;
- panel border: `#dbe3f0`.

Do not introduce many near-duplicate colors. Reuse existing colors when possible.

Phase 6 may introduce lightweight CSS variables for colors and spacing, but they do not exist yet.

---

## Loading, Error, and Empty States

Use existing visual language:

- skeleton lines for loading;
- red alert for errors;
- blue alert for empty/info states.

Error states should be visible but not alarming. They should explain how to recover, usually by starting the ingest API and refreshing.

---

## When To Add a New Class

Add a new class when:

- the element represents a new reusable UI pattern;
- existing classes would make the markup misleading;
- a one-off selector would be hard to understand later.

Avoid adding a new class when a current reusable pattern already fits.

---

## What To Avoid

Avoid:

- inline styles for normal UI;
- deeply nested selectors;
- class names based only on color or spacing;
- one-off magic values;
- introducing CSS tooling without a clear need;
- claiming Tailwind or design tokens exist before they are implemented.
