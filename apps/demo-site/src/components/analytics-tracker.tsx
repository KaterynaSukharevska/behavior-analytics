"use client";

import { init, trackConversion, trackPageView } from "@behavior-analytics/tracker";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { CONVERSION_NAMES } from "../lib/conversion-names";
import {
  TRACKER_DEBUG,
  TRACKER_ENDPOINT,
  TRACKER_SITE_ID,
} from "../lib/tracker-config";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    init({
      siteId: TRACKER_SITE_ID,
      endpoint: TRACKER_ENDPOINT,
    });
    initialized.current = true;

    if (TRACKER_DEBUG) {
      console.debug("[behavior-analytics] tracker initialized", {
        siteId: TRACKER_SITE_ID,
        endpoint: TRACKER_ENDPOINT,
      });
    }
  }, []);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    void trackPageView().then(() => {
      if (TRACKER_DEBUG) {
        console.debug("[behavior-analytics] page_view sent", { path: pathname });
      }
    });

    if (pathname === "/thank-you") {
      void trackConversion(CONVERSION_NAMES.THANK_YOU_PAGE_VIEWED).then(() => {
        if (TRACKER_DEBUG) {
          console.debug("[behavior-analytics] conversion sent", {
            conversionName: CONVERSION_NAMES.THANK_YOU_PAGE_VIEWED,
          });
        }
      });
    }
  }, [pathname]);

  return null;
}
