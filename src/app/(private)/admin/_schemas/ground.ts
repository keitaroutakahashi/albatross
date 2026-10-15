import { z } from "zod";
import { parseGoogleMapEmbed } from "@/app/_utils/google-map";
import {
  optionalText,
  requiredText,
} from "@/app/(private)/admin/_schemas/fields";

/**
 * Google マップの埋め込みコード（iframe タグ、または src の URL）。
 * 保存するのは、取り出した URL だけ。未入力は null として扱う。
 */
const mapEmbedUrl = z
  .string()
  .trim()
  .max(2000, "2000文字以内で入力してください")
  .optional()
  .transform((value, ctx) => {
    if (!value) return null;
    const result = parseGoogleMapEmbed(value);
    if (!result.ok) {
      ctx.addIssue({ code: "custom", message: result.message });
      return z.NEVER;
    }
    return result.url;
  });

export const groundSchema = z.object({
  name: requiredText(50),
  address: requiredText(200),
  access: optionalText(500),
  url: requiredText(500).pipe(z.url("URL の形式で入力してください")),
  imagePath: optionalText(200),
  mapEmbedUrl,
});
