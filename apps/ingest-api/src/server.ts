import Fastify from "fastify";
import cors from "@fastify/cors";
import { IngestEventsRequestSchema } from "@behavior-analytics/analytics-core";

const port = Number(process.env.INGEST_API_PORT ?? 4000);

const app = Fastify({
  logger: true,
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

  return {
    ok: true,
    accepted: parsed.data.events.length,
  };
});

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
