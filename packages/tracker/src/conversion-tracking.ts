import type {
  ConversionEvent,
  IngestEventsRequest,
} from "@behavior-analytics/types";
import { requireTrackerConfig } from "./config";
import { createId } from "./create-id";
import { getDeviceType } from "./device";
import { getOrCreateSessionId } from "./session";
import { sendIngestRequest } from "./transport";

export type ConversionOptionalData = Partial<
  Pick<
    ConversionEvent,
    | "utm_source"
    | "utm_medium"
    | "utm_campaign"
    | "conversion_value"
    | "referrer"
    | "path"
    | "page_url"
  >
>;

function normalizeConversionName(conversionName: string): string {
  const trimmed = conversionName.trim();

  if (!trimmed) {
    throw new Error("conversionName is required");
  }

  return trimmed;
}

function buildConversionEvent(
  conversionName: string,
  optionalData?: ConversionOptionalData,
): ConversionEvent {
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

  const event: ConversionEvent = {
    event_id: createId(),
    event_type: "conversion",
    site_id: config.siteId,
    session_id: getOrCreateSessionId(),
    timestamp: new Date().toISOString(),
    page_url: pageUrl,
    path,
    device_type: getDeviceType(),
    conversion_name: conversionName,
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

  if (optionalData?.conversion_value !== undefined) {
    event.conversion_value = optionalData.conversion_value;
  }

  return event;
}

export async function trackConversion(
  conversionName: string,
  optionalData?: ConversionOptionalData,
): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedName = normalizeConversionName(conversionName);
  const config = requireTrackerConfig();
  const event = buildConversionEvent(normalizedName, optionalData);

  const body: IngestEventsRequest = {
    site_id: config.siteId,
    events: [event],
  };

  await sendIngestRequest(config.endpoint, body);
}
