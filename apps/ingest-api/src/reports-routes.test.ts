import { describe, expect, it, vi } from "vitest";

const routeMocks = vi.hoisted(() => ({
  disconnectPrisma: vi.fn(),
  saveAnalyticsEvents: vi.fn(),
  getOverviewTotals: vi.fn(),
  getPageViewsByPath: vi.fn(),
  getInteractionsSummary: vi.fn(),
  getScrollDepthSummary: vi.fn(),
}));

vi.mock("./db/prisma.js", () => ({
  disconnectPrisma: routeMocks.disconnectPrisma,
}));

vi.mock("./db/save-analytics-events.js", () => ({
  saveAnalyticsEvents: routeMocks.saveAnalyticsEvents,
}));

vi.mock("./db/get-overview-totals.js", () => ({
  getOverviewTotals: routeMocks.getOverviewTotals,
}));

vi.mock("./db/get-page-views-by-path.js", () => ({
  getPageViewsByPath: routeMocks.getPageViewsByPath,
}));

vi.mock("./db/get-interactions-summary.js", () => ({
  getInteractionsSummary: routeMocks.getInteractionsSummary,
}));

vi.mock("./db/get-scroll-depth-summary.js", () => ({
  getScrollDepthSummary: routeMocks.getScrollDepthSummary,
}));

import { buildApp } from "./app.js";

const REPORT_ENDPOINTS = [
  {
    path: "/api/reports/overview",
    failureError: "REPORTING_OVERVIEW_FAILED",
    mock: routeMocks.getOverviewTotals,
  },
  {
    path: "/api/reports/page-views-by-path",
    failureError: "REPORTING_PAGE_VIEWS_BY_PATH_FAILED",
    mock: routeMocks.getPageViewsByPath,
  },
  {
    path: "/api/reports/interactions-summary",
    failureError: "REPORTING_INTERACTIONS_SUMMARY_FAILED",
    mock: routeMocks.getInteractionsSummary,
  },
  {
    path: "/api/reports/scroll-depth-summary",
    failureError: "REPORTING_SCROLL_DEPTH_SUMMARY_FAILED",
    mock: routeMocks.getScrollDepthSummary,
  },
];

async function injectGet(url: string) {
  const app = buildApp({ logger: false });

  try {
    return await app.inject({
      method: "GET",
      url,
    });
  } finally {
    await app.close();
  }
}

function resetRouteMocks() {
  vi.resetAllMocks();
}

