import Link from "next/link";

export default function ThankYouPage() {
  return (
    <section className="section" aria-label="Thank you">
      <h1 className="sectionTitle">Thanks — we’ve got it.</h1>
      <p className="sectionSubtitle">
        This page represents a successful demo conversion. In the MVP, it’s a
        plain page so tracking can be validated without any backend wiring.
      </p>

      <div className="heroActions">
        <Link
          href="/"
          className="btn btnPrimary"
          data-analytics-id="thank-you-cta-back-home"
        >
          Back to home
        </Link>
        <Link
          href="/features"
          className="btn"
          data-analytics-id="thank-you-cta-to-features"
        >
          Explore features
        </Link>
      </div>
    </section>
  );
}

