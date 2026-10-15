import { z } from "zod";
import {
  checkbox,
  optionalInt,
  requiredId,
  requiredInt,
} from "@/app/(private)/admin/_schemas/fields";

const count = requiredInt(0, 99);

export const pitchingResultSchema = z.object({
  gameMemberId: requiredId,
  pitchingOrder: requiredInt(1, 20),
  inningsPitched: requiredInt(0, 30),
  partialOuts: optionalInt(0, 2),
  earnedRuns: count,
  runs: count,
  strikeouts: count,
  walks: count,
  hitByPitches: count,
  hitsAllowed: count,
  homeRunsAllowed: count,
  pitchCount: optionalInt(0, 999),
  isResponsible: checkbox,
});
