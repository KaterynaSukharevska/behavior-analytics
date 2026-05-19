import Fastify, { type FastifyError } from "fastify";
import cors from "@fastify/cors";
import { IngestEventsRequestSchema } from "@behavior-analytics/analytics-core";
import { disconnectPrisma } from "./db/prisma.js";
import { saveAnalyticsEvents } from "./db/save-analytics-events.js";

const port = Number(process.env.INGEST_API_PORT ?? 4000);

/** Fastify default bodyLimit is 1 MiB (1_048_576). Tighter limit for analytics ingest. */
const INGEST_BODY_LIMIT_BYTES = 256 * 1024;

const app = Fastify({
  logger: true,
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

await app.register(cors, {
  origin: ["http://localhost:3000", "http://localhost:3001"],
  methods: ["GET", "POST", "OPTIONS"],
});

app.get("/api/health", async () => {
  return {
    ok: true,
    service: "ingest-api",
  };
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

const shutdown = async (signal: string): Promise<void> => {
  app.log.info({ signal }, "Shutting down ingest-api");

  try {
    await app.close();
    process.exit(0);
  } catch (error) {
    app.log.error({ err: error }, "Failed to shut down ingest-api");
    process.exit(1);
  }
};

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    void shutdown(signal);
  });
}

const start = async (): Promise<void> => {
  try {
    await app.listen({
      port,
      host: "0.0.0.0",
    });
  } catch (error) {
    app.log.error(error, "Failed to start ingest-api");
    process.exit(1);
  }
};

await start();
