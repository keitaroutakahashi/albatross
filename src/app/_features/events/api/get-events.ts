import prisma from "@/lib/prisma";

export type UpcomingEvent = Awaited<
  ReturnType<typeof getUpcomingEvents>
>[number];

// 今後開催されるイベント（試合・練習）を開催日が近い順に取得
export const getUpcomingEvents = async (limit: number) => {
  return prisma.event.findMany({
    where: {
      status: "scheduled",
      date: { gte: new Date() },
    },
    include: {
      game: {
        include: {
          league: true,
          opponent: true,
          ground: true,
        },
      },
      practice: {
        include: { ground: true },
      },
    },
    orderBy: { date: "asc" },
    take: limit,
  });
};
