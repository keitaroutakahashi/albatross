/** リーグで絞り込まない（すべてのリーグ）ことを表すセレクトの値 */
export const ALL_LEAGUES = "all";

/** セレクトの値を、取得関数に渡すリーグ ID に変換する。「すべて」や不正な値は undefined（絞り込まない） */
export const toLeagueId = (value: string): number | undefined => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : undefined;
};
