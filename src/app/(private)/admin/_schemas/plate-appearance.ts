import { z } from "zod";
import {
  checkbox,
  enumField,
  optionalEnumField,
  requiredId,
  requiredInt,
} from "@/app/(private)/admin/_schemas/fields";
import { AtBatResult, Position } from "@/generated/prisma/enums";

export const plateAppearanceSchema = z.object({
  gameMemberId: requiredId,
  inningNumber: requiredInt(1, 30),
  atBatInGame: requiredInt(1, 20),
  result: enumField(AtBatResult),
  direction: optionalEnumField(Position),
  rbi: requiredInt(0, 4),
  isScoringPosition: checkbox,
});
