import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "#overview", label: "Overview" },
  { href: "#page-views", label: "Page Views" },
  { href: "#interactions", label: "Interactions" },
  { href: "#scroll-depth", label: "Scroll Depth" },
  { href: "#privacy", label: "Privacy" },
];

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="dashboard">
      <aside className="dashboard__sidebar" aria-label="Dashboard navigation">
        <div className="dashboard__brand">
          <p className="dashboard__brand-eyebrow">Local portfolio MVP</p>
          <p className="dashboard__brand-title">Behavior Analytics</p>
          <p className="dashboard__brand-site">Site: demo-site</p>
        </div>

        <nav className="dashboard__nav" aria-label="Report sections">
          <ul className="dashboard__nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a className="dashboard__nav-link" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className="dashboard__sidebar-note">
          Privacy-safe events only. Not a production SaaS deployment.
        </p>
      </aside>

      <div className="dashboard__main">
        <header className="dashboard__header">
          <div className="dashboard__header-copy">
            <h1>Reports</h1>
            <p>
              Page views, clicks, scroll depth, and conversions from the local
              ingest API. Generate data on the demo site, then refresh.
            </p>
          </div>
          <div className="dashboard__header-meta" aria-label="Stack scope">
            <span>REST reports</span>
            <span>PostgreSQL</span>
          </div>
        </header>

        <div className="dashboard__content">{children}</div>
      </div>
    </div>
  );
}
