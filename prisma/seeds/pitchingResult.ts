import type { PitchingDecision } from "../../src/generated/prisma/client.js";

type PitchingResultData = {
  gameMemberId: number;
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

// 試合1: 田中太郎 5回 → 加藤隼人 2回（15-3 勝利）
export function getGame1PitchingResults(
  gameMembers: { id: number }[],
): PitchingResultData[] {
  return [
    {
      gameMemberId: gameMembers[9].id, // 田中太郎（先発、打順10番）
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
}

// 試合2: 小林勇気（7回完投、2-5 敗北）
export function getGame2PitchingResults(
  gameMembers: { id: number }[],
): PitchingResultData[] {
  return [
    {
      gameMemberId: gameMembers[8].id, // 小林勇気（投手、打順9番）
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
}

// 試合3: 小林勇気（4 1/3回、4-4 引き分け）
export function getGame3PitchingResults(
  gameMembers: { id: number }[],
): PitchingResultData[] {
  return [
    {
      gameMemberId: gameMembers[8].id, // 小林勇気（投手、打順9番）
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
}
