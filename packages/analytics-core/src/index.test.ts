import { describe, expect, it } from 'vitest';
import {
  AnalyticsEventPayloadSchema,
  ConversionEventSchema,
  IngestEventsRequestSchema,
  PageViewEventSchema,
  ClickEventSchema,
} from './index.js';

const baseFields = {
  event_id: 'evt_1',
  site_id: 'site_1',
  session_id: 'sess_1',
  timestamp: '2026-01-01T12:00:00.000Z',
  page_url: 'https://example.com/pricing',
  path: '/pricing',
};

describe('analytics-core schemas', () => {
  it('valid page_view event passes', () => {
    const event = { ...baseFields, event_type: 'page_view' as const };
    const result = PageViewEventSchema.safeParse(event);
    expect(result.success).toBe(true);
  });

  it('valid click event passes', () => {
    const event = {
      ...baseFields,
      event_type: 'click' as const,
      element_tag: 'button',
      x: 10,
      y: 20,
      normalized_x: 0.5,
      normalized_y: 0.25,
    };
    const result = ClickEventSchema.safeParse(event);
    expect(result.success).toBe(true);
  });

  it('valid ingest request with one event passes', () => {
    const req = {
      site_id: 'site_1',
      events: [{ ...baseFields, event_type: 'page_view' as const }],
    };
    const result = IngestEventsRequestSchema.safeParse(req);
    expect(result.success).toBe(true);
  });

  it('empty events array fails', () => {
    const result = IngestEventsRequestSchema.safeParse({
      site_id: 'site_1',
      events: [],
    });
    expect(result.success).toBe(false);
  });

  it('invalid event_type fails', () => {
    const result = AnalyticsEventPayloadSchema.safeParse({
      ...baseFields,
      event_type: 'not_a_real_type',
    });
    expect(result.success).toBe(false);
  });

  it('scroll_depth above 100 fails', () => {
    const result = AnalyticsEventPayloadSchema.safeParse({
      ...baseFields,
      event_type: 'scroll_depth',
      depth_percent: 101,
    });
    expect(result.success).toBe(false);
  });

  it('scroll_depth below 0 fails', () => {
    const result = AnalyticsEventPayloadSchema.safeParse({
      ...baseFields,
      event_type: 'scroll_depth',
      depth_percent: -1,
    });
    expect(result.success).toBe(false);
  });

  it('conversion with conversion_name passes', () => {
    const result = ConversionEventSchema.safeParse({
      ...baseFields,
      event_type: 'conversion',
      conversion_name: 'signup',
    });
    expect(result.success).toBe(true);
  });

  it('conversion with empty conversion_name fails', () => {
    const result = ConversionEventSchema.safeParse({
      ...baseFields,
      event_type: 'conversion',
      conversion_name: '',
    });
    expect(result.success).toBe(false);
  });
});
