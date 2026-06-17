import { DashboardShell } from "../components/dashboard-shell";
import { OverviewReport } from "../components/overview-report";
import { InteractionsSummary } from "../components/interactions-summary";
import { ScrollDepthSummary } from "../components/scroll-depth-summary";
import { PageViewsByPath } from "../components/page-views-by-path";

export default function HomePage() {
  return (
    <DashboardShell>
      <section className="status-strip" aria-label="Local service status">
        <p className="status-strip__label">Local stack</p>
        <ul className="status-strip__list">
          <li>
            <span className="status-strip__name">Dashboard</span>
            <span className="status-strip__value">localhost:3000</span>
          </li>
          <li>
            <span className="status-strip__name">Ingest API</span>
            <a
              className="status-strip__link"
              href="http://localhost:4000/api/health"
            >
              localhost:4000/api/health
            </a>
          </li>
          <li>
            <span className="status-strip__name">Database</span>
            <span className="status-strip__value">PostgreSQL · :5432</span>
          </li>
        </ul>
      </section>

      <div id="overview" className="dashboard-section">
        <OverviewReport />
      </div>

      <div className="dashboard-reports" aria-label="Detailed reports">
        <div id="page-views" className="dashboard-section">
          <PageViewsByPath />
        </div>
        <div id="interactions" className="dashboard-section">
          <InteractionsSummary />
        </div>
        <div id="scroll-depth" className="dashboard-section">
          <ScrollDepthSummary />
        </div>
      </div>

      <section
        id="privacy"
        className="privacy-note"
        aria-label="Privacy summary"
      >
        <h2>Privacy</h2>
        <p>
          The tracker collects behavior metadata only. It does not collect form
          values, names, emails, cookies, localStorage, arbitrary DOM text, or
          session replay data. Clicks use explicit{" "}
          <code>data-analytics-id</code> attributes.
        </p>
      </section>
    </DashboardShell>
  );
}
