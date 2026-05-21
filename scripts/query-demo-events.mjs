import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Usage: node scripts/query-demo-events.mjs [eventType]
 *  Examples: click | scroll_depth | page_view | conversion
 */
const eventType = process.argv[2];

const rows = await prisma.analyticsEvent.findMany({
  where: {
    siteId: "demo-site",
    ...(eventType ? { eventType } : {}),
  },
  orderBy: { createdAt: "desc" },
  take: 10,
  select: {
    eventId: true,
    eventType: true,
    path: true,
    siteId: true,
    createdAt: true,
    payload: true,
  },
});

console.log(JSON.stringify(rows, null, 2));
await prisma.$disconnect();
