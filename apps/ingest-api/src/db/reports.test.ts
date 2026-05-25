import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMocks = vi.hoisted(() => ({
  findMany: vi.fn(),
  groupBy: vi.fn(),
}));

vi.mock("./prisma.js", () => ({
  prisma: {
    analyticsEvent: {
      findMany: prismaMocks.findMany,
      groupBy: prismaMocks.groupBy,
    },
  },
}));

import { getInteractionsSummary } from "./get-interactions-summary.js";
import { getOverviewTotals } from "./get-overview-totals.js";
import { getPageViewsByPath } from "./get-page-views-by-path.js";
import { getScrollDepthSummary } from "./get-scroll-depth-summary.js";

describe("reporting helpers", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getOverviewTotals", () => {
    it("counts supported event types and defaults missing totals to zero", async () => {
      prismaMocks.groupBy.mockResolvedValue([
        { eventType: "page_view", _count: { _all: 3 } },
        { eventType: "click", _count: { _all: 2 } },
        { eventType: "conversion", _count: { _all: 1 } },
        { eventType: "session_start", _count: { _all: 99 } },
      ]);

      await expect(getOverviewTotals("demo-site")).resolves.toEqual({
        pageViews: 3,
        clicks: 2,
        scrollDepthEvents: 0,
        conversions: 1,
      });

      expect(prismaMocks.groupBy).toHaveBeenCalledWith({
        by: ["eventType"],
        where: { siteId: "demo-site" },
        _count: { _all: true },
      });
    });
  });

  describe("getPageViewsByPath", () => {
    it("returns the top 10 page_view paths sorted by count", async () => {
      prismaMocks.groupBy.mockResolvedValue(
        Array.from({ length: 12 }, (_, index) => ({
          path: `/page-${index + 1}`,
          _count: { _all: index + 1 },
        })),
      );

      await expect(getPageViewsByPath("demo-site")).resolves.toEqual(
        Array.from({ length: 10 }, (_, index) => ({
          path: `/page-${12 - index}`,
          pageViews: 12 - index,
        })),
      );

      expect(prismaMocks.groupBy).toHaveBeenCalledWith({
        by: ["path"],
        where: {
          siteId: "demo-site",
          eventType: "page_view",
          path: { not: null },
        },
        _count: { _all: true },
      });
    });
  });

  describe("getInteractionsSummary", () => {
    it("groups safe click and conversion payload fields", async () => {
      prismaMocks.findMany.mockResolvedValue([
        { eventType: "click", payload: { element_id: "primary-cta" } },
        { eventType: "click", payload: { element_id: "primary-cta" } },
        { eventType: "click", payload: { element_id: " secondary-cta " } },
        { eventType: "click", payload: { element_id: "" } },
        { eventType: "click", payload: { element_id: 123 } },
        { eventType: "click", payload: null },
        { eventType: "conversion", payload: { conversion_name: "signup" } },
        { eventType: "conversion", payload: { conversion_name: "signup" } },
        { eventType: "conversion", payload: { conversion_name: "purchase" } },
        { eventType: "conversion", payload: { conversion_name: " " } },
      ]);

      await expect(getInteractionsSummary("demo-site")).resolves.toEqual({
        clicks: [
          { elementId: "primary-cta", clicks: 2 },
          { elementId: "secondary-cta", clicks: 1 },
        ],
        conversions: [
          { conversionName: "signup", conversions: 2 },
          { conversionName: "purchase", conversions: 1 },
        ],
      });

      expect(prismaMocks.findMany).toHaveBeenCalledWith({
        where: {
          siteId: "demo-site",
          eventType: { in: ["click", "conversion"] },
        },
        select: {
          eventType: true,
          payload: true,
        },
      });
    });
  });

  describe("getScrollDepthSummary", () => {
    it("counts valid scroll milestones and sorts them ascending", async () => {
      prismaMocks.findMany.mockResolvedValue([
        { payload: { depth_percent: 75 } },
        { payload: { depth_percent: 25 } },
        { payload: { depth_percent: 25 } },
        { payload: { depth_percent: 100 } },
        { payload: { depth_percent: 60 } },
        { payload: { depth_percent: "50" } },
        { payload: {} },
        { payload: null },
      ]);

      await expect(getScrollDepthSummary("demo-site")).resolves.toEqual([
        { depthPercent: 25, events: 2 },
        { depthPercent: 75, events: 1 },
        { depthPercent: 100, events: 1 },
      ]);

      expect(prismaMocks.findMany).toHaveBeenCalledWith({
        where: {
          siteId: "demo-site",
          eventType: "scroll_depth",
        },
        select: {
          payload: true,
        },
      });
    });
  });
});
