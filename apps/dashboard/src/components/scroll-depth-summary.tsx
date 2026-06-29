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

function DepthChartSkeleton() {
  return (
    <div className="depth-chart depth-chart--skeleton" aria-hidden="true">
      <p className="bar-chart__caption">Milestone event distribution</p>
      <div className="depth-chart__grid">
        {[25, 50, 75, 100].map((milestone) => (
          <div key={milestone} className="depth-chart__item">
            <div className="skeleton-line skeleton-line--chart-value" />
            <div className="depth-chart__track">
              <div className="skeleton-line skeleton-line--depth-bar" />
            </div>
            <span className="depth-chart__label">{milestone}%</span>
          </div>
        ))}
      </div>
    </div>
  );
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

function ScrollDepthDistributionChart({
  items,
}: {
  items: ScrollDepthSummaryReport["items"];
}) {
  const maxEvents = Math.max(0, ...items.map((item) => item.events));

  return (
    <div className="depth-chart" aria-label="Scroll depth distribution chart">
      <p className="bar-chart__caption">Milestone event distribution</p>
      <div className="depth-chart__grid">
        {items.map((item) => {
          const barHeight = maxEvents > 0 ? (item.events / maxEvents) * 100 : 0;

          return (
            <div
              key={item.depthPercent}
              className="depth-chart__item"
              aria-label={`${formatDepthLabel(item.depthPercent)} scroll depth: ${
                item.events
              } events`}
            >
              <span className="depth-chart__value">{item.events}</span>
              <div className="depth-chart__track" aria-hidden="true">
                <div
                  className="depth-chart__bar"
                  style={{ height: `${barHeight}%` }}
                />
              </div>
              <span className="depth-chart__label">
                {formatDepthLabel(item.depthPercent)}
              </span>
            </div>
          );
        })}
      </div>
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
    <section className="report-section" aria-label="Scroll depth summary">
      <header className="report-section__header">
        <h2>Scroll depth summary</h2>
        <p className="report-section__lead">
          Milestones at 25–100% for <code>{DEMO_SITE_ID}</code>. Scroll a long
          page on <a href="http://localhost:3001">localhost:3001</a>.
        </p>
      </header>

      {state.status === "loading" && (
        <div className="report-section__body">
          <p className="report-section__status">Loading scroll depth summary…</p>
          <DepthChartSkeleton />
          <div className="report-section__divider">
            <ScrollDepthTableSkeleton />
          </div>
        </div>
      )}

      {state.status === "error" && (
        <div
          className="report-section__alert report-section__alert--error"
          role="alert"
        >
          <p>
            We could not load scroll depth summary right now. Make sure the
            ingest API is running, then refresh this page.
          </p>
        </div>
      )}

      {state.status === "success" && state.report.items.length === 0 && (
        <div className="report-section__alert report-section__alert--info">
          <p>
            No scroll depth events recorded yet. Scroll through a demo site page
            to trigger milestone events.
          </p>
        </div>
      )}

      {state.status === "success" && state.report.items.length > 0 && (
        <div className="report-section__body">
          <ScrollDepthDistributionChart items={state.report.items} />
          <div className="report-section__divider">
            <ScrollDepthTable items={state.report.items} />
          </div>
        </div>
      )}
    </section>
  );
}
