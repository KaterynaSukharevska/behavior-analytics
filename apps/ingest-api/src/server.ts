import Fastify from "fastify";
import cors from "@fastify/cors";

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
