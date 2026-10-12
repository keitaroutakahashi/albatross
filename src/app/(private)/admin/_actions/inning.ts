"use server";

import { redirect } from "next/navigation";
import { inningSchema } from "@/app/(private)/admin/_schemas/inning";
import {
  parseForm,
  revalidateAll,
  toFailureState,
} from "@/app/(private)/admin/_utils/action";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { requireAccess } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

/**
 * イニングごとの得点を、送信された内容に置き換える。
 * 試合結果（得点・安打など）は手入力のため、ここでは更新しない。
 */
export const saveInnings = async (
  eventId: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAccess("events");
  const parsed = parseForm(inningSchema, formData);
  if (!parsed.success) return parsed.state;
  const { teamScore, opponentScore } = parsed.data;

  try {
    const game = await prisma.game.findUnique({ where: { eventId } });
    if (!game) return { message: "データが見つかりません" };

    await prisma.$transaction([
      prisma.inning.deleteMany({ where: { gameId: game.id } }),
      prisma.inning.createMany({
        data: teamScore.map((score, index) => ({
          gameId: game.id,
          inningNumber: index + 1,
          teamScore: score,
          opponentScore: opponentScore[index],
        })),
      }),
    ]);
  } catch (error) {
    return toFailureState(error, formData);
  }

  revalidateAll();
  redirect(`/admin/events/${eventId}`);
};
