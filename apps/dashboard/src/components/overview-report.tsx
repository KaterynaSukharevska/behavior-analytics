"use client";

import { useEffect, useState } from "react";
import {
  fetchOverviewReport,
  type OverviewReport,
  type OverviewTotals,
} from "../lib/reports-api";
import { DEMO_SITE_ID, INGEST_API_BASE_URL } from "../lib/reports-config";

type LoadState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; report: OverviewReport };

const METRIC_CARDS: {
  label: string;
  helper: string;
  key: keyof OverviewTotals;
}[] = [
  {
    label: "Page views",
    helper: "Tracked page_view events",
    key: "pageViews",
  },
  {
    label: "Clicks",
    helper: "Tracked data-analytics-id clicks",
    key: "clicks",
  },
  {
    label: "Scroll depth",
    helper: "Milestone events at 25–100%",
    key: "scrollDepthEvents",
  },
  {
    label: "Conversions",
    helper: "Explicit business events",
    key: "conversions",
  },
];

function formatMetricValue(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function isEmptyTotals(totals: OverviewTotals): boolean {
  return (
    totals.pageViews === 0 &&
    totals.clicks === 0 &&
    totals.scrollDepthEvents === 0 &&
    totals.conversions === 0
  );
}

function MetricCardsSkeleton() {
  return (
    <div className="metric-cards" aria-hidden="true">
      {METRIC_CARDS.map((card) => (
        <article key={card.key} className="metric-card metric-card--skeleton">
          <div className="skeleton-line skeleton-line--label" />
          <div className="skeleton-line skeleton-line--value" />
        </article>
      ))}
    </div>
  );
}

function MetricCards({ totals }: { totals: OverviewTotals }) {
  return (
    <div className="metric-cards">
      {METRIC_CARDS.map((card) => (
        <article key={card.key} className="metric-card">
          <h3 className="metric-card__label">{card.label}</h3>
          <p className="metric-card__value">
            {formatMetricValue(totals[card.key])}
          </p>
          <p className="metric-card__helper">{card.helper}</p>
        </article>
      ))}
    </div>
  );
}

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
    <section className="metrics-panel" aria-label="Demo site metrics">
      <header className="metrics-panel__header">
        <p className="metrics-panel__eyebrow">Overview</p>
        <h2>Demo site activity</h2>
        <p>
          Current totals for behavior analytics collected from the demo site (
          {DEMO_SITE_ID}). Browse{" "}
          <a href="http://localhost:3001">localhost:3001</a> to generate new
          events.
        </p>
      </header>

      {state.status === "loading" && (
        <>
          <p className="metrics-panel__status">Loading metrics…</p>
          <MetricCardsSkeleton />
        </>
      )}

      {state.status === "error" && (
        <div className="metrics-panel__alert metrics-panel__alert--error" role="alert">
          <p>
            We could not load metrics right now. Make sure the ingest API is
            running, then refresh this page.
          </p>
        </div>
      )}

      {state.status === "success" && isEmptyTotals(state.report.totals) && (
        <div className="metrics-panel__alert metrics-panel__alert--info">
          <p>
            No events yet for the demo site. Open the demo site, visit a few
            pages, click a CTA, scroll, and try a conversion — totals will
            appear here after data is ingested.
          </p>
        </div>
      )}

      {state.status === "success" && (
        <MetricCards totals={state.report.totals} />
      )}
    </section>
  );
}
