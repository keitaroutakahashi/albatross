/**
 * 率（打率・出塁率・長打率・OPS など）を表示用の文字列にフォーマットする。
 *
 * 小数第3位まで表示し、"1.000" 以外は先頭の 0 を落として ".317" 表記にする。
 * `value` が `null`（分母が 0 で算出できない）の場合は `fallback`（既定 "-"）を返す。
 *
 * @param value     率の値（null は算出不可を表す）
 * @param fallback  算出できないときの表示文字列（既定 "-"）
 */
export const formatRate = (value: number | null, fallback = "-"): string => {
  if (value === null) return fallback;

  return value >= 1 ? value.toFixed(3) : value.toFixed(3).slice(1);
};
