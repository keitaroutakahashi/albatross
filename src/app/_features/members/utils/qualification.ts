/** 打率などの規定打席（この打席数に達していれば試合数に関わらず対象） */
const QUALIFIED_PLATE_APPEARANCES = 10;

/**
 * 規定打席を満たしているか判定する。
 *
 * 規定打席: 10 打席以上、またはシーズンの試合数以上の打席に立っていること。
 *
 * @param plateAppearances 選手のシーズン打席数
 * @param gameCount         シーズンの対象試合数
 */
export const isQualifiedBatter = (
  plateAppearances: number,
  gameCount: number,
): boolean =>
  plateAppearances >= QUALIFIED_PLATE_APPEARANCES ||
  plateAppearances >= gameCount;
