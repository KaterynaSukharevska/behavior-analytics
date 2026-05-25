"use client";

import { useEffect, useState } from "react";
import {
  fetchScrollDepthSummaryReport,
  type ScrollDepthSummaryReport,
} from "../lib/reports-api";
import { DEMO_SITE_ID, INGEST_API_BASE_URL } from "../lib/reports-config";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; report: ScrollDepthSummaryReport };

function formatDepthLabel(depthPercent: number): string {
  return `${depthPercent}%`;
}

function ScrollDepthTableSkeleton() {
  return (
    <table className="path-table path-table--skeleton" aria-hidden="true">
      <thead>
        <tr>
          <th scope="col">Depth</th>
          <th scope="col">Events</th>
        </tr>
      </thead>
      <tbody>
        {[25, 50, 75].map((row) => (
          <tr key={row}>
            <td>
              <div className="skeleton-line skeleton-line--path" />
            </td>
            <td>
              <div className="skeleton-line skeleton-line--count" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ScrollDepthTable({
  items,
}: {
  items: ScrollDepthSummaryReport["items"];
}) {
  return (
    <div className="path-table__wrapper">
      <table className="path-table">
        <thead>
          <tr>
            <th scope="col">Depth</th>
            <th scope="col">Events</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.depthPercent}>
              <td className="path-table__count">
                {formatDepthLabel(item.depthPercent)}
              </td>
              <td className="path-table__count">{item.events}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ScrollDepthSummary() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const report = await fetchScrollDepthSummaryReport(
          INGEST_API_BASE_URL,
          DEMO_SITE_ID,
        );

        if (!cancelled) {
          setState({ status: "success", report });
        }
      } catch {
        if (!cancelled) {
          setState({ status: "error" });
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="metrics-panel" aria-label="Scroll depth summary">
      <header className="metrics-panel__header">
        <p className="metrics-panel__eyebrow">Scroll</p>
        <h2>Scroll depth summary</h2>
        <p>
          Scroll milestones reached on the demo site ({DEMO_SITE_ID}). Scroll
          through a long page on{" "}
          <a href="http://localhost:3001">localhost:3001</a> to trigger 25%,
          50%, 75%, and 100% depth events.
        </p>
      </header>

      {state.status === "loading" && (
        <>
          <p className="metrics-panel__status">Loading scroll depth summary…</p>
          <ScrollDepthTableSkeleton />
        </>
      )}

      {state.status === "error" && (
        <div
          className="metrics-panel__alert metrics-panel__alert--error"
          role="alert"
        >
          <p>
            We could not load scroll depth summary right now. Make sure the
            ingest API is running, then refresh this page.
          </p>
        </div>
      )}

      {state.status === "success" && state.report.items.length === 0 && (
        <div className="metrics-panel__alert metrics-panel__alert--info">
          <p>
            No scroll depth events recorded yet. Open the demo site and scroll
            through a page — milestones will appear here after scroll_depth
            events are ingested.
          </p>
        </div>
      )}

      {state.status === "success" && state.report.items.length > 0 && (
        <ScrollDepthTable items={state.report.items} />
      )}
    </section>
  );
}
