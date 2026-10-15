import { addMonth } from "@formkit/tempo";
import type { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export type GameWithRelations = Prisma.GameGetPayload<{
  include: { event: true; league: true; opponent: true; ground: true };
}>;

// 次に開催される試合を 1 件取得（無ければ null）
export const getUpcomingGame = async () => {
  return prisma.game.findFirst({
    where: {
      event: { status: "scheduled", date: { gte: new Date() } },
    },
    include: {
      event: true,
      league: true,
      opponent: true,
      ground: true,
    },
    orderBy: [{ event: { date: "asc" } }, { gameNumber: "asc" }],
  });
};

// 直近 1 ヶ月以内に終了した試合を 1 件取得（無ければ null）
export const getLatestCompletedGame = async () => {
  const now = new Date();

  return prisma.game.findFirst({
    where: {
      event: {
        status: "completed",
        date: { gte: addMonth(now, -1), lte: now },
      },
    },
    include: {
      event: true,
      league: true,
      opponent: true,
      ground: true,
    },
    orderBy: [{ event: { date: "desc" } }, { gameNumber: "desc" }],
  });
};

// Game 詳細を取得
export type GameDetail = NonNullable<Awaited<ReturnType<typeof getGame>>>;

export const getGame = async (eventId: number) => {
  const games = await prisma.game.findUnique({
    where: { eventId },
    include: {
      event: true,
      league: true,
      opponent: true,
      ground: true,
      gameWeather: true,
      innings: {
        orderBy: { inningNumber: "asc" },
      },
      gameMembers: {
        include: {
          member: true,
          plateAppearances: { orderBy: { atBatInGame: "asc" } },
          pitchingResult: true,
        },
        orderBy: { battingOrder: "asc" },
      },
      // MVP は参加メンバーに付くため、オーダーとは別に、表示順で取得する
      mvps: {
        include: { participant: { include: { member: true } } },
        orderBy: { order: "asc" },
      },
    },
  });

  return games;
};
