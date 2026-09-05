/** 1 イニングのアウト数 */
export const OUTS_PER_INNING = 3;

/**
 * アウト数を野球慣例の投球回表記（例: 16 アウト → "5.1"）に変換する。
 *
 * ".1 / .2" は実際には 1/3・2/3 イニングを表す端数表記であり、
 * 10 進数の小数ではないことに注意。
 */
export const formatInnings = (outs: number): string =>
  `${Math.floor(outs / OUTS_PER_INNING)}.${outs % OUTS_PER_INNING}`;

/**
 * 完了イニング数とイニング途中のアウト数から、投球回を "5 1/3" 形式でフォーマットする。
 *
 * `partialOuts` が `null`（端数の記録が無い＝ちょうど完了イニングで降板）の場合は
 * 分数を付けずに完了イニング数のみを返す。
 */
export const formatInningsPitched = (
  inningsPitched: number,
  partialOuts: number | null,
): string => {
  if (partialOuts == null) return `${inningsPitched}`;
  return `${inningsPitched} ${partialOuts}/${OUTS_PER_INNING}`;
};
