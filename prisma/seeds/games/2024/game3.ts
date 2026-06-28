import type { PrismaClient } from "../../../../src/generated/prisma/client.js";
import {
  createGameMembers,
  type PitchingResultData,
  type PlateAppearanceData,
  type SeedContext,
} from "../_shared.js";

// 試合3: 2024年 練習試合 引き分け（4-4、5イニング・各スタメン2-3打席）
export async function seedGame3(prisma: PrismaClient, ctx: SeedContext) {
  const {
    season2024,
    practiceLeague,
    grounds,
    opponents,
    starters,
    benchMembers,
    starterPositions,
  } = ctx;

  const game = await prisma.game.create({
    data: {
      date: new Date("2024-06-05T09:00:00"),
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
      teamHits: 7,
      opponentHits: 6,
      teamErrors: 1,
      opponentErrors: 1,
      result: "draw",
    },
  });

  await prisma.inning.createMany({
    data: [
      { gameId: game.id, inningNumber: 1, teamScore: 1, opponentScore: 0 },
      { gameId: game.id, inningNumber: 2, teamScore: 0, opponentScore: 2 },
      { gameId: game.id, inningNumber: 3, teamScore: 2, opponentScore: 0 },
      { gameId: game.id, inningNumber: 4, teamScore: 0, opponentScore: 1 },
      { gameId: game.id, inningNumber: 5, teamScore: 1, opponentScore: 1 },
    ],
  });

  const gameMembers = await createGameMembers(
    prisma,
    game.id,
    starters,
    benchMembers,
    starterPositions,
  );

  // PlateAppearance（5イニング、各スタメン2-3打席）
  const plateAppearances: PlateAppearanceData[] = [
    // 1番 田中太郎（中）: 左安(1), 中飛, 右安
    {
      gameMemberId: gameMembers[0].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "single",
      direction: "left",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[0].id,
      inningNumber: 3,
      atBatInGame: 2,
      result: "flyOut",
      direction: "center",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[0].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "single",
      direction: "right",
      rbi: 0,
    },
    // 2番 山田花子（遊）: 四球, 遊ゴロ, 左安
    {
      gameMemberId: gameMembers[1].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "walk",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[1].id,
      inningNumber: 3,
      atBatInGame: 2,
      result: "groundOut",
      direction: "shortstop",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[1].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "single",
      direction: "left",
      rbi: 0,
    },
    // 3番 佐藤一郎（一）: 右二(1), 三振, 中本(1)
    {
      gameMemberId: gameMembers[2].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "double",
      direction: "right",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[2].id,
      inningNumber: 3,
      atBatInGame: 2,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[2].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "homeRun",
      direction: "center",
      rbi: 1,
    },
    // 4番 鈴木雪（三）: 中飛, 左安(1), 三振
    {
      gameMemberId: gameMembers[3].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "flyOut",
      direction: "center",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[3].id,
      inningNumber: 3,
      atBatInGame: 2,
      result: "single",
      direction: "left",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[3].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    // 5番 高橋健（左）: 三振, 投ゴロ
    {
      gameMemberId: gameMembers[4].id,
      inningNumber: 2,
      atBatInGame: 1,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[4].id,
      inningNumber: 4,
      atBatInGame: 2,
      result: "groundOut",
      direction: "pitcher",
      rbi: 0,
    },
    // 6番 伊藤誠（右）: 右飛, 死球
    {
      gameMemberId: gameMembers[5].id,
      inningNumber: 2,
      atBatInGame: 1,
      result: "flyOut",
      direction: "right",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[5].id,
      inningNumber: 4,
      atBatInGame: 2,
      result: "hitByPitch",
      direction: null,
      rbi: 0,
    },
    // 7番 渡辺大輔（二）: 遊ゴロ, 中安
    {
      gameMemberId: gameMembers[6].id,
      inningNumber: 2,
      atBatInGame: 1,
      result: "groundOut",
      direction: "shortstop",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[6].id,
      inningNumber: 4,
      atBatInGame: 2,
      result: "single",
      direction: "center",
      rbi: 0,
    },
    // 8番 中村翔（捕）: 三振, 犠打
    {
      gameMemberId: gameMembers[7].id,
      inningNumber: 3,
      atBatInGame: 1,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[7].id,
      inningNumber: 5,
      atBatInGame: 2,
      result: "sacrificeHit",
      direction: "pitcher",
      rbi: 0,
    },
    // 9番 小林勇気（投）: 投ゴロ, 三振
    {
      gameMemberId: gameMembers[8].id,
      inningNumber: 3,
      atBatInGame: 1,
      result: "groundOut",
      direction: "pitcher",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[8].id,
      inningNumber: 5,
      atBatInGame: 2,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
  ];
  await prisma.plateAppearance.createMany({ data: plateAppearances });

  // PitchingResult: 小林勇気（4 1/3回、4-4 引き分け）
  const pitchingResults: PitchingResultData[] = [
    {
      gameMemberId: gameMembers[8].id, // 小林勇気（投手、打順9番）
      pitchingOrder: 1,
      inningsPitched: 4,
      partialOuts: 1,
      earnedRuns: 3,
      runs: 4,
      strikeouts: 4,
      walks: 2,
      hitByPitches: 1,
      hitsAllowed: 7,
      homeRunsAllowed: 0,
      decision: null, // 引き分けのため勝敗なし
    },
  ];
  await prisma.pitchingResult.createMany({ data: pitchingResults });

  // 盗塁を設定
  await prisma.gameMember.update({
    where: { id: gameMembers[0].id },
    data: { stolenBases: 1 },
  });
  await prisma.gameMember.update({
    where: { id: gameMembers[1].id },
    data: { stolenBases: 1 },
  });

  // 天候: 2024-06-05（6月の雨の日）
  await prisma.gameWeather.create({
    data: { gameId: game.id, weather: "rainy", temperature: 19.5 },
  });

  return game;
}
