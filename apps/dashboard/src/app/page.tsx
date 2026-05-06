export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <h1>Behavior Analytics</h1>
        <p>
          Lightweight website behavior analytics for engagement, clicks, scroll
          depth, and conversion drop-off.
        </p>
      </section>

      <section className="status-card" aria-label="service status">
        <h2>Current Status</h2>
        <ul>
          <li>
            <strong>Dashboard:</strong> ready
          </li>
          <li>
            <strong>Ingest API:</strong> available at
            {" "}
            <a href="http://localhost:4000/api/health">
              http://localhost:4000/api/health
            </a>
          </li>
          <li>
            <strong>PostgreSQL:</strong> running via Docker
          </li>
        </ul>
      </section>

      <p className="note">Reports and analytics views will be added later.</p>
    </main>
  );
}
