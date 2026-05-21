import type { IngestEventsRequest, ScrollDepthEvent } from "@behavior-analytics/types";
import { requireTrackerConfig } from "./config";
import { createId } from "./create-id";
import { getDeviceType } from "./device";
import { getOrCreateSessionId } from "./session";
import { sendIngestRequest } from "./transport";

const SCROLL_MILESTONES = [25, 50, 75, 100] as const;
const SCROLL_THROTTLE_MS = 200;

type ScrollMilestone = (typeof SCROLL_MILESTONES)[number];

let scrollListenerAttached = false;
let currentPath = "";
let sentMilestones = new Set<ScrollMilestone>();
let scrollThrottleTimer: ReturnType<typeof setTimeout> | null = null;

function resetMilestonesForPath(path: string): void {
  currentPath = path;
  sentMilestones = new Set();
}

function getScrollDepthPercent(): number {
  const doc = document.documentElement;
  const scrollTop = window.scrollY ?? doc.scrollTop;
  const scrollHeight = doc.scrollHeight;
  const clientHeight = doc.clientHeight;
  const maxScroll = scrollHeight - clientHeight;

  if (maxScroll <= 0) {
    return 100;
  }

  const percent = Math.round((scrollTop / maxScroll) * 100);
  return Math.min(100, Math.max(0, percent));
}

function getNewMilestones(depthPercent: number): ScrollMilestone[] {
  return SCROLL_MILESTONES.filter(
    (milestone) => depthPercent >= milestone && !sentMilestones.has(milestone),
  );
}

function buildScrollDepthEvent(depthPercent: ScrollMilestone): ScrollDepthEvent {
  const config = requireTrackerConfig();

  return {
    event_id: createId(),
    event_type: "scroll_depth",
    site_id: config.siteId,
    session_id: getOrCreateSessionId(),
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
    path: window.location.pathname,
    device_type: getDeviceType(),
    depth_percent: depthPercent,
  };
}

async function sendScrollMilestone(milestone: ScrollMilestone): Promise<void> {
  sentMilestones.add(milestone);

  const config = requireTrackerConfig();
  const event = buildScrollDepthEvent(milestone);

  const body: IngestEventsRequest = {
    site_id: config.siteId,
    events: [event],
  };

  await sendIngestRequest(config.endpoint, body);
}

function processScrollDepth(): void {
  const path = window.location.pathname;

  if (path !== currentPath) {
    resetMilestonesForPath(path);
  }

  const depthPercent = getScrollDepthPercent();
  const milestones = getNewMilestones(depthPercent);

  for (const milestone of milestones) {
    void sendScrollMilestone(milestone);
  }
}

function scheduleScrollProcessing(): void {
  if (scrollThrottleTimer !== null) {
    return;
  }

  scrollThrottleTimer = setTimeout(() => {
    scrollThrottleTimer = null;
    processScrollDepth();
  }, SCROLL_THROTTLE_MS);
}

export function startScrollTracking(): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  if (scrollListenerAttached) {
    return;
  }

  resetMilestonesForPath(window.location.pathname);

  window.addEventListener("scroll", scheduleScrollProcessing, { passive: true });
  scrollListenerAttached = true;

  processScrollDepth();
}
