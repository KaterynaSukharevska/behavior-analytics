import { prisma } from "./prisma.js";

export type ScrollDepthSummaryItem = {
  depthPercent: number;
  events: number;
};

const VALID_MILESTONES = [25, 50, 75, 100] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseDepthPercent(payload: unknown): number | null {
  if (!isRecord(payload)) {
    return null;
  }

  const raw = payload.depth_percent;
  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return null;
  }

  const milestone = Math.round(raw);
  if (!(VALID_MILESTONES as readonly number[]).includes(milestone)) {
    return null;
  }

  return milestone;
}

export async function getScrollDepthSummary(
  siteId: string,
): Promise<ScrollDepthSummaryItem[]> {
  const rows = await prisma.analyticsEvent.findMany({
    where: {
      siteId,
      eventType: "scroll_depth",
    },
    select: {
      payload: true,
    },
  });

  const counts = new Map<number, number>();

  for (const row of rows) {
    const depthPercent = parseDepthPercent(row.payload);
    if (depthPercent === null) {
      continue;
    }

    counts.set(depthPercent, (counts.get(depthPercent) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([depthPercent, events]) => ({ depthPercent, events }))
    .sort((a, b) => a.depthPercent - b.depthPercent);
}
