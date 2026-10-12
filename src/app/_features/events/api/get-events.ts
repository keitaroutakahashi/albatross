import type { Prisma } from "@/generated/prisma/client";
import type { EventType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

const eventInclude = {
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
} satisfies Prisma.EventInclude;

// Event 一覧（試合・練習）を取得。type 指定時はその種別のみに絞り込む
export type EventWithRelations = Awaited<ReturnType<typeof getEvents>>[number];

export const getEvents = async ({
  season,
  type,
}: {
  season: string | number;
  type?: EventType;
}) => {
  return prisma.event.findMany({
    where: {
      season: { season: Number(season) },
      type,
    },
    include: eventInclude,
    orderBy: { date: "desc" },
  });
};

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
    include: eventInclude,
    orderBy: { date: "asc" },
    take: limit,
  });
};