describe("reporting API routes", () => {
  it("returns current dashboard response shapes for valid siteId", async () => {
    resetRouteMocks();

    routeMocks.getOverviewTotals.mockResolvedValue({
      pageViews: 12,
      clicks: 5,
      scrollDepthEvents: 4,
      conversions: 2,
    });
    routeMocks.getPageViewsByPath.mockResolvedValue([
      { path: "/", pageViews: 8 },
      { path: "/pricing", pageViews: 4 },
    ]);
    routeMocks.getInteractionsSummary.mockResolvedValue({
      clicks: [{ elementId: "pricing-cta", clicks: 3 }],
      conversions: [{ conversionName: "pricing_cta_clicked", conversions: 1 }],
    });
    routeMocks.getScrollDepthSummary.mockResolvedValue([
      { depthPercent: 25, events: 6 },
      { depthPercent: 50, events: 3 },
    ]);

    const overview = await injectGet("/api/reports/overview?siteId=demo-site");
    expect(overview.statusCode).toBe(200);
    expect(overview.json()).toEqual({
      siteId: "demo-site",
      totals: {
        pageViews: 12,
        clicks: 5,
        scrollDepthEvents: 4,
        conversions: 2,
      },
    });

    const pageViews = await injectGet(
      "/api/reports/page-views-by-path?siteId=demo-site",
    );
    expect(pageViews.statusCode).toBe(200);
    expect(pageViews.json()).toEqual({
      siteId: "demo-site",
      items: [
        { path: "/", pageViews: 8 },
        { path: "/pricing", pageViews: 4 },
      ],
    });

    const interactions = await injectGet(
      "/api/reports/interactions-summary?siteId=demo-site",
    );
    expect(interactions.statusCode).toBe(200);
    expect(interactions.json()).toEqual({
      siteId: "demo-site",
      clicks: [{ elementId: "pricing-cta", clicks: 3 }],
      conversions: [{ conversionName: "pricing_cta_clicked", conversions: 1 }],
    });

    const scrollDepth = await injectGet(
      "/api/reports/scroll-depth-summary?siteId=demo-site",
    );
    expect(scrollDepth.statusCode).toBe(200);
    expect(scrollDepth.json()).toEqual({
      siteId: "demo-site",
      items: [
        { depthPercent: 25, events: 6 },
        { depthPercent: 50, events: 3 },
      ],
    });

    expect(routeMocks.getOverviewTotals).toHaveBeenCalledWith("demo-site");
    expect(routeMocks.getPageViewsByPath).toHaveBeenCalledWith("demo-site");
    expect(routeMocks.getInteractionsSummary).toHaveBeenCalledWith("demo-site");
    expect(routeMocks.getScrollDepthSummary).toHaveBeenCalledWith("demo-site");
  });

  it("returns safe empty/default responses for valid siteId with no data", async () => {
    resetRouteMocks();

    routeMocks.getOverviewTotals.mockResolvedValue({
      pageViews: 0,
      clicks: 0,
      scrollDepthEvents: 0,
      conversions: 0,
    });
    routeMocks.getPageViewsByPath.mockResolvedValue([]);
    routeMocks.getInteractionsSummary.mockResolvedValue({
      clicks: [],
      conversions: [],
    });
    routeMocks.getScrollDepthSummary.mockResolvedValue([]);

    const overview = await injectGet("/api/reports/overview?siteId=demo-site");
    expect(overview.statusCode).toBe(200);
    expect(overview.json()).toEqual({
      siteId: "demo-site",
      totals: {
        pageViews: 0,
        clicks: 0,
        scrollDepthEvents: 0,
        conversions: 0,
      },
    });

    const pageViews = await injectGet(
      "/api/reports/page-views-by-path?siteId=demo-site",
    );
    expect(pageViews.statusCode).toBe(200);
    expect(pageViews.json()).toEqual({
      siteId: "demo-site",
      items: [],
    });

    const interactions = await injectGet(
      "/api/reports/interactions-summary?siteId=demo-site",
    );
    expect(interactions.statusCode).toBe(200);
    expect(interactions.json()).toEqual({
      siteId: "demo-site",
      clicks: [],
      conversions: [],
    });

    const scrollDepth = await injectGet(
      "/api/reports/scroll-depth-summary?siteId=demo-site",
    );
    expect(scrollDepth.statusCode).toBe(200);
    expect(scrollDepth.json()).toEqual({
      siteId: "demo-site",
      items: [],
    });
  });

  it.each(REPORT_ENDPOINTS)(
    "returns INVALID_SITE_ID for missing siteId on $path",
    async ({ path, mock }) => {
      resetRouteMocks();

      const response = await injectGet(path);

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({
        ok: false,
        error: "INVALID_SITE_ID",
      });
      expect(mock).not.toHaveBeenCalled();
    },
  );

  it.each(REPORT_ENDPOINTS)(
    "returns INVALID_SITE_ID for blank siteId on $path",
    async ({ path, mock }) => {
      resetRouteMocks();

      const response = await injectGet(`${path}?siteId=`);

      expect(response.statusCode).toBe(400);
      expect(response.json()).toEqual({
        ok: false,
        error: "INVALID_SITE_ID",
      });
      expect(mock).not.toHaveBeenCalled();
    },
  );

  it.each(REPORT_ENDPOINTS)(
    "returns a safe public error when $path reporting fails",
    async ({ path, failureError, mock }) => {
      resetRouteMocks();
      mock.mockRejectedValue(
        new Error(
          "PrismaClientKnownRequestError: relation analytics_events leaked stack",
        ),
      );

      const response = await injectGet(`${path}?siteId=demo-site`);
      const bodyText = response.body;

      expect(response.statusCode).toBe(500);
      expect(response.json()).toEqual({
        ok: false,
        error: failureError,
      });
      expect(bodyText).not.toContain("Prisma");
      expect(bodyText).not.toContain("analytics_events");
      expect(bodyText).not.toContain("stack");
      expect(mock).toHaveBeenCalledWith("demo-site");
    },
  );
});
