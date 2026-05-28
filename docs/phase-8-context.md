# Behavior Analytics MVP - Phase 8 Cursor Context

## Purpose of This File

Phase 8 handoff: **portfolio presentation polish**.

Use this file to:

- align future Phase 8 tasks around presentation quality;
- keep project messaging honest and local-first;
- avoid accidental scope creep into production-style features;
- provide a clear default starting step for docs-first work.

---

## 1. Phase 8 Purpose

Phase 8 should make the project easier to present in:

- GitHub;
- interviews;
- portfolio discussions.

Phase 8 should **not** turn the project into a production SaaS.  
It should stay local-first, practical, and honest about current limitations.

---

## 2. Current State After Phase 7

After Phase 7:

- Phases 1-7 are complete;
- basic GitHub Actions CI exists in `.github/workflows/ci.yml`;
- `README.md` includes a CI badge;
- the dashboard includes simple CSS-only charts for page views and scroll depth;
- GitHub Actions passed after push in Phase 7 verification;
- `docs/phase-7-context.md` exists as the current handoff.

The project remains a local-first portfolio MVP and is not a production SaaS.

---

## 3. What Phase 8 Should Focus On

Default focus for Phase 8:

- screenshots/demo media planning;
- README portfolio walkthrough polish;
- optional demo script/checklist;
- optional `docs/demo` or `docs/portfolio` guide;
- explaining what the project demonstrates technically;
- making the local demo flow easier to run and explain.

Most Phase 8 tasks should be documentation-first and beginner-readable.

---

## 4. What Phase 8 Should Not Do By Default

Do not start these unless explicitly chosen:

- deployment implementation;
- auth implementation;
- rate limiting implementation;
- monitoring/logging implementation;
- new analytics features;
- new backend reporting endpoints;
- date filters;
- new packages;
- E2E or screenshot automation/testing;
- production-ready claims.

---

## 5. Candidate Phase 8 Milestones

- **8.1 Demo readiness checklist**  
  Create a practical, repeatable local demo checklist.
- **8.2 README screenshots/media guidance**  
  Add placeholders or guidance for manual screenshot capture and usage.
- **8.3 Portfolio explanation section**  
  Add concise language about technical skills demonstrated by this MVP.
- **8.4 Local troubleshooting section**  
  Improve troubleshooting for Docker/PostgreSQL/ingest API/dashboard flow.
- **8.5 Optional interview talking points doc**  
  Add a short optional guide for interview narrative and architecture walk-through.

Keep each milestone small and independently reviewable.

---

## 6. Recommended First Phase 8 Step

Recommended first step:

Create a demo/portfolio checklist document that describes:

- how to run the local demo;
- how to generate events from the demo site;
- how to verify dashboard report sections;
- how to capture screenshots manually.

Do **not** add automated screenshot tooling at this stage.

---

## 7. Local Demo Flow To Document

Recommended local flow:

1. Start Docker/PostgreSQL.
2. Start ingest API on `http://localhost:4000`.
3. Start dashboard on `http://localhost:3000`.
4. Start demo site on `http://localhost:3001`.
5. Open health endpoint: `http://localhost:4000/api/health`.
6. Generate `page_view`, `click`, `scroll_depth`, and `conversion` events from the demo site.
7. Refresh dashboard and verify:
   - overview;
   - page views by path;
   - interactions summary;
   - scroll depth summary.
8. Capture screenshots manually if needed.

---

## 8. Known Local Troubleshooting

If reports show error states:

- check Docker/PostgreSQL first;
- check ingest API status and endpoint reachability.

If `http://localhost:4000/api/health` fails:

- start or restart ingest API.

If report endpoints return `ok: false`:

- check database connection settings;
- verify Prisma migrations/client setup.

If dashboard loads but report data is empty:

- generate events from the demo site and refresh dashboard.

---

## 9. Verification Expectations For Phase 8 Tasks

For most Phase 8 tasks:

- prefer docs-only changes;
- run `git status --short`;
- run app checks only when application files are changed;
- do not modify package files unless explicitly required.

This keeps Phase 8 fast, focused, and low risk.

---

## 10. Guardrails For Future Agents

- Keep documentation grounded in implemented behavior.
- Avoid hype and avoid production/deployment claims.
- Keep wording clear for junior-to-mid interview audiences.
- Preserve privacy-first messaging and explicit limitations.
- Keep one task equal to one small milestone.
