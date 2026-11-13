/**
 * 出席率（0〜1）を計算する。開催済みのイベントが 0 件のときは算出できないため null を返す。
 *
 * @param attended 出席したイベント数
 * @param total    開催済みのイベント数
 */
export const calculateAttendanceRate = (
  attended: number,
  total: number,
): number | null => (total > 0 ? attended / total : null);

/** 出席率（0〜1）を "85.7%" 形式の文字列にフォーマットする */
export const formatAttendanceRate = (rate: number): string =>
  `${(rate * 100).toFixed(1)}%`;
