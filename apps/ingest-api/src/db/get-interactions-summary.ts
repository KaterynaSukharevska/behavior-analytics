import { prisma } from "./prisma.js";

export type ClickSummaryItem = {
  elementId: string;
  clicks: number;
};

export type ConversionSummaryItem = {
  conversionName: string;
  conversions: number;
};

export type InteractionsSummary = {
  clicks: ClickSummaryItem[];
  conversions: ConversionSummaryItem[];
};

const TOP_ITEMS_LIMIT = 10;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function countByPayloadField(
  payloads: unknown[],
  fieldName: string,
): Map<string, number> {
  const counts = new Map<string, number>();

  for (const payload of payloads) {
    if (!isRecord(payload)) {
      continue;
    }

    const raw = payload[fieldName];
    if (typeof raw !== "string") {
      continue;
    }

    const key = raw.trim();
    if (key.length === 0) {
      continue;
    }

    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return counts;
}

function toTopClickItems(counts: Map<string, number>): ClickSummaryItem[] {
  return [...counts.entries()]
    .map(([elementId, clicks]) => ({ elementId, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, TOP_ITEMS_LIMIT);
}

function toTopConversionItems(
  counts: Map<string, number>,
): ConversionSummaryItem[] {
  return [...counts.entries()]
    .map(([conversionName, conversions]) => ({ conversionName, conversions }))
    .sort((a, b) => b.conversions - a.conversions)
    .slice(0, TOP_ITEMS_LIMIT);
}

export async function getInteractionsSummary(
  siteId: string,
): Promise<InteractionsSummary> {
  const events = await prisma.analyticsEvent.findMany({
    where: {
      siteId,
      eventType: { in: ["click", "conversion"] },
    },
    select: {
      eventType: true,
      payload: true,
    },
  });

  const clickPayloads = events
    .filter((event) => event.eventType === "click")
    .map((event) => event.payload);

  const conversionPayloads = events
    .filter((event) => event.eventType === "conversion")
    .map((event) => event.payload);

  const clickCounts = countByPayloadField(clickPayloads, "element_id");
  const conversionCounts = countByPayloadField(
    conversionPayloads,
    "conversion_name",
  );

  return {
    clicks: toTopClickItems(clickCounts),
    conversions: toTopConversionItems(conversionCounts),
  };
}
