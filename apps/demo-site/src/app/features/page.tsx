import Link from "next/link";

const features = [
  {
    title: "Event-ready UI",
    description:
      "Buttons and links across pages are designed for click tracking and realistic navigation flows.",
  },
  {
    title: "Scroll depth surfaces",
    description:
      "Long-form sections encourage natural scrolling for depth and engagement metrics.",
  },
  {
    title: "Conversion path",
    description:
      "A lightweight contact → thank-you flow enables clean conversion event validation.",
  },
  {
    title: "Traffic source simulation",
    description:
      "Use UTM query parameters on the homepage to test attribution and source breakdowns.",
  },
  {
    title: "Pricing intent",
    description:
      "Tiered plan cards and multiple CTAs create strong intent signals and funnel steps.",
  },
  {
    title: "Clean structure",
    description:
      "Minimal Next.js App Router foundation with plain CSS—easy to extend when the SDK lands.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="section" aria-label="Features header">
        <h1 className="sectionTitle">Features</h1>
        <p className="sectionSubtitle">
          Everything on this site is built to feel like a real marketing
          experience—while generating meaningful analytics signals later.
        </p>
        <div className="heroActions">
          <Link
            href="/pricing"
            className="btn btnPrimary"
            data-analytics-id="features-cta-to-pricing"
          >
            See pricing
          </Link>
          <Link
            href="/contact"
            className="btn"
            data-analytics-id="features-cta-to-contact"
          >
            Contact sales
          </Link>
        </div>
      </section>

      <section className="section" aria-label="Feature cards">
        <h2 className="sectionTitle">What you can test</h2>
        <p className="sectionSubtitle">
          A small, opinionated set of interactions that cover page views, clicks,
          scroll depth, conversions, and traffic sources.
        </p>
        <div className="cardGrid">
          {features.map((f) => (
            <div className="card" key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
              <div className="heroActions">
                <Link
                  href="/pricing"
                  className="btn"
                  data-analytics-id={`features-card-cta-pricing-${f.title
                    .toLowerCase()
                    .replaceAll(" ", "-")}`}
                >
                  View plans
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

