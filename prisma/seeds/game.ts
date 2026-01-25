import type { PrismaClient } from "../../src/generated/prisma/client.js";

export async function seedGames(prisma: PrismaClient) {
  console.log("Seeding games...");

  // マスタデータを取得
  const season2024 = await prisma.season.findUnique({ where: { year: 2024 } });
  const season2025 = await prisma.season.findUnique({ where: { year: 2025 } });
  const leagues = await prisma.league.findMany();
  const grounds = await prisma.ground.findMany();
  const opponents = await prisma.opponent.findMany();

  if (!season2024 || !season2025) {
    throw new Error("Season data not found");
  }

  const tokyoLeague = leagues.find((l) => l.name === "東京草野球リーグ");
  const sundayLeague = leagues.find((l) => l.name === "日曜リーグ");
  const practiceLeague = leagues.find((l) => l.name === "練習試合");

  if (!tokyoLeague || !sundayLeague || !practiceLeague) {
    throw new Error("League data not found");
  }

  // 試合1: 2024年 公式戦 勝利
  const game1 = await prisma.game.create({
    data: {
      date: new Date("2024-04-14T10:00:00"),
      gameNumber: 1,
      gameType: "official",
      isFirstBatting: true,
      status: "completed",
      seasonId: season2024.id,
      leagueId: tokyoLeague.id,
      groundId: grounds[0].id,
      opponentId: opponents[0].id,
      teamScore: 7,
      opponentScore: 3,
      result: "win",
    },
  });

  // 試合1のイニング
  await prisma.inning.createMany({
    data: [
      { gameId: game1.id, inningNumber: 1, teamScore: 2, opponentScore: 0 },
      { gameId: game1.id, inningNumber: 2, teamScore: 0, opponentScore: 1 },
      { gameId: game1.id, inningNumber: 3, teamScore: 1, opponentScore: 0 },
      { gameId: game1.id, inningNumber: 4, teamScore: 0, opponentScore: 2 },
      { gameId: game1.id, inningNumber: 5, teamScore: 3, opponentScore: 0 },
      { gameId: game1.id, inningNumber: 6, teamScore: 1, opponentScore: 0 },
      { gameId: game1.id, inningNumber: 7, teamScore: 0, opponentScore: 0 },
    ],
  });

  // 試合2: 2024年 公式戦 敗北
  const game2 = await prisma.game.create({
    data: {
      date: new Date("2024-05-12T13:00:00"),
      gameNumber: 1,
      gameType: "official",
      isFirstBatting: false,
      status: "completed",
      seasonId: season2024.id,
      leagueId: tokyoLeague.id,
      groundId: grounds[1].id,
      opponentId: opponents[1].id,
      teamScore: 2,
      opponentScore: 5,
      result: "lose",
    },
  });

  await prisma.inning.createMany({
    data: [
      { gameId: game2.id, inningNumber: 1, teamScore: 0, opponentScore: 2 },
      { gameId: game2.id, inningNumber: 2, teamScore: 1, opponentScore: 0 },
      { gameId: game2.id, inningNumber: 3, teamScore: 0, opponentScore: 1 },
      { gameId: game2.id, inningNumber: 4, teamScore: 0, opponentScore: 0 },
      { gameId: game2.id, inningNumber: 5, teamScore: 1, opponentScore: 2 },
      { gameId: game2.id, inningNumber: 6, teamScore: 0, opponentScore: 0 },
      { gameId: game2.id, inningNumber: 7, teamScore: 0, opponentScore: 0 },
    ],
  });

  // 試合3: 2024年 練習試合 引き分け
  const game3 = await prisma.game.create({
    data: {
      date: new Date("2024-06-09T09:00:00"),
      gameNumber: 1,
      gameType: "practice",
      isFirstBatting: true,
      status: "completed",
      seasonId: season2024.id,
      leagueId: practiceLeague.id,
      groundId: grounds[2].id,
      opponentId: opponents[2].id,
      teamScore: 4,
      opponentScore: 4,
      result: "draw",
    },
  });

  await prisma.inning.createMany({
    data: [
      { gameId: game3.id, inningNumber: 1, teamScore: 1, opponentScore: 0 },
      { gameId: game3.id, inningNumber: 2, teamScore: 0, opponentScore: 2 },
      { gameId: game3.id, inningNumber: 3, teamScore: 2, opponentScore: 0 },
      { gameId: game3.id, inningNumber: 4, teamScore: 0, opponentScore: 1 },
      { gameId: game3.id, inningNumber: 5, teamScore: 1, opponentScore: 1 },
    ],
  });

  // 試合4: 2025年 公式戦（予定）
  await prisma.game.create({
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

  // 試合5: 2025年 公式戦（中止）
  await prisma.game.create({
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

  console.log("Created 5 games with innings");
}
