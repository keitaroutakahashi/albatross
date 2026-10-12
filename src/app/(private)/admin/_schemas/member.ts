import { z } from "zod";
import {
  checkbox,
  enumArrayField,
  enumField,
  requiredText,
} from "@/app/(private)/admin/_schemas/fields";
import { Hand, MemberCategory, Position } from "@/generated/prisma/enums";

export const memberSchema = z
  .object({
    name: requiredText(50),
    uniformNumber: requiredText(3),
    position: enumField(Position),
    subPositions: enumArrayField(Position),
    throwHand: enumField(Hand),
    batHand: enumField(Hand),
    category: enumField(MemberCategory),
    isActive: checkbox,
  })
  .refine((v) => !v.subPositions.includes(v.position), {
    path: ["subPositions"],
    message: "メインポジションと重複しています",
  });
