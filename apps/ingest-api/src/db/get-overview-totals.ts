import { prisma } from "./prisma.js";

export type OverviewTotals = {
  pageViews: number;
  clicks: number;
  scrollDepthEvents: number;
  conversions: number;
};

const EMPTY_TOTALS: OverviewTotals = {
  pageViews: 0,
  clicks: 0,
  scrollDepthEvents: 0,
  conversions: 0,
};

const EVENT_TYPE_TO_TOTAL_KEY: Record<string, keyof OverviewTotals> = {
  page_view: "pageViews",
  click: "clicks",
  scroll_depth: "scrollDepthEvents",
  conversion: "conversions",
};

export async function getOverviewTotals(siteId: string): Promise<OverviewTotals> {
  const groups = await prisma.analyticsEvent.groupBy({
    by: ["eventType"],
    where: { siteId },
    _count: { _all: true },
  });

  const totals: OverviewTotals = { ...EMPTY_TOTALS };

  for (const group of groups) {
    const key = EVENT_TYPE_TO_TOTAL_KEY[group.eventType];
    if (key) {
      totals[key] = group._count._all;
    }
  }

  return totals;
}
