import type {
  IngestEventsRequest,
  PageViewEvent,
} from "@behavior-analytics/types";
import { startClickTracking } from "./click-tracking";
import { startScrollTracking } from "./scroll-tracking";
import { requireTrackerConfig, setTrackerConfig, type TrackerConfig } from "./config";
import { getDeviceType } from "./device";
import { getOrCreateSessionId } from "./session";
import { createId } from "./create-id";
import { sendIngestRequest } from "./transport";

export type { TrackerConfig } from "./config";
export { startClickTracking } from "./click-tracking";
export { startScrollTracking } from "./scroll-tracking";

export type PageViewOptionalData = Partial<
  Pick<
    PageViewEvent,
    | "utm_source"
    | "utm_medium"
    | "utm_campaign"
    | "viewport_width"
    | "viewport_height"
    | "referrer"
    | "path"
    | "page_url"
  >
>;

export function init(config: TrackerConfig): void {
  setTrackerConfig(config);

  if (typeof window !== "undefined") {
    startClickTracking();
    startScrollTracking();
  }
}

function buildPageViewEvent(
  optionalData?: PageViewOptionalData,
): PageViewEvent {
  const config = requireTrackerConfig();
  const pageUrl =
    optionalData?.page_url ??
    (typeof window !== "undefined" ? window.location.href : "");
  const path =
    optionalData?.path ??
    (typeof window !== "undefined" ? window.location.pathname : "");

  const referrer =
    optionalData?.referrer ??
    (typeof document !== "undefined" && document.referrer
      ? document.referrer
      : undefined);

  const viewportWidth =
    optionalData?.viewport_width ??
    (typeof window !== "undefined" ? window.innerWidth : undefined);
  const viewportHeight =
    optionalData?.viewport_height ??
    (typeof window !== "undefined" ? window.innerHeight : undefined);

  const event: PageViewEvent = {
    event_id: createId(),
    event_type: "page_view",
    site_id: config.siteId,
    session_id: getOrCreateSessionId(),
    timestamp: new Date().toISOString(),
    page_url: pageUrl,
    path,
    device_type: getDeviceType(),
  };

  if (referrer !== undefined) {
    event.referrer = referrer;
  }

  if (optionalData?.utm_source !== undefined) {
    event.utm_source = optionalData.utm_source;
  }

  if (optionalData?.utm_medium !== undefined) {
    event.utm_medium = optionalData.utm_medium;
  }

  if (optionalData?.utm_campaign !== undefined) {
    event.utm_campaign = optionalData.utm_campaign;
  }

  if (viewportWidth !== undefined) {
    event.viewport_width = viewportWidth;
  }

  if (viewportHeight !== undefined) {
    event.viewport_height = viewportHeight;
  }

  return event;
}

export async function trackPageView(
  optionalData?: PageViewOptionalData,
): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  const config = requireTrackerConfig();
  const event = buildPageViewEvent(optionalData);

  const body: IngestEventsRequest = {
    site_id: config.siteId,
    events: [event],
  };

  await sendIngestRequest(config.endpoint, body);
}
