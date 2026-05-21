import type { IngestEventsRequest } from "@behavior-analytics/types";

export async function sendIngestRequest(
  endpoint: string,
  body: IngestEventsRequest,
): Promise<void> {
  await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "omit",
  });
}
