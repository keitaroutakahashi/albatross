import type { GameResult } from "@/generated/prisma/enums";

/**
 * 得点から試合結果を求める。どちらかが未入力なら判定できないため null を返す。
 */
export const calcGameResult = (
  teamScore: number | null,
  opponentScore: number | null,
): GameResult | null => {
  if (teamScore === null || opponentScore === null) return null;
  if (teamScore > opponentScore) return "win";
  if (teamScore < opponentScore) return "lose";
  return "draw";
};
