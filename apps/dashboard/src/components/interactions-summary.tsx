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
    <section
      className="metrics-panel metrics-panel--wide"
      aria-label="Interactions summary"
    >
      <header className="metrics-panel__header">
        <p className="metrics-panel__eyebrow">Engagement</p>
        <h2>Interactions summary</h2>
        <p>
          Top clicked elements and conversions for the demo site ({DEMO_SITE_ID}
          ). Click CTAs with <code>data-analytics-id</code> or trigger
          conversion events on the demo site to populate this section.
        </p>
      </header>

      {state.status === "loading" && (
        <>
          <p className="metrics-panel__status">Loading interactions summary…</p>
          <div className="interactions-summary__sections">
            <div className="interactions-summary__subsection">
              <h3>Top clicked elements</h3>
              <InteractionsTableSkeleton firstColumnLabel="Element ID" />
            </div>
            <div className="interactions-summary__subsection">
              <h3>Conversions</h3>
              <InteractionsTableSkeleton firstColumnLabel="Conversion name" />
            </div>
          </div>
        </>
      )}

      {state.status === "error" && (
        <div
          className="metrics-panel__alert metrics-panel__alert--error"
          role="alert"
        >
          <p>
            We could not load interactions summary right now. Make sure the
            ingest API is running, then refresh this page.
          </p>
        </div>
      )}

      {state.status === "success" && isEmptySummary(state.report) && (
        <div className="metrics-panel__alert metrics-panel__alert--info">
          <p>
            No clicks or conversions recorded yet. Open the demo site, click
            tracked elements, and try a conversion — interactions will appear
            here after events are ingested.
          </p>
        </div>
      )}

      {state.status === "success" && !isEmptySummary(state.report) && (
        <div className="interactions-summary__sections">
          <div className="interactions-summary__subsection">
            <h3>Top clicked elements</h3>
            {state.report.clicks.length === 0 ? (
              <p className="interactions-summary__empty">
                No click events with an element ID yet.
              </p>
            ) : (
              <ClicksTable items={state.report.clicks} />
            )}
          </div>

          <div className="interactions-summary__subsection">
            <h3>Conversions</h3>
            {state.report.conversions.length === 0 ? (
              <p className="interactions-summary__empty">
                No conversion events yet.
              </p>
            ) : (
              <ConversionsTable items={state.report.conversions} />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
