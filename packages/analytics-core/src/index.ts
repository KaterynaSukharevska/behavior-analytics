import { z } from 'zod';

// ---------------------------------------------------------------------------
// Event type enum
// ---------------------------------------------------------------------------

export const AnalyticsEventTypeSchema = z.enum([
  'session_start',
  'session_end',
  'page_view',
  'click',
  'scroll_depth',
  'conversion',
]);

// ---------------------------------------------------------------------------
// Device type enum
// ---------------------------------------------------------------------------

export const DeviceTypeSchema = z.enum([
  'desktop',
  'tablet',
  'mobile',
  'unknown',
]);

// ---------------------------------------------------------------------------
// Common base fields shared by every analytics event
// ---------------------------------------------------------------------------

export const AnalyticsEventBaseSchema = z.object({
  event_id: z.string().min(1),
  event_type: AnalyticsEventTypeSchema,
  site_id: z.string().min(1),
  session_id: z.string().min(1),
  timestamp: z.string(),

  page_url: z.string(),
  path: z.string(),
  referrer: z.string().optional(),

  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),

  viewport_width: z.number().optional(),
  viewport_height: z.number().optional(),
  device_type: DeviceTypeSchema.optional(),
});

// ---------------------------------------------------------------------------
// Event-specific schemas
// ---------------------------------------------------------------------------

export const SessionStartEventSchema = AnalyticsEventBaseSchema.extend({
  event_type: z.literal('session_start'),
});

export const SessionEndEventSchema = AnalyticsEventBaseSchema.extend({
  event_type: z.literal('session_end'),
});

export const PageViewEventSchema = AnalyticsEventBaseSchema.extend({
  event_type: z.literal('page_view'),
});

export const ClickEventSchema = AnalyticsEventBaseSchema.extend({
  event_type: z.literal('click'),

  element_tag: z.string().min(1),
  element_id: z.string().optional(),
  element_classes: z.array(z.string()).optional(),
  element_text_short: z.string().optional(),
  selector: z.string().optional(),

  x: z.number(),
  y: z.number(),
  normalized_x: z.number(),
  normalized_y: z.number(),
});

export const ScrollDepthEventSchema = AnalyticsEventBaseSchema.extend({
  event_type: z.literal('scroll_depth'),

  depth_percent: z.number().min(0).max(100),
});

export const ConversionEventSchema = AnalyticsEventBaseSchema.extend({
  event_type: z.literal('conversion'),

  conversion_name: z.string().min(1),
  conversion_value: z.number().optional(),
});

// ---------------------------------------------------------------------------
// Discriminated union of all supported events
// ---------------------------------------------------------------------------

export const AnalyticsEventPayloadSchema = z.discriminatedUnion('event_type', [
  SessionStartEventSchema,
  SessionEndEventSchema,
  PageViewEventSchema,
  ClickEventSchema,
  ScrollDepthEventSchema,
  ConversionEventSchema,
]);

// ---------------------------------------------------------------------------
// Ingest API DTOs
// ---------------------------------------------------------------------------

export const IngestEventsRequestSchema = z.object({
  site_id: z.string().min(1),
  events: z.array(AnalyticsEventPayloadSchema).min(1),
});

export const IngestEventsResponseSchema = z.object({
  ok: z.boolean(),
  accepted: z.number(),
});
