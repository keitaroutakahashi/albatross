import type { PrismaClient } from "../../../../src/generated/prisma/client.js";
import {
  createGameMembersFromData,
  type GameMemberCreateData,
  type PitchingResultData,
  type PlateAppearanceData,
  type SeedContext,
} from "../_shared.js";

// 試合6: 2025年 公式戦 敗北（4-6、5回制・全員打ち12人）
export async function seedGameLose(prisma: PrismaClient, ctx: SeedContext) {
  const { season2026, tokyoLeague, grounds, opponents, members } = ctx;

  const game = await prisma.game.create({
    data: {
      date: new Date("2026-06-13T19:00:00"),
      gameNumber: 1,
      gameType: "official",
      isFirstBatting: true,
      status: "completed",
      seasonId: season2026.id,
      leagueId: tokyoLeague.id,
      groundId: grounds[1].id,
      opponentId: opponents[2].id,
      teamScore: 4,
      opponentScore: 11,
      teamHits: 5,
      opponentHits: 7,
      teamErrors: 0,
      opponentErrors: 0,
      result: "lose",
    },
  });

  await prisma.inning.createMany({
    data: [
      { gameId: game.id, inningNumber: 1, teamScore: 0, opponentScore: 3 },
      { gameId: game.id, inningNumber: 2, teamScore: 0, opponentScore: 3 },
      { gameId: game.id, inningNumber: 3, teamScore: 2, opponentScore: 4 },
      { gameId: game.id, inningNumber: 4, teamScore: 2, opponentScore: 1 },
      { gameId: game.id, inningNumber: 5, teamScore: 0, opponentScore: 0 },
    ],
  });

  // GameMember（全員打ち12人、打順1〜12・DH3人）
  const memberData: GameMemberCreateData[] = [
    {
      gameId: game.id,
      memberId: members[0].id,
      memberType: "starting",
      battingOrder: 1,
      position: "center",
    },
    {
      gameId: game.id,
      memberId: members[1].id,
      memberType: "starting",
      battingOrder: 2,
      position: "third",
    },
    {
      gameId: game.id,
      memberId: members[2].id,
      memberType: "starting",
      battingOrder: 3,
      position: "shortstop",
    },
    {
      gameId: game.id,
      memberId: members[3].id,
      memberType: "starting",
      battingOrder: 4,
      position: "left",
    },
    {
      gameId: game.id,
      memberId: members[4].id,
      memberType: "starting",
      battingOrder: 5,
      position: "second",
    },
    {
      gameId: game.id,
      memberId: members[5].id,
      memberType: "starting",
      battingOrder: 6,
      position: "first",
    },
    {
      gameId: game.id,
      memberId: members[6].id,
      memberType: "starting",
      battingOrder: 7,
      position: "dh",
    },
    {
      gameId: game.id,
      memberId: members[7].id,
      memberType: "starting",
      battingOrder: 8,
      position: "pitcher",
    },
    {
      gameId: game.id,
      memberId: members[8].id,
      memberType: "starting",
      battingOrder: 9,
      position: "catcher",
    },
    {
      gameId: game.id,
      memberId: members[9].id,
      memberType: "starting",
      battingOrder: 10,
      position: "dh",
    },
    {
      gameId: game.id,
      memberId: members[10].id,
      memberType: "starting",
      battingOrder: 11,
      position: "right",
    },
    {
      gameId: game.id,
      memberId: members[11].id,
      memberType: "starting",
      battingOrder: 12,
      position: "dh",
    },
  ];

  const gameMembers = await createGameMembersFromData(prisma, memberData);

  // PlateAppearance（全員打ち12人、5回制）
  // 1回:1〜4番 / 2回:5〜7番 / 3回:8〜11番 / 4回:12番→1〜7番 / 5回:8〜11番
  const plateAppearances: PlateAppearanceData[] = [
    // 1番 田中太郎（中）: 三振, 二ゴ
    {
      gameMemberId: gameMembers[0].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[0].id,
      inningNumber: 3,
      atBatInGame: 2,
      result: "groundOut",
      direction: "second",
      rbi: 0,
    },
    // 2番 山田花子（三）: 中安, 中安
    {
      gameMemberId: gameMembers[1].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "single",
      direction: "center",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[1].id,
      inningNumber: 4,
      atBatInGame: 2,
      result: "single",
      direction: "center",
      rbi: 0,
    },
    // 3番 佐藤一郎（遊）: 三ゴ, 左2(1)
    {
      gameMemberId: gameMembers[2].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "groundOut",
      direction: "third",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[2].id,
      inningNumber: 4,
      atBatInGame: 2,
      result: "double",
      direction: "left",
      rbi: 1,
    },
    // 4番 鈴木雪（左）: 遊ゴ, 投ゴ(1)
    {
      gameMemberId: gameMembers[3].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "groundOut",
      direction: "shortstop",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[3].id,
      inningNumber: 4,
      atBatInGame: 2,
      result: "groundOut",
      direction: "pitcher",
      rbi: 1,
    },
    // 5番 高橋健（二）: 三ゴ, 三安
    {
      gameMemberId: gameMembers[4].id,
      inningNumber: 2,
      atBatInGame: 1,
      result: "groundOut",
      direction: "third",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[4].id,
      inningNumber: 4,
      atBatInGame: 2,
      result: "single",
      direction: "third",
      rbi: 0,
    },
    // 6番 伊藤誠（一）: 右飛, 三ゴ
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
      result: "groundOut",
      direction: "third",
      rbi: 0,
    },
    // 7番 渡辺大輔（DH）: 三飛, 三振
    {
      gameMemberId: gameMembers[6].id,
      inningNumber: 2,
      atBatInGame: 1,
      result: "flyOut",
      direction: "third",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[6].id,
      inningNumber: 4,
      atBatInGame: 2,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    // 8番 中村翔（投）: 四球, 四球
    {
      gameMemberId: gameMembers[7].id,
      inningNumber: 3,
      atBatInGame: 1,
      result: "walk",
      direction: null,
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
    // 9番 小林勇気（捕）: 左2(1), 遊ゴ
    {
      gameMemberId: gameMembers[8].id,
      inningNumber: 3,
      atBatInGame: 1,
      result: "double",
      direction: "left",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[8].id,
      inningNumber: 5,
      atBatInGame: 2,
      result: "groundOut",
      direction: "shortstop",
      rbi: 0,
    },
    // 10番 加藤隼人（DH）: 四球, 三振
    {
      gameMemberId: gameMembers[9].id,
      inningNumber: 3,
      atBatInGame: 1,
      result: "walk",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[9].id,
      inningNumber: 5,
      atBatInGame: 2,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    // 11番 吉田拓也（右）: 一ゴ(1), 投飛
    {
      gameMemberId: gameMembers[10].id,
      inningNumber: 3,
      atBatInGame: 1,
      result: "groundOut",
      direction: "first",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[10].id,
      inningNumber: 5,
      atBatInGame: 2,
      result: "flyOut",
      direction: "pitcher",
      rbi: 0,
    },
    // 12番 松本涼介（DH）: 三振（1打席のみ）
    {
      gameMemberId: gameMembers[11].id,
      inningNumber: 3,
      atBatInGame: 1,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
  ];
  await prisma.plateAppearance.createMany({ data: plateAppearances });

  // 盗塁を設定（3番・5番・9番）
  await prisma.gameMember.update({
    where: { id: gameMembers[2].id },
    data: { stolenBases: 1 },
  });
  await prisma.gameMember.update({
    where: { id: gameMembers[4].id },
    data: { stolenBases: 1 },
  });
  await prisma.gameMember.update({
    where: { id: gameMembers[8].id },
    data: { stolenBases: 1 },
  });

  // PitchingResult: 小林勇気（4 1/3回、4-4 引き分け）
  const pitchingResults: PitchingResultData[] = [
    {
      gameMemberId: gameMembers[8].id, // 小林勇気（投手、打順9番）
      pitchingOrder: 1,
      inningsPitched: 1,
      partialOuts: null,
      earnedRuns: 2,
      runs: 3,
      strikeouts: 0,
      walks: 1,
      hitByPitches: 1,
      hitsAllowed: 2,
      homeRunsAllowed: 0,
      decision: "loss",
    },
    {
      gameMemberId: gameMembers[1].id, // 小林勇気（投手、打順9番）
      pitchingOrder: 2,
      inningsPitched: 1,
      partialOuts: null,
      earnedRuns: 3,
      runs: 3,
      strikeouts: 2,
      walks: 4,
      hitByPitches: 0,
      hitsAllowed: 1,
      homeRunsAllowed: 0,
      decision: null,
    },
    {
      gameMemberId: gameMembers[2].id, // 小林勇気（投手、打順9番）
      pitchingOrder: 3,
      inningsPitched: 1,
      partialOuts: null,
      earnedRuns: 2,
      runs: 3,
      strikeouts: 2,
      walks: 2,
      hitByPitches: 0,
      hitsAllowed: 3,
      homeRunsAllowed: 0,
      decision: null,
    },
    {
      gameMemberId: gameMembers[3].id, // 小林勇気（投手、打順9番）
      pitchingOrder: 4,
      inningsPitched: 1,
      partialOuts: null,
      earnedRuns: 0,
      runs: 0,
      strikeouts: 0,
      walks: 1,
      hitByPitches: 1,
      hitsAllowed: 0,
      homeRunsAllowed: 0,
      decision: null,
    },
  ];
  await prisma.pitchingResult.createMany({ data: pitchingResults });

  // 天候: 2025-05-18（5月の曇りの日）
  await prisma.gameWeather.create({
    data: { gameId: game.id, weather: "cloudy", temperature: 24.0 },
  });

  return game;
}
