import { AtBatResult } from "@/generated/prisma/enums";

export type AtBatResultCount = {
  result: AtBatResult;
  count: number;
  /** 集計対象全体（全打席、アウトになった打席など）に占める割合 */
  rate: number;
};

/** 表示順（enum の定義順） */
const RESULT_ORDER = Object.values(AtBatResult);

/** 打席結果ごとの回数と割合を集計する。1 回もない結果は返さない */
export const summarizeAtBatResults = (
  results: AtBatResult[],
): AtBatResultCount[] =>
  RESULT_ORDER.flatMap((result) => {
    const count = results.filter((r) => r === result).length;

    return count > 0 ? [{ result, count, rate: count / results.length }] : [];
  });

/** バッターがアウトになる結果。表示順 */
const OUT_RESULTS: AtBatResult[] = [
  "strikeout",
  "groundOut",
  "flyOut",
  "lineOut",
  "doublePlay",
  "sacrificeHit",
  "sacrificeFly",
];

/**
 * アウトになった打席の内訳（回数と、アウト全体に占める割合）を集計する。
 * 1 回もない結果は返さない。併殺打は、実際は 2 アウトでも 1 回として数える。
 */
export const summarizeOutResults = (
  results: AtBatResult[],
): AtBatResultCount[] => {
  const outs = results.filter((r) => OUT_RESULTS.includes(r));

  return OUT_RESULTS.flatMap((result) => {
    const count = outs.filter((r) => r === result).length;

    return count > 0 ? [{ result, count, rate: count / outs.length }] : [];
  });
};
