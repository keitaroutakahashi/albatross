"use server";

import { redirect } from "next/navigation";
import { practiceMemberSchema } from "@/app/(private)/admin/_schemas/practice-member";
import {
  parseForm,
  revalidateAll,
  toFailureState,
} from "@/app/(private)/admin/_utils/action";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { requireAdmin } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

/** 練習の参加メンバーを、送信された内容に置き換える */
export const savePracticeMembers = async (
  eventId: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAdmin();
  const parsed = parseForm(practiceMemberSchema, formData);
  if (!parsed.success) return parsed.state;
  const { memberIds } = parsed.data;

  try {
    const practice = await prisma.practice.findUnique({ where: { eventId } });
    if (!practice) return { message: "データが見つかりません" };

    await prisma.$transaction([
      prisma.practiceMember.deleteMany({
        where: { practiceId: practice.id, memberId: { notIn: memberIds } },
      }),
      prisma.practiceMember.createMany({
        data: memberIds.map((memberId) => ({
          practiceId: practice.id,
          memberId,
        })),
        skipDuplicates: true,
      }),
    ]);
  } catch (error) {
    return toFailureState(error, formData);
  }

  revalidateAll();
  redirect(`/admin/events/${eventId}`);
};
