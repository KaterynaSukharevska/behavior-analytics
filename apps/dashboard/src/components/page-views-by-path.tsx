"use client";

import { useEffect, useState } from "react";
import {
  fetchPageViewsByPathReport,
  type PageViewsByPathReport,
} from "../lib/reports-api";
import { DEMO_SITE_ID, INGEST_API_BASE_URL } from "../lib/reports-config";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; report: PageViewsByPathReport };

function BarChartSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bar-chart bar-chart--skeleton" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="bar-chart__row">
          <div className="skeleton-line skeleton-line--chart-label" />
          <div className="bar-chart__track bar-chart__track--skeleton">
            <div className="skeleton-line skeleton-line--chart-bar" />
          </div>
          <div className="skeleton-line skeleton-line--chart-value" />
        </div>
      ))}
    </div>
  );
}

function PathTableSkeleton() {
  return (
    <table className="path-table path-table--skeleton" aria-hidden="true">
      <thead>
        <tr>
          <th scope="col">Path</th>
          <th scope="col">Page views</th>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3].map((row) => (
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

function PathTable({ items }: { items: PageViewsByPathReport["items"] }) {
  return (
    <div className="path-table__wrapper">
      <table className="path-table">
        <thead>
          <tr>
            <th scope="col">Path</th>
            <th scope="col">Page views</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.path}>
              <td>
                <code className="path-table__path">{item.path}</code>
              </td>
              <td className="path-table__count">{item.pageViews}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PageViewsBarChart({
  items,
}: {
  items: PageViewsByPathReport["items"];
}) {
  const maxPageViews = Math.max(0, ...items.map((item) => item.pageViews));

  return (
    <div className="bar-chart" aria-label="Page views by path chart">
      <p className="bar-chart__caption">Relative page views by path</p>
      {items.map((item) => {
        const barWidth =
          maxPageViews > 0 ? (item.pageViews / maxPageViews) * 100 : 0;

        return (
          <div
            key={item.path}
            className="bar-chart__row"
            aria-label={`${item.path}: ${item.pageViews} page views`}
          >
            <code className="bar-chart__label">{item.path}</code>
            <div className="bar-chart__track" aria-hidden="true">
              <div
                className="bar-chart__bar"
                style={{ width: `${barWidth}%` }}
              />
            </div>
            <span className="bar-chart__value">{item.pageViews}</span>
          </div>
        );
      })}
    </div>
  );
}

export function PageViewsByPath() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const report = await fetchPageViewsByPathReport(
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
    <section className="report-section" aria-label="Page views by path">
      <header className="report-section__header">
        <h2>Page views by path</h2>
        <p className="report-section__lead">
          Top paths for <code>{DEMO_SITE_ID}</code>, up to ten entries.
        </p>
      </header>

      {state.status === "loading" && (
        <div className="report-section__body">
          <p className="report-section__status">Loading page views by path…</p>
          <BarChartSkeleton rows={4} />
          <div className="report-section__divider">
            <PathTableSkeleton />
          </div>
        </div>
      )}

      {state.status === "error" && (
        <div
          className="report-section__alert report-section__alert--error"
          role="alert"
        >
          <p>
            We could not load page views by path right now. Make sure the ingest
            API is running, then refresh this page.
          </p>
        </div>
      )}

      {state.status === "success" && state.report.items.length === 0 && (
        <div className="report-section__alert report-section__alert--info">
          <p>
            No page views recorded yet. Visit a few pages on the demo site to
            generate page_view events.
          </p>
        </div>
      )}

      {state.status === "success" && state.report.items.length > 0 && (
        <div className="report-section__body">
          <PageViewsBarChart items={state.report.items} />
          <div className="report-section__divider">
            <PathTable items={state.report.items} />
          </div>
        </div>
      )}
    </section>
  );
}
