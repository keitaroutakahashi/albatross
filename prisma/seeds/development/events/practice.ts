import type { PrismaClient } from "../../../../src/generated/prisma/client.js";

export async function seedPractices(prisma: PrismaClient) {
  console.log("Seeding practices...");

  const season2025 = await prisma.season.findUnique({
    where: { season: 2025 },
  });
  const season2026 = await prisma.season.findUnique({
    where: { season: 2026 },
  });
  const grounds = await prisma.ground.findMany({ orderBy: { id: "asc" } });

  if (!season2025 || !season2026) {
    throw new Error("Season data not found");
  }

  const practices = [
    {
      date: new Date("2025-04-06T09:00:00"),
      status: "completed",
      seasonId: season2025.id,
      groundId: grounds[0].id,
    },
    {
      date: new Date("2026-05-10T09:00:00"),
      status: "completed",
      seasonId: season2026.id,
      groundId: grounds[1].id,
    },
    {
      date: new Date("2026-10-25T09:00:00"),
      status: "scheduled",
      seasonId: season2026.id,
      groundId: grounds[2].id,
    },
    {
      date: new Date("2026-11-15T09:00:00"),
      status: "canceled",
      seasonId: season2026.id,
      groundId: grounds[2].id,
      note: "雨天中止",
    },
  ] as const;

  for (const { groundId, ...event } of practices) {
    await prisma.event.create({
      data: {
        type: "practice",
        ...event,
        practice: { create: { groundId } },
      },
    });
  }

  console.log(`Created ${practices.length} practices`);
}
