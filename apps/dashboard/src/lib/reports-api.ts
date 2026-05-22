export type OverviewTotals = {
  pageViews: number;
  clicks: number;
  scrollDepthEvents: number;
  conversions: number;
};

export type OverviewReport = {
  siteId: string;
  totals: OverviewTotals;
};

export type PageViewsByPathItem = {
  path: string;
  pageViews: number;
};

export type PageViewsByPathReport = {
  siteId: string;
  items: PageViewsByPathItem[];
};

export type ClickSummaryItem = {
  elementId: string;
  clicks: number;
};

export type ConversionSummaryItem = {
  conversionName: string;
  conversions: number;
};

export type InteractionsSummaryReport = {
  siteId: string;
  clicks: ClickSummaryItem[];
  conversions: ConversionSummaryItem[];
};

export type ScrollDepthSummaryItem = {
  depthPercent: number;
  events: number;
};

export type ScrollDepthSummaryReport = {
  siteId: string;
  items: ScrollDepthSummaryItem[];
};

type ReportsApiErrorBody = {
  ok: false;
  error: string;
};

function messageForApiError(errorCode: string | undefined): string {
  if (errorCode === "INVALID_SITE_ID") {
    return "Invalid site id.";
  }

  if (errorCode === "REPORTING_OVERVIEW_FAILED") {
    return "Reporting failed on the server.";
  }

  if (errorCode === "REPORTING_PAGE_VIEWS_BY_PATH_FAILED") {
    return "Reporting failed on the server.";
  }

  if (errorCode === "REPORTING_INTERACTIONS_SUMMARY_FAILED") {
    return "Reporting failed on the server.";
  }

  if (errorCode === "REPORTING_SCROLL_DEPTH_SUMMARY_FAILED") {
    return "Reporting failed on the server.";
  }

  return "Failed to load report.";
}

async function fetchReport<T>(
  endpointPath: string,
  baseUrl: string,
  siteId: string,
): Promise<T> {
  const url = new URL(endpointPath, baseUrl);
  url.searchParams.set("siteId", siteId);

  let response: Response;

  try {
    response = await fetch(url.toString());
  } catch {
    throw new Error(
      "Could not reach the ingest API. Is it running at http://localhost:4000?",
    );
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response from the ingest API.");
  }

  if (!response.ok) {
    const apiError = data as ReportsApiErrorBody;
    throw new Error(messageForApiError(apiError?.error));
  }

  return data as T;
}

export function fetchOverviewReport(
  baseUrl: string,
  siteId: string,
): Promise<OverviewReport> {
  return fetchReport<OverviewReport>("/api/reports/overview", baseUrl, siteId);
}

export function fetchPageViewsByPathReport(
  baseUrl: string,
  siteId: string,
): Promise<PageViewsByPathReport> {
  return fetchReport<PageViewsByPathReport>(
    "/api/reports/page-views-by-path",
    baseUrl,
    siteId,
  );
}

export function fetchInteractionsSummaryReport(
  baseUrl: string,
  siteId: string,
): Promise<InteractionsSummaryReport> {
  return fetchReport<InteractionsSummaryReport>(
    "/api/reports/interactions-summary",
    baseUrl,
    siteId,
  );
}

export function fetchScrollDepthSummaryReport(
  baseUrl: string,
  siteId: string,
): Promise<ScrollDepthSummaryReport> {
  return fetchReport<ScrollDepthSummaryReport>(
    "/api/reports/scroll-depth-summary",
    baseUrl,
    siteId,
  );
}
