import type { GameData } from "@/app/(public)/games/_dummy/data";
import prisma from "@/lib/prisma";

// Game 一覧を取得
export const getGames = async (): Promise<GameData[]> => {
  const games = await prisma.game.findMany({
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

  return games.map((game) => ({
    id: game.id,
    gameDate: game.date.toISOString().split("T")[0],
    leagueName: game.league.name,
    opposingTeam: game.opponent.name,
    venue: game.ground?.name ?? "",
    teamScore: game.teamScore,
    opposingTeamScore: game.opponentScore,
    result: game.result ?? "draw",
    pitcher: "", // TODO: 投手情報は別テーブルから取得する必要あり
    isHome: game.isFirstBatting,
    innings: game.innings.map((inning) => ({
      inning: inning.inningNumber,
      ourScore: inning.teamScore,
      opponentScore: inning.opponentScore,
    })),
    note: game.note ?? undefined,
  }));
};
