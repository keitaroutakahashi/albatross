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
      gameMembers: {
        include: {
          member: true,
          plateAppearances: { orderBy: { atBatInGame: "asc" } },
        },
        orderBy: { battingOrder: "asc" },
      },
    },
    orderBy: { date: "desc" },
  });

  return games;
};

export const getGame = async (id: number) => {
  const games = await prisma.game.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      league: true,
      opponent: true,
      ground: true,
      innings: {
        orderBy: { inningNumber: "asc" },
      },
      gameMembers: {
        include: {
          member: true,
          plateAppearances: { orderBy: { atBatInGame: "asc" } },
        },
        orderBy: { battingOrder: "asc" },
      },
    },
    orderBy: { date: "desc" },
  });

  return games;
};
