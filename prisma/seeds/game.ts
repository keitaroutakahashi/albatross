import type {
  Position,
  PrismaClient,
} from "../../src/generated/prisma/client.js";
import { getGame1PAs, getGame2PAs, getGame3PAs } from "./plateAppearance.js";
import {
  getGame1PitchingResults,
  getGame2PitchingResults,
  getGame3PitchingResults,
} from "./pitchingResult.js";
import { getGameWeathers } from "./gameWeather.js";

export async function seedGames(prisma: PrismaClient) {
  console.log("Seeding games...");

  // マスタデータを取得
  const season2024 = await prisma.season.findUnique({
    where: { season: 2024 },
  });
  const season2025 = await prisma.season.findUnique({
    where: { season: 2025 },
  });
  const leagues = await prisma.league.findMany();
  const grounds = await prisma.ground.findMany();
  const opponents = await prisma.opponent.findMany();
  const members = await prisma.member.findMany({
    orderBy: { id: "asc" },
  });

  if (!season2024 || !season2025) {
    throw new Error("Season data not found");
  }

  const tokyoLeague = leagues.find((l) => l.name === "東京草野球リーグ");
  const sundayLeague = leagues.find((l) => l.name === "日曜リーグ");
  const practiceLeague = leagues.find((l) => l.name === "練習試合");

  if (!tokyoLeague || !sundayLeague || !practiceLeague) {
    throw new Error("League data not found");
  }

  if (members.length < 12) {
    throw new Error("Member data not found (need at least 12 members)");
  }

  // スタメン9名 + ベンチ3名
  const starters = members.slice(0, 9);
  const benchMembers = members.slice(9, 12);

  // スタメンのポジション・打順マッピング
  const starterPositions: Position[] = [
    "center",
    "shortstop",
    "first",
    "third",
    "left",
    "right",
    "second",
    "catcher",
    "pitcher",
  ];

  // --- 試合1: 2024年 公式戦 勝利（7-3）---
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
      teamScore: 15,
      opponentScore: 3,
      result: "win",
    },
  });

  await prisma.inning.createMany({
    data: [
      { gameId: game1.id, inningNumber: 1, teamScore: 1, opponentScore: 0 },
      { gameId: game1.id, inningNumber: 2, teamScore: 0, opponentScore: 1 },
      { gameId: game1.id, inningNumber: 3, teamScore: 1, opponentScore: 0 },
      { gameId: game1.id, inningNumber: 4, teamScore: 0, opponentScore: 2 },
      { gameId: game1.id, inningNumber: 5, teamScore: 13, opponentScore: 0 },
      { gameId: game1.id, inningNumber: 6, teamScore: 0, opponentScore: 0 },
      { gameId: game1.id, inningNumber: 7, teamScore: 0, opponentScore: 0 },
    ],
  });

  // 試合1: GameMember（DH制、10名スタメン + 2名ベンチ）
  const game1MemberData: {
    gameId: number;
    memberId: number;
    memberType: "starting" | "bench";
    battingOrder: number | null;
    position: Position | null;
  }[] = [
    // スタメン打者（打順1〜9）
    {
      gameId: game1.id,
      memberId: members[7].id,
      memberType: "starting",
      battingOrder: 1,
      position: "center",
    },
    {
      gameId: game1.id,
      memberId: members[5].id,
      memberType: "starting",
      battingOrder: 2,
      position: "shortstop",
    },
    {
      gameId: game1.id,
      memberId: members[2].id,
      memberType: "starting",
      battingOrder: 3,
      position: "first",
    },
    {
      gameId: game1.id,
      memberId: members[4].id,
      memberType: "starting",
      battingOrder: 4,
      position: "third",
    },
    {
      gameId: game1.id,
      memberId: members[6].id,
      memberType: "starting",
      battingOrder: 5,
      position: "left",
    },
    {
      gameId: game1.id,
      memberId: members[11].id,
      memberType: "starting",
      battingOrder: 6,
      position: "dh",
    },
    {
      gameId: game1.id,
      memberId: members[3].id,
      memberType: "starting",
      battingOrder: 7,
      position: "second",
    },
    {
      gameId: game1.id,
      memberId: members[1].id,
      memberType: "starting",
      battingOrder: 8,
      position: "catcher",
    },
    {
      gameId: game1.id,
      memberId: members[8].id,
      memberType: "starting",
      battingOrder: 9,
      position: "right",
    },
    // ピッチャー（DH制のため打順10番、打席なし）
    {
      gameId: game1.id,
      memberId: members[0].id,
      memberType: "starting",
      battingOrder: 10,
      position: "pitcher",
    },
    // ベンチ
    {
      gameId: game1.id,
      memberId: members[9].id,
      memberType: "bench",
      battingOrder: null,
      position: null,
    },
    {
      gameId: game1.id,
      memberId: members[10].id,
      memberType: "bench",
      battingOrder: null,
      position: null,
    },
  ];

  const game1Members: { id: number }[] = [];
  for (const data of game1MemberData) {
    const gm = await prisma.gameMember.create({ data });
    game1Members.push(gm);
  }

  // 試合1: PlateAppearance（DH制、5回ビッグイニング含む）
  await prisma.plateAppearance.createMany({
    data: getGame1PAs(game1Members),
  });

  // 試合1: PitchingResult
  await prisma.pitchingResult.createMany({
    data: getGame1PitchingResults(game1Members),
  });

  // 盗塁を設定（一部メンバー）
  await prisma.gameMember.update({
    where: { id: game1Members[0].id },
    data: { stolenBases: 2 },
  });
  await prisma.gameMember.update({
    where: { id: game1Members[1].id },
    data: { stolenBases: 1 },
  });

  // --- 試合2: 2024年 公式戦 敗北（2-5）---
  const game2 = await prisma.game.create({
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

  const game2Members = await createGameMembers(
    prisma,
    game2.id,
    starters,
    benchMembers,
    starterPositions,
  );

  // 試合2: PlateAppearance（各スタメン3打席、9番のみ2打席）
  await prisma.plateAppearance.createMany({
    data: getGame2PAs(game2Members),
  });

  // 試合2: PitchingResult
  await prisma.pitchingResult.createMany({
    data: getGame2PitchingResults(game2Members),
  });

  // 盗塁を設定
  await prisma.gameMember.update({
    where: { id: game2Members[5].id },
    data: { stolenBases: 1 },
  });

  // --- 試合3: 2024年 練習試合 引き分け（4-4）---
  const game3 = await prisma.game.create({
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

  const game3Members = await createGameMembers(
    prisma,
    game3.id,
    starters,
    benchMembers,
    starterPositions,
  );

  // 試合3: PlateAppearance（5イニング、各スタメン2-3打席）
  await prisma.plateAppearance.createMany({
    data: getGame3PAs(game3Members),
  });

  // 試合3: PitchingResult
  await prisma.pitchingResult.createMany({
    data: getGame3PitchingResults(game3Members),
  });

  // 盗塁を設定
  await prisma.gameMember.update({
    where: { id: game3Members[0].id },
    data: { stolenBases: 1 },
  });
  await prisma.gameMember.update({
    where: { id: game3Members[1].id },
    data: { stolenBases: 1 },
  });

  // --- 試合4: 2025年 公式戦（予定）---
  const game4 = await prisma.game.create({
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

  // --- 試合5: 2025年 公式戦（中止）---
  const game5 = await prisma.game.create({
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

  // --- 天候データ ---
  const gameIds = [game1.id, game2.id, game3.id, game4.id, game5.id];
  await prisma.gameWeather.createMany({
    data: getGameWeathers(gameIds),
  });

  console.log(
    "Created 5 games with innings, game members, plate appearances, and weather",
  );
}

// スタメン + ベンチの GameMember を作成するヘルパー
async function createGameMembers(
  prisma: PrismaClient,
  gameId: number,
  starters: { id: number }[],
  benchMembers: { id: number }[],
  positions: Position[],
) {
  const gameMemberData = [
    // スタメン（打順1〜9）
    ...starters.map((m, i) => ({
      gameId,
      memberId: m.id,
      memberType: "starting" as const,
      battingOrder: i + 1,
      position: positions[i],
    })),
    // ベンチ
    ...benchMembers.map((m) => ({
      gameId,
      memberId: m.id,
      memberType: "bench" as const,
      battingOrder: null,
      position: null,
    })),
  ];

  const created = [];
  for (const data of gameMemberData) {
    const gm = await prisma.gameMember.create({ data });
    created.push(gm);
  }
  return created;
}
