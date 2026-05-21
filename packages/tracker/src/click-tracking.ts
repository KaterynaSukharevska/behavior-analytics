import type { ClickEvent, IngestEventsRequest } from "@behavior-analytics/types";
import { requireTrackerConfig } from "./config";
import { createId } from "./create-id";
import { getDeviceType } from "./device";
import { findAnalyticsClickTarget, isClickIgnored } from "./click-privacy";
import { getOrCreateSessionId } from "./session";
import { sendIngestRequest } from "./transport";

let clickListenerAttached = false;

function buildClickEvent(
  target: HTMLElement,
  pointer: { x: number; y: number },
): ClickEvent {
  const config = requireTrackerConfig();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const normalizedX =
    viewportWidth > 0 ? Math.min(1, Math.max(0, pointer.x / viewportWidth)) : 0;
  const normalizedY =
    viewportHeight > 0
      ? Math.min(1, Math.max(0, pointer.y / viewportHeight))
      : 0;

  const event: ClickEvent = {
    event_id: createId(),
    event_type: "click",
    site_id: config.siteId,
    session_id: getOrCreateSessionId(),
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
    path: window.location.pathname,
    device_type: getDeviceType(),
    element_tag: target.tagName.toLowerCase(),
    x: pointer.x,
    y: pointer.y,
    normalized_x: normalizedX,
    normalized_y: normalizedY,
  };

  const analyticsId = target.dataset.analyticsId;
  if (analyticsId) {
    event.element_id = analyticsId;
  }

  return event;
}

async function handleDocumentClick(event: MouseEvent): Promise<void> {
  if (event.button !== 0) {
    return;
  }

  if (isClickIgnored(event.target)) {
    return;
  }

  const target = findAnalyticsClickTarget(event.target);
  if (!target) {
    return;
  }

  const config = requireTrackerConfig();
  const clickEvent = buildClickEvent(target, {
    x: event.clientX,
    y: event.clientY,
  });

  const body: IngestEventsRequest = {
    site_id: config.siteId,
    events: [clickEvent],
  };

  await sendIngestRequest(config.endpoint, body);
}

export function startClickTracking(): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  if (clickListenerAttached) {
    return;
  }

  document.addEventListener("click", (event) => {
    void handleDocumentClick(event);
  });

  clickListenerAttached = true;
}
