import type { PrismaClient } from "../../../../../src/generated/prisma/client.js";
import { createGameEvent, type SeedContext } from "../_shared.js";

// 試合5: 2025年 公式戦（雨天中止）
export async function seedGameCanceled(prisma: PrismaClient, ctx: SeedContext) {
  const { season2025, tokyoLeague, grounds, opponents } = ctx;

  const event = await createGameEvent(prisma, {
    date: new Date("2025-03-16T10:00:00"),
    status: "canceled",
    seasonId: season2025.id,
    cancelReason: "雨天中止",
  });

  const game = await prisma.game.create({
    data: {
      eventId: event.id,
      gameNumber: 1,
      gameType: "official",
      leagueId: tokyoLeague.id,
      groundId: grounds[0].id,
      opponentId: opponents[4].id,
    },
  });

  return game;
}
