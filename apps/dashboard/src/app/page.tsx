import { OverviewReport } from "../components/overview-report";
import { InteractionsSummary } from "../components/interactions-summary";
import { ScrollDepthSummary } from "../components/scroll-depth-summary";
import { PageViewsByPath } from "../components/page-views-by-path";

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="hero__eyebrow">Local analytics MVP</p>
        <div className="hero__content">
          <div>
            <h1>Behavior Analytics Dashboard</h1>
            <p>
              A privacy-first dashboard for the demo site, showing page views,
              clicks, scroll depth, and conversions from the local ingest API.
            </p>
          </div>
          <div className="hero__meta" aria-label="dashboard scope">
            <span>REST reports</span>
            <span>PostgreSQL events</span>
            <span>Simple charts</span>
          </div>
        </div>
      </section>

      <section className="status-card" aria-label="service status">
        <div className="status-card__header">
          <h2>Local system status</h2>
          <p>Use these services together to generate and view live demo data.</p>
        </div>
        <div className="status-card__grid">
          <article className="status-card__item">
            <span className="status-card__label">Dashboard</span>
            <strong>Ready</strong>
            <span>http://localhost:3000</span>
          </article>
          <article className="status-card__item">
            <span className="status-card__label">Ingest API</span>
            <strong>Health check</strong>
            <a href="http://localhost:4000/api/health">
              localhost:4000/api/health
            </a>
          </article>
          <article className="status-card__item">
            <span className="status-card__label">Database</span>
            <strong>PostgreSQL</strong>
            <span>Docker Compose on localhost:5432</span>
          </article>
        </div>
      </section>

      <OverviewReport />

      <div className="dashboard-reports" aria-label="Detailed reports">
        <PageViewsByPath />
        <InteractionsSummary />
        <ScrollDepthSummary />
      </div>
    </main>
  );
}
