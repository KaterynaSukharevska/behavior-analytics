import Fastify, {
  type FastifyError,
  type FastifyServerOptions,
} from "fastify";
import cors from "@fastify/cors";
import { IngestEventsRequestSchema } from "@behavior-analytics/analytics-core";
import { disconnectPrisma } from "./db/prisma.js";
import { getOverviewTotals } from "./db/get-overview-totals.js";
import { getInteractionsSummary } from "./db/get-interactions-summary.js";
import { getPageViewsByPath } from "./db/get-page-views-by-path.js";
import { getScrollDepthSummary } from "./db/get-scroll-depth-summary.js";
import { saveAnalyticsEvents } from "./db/save-analytics-events.js";

function parseSiteIdQuery(query: unknown): string | null {
  const raw = (query as { siteId?: unknown })?.siteId;

  if (typeof raw !== "string") {
    return null;
  }

  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Fastify default bodyLimit is 1 MiB (1_048_576). Tighter limit for analytics ingest. */
const INGEST_BODY_LIMIT_BYTES = 256 * 1024;

type BuildAppOptions = {
  logger?: FastifyServerOptions["logger"];
};

export function buildApp(options: BuildAppOptions = {}) {
  const app = Fastify({
    logger: options.logger ?? true,
    bodyLimit: INGEST_BODY_LIMIT_BYTES,
  });

  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (error.code === "FST_ERR_CTP_BODY_TOO_LARGE") {
      return reply.status(413).send({
        ok: false,
        error: "PAYLOAD_TOO_LARGE",
      });
    }

    return reply.send(error);
  });

  app.addHook("onClose", async () => {
    await disconnectPrisma();
  });

  void app.register(cors, {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "OPTIONS"],
  });

  app.get("/api/health", async () => {
    return {
      ok: true,
      service: "ingest-api",
    };
  });

  app.get("/api/reports/overview", async (request, reply) => {
    const siteId = parseSiteIdQuery(request.query);

    if (!siteId) {
      return reply.status(400).send({
        ok: false,
        error: "INVALID_SITE_ID",
      });
    }

    try {
      const totals = await getOverviewTotals(siteId);

      return {
        siteId,
        totals,
      };
    } catch (error) {
      request.log.error({ err: error }, "Failed to load reporting overview");

      return reply.status(500).send({
        ok: false,
        error: "REPORTING_OVERVIEW_FAILED",
      });
    }
  });

  app.get("/api/reports/page-views-by-path", async (request, reply) => {
    const siteId = parseSiteIdQuery(request.query);

    if (!siteId) {
      return reply.status(400).send({
        ok: false,
        error: "INVALID_SITE_ID",
      });
    }

    try {
      const items = await getPageViewsByPath(siteId);

      return {
        siteId,
        items,
      };
    } catch (error) {
      request.log.error({ err: error }, "Failed to load page views by path");

      return reply.status(500).send({
        ok: false,
        error: "REPORTING_PAGE_VIEWS_BY_PATH_FAILED",
      });
    }
  });

  app.get("/api/reports/interactions-summary", async (request, reply) => {
    const siteId = parseSiteIdQuery(request.query);

    if (!siteId) {
      return reply.status(400).send({
        ok: false,
        error: "INVALID_SITE_ID",
      });
    }

    try {
      const summary = await getInteractionsSummary(siteId);

      return {
        siteId,
        clicks: summary.clicks,
        conversions: summary.conversions,
      };
    } catch (error) {
      request.log.error({ err: error }, "Failed to load interactions summary");

      return reply.status(500).send({
        ok: false,
        error: "REPORTING_INTERACTIONS_SUMMARY_FAILED",
      });
    }
  });

  app.get("/api/reports/scroll-depth-summary", async (request, reply) => {
    const siteId = parseSiteIdQuery(request.query);

    if (!siteId) {
      return reply.status(400).send({
        ok: false,
        error: "INVALID_SITE_ID",
      });
    }

    try {
      const items = await getScrollDepthSummary(siteId);

      return {
        siteId,
        items,
      };
    } catch (error) {
      request.log.error({ err: error }, "Failed to load scroll depth summary");

      return reply.status(500).send({
        ok: false,
        error: "REPORTING_SCROLL_DEPTH_SUMMARY_FAILED",
      });
    }
  });

  app.post("/api/events", async (request, reply) => {
    const parsed = IngestEventsRequestSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        ok: false,
        error: "INVALID_ANALYTICS_PAYLOAD",
      });
    }

    try {
      const accepted = await saveAnalyticsEvents(parsed.data.events);

      return {
        ok: true,
        accepted,
      };
    } catch (error) {
      request.log.error({ err: error }, "Failed to persist analytics events");

      return reply.status(500).send({
        ok: false,
        error: "EVENT_PERSISTENCE_FAILED",
      });
    }
  });

  return app;
}
