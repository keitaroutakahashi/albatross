import type { GameResult } from "@/generated/prisma/enums";

export type PitchingDecision = "win" | "loss";

/**
 * 責任投手の勝敗を、試合結果から求める。
 * 引き分けや結果が未確定の試合では勝敗がつかないため null を返す。
 */
export const resolvePitchingDecision = (
  isResponsible: boolean,
  gameResult: GameResult | null,
): PitchingDecision | null => {
  if (!isResponsible) return null;
  if (gameResult === "win") return "win";
  if (gameResult === "lose") return "loss";
  return null;
};
