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
    <div className="metric-grid" aria-hidden="true">
      {METRIC_CARDS.map((card) => (
        <article
          key={card.key}
          className="metric-grid__item metric-grid__item--skeleton"
        >
          <div className="skeleton-line skeleton-line--label" />
          <div className="skeleton-line skeleton-line--value" />
        </article>
      ))}
    </div>
  );
}

function MetricCards({ totals }: { totals: OverviewTotals }) {
  return (
    <div className="metric-grid">
      {METRIC_CARDS.map((card) => (
        <article key={card.key} className="metric-grid__item">
          <p className="metric-grid__label">{card.label}</p>
          <p className="metric-grid__value">
            {formatMetricValue(totals[card.key])}
          </p>
          <p className="metric-grid__helper">{card.helper}</p>
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
    <section className="report-section" aria-label="Overview">
      <header className="report-section__header">
        <h2>Overview</h2>
        <p className="report-section__lead">
          Totals for <code>{DEMO_SITE_ID}</code>. Browse{" "}
          <a href="http://localhost:3001">localhost:3001</a> to generate
          events, then refresh.
        </p>
      </header>

      {state.status === "loading" && (
        <div className="report-section__body">
          <p className="report-section__status">Loading metrics…</p>
          <MetricCardsSkeleton />
        </div>
      )}

      {state.status === "error" && (
        <div
          className="report-section__alert report-section__alert--error"
          role="alert"
        >
          <p>
            We could not load metrics right now. Make sure the ingest API is
            running, then refresh this page.
          </p>
        </div>
      )}

      {state.status === "success" && isEmptyTotals(state.report.totals) && (
        <div className="report-section__alert report-section__alert--info">
          <p>
            No events yet. Visit pages, click tracked CTAs, scroll, and try a
            conversion on the demo site.
          </p>
        </div>
      )}

      {state.status === "success" && (
        <div className="report-section__body">
          <MetricCards totals={state.report.totals} />
        </div>
      )}
    </section>
  );
}
