import { z } from "zod";
import { arrayOf, requiredInt } from "@/app/(private)/admin/_schemas/fields";

/** 参加メンバーの入力（試合・練習共通）。選手 ID の配列 */
export const eventMemberSchema = z.object({
  memberIds: arrayOf(requiredInt(1, 2_147_483_647)),
});
