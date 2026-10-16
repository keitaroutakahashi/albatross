import {
  hitResults,
  nonAtBatResults,
} from "@/app/_features/games/utils/at-bat-result";
import {
  calculateBattingAverage,
  calculateOnBasePercentage,
  calculateOps,
  calculateSluggingPercentage,
} from "@/app/_utils/stats/batting";
import type { AtBatResult } from "@/generated/prisma/client";

/** 安打 1 本あたりの塁打数 */
const TOTAL_BASES_BY_HIT: Partial<Record<AtBatResult, number>> = {
  single: 1,
  double: 2,
  triple: 3,
  homeRun: 4,
};

export type BattingPlateAppearance = {
  result: AtBatResult;
  rbi: number;
  /** 得点圏（二塁または三塁に走者がいる状況）での打席か */
  isScoringPosition: boolean;
};

export type BattingSummary = {
  /** 打席数 */
  plateAppearances: number;
  /** 打数 */
  atBats: number;
  /** 安打 */
  hits: number;
  /** 単打 */
  singles: number;
  /** 二塁打 */
  doubles: number;
  /** 三塁打 */
  triples: number;
  /** 本塁打 */
  homeRuns: number;
  /** 打点 */
  rbi: number;
  /** 四死球（四球 + 死球） */
  walks: number;
  /** 三振 */
  strikeouts: number;
  /** 犠打 */
  sacrificeHits: number;
  /** 犠飛 */
  sacrificeFlies: number;
  /** 打率（打数 0 のときは null） */
  average: number | null;
  /** 出塁率（分母 0 のときは null） */
  onBasePercentage: number | null;
  /** 長打率（打数 0 のときは null） */
  sluggingPercentage: number | null;
  /** OPS = 出塁率 + 長打率（どちらかが null のときは null） */
  ops: number | null;
  /** 得点圏での打数 */
  scoringPositionAtBats: number;
  /** 得点圏での安打 */
  scoringPositionHits: number;
  /** 得点圏打率（得点圏での打数 0 のときは null） */
  scoringPositionAverage: number | null;
};

/**
 * 打席結果の一覧から打撃成績を集計する。
 * 年度別・グラウンド別など、どの切り口でも同じ計算式を使うためのヘルパー。
 */
export const summarizeBatting = (
  plateAppearances: BattingPlateAppearance[],
): BattingSummary => {
  let atBats = 0;
  let totalBases = 0;
  let scoringPositionAtBats = 0;
  let scoringPositionHits = 0;
  const counts = {
    hits: 0,
    singles: 0,
    doubles: 0,
    triples: 0,
    homeRuns: 0,
    rbi: 0,
    walks: 0,
    strikeouts: 0,
    sacrificeHits: 0,
    sacrificeFlies: 0,
  };

  for (const { result, rbi, isScoringPosition } of plateAppearances) {
    counts.rbi += rbi;

    // 四死球・犠打・犠飛は打数に含めない
    const isAtBat = !nonAtBatResults.includes(result);
    const isHit = hitResults.includes(result);

    if (isAtBat) atBats += 1;
    if (isScoringPosition && isAtBat) scoringPositionAtBats += 1;
    if (isScoringPosition && isHit) scoringPositionHits += 1;

    if (isHit) {
      counts.hits += 1;
      totalBases += TOTAL_BASES_BY_HIT[result] ?? 0;

      if (result === "single") counts.singles += 1;
      if (result === "double") counts.doubles += 1;
      if (result === "triple") counts.triples += 1;
      if (result === "homeRun") counts.homeRuns += 1;
    }

    if (result === "walk" || result === "hitByPitch") counts.walks += 1;
    if (result === "strikeout") counts.strikeouts += 1;
    if (result === "sacrificeHit") counts.sacrificeHits += 1;
    if (result === "sacrificeFly") counts.sacrificeFlies += 1;
  }

  const onBasePercentage = calculateOnBasePercentage({
    hits: counts.hits,
    walks: counts.walks,
    atBats,
    sacrificeFlies: counts.sacrificeFlies,
  });
  const sluggingPercentage = calculateSluggingPercentage({
    totalBases,
    atBats,
  });

  return {
    plateAppearances: plateAppearances.length,
    atBats,
    ...counts,
    average: calculateBattingAverage({ hits: counts.hits, atBats }),
    onBasePercentage,
    sluggingPercentage,
    ops: calculateOps({ onBasePercentage, sluggingPercentage }),
    scoringPositionAtBats,
    scoringPositionHits,
    scoringPositionAverage: calculateBattingAverage({
      hits: scoringPositionHits,
      atBats: scoringPositionAtBats,
    }),
  };
};
