import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma.js";

/** Validated event fields from POST /api/events (Zod output). */
type ValidatedAnalyticsEvent = {
  event_id: string;
  site_id: string;
  session_id: string;
  event_type: string;
  timestamp: string;
  page_url: string;
  path: string;
  device_type?: string | undefined;
  [key: string]: unknown;
};

function toRow(event: ValidatedAnalyticsEvent): Prisma.AnalyticsEventCreateManyInput {
  const timestamp = new Date(event.timestamp);

  if (Number.isNaN(timestamp.getTime())) {
    throw new Error("Invalid event timestamp");
  }

  return {
    eventId: event.event_id,
    siteId: event.site_id,
    sessionId: event.session_id,
    eventType: event.event_type,
    timestamp,
    pageUrl: event.page_url,
    path: event.path,
    deviceType: event.device_type ?? null,
    payload: JSON.parse(JSON.stringify(event)) as Prisma.InputJsonValue,
  };
}

export async function saveAnalyticsEvents(
  events: ValidatedAnalyticsEvent[],
): Promise<number> {
  const result = await prisma.analyticsEvent.createMany({
    data: events.map(toRow),
  });

  return result.count;
}
