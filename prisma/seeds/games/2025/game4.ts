import type { PrismaClient } from "../../../../src/generated/prisma/client.js";
import type { SeedContext } from "../_shared.js";

// 試合4: 2025年 公式戦（予定）
export async function seedGame4(prisma: PrismaClient, ctx: SeedContext) {
  const { season2025, sundayLeague, grounds, opponents } = ctx;

  const game = await prisma.game.create({
    data: {
      date: new Date("2025-04-13T10:00:00"),
      gameNumber: 1,
      gameType: "official",
      isFirstBatting: true,
      status: "scheduled",
      seasonId: season2025.id,
      leagueId: sundayLeague.id,
      groundId: grounds[3].id,
      opponentId: opponents[3].id,
      teamScore: 0,
      opponentScore: 0,
      result: null,
    },
  });

  // 予定試合のため天候・打席データなし

  return game;
}
