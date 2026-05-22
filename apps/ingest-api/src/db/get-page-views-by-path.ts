import { prisma } from "./prisma.js";

export type PageViewsByPathItem = {
  path: string;
  pageViews: number;
};

const TOP_PATHS_LIMIT = 10;

export async function getPageViewsByPath(
  siteId: string,
): Promise<PageViewsByPathItem[]> {
  const groups = await prisma.analyticsEvent.groupBy({
    by: ["path"],
    where: {
      siteId,
      eventType: "page_view",
      path: { not: null },
    },
    _count: { _all: true },
  });

  return groups
    .map((group) => ({
      path: group.path as string,
      pageViews: group._count._all,
    }))
    .sort((a, b) => b.pageViews - a.pageViews)
    .slice(0, TOP_PATHS_LIMIT);
}
