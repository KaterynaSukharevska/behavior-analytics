import Link from "next/link";

export default function ContactPage() {
  return (
    <>
      <section className="section" aria-label="Contact header">
        <h1 className="sectionTitle">Contact</h1>
        <p className="sectionSubtitle">
          This is UI only—no form submission. Use the “Continue” link below to
          simulate a conversion flow.
        </p>
      </section>

      <section className="section" aria-label="Contact form">
        <h2 className="sectionTitle">Tell us what you’re building</h2>
        <p className="sectionSubtitle">
          Fields are marked with <code>data-analytics-ignore</code> so future
          tracking can avoid capturing typed values.
        </p>

        <div className="form" role="form" aria-label="Contact form fields">
          <div className="twoCol">
            <div className="field">
              <label className="label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="input"
                placeholder="Alex Doe"
                data-analytics-ignore
                autoComplete="off"
              />
            </div>
            <div className="field">
              <label className="label" htmlFor="email">
                Work email
              </label>
              <input
                id="email"
                className="input"
                placeholder="alex@company.com"
                type="email"
                data-analytics-ignore
                autoComplete="off"
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="company">
              Company
            </label>
            <input
              id="company"
              className="input"
              placeholder="Company Inc."
              data-analytics-ignore
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="message">
              What are you trying to measure?
            </label>
            <textarea
              id="message"
              className="textarea"
              placeholder="Activation, pricing intent, checkout drop-off..."
              data-analytics-ignore
            />
          </div>

          <div className="heroActions" aria-label="Form actions">
            <button
              type="button"
              className="btn btnPrimary"
              data-analytics-id="contact-cta-primary-ui-only"
              aria-disabled="true"
            >
              Request demo (disabled)
            </button>
            <Link
              href="/thank-you"
              className="btn"
              data-analytics-id="contact-cta-conversion-to-thank-you"
            >
              Continue to thank you
            </Link>
            <Link
              href="/pricing"
              className="btn"
              data-analytics-id="contact-cta-back-to-pricing"
            >
              Revisit pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

