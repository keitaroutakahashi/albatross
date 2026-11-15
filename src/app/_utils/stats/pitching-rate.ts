import { OUTS_PER_GAME } from "@/app/_utils/stats/era";

/**
 * 7 イニングあたりの個数（K/7・BB/7）を算出する。
 * 防御率と同じく、草野球の 7 イニング制に合わせて 9 イニングではなく 7 イニング基準にする。
 * アウトを 1 つも取っていない（`outs` が 0）ときは `null` を返す。
 */
export const calculatePerSevenInnings = ({
  count,
  outs,
}: {
  count: number;
  outs: number;
}): number | null => (outs > 0 ? (count * OUTS_PER_GAME) / outs : null);

/** K/BB（奪三振 ÷ 与四球）を算出する。与四球が 0 のときは `null` を返す。 */
export const calculateStrikeoutWalkRatio = ({
  strikeouts,
  walks,
}: {
  strikeouts: number;
  walks: number;
}): number | null => (walks > 0 ? strikeouts / walks : null);
