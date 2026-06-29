"use client";

import { useEffect, useState } from "react";
import {
  fetchInteractionsSummaryReport,
  type ClickSummaryItem,
  type ConversionSummaryItem,
  type InteractionsSummaryReport,
} from "../lib/reports-api";
import { DEMO_SITE_ID, INGEST_API_BASE_URL } from "../lib/reports-config";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; report: InteractionsSummaryReport };

function isEmptySummary(report: InteractionsSummaryReport): boolean {
  return report.clicks.length === 0 && report.conversions.length === 0;
}

type BarChartItem = {
  key: string;
  label: string;
  value: number;
};

function BarChartSkeleton({ rows = 2 }: { rows?: number }) {
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

function InteractionBarChart({
  items,
  caption,
  ariaLabel,
}: {
  items: BarChartItem[];
  caption: string;
  ariaLabel: string;
}) {
  const maxValue = Math.max(0, ...items.map((item) => item.value));

  return (
    <div className="bar-chart" aria-label={ariaLabel}>
      <p className="bar-chart__caption">{caption}</p>
      {items.map((item) => {
        const barWidth = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

        return (
          <div
            key={item.key}
            className="bar-chart__row"
            aria-label={`${item.label}: ${item.value}`}
          >
            <code className="bar-chart__label">{item.label}</code>
            <div className="bar-chart__track" aria-hidden="true">
              <div
                className="bar-chart__bar bar-chart__bar--muted"
                style={{ width: `${barWidth}%` }}
              />
            </div>
            <span className="bar-chart__value">{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

function InteractionsTableSkeleton({
  firstColumnLabel,
}: {
  firstColumnLabel: string;
}) {
  return (
    <table className="path-table path-table--skeleton" aria-hidden="true">
      <thead>
        <tr>
          <th scope="col">{firstColumnLabel}</th>
          <th scope="col">Count</th>
        </tr>
      </thead>
      <tbody>
        {[1, 2].map((row) => (
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

function ClicksTable({ items }: { items: ClickSummaryItem[] }) {
  return (
    <div className="path-table__wrapper">
      <table className="path-table">
        <thead>
          <tr>
            <th scope="col">Element ID</th>
            <th scope="col">Clicks</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.elementId}>
              <td>
                <code className="path-table__path">{item.elementId}</code>
              </td>
              <td className="path-table__count">{item.clicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConversionsTable({ items }: { items: ConversionSummaryItem[] }) {
  return (
    <div className="path-table__wrapper">
      <table className="path-table">
        <thead>
          <tr>
            <th scope="col">Conversion name</th>
            <th scope="col">Conversions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.conversionName}>
              <td>
                <code className="path-table__path">{item.conversionName}</code>
              </td>
              <td className="path-table__count">{item.conversions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InteractionsSummary() {
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const report = await fetchInteractionsSummaryReport(
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
    <section className="report-section" aria-label="Interactions summary">
      <header className="report-section__header">
        <h2>Interactions summary</h2>
        <p className="report-section__lead">
          Top clicks and conversions for <code>{DEMO_SITE_ID}</code>. Clicks use{" "}
          <code>data-analytics-id</code>.
        </p>
      </header>

      {state.status === "loading" && (
        <div className="report-section__body">
          <p className="report-section__status">Loading interactions summary…</p>
          <div className="report-section__split">
            <div className="report-block">
              <h3>Top clicked elements</h3>
              <BarChartSkeleton />
              <div className="report-section__divider">
                <InteractionsTableSkeleton firstColumnLabel="Element ID" />
              </div>
            </div>
            <div className="report-block">
              <h3>Conversions</h3>
              <BarChartSkeleton />
              <div className="report-section__divider">
                <InteractionsTableSkeleton firstColumnLabel="Conversion name" />
              </div>
            </div>
          </div>
        </div>
      )}

      {state.status === "error" && (
        <div
          className="report-section__alert report-section__alert--error"
          role="alert"
        >
          <p>
            We could not load interactions summary right now. Make sure the
            ingest API is running, then refresh this page.
          </p>
        </div>
      )}

      {state.status === "success" && isEmptySummary(state.report) && (
        <div className="report-section__alert report-section__alert--info">
          <p>
            No clicks or conversions recorded yet. Click tracked elements or
            trigger conversions on the demo site.
          </p>
        </div>
      )}

      {state.status === "success" && !isEmptySummary(state.report) && (
        <div className="report-section__body">
          <div className="report-section__split">
            <div className="report-block">
              <h3>Top clicked elements</h3>
              {state.report.clicks.length === 0 ? (
                <p className="report-block__empty">
                  No click events with an element ID yet.
                </p>
              ) : (
                <>
                  <InteractionBarChart
                    items={state.report.clicks.map((item) => ({
                      key: item.elementId,
                      label: item.elementId,
                      value: item.clicks,
                    }))}
                    caption="Relative click counts"
                    ariaLabel="Top clicked elements chart"
                  />
                  <div className="report-section__divider">
                    <ClicksTable items={state.report.clicks} />
                  </div>
                </>
              )}
            </div>

            <div className="report-block">
              <h3>Conversions</h3>
              {state.report.conversions.length === 0 ? (
                <p className="report-block__empty">No conversion events yet.</p>
              ) : (
                <>
                  <InteractionBarChart
                    items={state.report.conversions.map((item) => ({
                      key: item.conversionName,
                      label: item.conversionName,
                      value: item.conversions,
                    }))}
                    caption="Relative conversion counts"
                    ariaLabel="Conversions chart"
                  />
                  <div className="report-section__divider">
                    <ConversionsTable items={state.report.conversions} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
