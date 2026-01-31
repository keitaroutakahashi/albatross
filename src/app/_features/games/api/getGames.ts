import prisma from "@/lib/prisma";

// Game 一覧を取得（リレーション込み）
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
      innings: {
        orderBy: { inningNumber: "asc" },
      },
    },
    orderBy: { date: "desc" },
  });

  return games;
};
