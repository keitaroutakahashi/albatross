/** 各項目で表示する順位（同順位は全員表示するため人数は 3 人以上になることがある） */
const DISPLAY_RANK = 3;

/** ランキングの元になる選手情報 */
export type MemberStatsBase = {
  memberId: number;
  name: string;
  uniformNumber: string;
};

export type MemberRanking = MemberStatsBase & {
  /** 同順位は同じ値になる（1, 2, 2, 4 …） */
  rank: number;
  value: number;
};

/**
 * 全件のランキングを作る。同順位は同じ rank になる（1, 2, 2, 4 …）。
 * order が "asc" の場合は値が小さいほど上位（防御率など）。
 * 対象外の選手（0 の記録など）は呼び出し側で除外しておくこと。
 */
export const rankMemberStats = <T extends MemberStatsBase>(
  stats: T[],
  getValue: (stat: T) => number,
  order: "asc" | "desc" = "desc",
): MemberRanking[] => {
  const sorted = [...stats].sort(
    (a, b) =>
      (order === "asc"
        ? getValue(a) - getValue(b)
        : getValue(b) - getValue(a)) ||
      // 同値のときは背番号順にして表示順を安定させる
      a.uniformNumber.localeCompare(b.uniformNumber, "ja", { numeric: true }),
  );

  const ranking: MemberRanking[] = [];

  sorted.forEach((stat, index) => {
    const value = getValue(stat);
    const previous = ranking.at(-1);
    // 直前と同値なら同順位、そうでなければ「自分より上にいる人数 + 1」位
    const rank = previous?.value === value ? previous.rank : index + 1;

    ranking.push({
      memberId: stat.memberId,
      name: stat.name,
      uniformNumber: stat.uniformNumber,
      rank,
      value,
    });
  });

  return ranking;
};

/**
 * 上位 3 位までのランキングを作る。同順位は全員含める（例: 2 位が 3 人いれば 5 人返る）。
 */
export const toMemberRanking = <T extends MemberStatsBase>(
  stats: T[],
  getValue: (stat: T) => number,
  order: "asc" | "desc" = "desc",
): MemberRanking[] =>
  rankMemberStats(stats, getValue, order).filter(
    (ranking) => ranking.rank <= DISPLAY_RANK,
  );
