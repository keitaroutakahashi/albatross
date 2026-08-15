/** 打率を算出する。打数 0 のときは `null` を返す。 */
export const calculateBattingAverage = ({
  hits,
  atBats,
}: {
  hits: number;
  atBats: number;
}): number | null => (atBats > 0 ? hits / atBats : null);

/** 長打率を算出する。打数 0 のときは `null` を返す。 */
export const calculateSluggingPercentage = ({
  totalBases,
  atBats,
}: {
  totalBases: number;
  atBats: number;
}): number | null => (atBats > 0 ? totalBases / atBats : null);

/**
 * 出塁率を算出する。
 *
 * 出塁率 = (安打 + 四死球) ÷ (打数 + 四死球 + 犠飛)
 *
 * `walks` は四球・死球を合算した数（四死球）を渡すこと。
 * 分母が 0 のときは `null` を返す。
 */
export const calculateOnBasePercentage = ({
  hits,
  walks,
  atBats,
  sacrificeFlies,
}: {
  hits: number;
  walks: number;
  atBats: number;
  sacrificeFlies: number;
}): number | null => {
  const denominator = atBats + walks + sacrificeFlies;

  return denominator > 0 ? (hits + walks) / denominator : null;
};

/**
 * OPS（出塁率 + 長打率）を算出する。
 * どちらかが `null`（算出不可）のときは `null` を返す。
 */
export const calculateOps = ({
  onBasePercentage,
  sluggingPercentage,
}: {
  onBasePercentage: number | null;
  sluggingPercentage: number | null;
}): number | null =>
  onBasePercentage !== null && sluggingPercentage !== null
    ? onBasePercentage + sluggingPercentage
    : null;
