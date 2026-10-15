import { z } from "zod";
import { arrayOf, requiredInt } from "@/app/(private)/admin/_schemas/fields";

export const MAX_INNINGS = 30;

/**
 * イニング番号は入力順（1 回から連番）で決まるため、得点だけを列として受け取る。
 * 献上点（試合開始時に与えられた得点）と自チームの失策は試合に 1 つずつ。
 */
export const inningSchema = z
  .object({
    teamScore: arrayOf(requiredInt(0, 99)),
    opponentScore: arrayOf(requiredInt(0, 99)),
    teamForfeitedRuns: requiredInt(0, 99),
    opponentForfeitedRuns: requiredInt(0, 99),
    teamErrors: requiredInt(0, 99),
  })
  .refine(
    (v) =>
      v.teamScore.length === v.opponentScore.length &&
      v.teamScore.length <= MAX_INNINGS,
    { path: ["teamScore"], message: `イニングは ${MAX_INNINGS} 回までです` },
  );
