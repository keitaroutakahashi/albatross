import { z } from "zod";
import { requiredInt } from "@/app/(private)/admin/_schemas/fields";

export const seasonSchema = z.object({
  season: requiredInt(2000, 2100),
});
