import { z } from "zod";
import {
  enumField,
  optionalId,
  optionalText,
  requiredText,
} from "@/app/(private)/admin/_schemas/fields";
import { UserRole } from "@/generated/prisma/enums";

export const userSchema = z.object({
  email: requiredText(254).pipe(
    z.email("メールアドレスの形式で入力してください"),
  ),
  name: optionalText(50),
  role: enumField(UserRole),
  memberId: optionalId,
});
