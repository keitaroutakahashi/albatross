import { z } from "zod";
import { requiredText } from "@/app/(private)/admin/_schemas/fields";

export const opponentSchema = z.object({
  name: requiredText(50),
});
