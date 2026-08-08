import type {
  Prisma,
  PrismaClient,
} from "../../../../src/generated/prisma/client.js";
import type { SeedContext } from "../_shared.js";

// 試合4: 2026年 開催予定の試合（5件）
export async function seedGameScheduled(
  prisma: PrismaClient,
  ctx: SeedContext,
) {
  const {
    season2026,
    tokyoLeague,
    sundayLeague,
    practiceLeague,
    grounds,
    opponents,
  } = ctx;

  const games: Prisma.GameCreateManyInput[] = [
    {
      date: new Date("2026-08-22T10:00:00"),
      gameNumber: 1,
      gameType: "official",
      status: "scheduled",
      seasonId: season2026.id,
      leagueId: tokyoLeague.id,
      groundId: grounds[1].id,
      opponentId: opponents[0].id,
    },
    {
      date: new Date("2026-09-13T13:00:00"),
      gameNumber: 1,
      gameType: "official",
      status: "scheduled",
      seasonId: season2026.id,
      leagueId: sundayLeague.id,
      groundId: grounds[2].id,
      opponentId: opponents[1].id,
    },
    {
      date: new Date("2026-10-04T09:30:00"),
      gameNumber: 1,
      gameType: "practice",
      status: "scheduled",
      seasonId: season2026.id,
      leagueId: practiceLeague.id,
      groundId: grounds[3].id,
      opponentId: opponents[4].id,
    },
    {
      date: new Date("2026-11-08T11:00:00"),
      gameNumber: 1,
      gameType: "official",
      status: "scheduled",
      seasonId: season2026.id,
      leagueId: tokyoLeague.id,
      groundId: grounds[0].id,
      opponentId: opponents[3].id,
    },
    // リーグ・対戦相手が未定の試合
    {
      date: new Date("2026-12-13T10:00:00"),
      gameNumber: 1,
      gameType: "undecided",
      status: "scheduled",
      seasonId: season2026.id,
      groundId: grounds[0].id,
    },
  ];

  // 予定試合のため天候・打席データなし

  return prisma.game.createManyAndReturn({ data: games });
}
