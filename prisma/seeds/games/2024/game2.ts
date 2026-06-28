import type { PrismaClient } from "../../../../src/generated/prisma/client.js";
import {
  createGameMembers,
  type PitchingResultData,
  type PlateAppearanceData,
  type SeedContext,
} from "../_shared.js";

// 試合2: 2024年 公式戦 敗北（2-5、各スタメン3打席・9番のみ2打席）
export async function seedGame2(prisma: PrismaClient, ctx: SeedContext) {
  const {
    season2024,
    tokyoLeague,
    grounds,
    opponents,
    starters,
    benchMembers,
    starterPositions,
  } = ctx;

  const game = await prisma.game.create({
    data: {
      date: new Date("2024-05-11T13:00:00"),
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
      teamHits: 4,
      opponentHits: 8,
      teamErrors: 2,
      opponentErrors: 0,
      result: "lose",
    },
  });

  await prisma.inning.createMany({
    data: [
      { gameId: game.id, inningNumber: 1, teamScore: 0, opponentScore: 2 },
      { gameId: game.id, inningNumber: 2, teamScore: 1, opponentScore: 0 },
      { gameId: game.id, inningNumber: 3, teamScore: 0, opponentScore: 1 },
      { gameId: game.id, inningNumber: 4, teamScore: 0, opponentScore: 0 },
      { gameId: game.id, inningNumber: 5, teamScore: 1, opponentScore: 2 },
      { gameId: game.id, inningNumber: 6, teamScore: 0, opponentScore: 0 },
      { gameId: game.id, inningNumber: 7, teamScore: 0, opponentScore: 0 },
    ],
  });

  const gameMembers = await createGameMembers(
    prisma,
    game.id,
    starters,
    benchMembers,
    starterPositions,
  );

  // PlateAppearance（各スタメン3打席、9番のみ2打席）
  const plateAppearances: PlateAppearanceData[] = [
    // 1番 田中太郎（中）: 遊ゴロ, 三振, 中飛
    {
      gameMemberId: gameMembers[0].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "groundOut",
      direction: "shortstop",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[0].id,
      inningNumber: 4,
      atBatInGame: 2,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[0].id,
      inningNumber: 6,
      atBatInGame: 3,
      result: "flyOut",
      direction: "center",
      rbi: 0,
    },
    // 2番 山田花子（遊）: 三振, 左安, 遊ゴロ
    {
      gameMemberId: gameMembers[1].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[1].id,
      inningNumber: 4,
      atBatInGame: 2,
      result: "single",
      direction: "left",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[1].id,
      inningNumber: 6,
      atBatInGame: 3,
      result: "groundOut",
      direction: "shortstop",
      rbi: 0,
    },
    // 3番 佐藤一郎（一）: 右飛, 中安(1), 三振
    {
      gameMemberId: gameMembers[2].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "flyOut",
      direction: "right",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[2].id,
      inningNumber: 4,
      atBatInGame: 2,
      result: "single",
      direction: "center",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[2].id,
      inningNumber: 7,
      atBatInGame: 3,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    // 4番 鈴木雪（三）: 三振, 二ゴロ, 右安(1)
    {
      gameMemberId: gameMembers[3].id,
      inningNumber: 2,
      atBatInGame: 1,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[3].id,
      inningNumber: 5,
      atBatInGame: 2,
      result: "groundOut",
      direction: "second",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[3].id,
      inningNumber: 7,
      atBatInGame: 3,
      result: "single",
      direction: "right",
      rbi: 1,
    },
    // 5番 高橋健（左）: 左飛, 三振, 四球
    {
      gameMemberId: gameMembers[4].id,
      inningNumber: 2,
      atBatInGame: 1,
      result: "flyOut",
      direction: "left",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[4].id,
      inningNumber: 5,
      atBatInGame: 2,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[4].id,
      inningNumber: 7,
      atBatInGame: 3,
      result: "walk",
      direction: null,
      rbi: 0,
    },
    // 6番 伊藤誠（右）: 遊ゴロ, 三振, 右飛
    {
      gameMemberId: gameMembers[5].id,
      inningNumber: 2,
      atBatInGame: 1,
      result: "groundOut",
      direction: "shortstop",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[5].id,
      inningNumber: 5,
      atBatInGame: 2,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[5].id,
      inningNumber: 7,
      atBatInGame: 3,
      result: "flyOut",
      direction: "right",
      rbi: 0,
    },
    // 7番 渡辺大輔（二）: 三振, 一ゴロ, 中飛
    {
      gameMemberId: gameMembers[6].id,
      inningNumber: 3,
      atBatInGame: 1,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[6].id,
      inningNumber: 5,
      atBatInGame: 2,
      result: "groundOut",
      direction: "first",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[6].id,
      inningNumber: 7,
      atBatInGame: 3,
      result: "flyOut",
      direction: "center",
      rbi: 0,
    },
    // 8番 中村翔（捕）: 投ゴロ, 四球, 三振
    {
      gameMemberId: gameMembers[7].id,
      inningNumber: 3,
      atBatInGame: 1,
      result: "groundOut",
      direction: "pitcher",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[7].id,
      inningNumber: 5,
      atBatInGame: 2,
      result: "walk",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[7].id,
      inningNumber: 7,
      atBatInGame: 3,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    // 9番 小林勇気（投）: 三振, 遊ゴロ
    {
      gameMemberId: gameMembers[8].id,
      inningNumber: 3,
      atBatInGame: 1,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[8].id,
      inningNumber: 6,
      atBatInGame: 2,
      result: "groundOut",
      direction: "shortstop",
      rbi: 0,
    },
  ];
  await prisma.plateAppearance.createMany({ data: plateAppearances });

  // PitchingResult: 小林勇気（7回完投、2-5 敗北）
  const pitchingResults: PitchingResultData[] = [
    {
      gameMemberId: gameMembers[8].id, // 小林勇気（投手、打順9番）
      pitchingOrder: 1,
      inningsPitched: 7,
      partialOuts: null,
      earnedRuns: 4,
      runs: 5,
      strikeouts: 8,
      walks: 3,
      hitByPitches: 1,
      hitsAllowed: 9,
      homeRunsAllowed: 1,
      decision: "loss",
    },
  ];
  await prisma.pitchingResult.createMany({ data: pitchingResults });

  // 盗塁を設定
  await prisma.gameMember.update({
    where: { id: gameMembers[5].id },
    data: { stolenBases: 1 },
  });

  // 天候: 2024-05-11（5月の曇りの日）
  await prisma.gameWeather.create({
    data: { gameId: game.id, weather: "cloudy", temperature: 22.0 },
  });

  return game;
}
