"use client";

import { useEffect, useState } from "react";
import { fetchOverviewReport, type OverviewReport } from "../lib/reports-api";
import { DEMO_SITE_ID, INGEST_API_BASE_URL } from "../lib/reports-config";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; report: OverviewReport };

export function OverviewReport() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const report = await fetchOverviewReport(
          INGEST_API_BASE_URL,
          DEMO_SITE_ID,
        );

        if (!cancelled) {
          setState({ status: "success", report });
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load overview report.";
          setState({ status: "error", message });
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="overview-report" aria-label="overview report">
      <h2>Overview report ({DEMO_SITE_ID})</h2>

      {state.status === "loading" && (
        <p className="overview-report__message">Loading overview totals…</p>
      )}

      {state.status === "error" && (
        <p className="overview-report__message overview-report__message--error">
          {state.message}
        </p>
      )}

      {state.status === "success" && (
        <dl className="overview-report__totals">
          <div>
            <dt>Page views</dt>
            <dd>{state.report.totals.pageViews}</dd>
          </div>
          <div>
            <dt>Clicks</dt>
            <dd>{state.report.totals.clicks}</dd>
          </div>
          <div>
            <dt>Scroll depth events</dt>
            <dd>{state.report.totals.scrollDepthEvents}</dd>
          </div>
          <div>
            <dt>Conversions</dt>
            <dd>{state.report.totals.conversions}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}
