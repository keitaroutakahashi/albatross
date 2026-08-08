import { addMonth } from "@formkit/tempo";
import prisma from "@/lib/prisma";

// Game 一覧を取得
export type GamesResult = Awaited<ReturnType<typeof getGames>>;
export type GameWithRelations = GamesResult[number];

export const getGames = async (season: string | number) => {
  const games = await prisma.game.findMany({
    where: {
      season: { season: Number(season) },
    },
    include: {
      league: true,
      opponent: true,
      ground: true,
    },
    orderBy: { date: "desc" },
  });

  return games;
};

// 次に開催される試合を 1 件取得（無ければ null）
export const getUpcomingGame = async () => {
  return prisma.game.findFirst({
    where: {
      status: "scheduled",
      date: { gte: new Date() },
    },
    include: {
      league: true,
      opponent: true,
      ground: true,
    },
    orderBy: [{ date: "asc" }, { gameNumber: "asc" }],
  });
};

// 今後開催される試合を開催日が近い順に取得
export const getUpcomingGames = async (limit: number) => {
  return prisma.game.findMany({
    where: {
      status: "scheduled",
      date: { gte: new Date() },
    },
    include: {
      league: true,
      opponent: true,
      ground: true,
    },
    orderBy: [{ date: "asc" }, { gameNumber: "asc" }],
    take: limit,
  });
};

// 直近 1 ヶ月以内に終了した試合を 1 件取得（無ければ null）
export const getLatestCompletedGame = async () => {
  const now = new Date();

  return prisma.game.findFirst({
    where: {
      status: "completed",
      date: { gte: addMonth(now, -1), lte: now },
    },
    include: {
      league: true,
      opponent: true,
      ground: true,
    },
    orderBy: [{ date: "desc" }, { gameNumber: "desc" }],
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
    orderBy: { date: "desc" },
  });

  return games;
};
