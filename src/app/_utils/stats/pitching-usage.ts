import { OUTS_PER_INNING } from "@/app/_utils/stats/innings";
import type { PitchingGameResult } from "@/app/_utils/stats/pitching-summary";

export type PitchingUsage = {
  /** 1 試合あたりの使用投手数（登板のある試合がなければ null） */
  pitchersPerGame: number | null;
  /** 先発の平均アウト数（先発の登板がなければ null） */
  starterAverageOuts: number | null;
};

/**
 * 投手の起用状況を集計する。
 * @param gameResults 試合ごとの、その試合に登板した投手の成績
 */
export const summarizePitchingUsage = (
  gameResults: PitchingGameResult[][],
): PitchingUsage => {
  const games = gameResults.filter((results) => results.length > 0);
  const starters = games.flatMap((results) =>
    results.filter((r) => r.pitchingOrder === 1),
  );

  const outsOf = (r: PitchingGameResult) =>
    r.inningsPitched * OUTS_PER_INNING + (r.partialOuts ?? 0);

  return {
    pitchersPerGame:
      games.length > 0
        ? games.reduce((total, results) => total + results.length, 0) /
          games.length
        : null,
    starterAverageOuts:
      starters.length > 0
        ? starters.reduce((total, r) => total + outsOf(r), 0) / starters.length
        : null,
  };
};
