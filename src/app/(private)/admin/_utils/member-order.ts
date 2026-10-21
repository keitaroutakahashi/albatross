type Sortable = {
  isActive: boolean;
  uniformNumber: string | null;
  name: string;
};

const compareByUniformNumber = (a: Sortable, b: Sortable) =>
  Number(a.uniformNumber === null) - Number(b.uniformNumber === null) ||
  (a.uniformNumber ?? "").localeCompare(b.uniformNumber ?? "", "ja", {
    numeric: true,
  }) ||
  (b.uniformNumber?.length ?? 0) - (a.uniformNumber?.length ?? 0) ||
  a.name.localeCompare(b.name, "ja");

/**
 * 現役メンバーを先に、その中で背番号の小さい順に並べる。
 * 背番号は文字列のため、数値として比べる（文字列順だと 10 が 2 より前に来る）。
 * 背番号が無い（助っ人）メンバーは最後に置く。
 * 数値が同じ背番号（001・01・1 など）は、0 が多い（文字数が多い）方を先にし、
 * それも同じなら名前順にする。
 */
export const sortMembersByUniformNumber = <T extends Sortable>(
  members: readonly T[],
): T[] =>
  [...members].sort(
    (a, b) =>
      Number(b.isActive) - Number(a.isActive) || compareByUniformNumber(a, b),
  );

/**
 * セレクトボックスなど、選手を選ぶ UI 向けの並び順。
 * `sortMembersByUniformNumber` と同じ順だが、背番号が無いメンバーは
 * 現役かどうかに関わらず必ず一番最後に置く。
 */
export const sortMembersForSelect = <T extends Sortable>(
  members: readonly T[],
): T[] =>
  [...members].sort(
    (a, b) =>
      Number(a.uniformNumber === null) - Number(b.uniformNumber === null) ||
      Number(b.isActive) - Number(a.isActive) ||
      compareByUniformNumber(a, b),
  );
