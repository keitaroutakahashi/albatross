import type {
  AtBatResult,
  Ground,
  League,
  Member,
  Opponent,
  PitchingDecision,
  Position,
  PrismaClient,
  Season,
} from "../../../../src/generated/prisma/client.js";

// 各試合シーダーに渡すマスタデータ
export type SeedContext = {
  season2025: Season;
  season2026: Season;
  tokyoLeague: League;
  sundayLeague: League;
  practiceLeague: League;
  grounds: Ground[];
  opponents: Opponent[];
  members: Member[];
  // 標準スタメン9名 + ベンチ3名（試合2・3で使用）
  starters: Member[];
  benchMembers: Member[];
  starterPositions: Position[];
};

// GameMember 作成用データ
export type GameMemberCreateData = {
  gameId: number;
  memberId: number;
  memberType: "starting" | "bench";
  battingOrder: number | null;
  position: Position | null;
};

// PlateAppearance 作成用データ
export type PlateAppearanceData = {
  gameMemberId: number;
  inningNumber: number;
  atBatInGame: number;
  result: AtBatResult;
  direction: Position | null;
  rbi: number;
};

// PitchingResult 作成用データ
export type PitchingResultData = {
  gameMemberId: number;
  pitchingOrder: number;
  inningsPitched: number;
  partialOuts: number | null;
  earnedRuns: number;
  runs: number;
  strikeouts: number;
  walks: number;
  hitByPitches: number;
  hitsAllowed: number;
  homeRunsAllowed: number;
  decision: PitchingDecision | null;
};

// 明示的な GameMember データ配列から順次作成する（試合1・6・7のような独自打順）
export async function createGameMembersFromData(
  prisma: PrismaClient,
  data: GameMemberCreateData[],
): Promise<{ id: number }[]> {
  const created: { id: number }[] = [];
  for (const d of data) {
    const gm = await prisma.gameMember.create({ data: d });
    created.push(gm);
  }
  return created;
}
