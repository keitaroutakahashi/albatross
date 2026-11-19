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

/**
 * ISO（純長打率 = 長打率 − 打率）を算出する。
 * どちらかが `null`（算出不可）のときは `null` を返す。
 */
export const calculateIso = ({
  sluggingPercentage,
  average,
}: {
  sluggingPercentage: number | null;
  average: number | null;
}): number | null =>
  sluggingPercentage !== null && average !== null
    ? sluggingPercentage - average
    : null;

/**
 * BABIP（本塁打を除くインプレー打球が安打になった割合）を算出する。
 *
 * BABIP = (安打 − 本塁打) ÷ (打数 − 三振 − 本塁打 + 犠飛)
 *
 * 分母が 0 以下のときは `null` を返す。
 */
export const calculateBabip = ({
  hits,
  homeRuns,
  atBats,
  strikeouts,
  sacrificeFlies,
}: {
  hits: number;
  homeRuns: number;
  atBats: number;
  strikeouts: number;
  sacrificeFlies: number;
}): number | null => {
  const denominator = atBats - strikeouts - homeRuns + sacrificeFlies;

  return denominator > 0 ? (hits - homeRuns) / denominator : null;
};

/**
 * 打席あたりの割合（四死球率・三振率など）を算出する。
 * 打席数が 0 のときは `null` を返す。
 */
export const calculateRatePerPlateAppearance = ({
  count,
  plateAppearances,
}: {
  count: number;
  plateAppearances: number;
}): number | null => (plateAppearances > 0 ? count / plateAppearances : null);

/**
 * BB/K（四死球 ÷ 三振）を算出する。三振が 0 のときは `null` を返す。
 */
export const calculateWalkStrikeoutRatio = ({
  walks,
  strikeouts,
}: {
  walks: number;
  strikeouts: number;
}): number | null => (strikeouts > 0 ? walks / strikeouts : null);

/**
 * 長打割合（長打 ÷ 安打）を算出する。長打は二塁打・三塁打・本塁打。
 * 安打が 0 のときは `null` を返す。
 */
export const calculateExtraBaseHitRate = ({
  extraBaseHits,
  hits,
}: {
  extraBaseHits: number;
  hits: number;
}): number | null => (hits > 0 ? extraBaseHits / hits : null);

/**
 * 生還率（得点 ÷ (安打 + 四死球)）を算出する。出塁した走者のうち、ホームに還った割合の目安。
 * 失策や野選での出塁は含まれない。出塁が 0 のときは `null` を返す。
 */
export const calculateScoringRate = ({
  runs,
  hits,
  walks,
}: {
  runs: number;
  hits: number;
  walks: number;
}): number | null => (hits + walks > 0 ? runs / (hits + walks) : null);

/** 1 試合あたりの回数を算出する。試合数が 0 のときは `null` を返す。 */
export const calculatePerGame = ({
  count,
  games,
}: {
  count: number;
  games: number;
}): number | null => (games > 0 ? count / games : null);
