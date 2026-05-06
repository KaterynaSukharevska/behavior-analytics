import Link from "next/link";

type Plan = {
  name: string;
  price: string;
  tagline: string;
  bullets: string[];
  cta: { label: string; href: string; analyticsId: string };
};

const plans: Plan[] = [
  {
    name: "Starter",
    price: "$0",
    tagline: "For prototypes and early demos.",
    bullets: ["Page views", "Click tracking", "Basic traffic sources"],
    cta: {
      label: "Start free",
      href: "/contact",
      analyticsId: "pricing-cta-starter-contact",
    },
  },
  {
    name: "Growth",
    price: "$49",
    tagline: "For teams shipping weekly.",
    bullets: ["Funnels & conversions", "Scroll depth", "Source attribution"],
    cta: {
      label: "Choose Growth",
      href: "/contact",
      analyticsId: "pricing-cta-growth-contact",
    },
  },
  {
    name: "Scale",
    price: "$199",
    tagline: "For high-volume products.",
    bullets: ["Advanced segmentation", "Export-ready events", "Priority support"],
    cta: {
      label: "Talk to sales",
      href: "/contact",
      analyticsId: "pricing-cta-scale-contact",
    },
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="section" aria-label="Pricing header">
        <h1 className="sectionTitle">Pricing</h1>
        <p className="sectionSubtitle">
          Simple plans with clear CTAs. Click around to generate intent signals
          and test funnel steps later.
        </p>
        <div className="heroActions">
          <Link
            href="/features"
            className="btn"
            data-analytics-id="pricing-cta-to-features"
          >
            Review features
          </Link>
          <Link
            href="/contact"
            className="btn btnPrimary"
            data-analytics-id="pricing-cta-to-contact-primary"
          >
            Contact sales
          </Link>
        </div>
      </section>

      <section className="section" aria-label="Plan cards">
        <h2 className="sectionTitle">Choose your plan</h2>
        <p className="sectionSubtitle">
          These tiers are fictional and exist to power demo interactions.
        </p>

        <div className="cardGrid">
          {plans.map((plan) => (
            <div className="card" key={plan.name} aria-label={`${plan.name} plan`}>
              <h3>{plan.name}</h3>
              <p>
                <strong>{plan.price}</strong> · {plan.tagline}
              </p>
              <div className="heroMeta" aria-label="Plan details">
                {plan.bullets.map((b) => (
                  <span className="pill" key={b}>
                    {b}
                  </span>
                ))}
              </div>
              <div className="heroActions">
                <Link
                  href={plan.cta.href}
                  className="btn btnPrimary"
                  data-analytics-id={plan.cta.analyticsId}
                >
                  {plan.cta.label}
                </Link>
                <Link
                  href="/contact"
                  className="btn"
                  data-analytics-id={`pricing-secondary-cta-${plan.name.toLowerCase()}`}
                >
                  Ask a question
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-label="FAQ">
        <h2 className="sectionTitle">FAQ</h2>
        <p className="sectionSubtitle">
          A bit more content to encourage scrolling and interaction.
        </p>
        <div className="twoCol">
          <div className="card">
            <h3>Do you store sensitive user data?</h3>
            <p>
              Not in this demo. It’s structured to test event capture without
              collecting personal information.
            </p>
          </div>
          <div className="card">
            <h3>Can I test a conversion event?</h3>
            <p>
              Yes—use the contact page’s “Continue to thank you” link as a demo
              conversion flow.
            </p>
            <div className="heroActions">
              <Link
                href="/contact"
                className="btn"
                data-analytics-id="pricing-faq-cta-to-contact"
              >
                Go to Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

