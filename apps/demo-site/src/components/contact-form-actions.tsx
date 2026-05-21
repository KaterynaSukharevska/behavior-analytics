"use client";

import { trackConversion } from "@behavior-analytics/tracker";
import Link from "next/link";
import { CONVERSION_NAMES } from "../lib/conversion-names";
import { TRACKER_DEBUG } from "../lib/tracker-config";

function sendConversion(conversionName: string): void {
  void trackConversion(conversionName).then(() => {
    if (TRACKER_DEBUG) {
      console.debug("[behavior-analytics] conversion sent", { conversionName });
    }
  });
}

export function ContactFormActions() {
  return (
    <div className="heroActions" aria-label="Form actions">
      <button
        type="button"
        className="btn btnPrimary"
        data-analytics-id="contact-cta-submit-demo"
        onClick={() => sendConversion(CONVERSION_NAMES.CONTACT_FORM_SUBMITTED)}
      >
        Submit demo request
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
  );
}
