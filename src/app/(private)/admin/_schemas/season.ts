import { z } from "zod";
import {
  optionalText,
  requiredInt,
} from "@/app/(private)/admin/_schemas/fields";

export const seasonSchema = z.object({
  season: requiredInt(2000, 2100),
  name: optionalText(50),
});
