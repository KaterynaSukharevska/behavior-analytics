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
    <section className="metrics-panel" aria-label="Page views by path">
      <header className="metrics-panel__header">
        <p className="metrics-panel__eyebrow">Traffic</p>
        <h2>Page views by path</h2>
        <p>
          Top paths ranked by page views for the demo site ({DEMO_SITE_ID}), up
          to the ten most viewed paths.
        </p>
      </header>

      {state.status === "loading" && (
        <>
          <p className="metrics-panel__status">Loading page views by path…</p>
          <PathTableSkeleton />
        </>
      )}

      {state.status === "error" && (
        <div
          className="metrics-panel__alert metrics-panel__alert--error"
          role="alert"
        >
          <p>
            We could not load page views by path right now. Make sure the ingest
            API is running, then refresh this page.
          </p>
        </div>
      )}

      {state.status === "success" && state.report.items.length === 0 && (
        <div className="metrics-panel__alert metrics-panel__alert--info">
          <p>
            No page views recorded yet. Open the demo site and visit a few pages
            — paths will appear here after page_view events are ingested.
          </p>
        </div>
      )}

      {state.status === "success" && state.report.items.length > 0 && (
        <PathTable items={state.report.items} />
      )}
    </section>
  );
}
