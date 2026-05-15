-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "raw_events" (
    "id" TEXT NOT NULL,
    "site_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raw_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "raw_events_site_id_idx" ON "raw_events"("site_id");

-- CreateIndex
CREATE INDEX "raw_events_session_id_idx" ON "raw_events"("session_id");

-- CreateIndex
CREATE INDEX "raw_events_event_type_idx" ON "raw_events"("event_type");
