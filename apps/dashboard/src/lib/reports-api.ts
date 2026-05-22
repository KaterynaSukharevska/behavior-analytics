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

  return "Failed to load overview report.";
}

export async function fetchOverviewReport(
  baseUrl: string,
  siteId: string,
): Promise<OverviewReport> {
  const url = new URL("/api/reports/overview", baseUrl);
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

  return data as OverviewReport;
}
