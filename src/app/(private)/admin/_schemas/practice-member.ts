import { z } from "zod";
import { arrayOf, requiredInt } from "@/app/(private)/admin/_schemas/fields";

export const practiceMemberSchema = z.object({
  memberIds: arrayOf(requiredInt(1, 2_147_483_647)),
});
