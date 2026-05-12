// ---------------------------------------------------------------------------
// Event types
// ---------------------------------------------------------------------------

export type AnalyticsEventType =
  | 'session_start'
  | 'session_end'
  | 'page_view'
  | 'click'
  | 'scroll_depth'
  | 'conversion';

// ---------------------------------------------------------------------------
// Device type
// ---------------------------------------------------------------------------

export type DeviceType = 'desktop' | 'tablet' | 'mobile' | 'unknown';

// ---------------------------------------------------------------------------
// Common base fields shared by every analytics event
// ---------------------------------------------------------------------------

export interface AnalyticsEventBase {
  event_id: string;
  event_type: AnalyticsEventType;
  site_id: string;
  session_id: string;
  timestamp: string;

  page_url: string;
  path: string;
  referrer?: string;

  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;

  viewport_width?: number;
  viewport_height?: number;
  device_type?: DeviceType;
}

// ---------------------------------------------------------------------------
// Event-specific payloads
// ---------------------------------------------------------------------------

export interface SessionStartEvent extends AnalyticsEventBase {
  event_type: 'session_start';
}

export interface SessionEndEvent extends AnalyticsEventBase {
  event_type: 'session_end';
}

export interface PageViewEvent extends AnalyticsEventBase {
  event_type: 'page_view';
}

export interface ClickEvent extends AnalyticsEventBase {
  event_type: 'click';

  element_tag: string;
  element_id?: string;
  element_classes?: string[];
  element_text_short?: string;
  selector?: string;

  x: number;
  y: number;
  normalized_x: number;
  normalized_y: number;
}

export interface ScrollDepthEvent extends AnalyticsEventBase {
  event_type: 'scroll_depth';

  depth_percent: number;
}

export interface ConversionEvent extends AnalyticsEventBase {
  event_type: 'conversion';

  conversion_name: string;
  conversion_value?: number;
}

// ---------------------------------------------------------------------------
// Discriminated union of all supported events
// ---------------------------------------------------------------------------

export type AnalyticsEventPayload =
  | SessionStartEvent
  | SessionEndEvent
  | PageViewEvent
  | ClickEvent
  | ScrollDepthEvent
  | ConversionEvent;

// ---------------------------------------------------------------------------
// Ingest API DTOs
// ---------------------------------------------------------------------------

export interface IngestEventsRequest {
  site_id: string;
  events: AnalyticsEventPayload[];
}

export interface IngestEventsResponse {
  accepted: number;
}
