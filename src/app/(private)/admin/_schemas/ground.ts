import { z } from "zod";
import {
  optionalText,
  requiredText,
} from "@/app/(private)/admin/_schemas/fields";

export const groundSchema = z.object({
  name: requiredText(50),
  address: requiredText(200),
  access: optionalText(500),
  url: requiredText(500).pipe(z.url("URL の形式で入力してください")),
  imagePath: optionalText(200),
});
