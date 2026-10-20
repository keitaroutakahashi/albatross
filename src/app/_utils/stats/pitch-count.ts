import { OUTS_PER_INNING } from "@/app/_utils/stats/innings";

/** 1 イニングあたりの球数の算出に必要な、登板ごとの成績 */
type PitchCountInput = {
  /** 登板ごとの合計球数（未入力は null） */
  pitchCount: number | null;
  /** 完了イニング数 */
  inningsPitched: number;
  /** イニング途中で降板した際のアウト数（0, 1, 2 / null） */
  partialOuts: number | null;
};

/**
 * 1 イニングあたりの平均球数（P/IP）を算出する。
 *
 * 1 イニングあたりの球数 = 合計球数 ÷ 投球回 = 合計球数 × 3 ÷ 奪ったアウトの総数
 *
 * 投球回の端数（.1 / .2）は 1/3・2/3 イニングであり、そのまま割ると誤差が出るため、
 * アウト数を基準に計算する。球数が未入力の登板は、球数もアウト数も集計から除く
 * （片方だけ含めると、実際より少ない球数で割ってしまうため）。
 * 球数が入力された登板がない、またはアウトを 1 つも取っていない場合は null を返す。
 * 端数の丸めは表示の責務とし、ここでは丸めていない精度の値を返す。
 */
export const calculatePitchCountPerInning = (
  results: readonly PitchCountInput[],
): number | null => {
  let pitchCount = 0;
  let outs = 0;

  for (const result of results) {
    if (result.pitchCount === null) continue;
    pitchCount += result.pitchCount;
    outs += result.inningsPitched * OUTS_PER_INNING + (result.partialOuts ?? 0);
  }

  if (outs <= 0) return null;

  return (pitchCount * OUTS_PER_INNING) / outs;
};

/**
 * 1 イニングあたりの平均球数を、小数第 1 位まで四捨五入した表示用の文字列にする（例: 15.25 → "15.3"）。
 * 算出できない（null）ときは `fallback`（既定 "-"）を返す。
 */
export const formatPitchCountPerInning = (
  value: number | null,
  fallback = "-",
): string => (value === null ? fallback : value.toFixed(1));
