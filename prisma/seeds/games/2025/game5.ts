import type { PrismaClient } from "../../../../src/generated/prisma/client.js";
import type { SeedContext } from "../_shared.js";

// 試合5: 2025年 公式戦（雨天中止）
export async function seedGame5(prisma: PrismaClient, ctx: SeedContext) {
  const { season2025, tokyoLeague, grounds, opponents } = ctx;

  const game = await prisma.game.create({
    data: {
      date: new Date("2025-03-16T10:00:00"),
      gameNumber: 1,
      gameType: "official",
      isFirstBatting: false,
      status: "canceled",
      seasonId: season2025.id,
      leagueId: tokyoLeague.id,
      groundId: grounds[0].id,
      opponentId: opponents[4].id,
      teamScore: 0,
      opponentScore: 0,
      result: null,
      note: "雨天中止",
    },
  });

  // 天候: 2025-03-16（雨天中止）
  await prisma.gameWeather.create({
    data: { gameId: game.id, weather: "rainy", temperature: 8.0 },
  });

  return game;
}
