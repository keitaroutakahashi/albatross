import { calculateEra } from "@/app/_utils/stats/era";
import { OUTS_PER_INNING } from "@/app/_utils/stats/innings";
import { calculateWhip } from "@/app/_utils/stats/whip";
import type { PitchingDecision } from "@/generated/prisma/client";

export type PitchingGameResult = {
  /** 登板順（先発 = 1） */
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
  /** 登板ごとの合計球数（未入力は null） */
  pitchCount: number | null;
  decision: PitchingDecision | null;
};

export type PitchingSummary = {
  /** 登板数 */
  games: number;
  /** 先発登板数 */
  starts: number;
  /** 投球回（アウト数換算） */
  outs: number;
  /** 勝利 */
  wins: number;
  /** 敗戦 */
  losses: number;
  /** 奪三振 */
  strikeouts: number;
  /** 自責点 */
  earnedRuns: number;
  /** 失点 */
  runs: number;
  /** 与四球 */
  walks: number;
  /** 与死球 */
  hitByPitches: number;
  /** 被安打 */
  hitsAllowed: number;
  /** 被本塁打 */
  homeRunsAllowed: number;
  /** 合計球数（球数が入力された登板の合計。1 登板も入力がなければ null） */
  pitchCount: number | null;
  /** 1 登板あたりの平均球数（球数が入力された登板のみで算出。入力がなければ null） */
  pitchCountAverage: number | null;
  /** 防御率（7 イニング基準。投球回 0 のときは null） */
  era: number | null;
  /** WHIP（投球回 0 のときは null） */
  whip: number | null;
};

/**
 * 試合ごとの投球成績を合算して通算の投球成績を集計する。
 * 投球回は丸め誤差を避けるため、アウト数（整数）で積み上げる。
 */
export const summarizePitching = (
  results: PitchingGameResult[],
): PitchingSummary => {
  const total = {
    outs: 0,
    wins: 0,
    losses: 0,
    strikeouts: 0,
    earnedRuns: 0,
    runs: 0,
    walks: 0,
    hitByPitches: 0,
    hitsAllowed: 0,
    homeRunsAllowed: 0,
  };

  for (const result of results) {
    total.outs +=
      result.inningsPitched * OUTS_PER_INNING + (result.partialOuts ?? 0);
    total.earnedRuns += result.earnedRuns;
    total.runs += result.runs;
    total.strikeouts += result.strikeouts;
    total.walks += result.walks;
    total.hitByPitches += result.hitByPitches;
    total.hitsAllowed += result.hitsAllowed;
    total.homeRunsAllowed += result.homeRunsAllowed;

    if (result.decision === "win") total.wins += 1;
    if (result.decision === "loss") total.losses += 1;
  }

  // 球数が未入力の登板は合計・平均の両方から除く
  const pitchCounts = results.flatMap((result) =>
    result.pitchCount === null ? [] : [result.pitchCount],
  );
  const pitchCountTotal = pitchCounts.reduce((sum, count) => sum + count, 0);

  return {
    games: results.length,
    starts: results.filter((result) => result.pitchingOrder === 1).length,
    ...total,
    pitchCount: pitchCounts.length > 0 ? pitchCountTotal : null,
    pitchCountAverage:
      pitchCounts.length > 0 ? pitchCountTotal / pitchCounts.length : null,
    era: calculateEra({
      earnedRuns: total.earnedRuns,
      inningsPitched: Math.floor(total.outs / OUTS_PER_INNING),
      partialOuts: total.outs % OUTS_PER_INNING,
    }),
    whip: calculateWhip({
      walks: total.walks,
      hitsAllowed: total.hitsAllowed,
      outs: total.outs,
    }),
  };
};
