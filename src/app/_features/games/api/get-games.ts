import { addMonth } from "@formkit/tempo";
import prisma from "@/lib/prisma";

// Game 一覧を取得
export type GamesResult = Awaited<ReturnType<typeof getGames>>;
export type GameWithRelations = GamesResult[number];

export const getGames = async (season: string | number) => {
  const games = await prisma.game.findMany({
    where: {
      event: { season: { season: Number(season) } },
    },
    include: {
      event: true,
      league: true,
      opponent: true,
      ground: true,
    },
    orderBy: { event: { date: "desc" } },
  });

  return games;
};

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

export const getGame = async (id: number) => {
  const games = await prisma.game.findFirst({
    where: {
      id: Number(id),
    },
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
    },
  });

  return games;
};
