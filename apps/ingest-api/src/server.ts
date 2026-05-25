import { buildApp } from "./app.js";

const port = Number(process.env.INGEST_API_PORT ?? 4000);
const app = buildApp();

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
