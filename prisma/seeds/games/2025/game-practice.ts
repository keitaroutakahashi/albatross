import type { PrismaClient } from "../../../../src/generated/prisma/client.js";
import {
  createGameMembersFromData,
  type GameMemberCreateData,
  type PitchingResultData,
  type PlateAppearanceData,
  type SeedContext,
} from "../_shared.js";

// 試合7: 2025年 練習試合 勝利（10-3、5回コールド・11人打ち）
export async function seedGamePractice(prisma: PrismaClient, ctx: SeedContext) {
  const { season2025, grounds, opponents, members } = ctx;

  const game = await prisma.game.create({
    data: {
      date: new Date("2025-06-10T10:00:00"),
      gameNumber: 1,
      gameType: "practice",
      isFirstBatting: true,
      status: "completed",
      seasonId: season2025.id,
      groundId: grounds[3].id,
      opponentId: opponents[3].id,
      teamScore: 10,
      opponentScore: 3,
      teamHits: 13,
      opponentHits: 6,
      teamErrors: 0,
      opponentErrors: 1,
      result: "win",
      videoUrl: "https://www.youtube.com/embed/Zf2lra7LTcI?si=v2QMsZIEnygJVmGW",
      aiGoodPoints:
        "最大の勝因は2回の集中打です。打者一巡で一挙6得点を奪い、序盤で試合の主導権を握りました。\n\nチーム13安打と打線が途切れずつながり、特に3番佐藤の3安打猛打賞、4番鈴木の2安打2打点が効果的でした。\n\n守備は無失策と堅実で、先発・渡辺が5奪三振で5回を投げ切り完投勝利。攻守がかみ合った理想的な試合運びで、5回コールド勝ちを呼び込みました。",
      aiBadPoints:
        "改善点は立ち上がりです。初回にいきなり先制を許し、最終回にも1点を失うなど、流れを渡しかねない失点が見られました。\n\n投球では四球2・被安打6とやや走者を背負う場面が散発。打線でも5番と6番が3打席で快音なく三振も目立ち、好機をさらに広げきれませんでした。\n\n大量点で勝てた一戦だけに、僅差の展開を見据えた守りの締めと、下位打線の奮起が次戦への課題と言えます。",
    },
  });

  await prisma.inning.createMany({
    data: [
      { gameId: game.id, inningNumber: 1, teamScore: 0, opponentScore: 1 },
      { gameId: game.id, inningNumber: 2, teamScore: 6, opponentScore: 0 },
      { gameId: game.id, inningNumber: 3, teamScore: 3, opponentScore: 1 },
      { gameId: game.id, inningNumber: 4, teamScore: 1, opponentScore: 0 },
      { gameId: game.id, inningNumber: 5, teamScore: 0, opponentScore: 1 },
    ],
  });

  // GameMember（11人打ち、打順1〜11・DH2人）
  const memberData: GameMemberCreateData[] = [
    {
      gameId: game.id,
      memberId: members[0].id,
      memberType: "starting",
      battingOrder: 1,
      position: "right",
    },
    {
      gameId: game.id,
      memberId: members[1].id,
      memberType: "starting",
      battingOrder: 2,
      position: "shortstop",
    },
    {
      gameId: game.id,
      memberId: members[2].id,
      memberType: "starting",
      battingOrder: 3,
      position: "third",
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
      position: "pitcher",
    },
    {
      gameId: game.id,
      memberId: members[7].id,
      memberType: "starting",
      battingOrder: 8,
      position: "catcher",
    },
    {
      gameId: game.id,
      memberId: members[8].id,
      memberType: "starting",
      battingOrder: 9,
      position: "dh",
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
      position: "center",
    },
  ];

  const gameMembers = await createGameMembersFromData(prisma, memberData);

  // PlateAppearance（11人打ち、5回コールド勝ち）
  // 1回:1〜6番 / 2回:7〜11番→1〜6番(打者一巡) / 3回:7〜11番 / 4回:1〜4番 / 5回:5〜9番
  const plateAppearances: PlateAppearanceData[] = [
    // 1番 田中太郎（右）: 遊ゴ, 右安(2), 投飛
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
      inningNumber: 2,
      atBatInGame: 2,
      result: "single",
      direction: "right",
      rbi: 2,
    },
    {
      gameMemberId: gameMembers[0].id,
      inningNumber: 4,
      atBatInGame: 3,
      result: "flyOut",
      direction: "pitcher",
      rbi: 0,
    },
    // 2番 山田花子（遊）: 三ゴ, 左失, 四球
    {
      gameMemberId: gameMembers[1].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "groundOut",
      direction: "third",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[1].id,
      inningNumber: 2,
      atBatInGame: 2,
      result: "error",
      direction: "left",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[1].id,
      inningNumber: 4,
      atBatInGame: 3,
      result: "walk",
      direction: null,
      rbi: 0,
    },
    // 3番 佐藤一郎（三）: 左安, 中安(1), 左安(1)
    {
      gameMemberId: gameMembers[2].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "single",
      direction: "left",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[2].id,
      inningNumber: 2,
      atBatInGame: 2,
      result: "single",
      direction: "center",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[2].id,
      inningNumber: 4,
      atBatInGame: 3,
      result: "single",
      direction: "left",
      rbi: 1,
    },
    // 4番 鈴木雪（左）: 中安, 左安(2), 遊飛
    {
      gameMemberId: gameMembers[3].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "single",
      direction: "center",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[3].id,
      inningNumber: 2,
      atBatInGame: 2,
      result: "single",
      direction: "left",
      rbi: 2,
    },
    {
      gameMemberId: gameMembers[3].id,
      inningNumber: 4,
      atBatInGame: 3,
      result: "flyOut",
      direction: "shortstop",
      rbi: 0,
    },
    // 5番 高橋健（二）: 四球, 三振, 四球
    {
      gameMemberId: gameMembers[4].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "walk",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[4].id,
      inningNumber: 2,
      atBatInGame: 2,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[4].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "walk",
      direction: null,
      rbi: 0,
    },
    // 6番 伊藤誠（一）: 左飛, 三振, 三ゴ
    {
      gameMemberId: gameMembers[5].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "flyOut",
      direction: "left",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[5].id,
      inningNumber: 2,
      atBatInGame: 2,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[5].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "groundOut",
      direction: "third",
      rbi: 0,
    },
    // 7番 渡辺大輔（投）: 左2, 四球, 四球
    {
      gameMemberId: gameMembers[6].id,
      inningNumber: 2,
      atBatInGame: 1,
      result: "double",
      direction: "left",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[6].id,
      inningNumber: 3,
      atBatInGame: 2,
      result: "walk",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[6].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "walk",
      direction: null,
      rbi: 0,
    },
    // 8番 中村翔（捕）: 二ゴ, 左安(1), 遊飛
    {
      gameMemberId: gameMembers[7].id,
      inningNumber: 2,
      atBatInGame: 1,
      result: "groundOut",
      direction: "second",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[7].id,
      inningNumber: 3,
      atBatInGame: 2,
      result: "single",
      direction: "left",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[7].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "flyOut",
      direction: "shortstop",
      rbi: 0,
    },
    // 9番 小林勇気（DH）: 右安(1), 中安, 三ゴ
    {
      gameMemberId: gameMembers[8].id,
      inningNumber: 2,
      atBatInGame: 1,
      result: "single",
      direction: "right",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[8].id,
      inningNumber: 3,
      atBatInGame: 2,
      result: "single",
      direction: "center",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[8].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "groundOut",
      direction: "third",
      rbi: 0,
    },
    // 10番 加藤隼人（DH）: 右安, 右2(2)
    {
      gameMemberId: gameMembers[9].id,
      inningNumber: 2,
      atBatInGame: 1,
      result: "single",
      direction: "right",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[9].id,
      inningNumber: 3,
      atBatInGame: 2,
      result: "double",
      direction: "right",
      rbi: 2,
    },
    // 11番 吉田拓也（中）: 中安, 捕飛
    {
      gameMemberId: gameMembers[10].id,
      inningNumber: 2,
      atBatInGame: 1,
      result: "single",
      direction: "center",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[10].id,
      inningNumber: 3,
      atBatInGame: 2,
      result: "flyOut",
      direction: "catcher",
      rbi: 0,
    },
  ];
  await prisma.plateAppearance.createMany({ data: plateAppearances });

  // PitchingResult: 渡辺大輔（5回コールド、10-3 勝利）
  const pitchingResults: PitchingResultData[] = [
    {
      gameMemberId: gameMembers[6].id, // 渡辺大輔（投手、打順7番）
      pitchingOrder: 1,
      inningsPitched: 5,
      partialOuts: null,
      earnedRuns: 2,
      runs: 3,
      strikeouts: 5,
      walks: 2,
      hitByPitches: 0,
      hitsAllowed: 6,
      homeRunsAllowed: 0,
      decision: "win",
    },
  ];
  await prisma.pitchingResult.createMany({ data: pitchingResults });

  // 盗塁を設定（1番・8番）
  await prisma.gameMember.update({
    where: { id: gameMembers[0].id },
    data: { stolenBases: 1 },
  });
  await prisma.gameMember.update({
    where: { id: gameMembers[7].id },
    data: { stolenBases: 1 },
  });

  // 天候: 2025-06-08（6月の晴れた日）
  await prisma.gameWeather.create({
    data: { gameId: game.id, weather: "sunny", temperature: 26.5 },
  });

  return game;
}
