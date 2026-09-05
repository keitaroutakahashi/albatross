import { OUTS_PER_INNING } from "@/app/_utils/stats/innings";

/** 防御率（ERA）の算出に必要な投球成績 */
type EraInput = {
  /** 自責点 */
  earnedRuns: number;
  /** 完了イニング数（例: 5回投げたら 5） */
  inningsPitched: number;
  /** イニング途中で降板した際のアウト数（0, 1, 2 / null） */
  partialOuts?: number | null;
};

/** 1試合のイニング数（草野球は7イニング制） */
const INNINGS_PER_GAME = 7;
/** 1試合（7イニング）あたりのアウト数 */
const OUTS_PER_GAME = INNINGS_PER_GAME * OUTS_PER_INNING;

/**
 * 防御率（ERA）を算出する。
 *
 * 防御率 = 自責点 × 21 ÷ 奪ったアウトの総数
 * （アウト総数 = 完了イニング数 × 3 + イニング途中のアウト数）
 *
 * 草野球は7イニング制のため、9イニングではなく7イニング
 * （= 21アウト）あたりの自責点の平均値として算出する。
 *
 * 投球回の「.1 / .2」表記は実際には 1/3・2/3 の端数であり、
 * そのまま割り算すると誤差が出るため、アウトの総数を基準に計算する。
 *
 * アウトを1つも取っていない場合（投球回 0）は防御率を定義できないため
 * `null` を返す。表示側で "-" や "∞" などに変換すること。
 * 端数の丸めも表示の責務とし、ここでは丸めていない精度の値を返す。
 */
export const calculateEra = ({
  earnedRuns,
  inningsPitched,
  partialOuts,
}: EraInput): number | null => {
  const totalOuts = inningsPitched * OUTS_PER_INNING + (partialOuts ?? 0);

  if (totalOuts <= 0) return null;

  return (earnedRuns * OUTS_PER_GAME) / totalOuts;
};

/**
 * 防御率（ERA）を表示用の文字列にフォーマットする。
 *
 * 小数第2位まで四捨五入する（例: 3.375 → "3.38"）。
 * `calculateEra` が `null`（投球回0）を返した場合は `fallback`（既定 "-"）を返す。
 *
 * @param era       `calculateEra` の戻り値
 * @param fallback  防御率を算出できないときの表示文字列（既定 "-"）
 */
export const formatEra = (era: number | null, fallback = "-"): string => {
  if (era === null) return fallback;

  return era.toFixed(2);
};

/**
 * 投球成績から防御率（ERA）を算出し、表示用の文字列まで一度に取得する。
 *
 * `calculateEra` と `formatEra` を組み合わせたヘルパー。
 * 通算防御率の合算など中間値が必要な場面では `calculateEra` を、
 * 単に1つの成績を表示したいだけの場面ではこちらを使うとよい。
 *
 * @param input     防御率の算出に必要な投球成績
 * @param fallback  防御率を算出できないときの表示文字列（既定 "-"）
 */
export const formatEraFromStats = (input: EraInput, fallback = "-"): string =>
  formatEra(calculateEra(input), fallback);
