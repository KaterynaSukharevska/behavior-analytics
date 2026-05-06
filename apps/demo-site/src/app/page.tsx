import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="hero" aria-label="Hero">
        <div>
          <h1>Understand what users do — and why they convert.</h1>
          <p>
            Pulseboard is a lightweight product analytics platform for SaaS
            teams. Track page views, clicks, scroll depth, and conversions with
            clean events and a simple dashboard.
          </p>

          <div className="heroMeta" aria-label="Highlights">
            <span className="pill">Realtime dashboards</span>
            <span className="pill">Session-friendly events</span>
            <span className="pill">Privacy-first defaults</span>
          </div>

          <div className="heroActions" aria-label="Primary actions">
            <Link
              href="/pricing"
              className="btn btnPrimary"
              data-analytics-id="home-hero-cta-primary-pricing"
            >
              See pricing
            </Link>
            <Link
              href="/features"
              className="btn"
              data-analytics-id="home-hero-cta-secondary-features"
            >
              Explore features
            </Link>
            <Link
              href="/contact"
              className="btn"
              data-analytics-id="home-hero-cta-contact"
            >
              Talk to sales
            </Link>
          </div>
        </div>

        <div aria-label="Preview">
          <div className="card">
            <h3>Today’s snapshot</h3>
            <p>
              A realistic set of interactions for testing tracking: navigation,
              scroll, pricing intent, and a conversion flow.
            </p>
          </div>
          <div className="cardGrid" aria-label="Quick links">
            <Link
              href="/features"
              className="card"
              data-analytics-id="home-quicklink-features"
            >
              <h3>Feature tour</h3>
              <p>See what we track and how it’s organized.</p>
            </Link>
            <Link
              href="/pricing"
              className="card"
              data-analytics-id="home-quicklink-pricing"
            >
              <h3>Plans</h3>
              <p>Compare tiers and click-through CTAs.</p>
            </Link>
            <Link
              href="/contact"
              className="card"
              data-analytics-id="home-quicklink-contact"
            >
              <h3>Contact</h3>
              <p>Try the demo conversion flow.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Social proof">
        <h2 className="sectionTitle">Built for the moments that matter</h2>
        <p className="sectionSubtitle">
          Track the journey from first touch to conversion. Attribute traffic
          sources, measure activation, and learn where users hesitate.
        </p>
        <div className="kpiRow" aria-label="KPIs">
          <div className="kpi">
            <strong>+18%</strong>
            <span>activation rate after onboarding tweaks</span>
          </div>
          <div className="kpi">
            <strong>-27%</strong>
            <span>drop-off on critical funnels</span>
          </div>
          <div className="kpi">
            <strong>2.1x</strong>
            <span>faster insight-to-decision cycle</span>
          </div>
          <div className="kpi">
            <strong>5 min</strong>
            <span>typical setup for first events</span>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Use cases">
        <h2 className="sectionTitle">What you can measure on this demo site</h2>
        <p className="sectionSubtitle">
          This site is intentionally scrollable and click-heavy to create rich
          event streams later.
        </p>
        <div className="twoCol">
          <div className="card">
            <h3>Intent signals</h3>
            <p>
              Track pricing clicks, feature exploration, and contact intent.
              Useful for click tracking and conversion funnels.
            </p>
            <div className="heroActions">
              <Link
                href="/pricing"
                className="btn"
                data-analytics-id="home-usecase-intent-to-pricing"
              >
                Compare plans
              </Link>
              <Link
                href="/features"
                className="btn"
                data-analytics-id="home-usecase-intent-to-features"
              >
                See capabilities
              </Link>
            </div>
          </div>
          <div className="card">
            <h3>Traffic sources</h3>
            <p>
              Use query params as realistic acquisition sources (for example{" "}
              <code>?utm_source=newsletter</code>) and validate attribution
              logic.
            </p>
            <div className="heroActions">
              <Link
                href="/?utm_source=newsletter&utm_campaign=demo"
                className="btn"
                data-analytics-id="home-traffic-source-newsletter"
              >
                Simulate newsletter traffic
              </Link>
              <Link
                href="/?utm_source=ads&utm_campaign=brand"
                className="btn"
                data-analytics-id="home-traffic-source-ads"
              >
                Simulate paid traffic
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Portfolio flow">
        <h2 className="sectionTitle">A simple “portfolio demo” flow</h2>
        <p className="sectionSubtitle">
          Follow a realistic path: read about features → evaluate pricing → reach
          out → land on a thank-you page.
        </p>
        <div className="cardGrid">
          <div className="card">
            <h3>1) Explore</h3>
            <p>Click into the feature catalog to generate navigation events.</p>
            <div className="heroActions">
              <Link
                href="/features"
                className="btn"
                data-analytics-id="home-flow-step1-features"
              >
                Go to Features
              </Link>
            </div>
          </div>
          <div className="card">
            <h3>2) Evaluate</h3>
            <p>Compare plans and click CTAs to create intent signals.</p>
            <div className="heroActions">
              <Link
                href="/pricing"
                className="btn"
                data-analytics-id="home-flow-step2-pricing"
              >
                Go to Pricing
              </Link>
            </div>
          </div>
          <div className="card">
            <h3>3) Convert</h3>
            <p>Use the contact flow’s thank-you step as a conversion event.</p>
            <div className="heroActions">
              <Link
                href="/contact"
                className="btn"
                data-analytics-id="home-flow-step3-contact"
              >
                Go to Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Final CTA">
        <h2 className="sectionTitle">Ready to see it in action?</h2>
        <p className="sectionSubtitle">
          Start with pricing, then try the contact → thank-you conversion path.
        </p>
        <div className="heroActions">
          <Link
            href="/pricing"
            className="btn btnPrimary"
            data-analytics-id="home-final-cta-pricing"
          >
            View plans
          </Link>
          <Link
            href="/contact"
            className="btn"
            data-analytics-id="home-final-cta-contact"
          >
            Start demo conversion
          </Link>
        </div>
      </section>
    </>
  );
}

