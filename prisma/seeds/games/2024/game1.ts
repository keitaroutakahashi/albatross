import type { PrismaClient } from "../../../../src/generated/prisma/client.js";
import {
  createGameMembersFromData,
  type GameMemberCreateData,
  type PitchingResultData,
  type PlateAppearanceData,
  type SeedContext,
} from "../_shared.js";

// 試合1: 2024年 公式戦 勝利（15-3、DH制・5回ビッグイニング含む）
export async function seedGame1(prisma: PrismaClient, ctx: SeedContext) {
  const { season2024, tokyoLeague, grounds, opponents, members } = ctx;

  const game = await prisma.game.create({
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
      teamScore: 15,
      opponentScore: 3,
      teamHits: 14,
      opponentHits: 5,
      teamErrors: 1,
      opponentErrors: 3,
      result: "win",
      summary:
        "ジャイアンツ様ご対戦ありがとうございました\n投手陣が粘りの投球をしてくれた点と 前回全然打てなかった西埜投手から\n7得点とチーム全体でいい打撃をすることができました\nMVP 岡本\n4回3失点、3打数2安打2打点と投打共に大活躍\n坂本\n3打数2安打とチームの打撃を大きく牽引してくれました\n丸\n2回2失点で2回にランナーを貯めるも\n何とか粘りの投球で試合を作ってくれました\nさらには3打数2安打2打点と打線も牽引\nこれで今季の公式戦は終了となります\n皆様1年間お疲れ様でした 来季もいいシーズンにできるよう\n全員野球で引き続き頑張っていきましょう",
    },
  });

  await prisma.inning.createMany({
    data: [
      { gameId: game.id, inningNumber: 1, teamScore: 1, opponentScore: 0 },
      { gameId: game.id, inningNumber: 2, teamScore: 0, opponentScore: 1 },
      { gameId: game.id, inningNumber: 3, teamScore: 1, opponentScore: 0 },
      { gameId: game.id, inningNumber: 4, teamScore: 0, opponentScore: 2 },
      { gameId: game.id, inningNumber: 5, teamScore: 13, opponentScore: 0 },
      { gameId: game.id, inningNumber: 6, teamScore: 0, opponentScore: 0 },
      { gameId: game.id, inningNumber: 7, teamScore: 0, opponentScore: 0 },
    ],
  });

  // GameMember（DH制、10名スタメン + 2名ベンチ）
  const memberData: GameMemberCreateData[] = [
    // スタメン打者（打順1〜9）
    {
      gameId: game.id,
      memberId: members[7].id,
      memberType: "starting",
      battingOrder: 1,
      position: "center",
    },
    {
      gameId: game.id,
      memberId: members[5].id,
      memberType: "starting",
      battingOrder: 2,
      position: "shortstop",
    },
    {
      gameId: game.id,
      memberId: members[2].id,
      memberType: "starting",
      battingOrder: 3,
      position: "first",
    },
    {
      gameId: game.id,
      memberId: members[4].id,
      memberType: "starting",
      battingOrder: 4,
      position: "third",
    },
    {
      gameId: game.id,
      memberId: members[6].id,
      memberType: "starting",
      battingOrder: 5,
      position: "left",
    },
    {
      gameId: game.id,
      memberId: members[11].id,
      memberType: "starting",
      battingOrder: 6,
      position: "dh",
    },
    {
      gameId: game.id,
      memberId: members[3].id,
      memberType: "starting",
      battingOrder: 7,
      position: "second",
    },
    {
      gameId: game.id,
      memberId: members[1].id,
      memberType: "starting",
      battingOrder: 8,
      position: "catcher",
    },
    {
      gameId: game.id,
      memberId: members[8].id,
      memberType: "starting",
      battingOrder: 9,
      position: "right",
    },
    // ピッチャー（DH制のため打順10番、打席なし）
    {
      gameId: game.id,
      memberId: members[0].id,
      memberType: "starting",
      battingOrder: 10,
      position: "pitcher",
    },
    // ベンチ
    {
      gameId: game.id,
      memberId: members[9].id,
      memberType: "bench",
      battingOrder: null,
      position: null,
    },
    {
      gameId: game.id,
      memberId: members[10].id,
      memberType: "bench",
      battingOrder: null,
      position: null,
    },
  ];

  const gameMembers = await createGameMembersFromData(prisma, memberData);

  // PlateAppearance（DH制、5回ビッグイニング含む）
  // 5回: 7番鈴木が3打席、他8名が2打席（打順が約2.5周）
  const plateAppearances: PlateAppearanceData[] = [
    // 1番 中村翔（中）: 5打席 — 左安, 中安(1), 右二(2), 右安(1), 左飛
    {
      gameMemberId: gameMembers[0].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "single",
      direction: "left",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[0].id,
      inningNumber: 3,
      atBatInGame: 2,
      result: "single",
      direction: "center",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[0].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "double",
      direction: "right",
      rbi: 2,
    },
    {
      gameMemberId: gameMembers[0].id,
      inningNumber: 5,
      atBatInGame: 4,
      result: "single",
      direction: "right",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[0].id,
      inningNumber: 6,
      atBatInGame: 5,
      result: "flyOut",
      direction: "left",
      rbi: 0,
    },
    // 2番 伊藤誠（遊）: 5打席 — 遊ゴロ, 左飛, 左安(1), 四球, 遊ゴロ
    {
      gameMemberId: gameMembers[1].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "groundOut",
      direction: "shortstop",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[1].id,
      inningNumber: 3,
      atBatInGame: 2,
      result: "flyOut",
      direction: "left",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[1].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "single",
      direction: "left",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[1].id,
      inningNumber: 5,
      atBatInGame: 4,
      result: "walk",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[1].id,
      inningNumber: 7,
      atBatInGame: 5,
      result: "groundOut",
      direction: "shortstop",
      rbi: 0,
    },
    // 3番 佐藤一郎（一）: 5打席 — 右安(1), 三振, 左本(2), 中安(1), 右飛
    {
      gameMemberId: gameMembers[2].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "single",
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
      direction: "left",
      rbi: 2,
    },
    {
      gameMemberId: gameMembers[2].id,
      inningNumber: 5,
      atBatInGame: 4,
      result: "single",
      direction: "center",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[2].id,
      inningNumber: 7,
      atBatInGame: 5,
      result: "flyOut",
      direction: "right",
      rbi: 0,
    },
    // 4番 高橋健（三）: 5打席 — 併殺, 遊ゴロ, 四球, 左安(1), 三振
    {
      gameMemberId: gameMembers[3].id,
      inningNumber: 1,
      atBatInGame: 1,
      result: "doublePlay",
      direction: "second",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[3].id,
      inningNumber: 4,
      atBatInGame: 2,
      result: "groundOut",
      direction: "shortstop",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[3].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "walk",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[3].id,
      inningNumber: 5,
      atBatInGame: 4,
      result: "single",
      direction: "left",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[3].id,
      inningNumber: 7,
      atBatInGame: 5,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    // 5番 渡辺大輔（左）: 4打席 — 三振, 右飛, 中安, 右安(1)
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
      result: "flyOut",
      direction: "right",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[4].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "single",
      direction: "center",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[4].id,
      inningNumber: 5,
      atBatInGame: 4,
      result: "single",
      direction: "right",
      rbi: 1,
    },
    // 6番 松本涼介（DH）: 4打席 — 中飛, 三振, 右二(1), 三振
    {
      gameMemberId: gameMembers[5].id,
      inningNumber: 2,
      atBatInGame: 1,
      result: "flyOut",
      direction: "center",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[5].id,
      inningNumber: 4,
      atBatInGame: 2,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[5].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "double",
      direction: "right",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[5].id,
      inningNumber: 5,
      atBatInGame: 4,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    // 7番 鈴木雪（二）: 4打席 — 投ゴロ, 左安, 犠飛(1), 遊ゴロ ※5回に3打席
    {
      gameMemberId: gameMembers[6].id,
      inningNumber: 2,
      atBatInGame: 1,
      result: "groundOut",
      direction: "pitcher",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[6].id,
      inningNumber: 5,
      atBatInGame: 2,
      result: "single",
      direction: "left",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[6].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "sacrificeFly",
      direction: "center",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[6].id,
      inningNumber: 5,
      atBatInGame: 4,
      result: "groundOut",
      direction: "shortstop",
      rbi: 0,
    },
    // 8番 山田花子（捕）: 4打席 — 四球, 右安, 四球, 遊ゴロ
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
      result: "single",
      direction: "right",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[7].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "walk",
      direction: null,
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[7].id,
      inningNumber: 6,
      atBatInGame: 4,
      result: "groundOut",
      direction: "shortstop",
      rbi: 0,
    },
    // 9番 小林勇気（右）: 4打席 — 犠打, 中安(1), 左安(1), 三振
    {
      gameMemberId: gameMembers[8].id,
      inningNumber: 3,
      atBatInGame: 1,
      result: "sacrificeHit",
      direction: "pitcher",
      rbi: 0,
    },
    {
      gameMemberId: gameMembers[8].id,
      inningNumber: 5,
      atBatInGame: 2,
      result: "single",
      direction: "center",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[8].id,
      inningNumber: 5,
      atBatInGame: 3,
      result: "single",
      direction: "left",
      rbi: 1,
    },
    {
      gameMemberId: gameMembers[8].id,
      inningNumber: 6,
      atBatInGame: 4,
      result: "strikeout",
      direction: null,
      rbi: 0,
    },
    // 10番 田中太郎（投）: DH制のため打席なし
  ];
  await prisma.plateAppearance.createMany({ data: plateAppearances });

  // PitchingResult: 田中太郎 5回 → 加藤隼人 2回（15-3 勝利）
  const pitchingResults: PitchingResultData[] = [
    {
      gameMemberId: gameMembers[9].id, // 田中太郎（先発、打順10番）
      pitchingOrder: 1,
      inningsPitched: 5,
      partialOuts: 0,
      earnedRuns: 2,
      runs: 3,
      strikeouts: 4,
      walks: 2,
      hitByPitches: 0,
      hitsAllowed: 5,
      homeRunsAllowed: 0,
      decision: "win",
    },
    {
      gameMemberId: gameMembers[10].id, // 加藤隼人（リリーフ、ベンチ）
      pitchingOrder: 2,
      inningsPitched: 2,
      partialOuts: 1,
      earnedRuns: 0,
      runs: 0,
      strikeouts: 1,
      walks: 0,
      hitByPitches: 0,
      hitsAllowed: 1,
      homeRunsAllowed: 0,
      decision: null,
    },
  ];
  await prisma.pitchingResult.createMany({ data: pitchingResults });

  // 盗塁を設定（一部メンバー）
  await prisma.gameMember.update({
    where: { id: gameMembers[0].id },
    data: { stolenBases: 2 },
  });
  await prisma.gameMember.update({
    where: { id: gameMembers[1].id },
    data: { stolenBases: 1 },
  });

  // 天候: 2024-04-14（4月の晴れた日）
  await prisma.gameWeather.create({
    data: { gameId: game.id, weather: "sunny", temperature: 18.5 },
  });

  return game;
}
