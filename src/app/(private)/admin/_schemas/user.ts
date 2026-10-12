import { z } from "zod";
import {
  optionalText,
  requiredText,
} from "@/app/(private)/admin/_schemas/fields";

export const userSchema = z.object({
  email: requiredText(254).pipe(
    z.email("メールアドレスの形式で入力してください"),
  ),
  name: optionalText(50),
});
