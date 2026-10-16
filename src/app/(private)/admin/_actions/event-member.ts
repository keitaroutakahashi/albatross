"use server";

import { redirect } from "next/navigation";
import { eventMemberSchema } from "@/app/(private)/admin/_schemas/event-member";
import {
  parseForm,
  revalidateAll,
  toFailureState,
  toFieldErrorState,
} from "@/app/(private)/admin/_utils/action";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { requireAccess } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

/**
 * 参加メンバーを、送信された内容に置き換える（試合・練習共通）。
 * 試合では、参加メンバーの中からオーダーの選手を選ぶため、
 * すでにオーダーに入っている人、MVP に登録されている人は参加メンバーから外せない。
 */
export const saveEventMembers = async (
  eventId: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAccess("events");
  const parsed = parseForm(eventMemberSchema, formData);
  if (!parsed.success) return parsed.state;
  const { memberIds } = parsed.data;

  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        game: { select: { id: true } },
        practice: { select: { id: true } },
      },
    });
    if (!event) return { message: "データが見つかりません" };

    if (event.game) {
      const gameId = event.game.id;
      const lineup = await prisma.gameMember.findMany({
        where: { gameId, memberId: { notIn: memberIds } },
        select: { member: { select: { name: true } } },
      });
      if (lineup.length > 0) {
        const names = lineup.map((gm) => gm.member.name).join("、");
        return {
          ...toFieldErrorState(formData, {}),
          message: `${names} はオーダーに登録されているため外せません。先にオーダーから外してください`,
        };
      }

      const mvps = await prisma.gameMvp.findMany({
        where: { gameId, memberId: { notIn: memberIds } },
        select: {
          participant: { select: { member: { select: { name: true } } } },
        },
      });
      if (mvps.length > 0) {
        const names = mvps.map((m) => m.participant.member.name).join("、");
        return {
          ...toFieldErrorState(formData, {}),
          message: `${names} は MVP に登録されているため外せません。先に「試合の振り返り」から MVP を外してください`,
        };
      }

      await prisma.$transaction([
        prisma.gameParticipant.deleteMany({
          where: { gameId, memberId: { notIn: memberIds } },
        }),
        prisma.gameParticipant.createMany({
          data: memberIds.map((memberId) => ({ gameId, memberId })),
          skipDuplicates: true,
        }),
      ]);
    } else if (event.practice) {
      const practiceId = event.practice.id;
      await prisma.$transaction([
        prisma.practiceMember.deleteMany({
          where: { practiceId, memberId: { notIn: memberIds } },
        }),
        prisma.practiceMember.createMany({
          data: memberIds.map((memberId) => ({ practiceId, memberId })),
          skipDuplicates: true,
        }),
      ]);
    } else {
      return { message: "データが見つかりません" };
    }
  } catch (error) {
    return toFailureState(error, formData);
  }

  revalidateAll();
  redirect(`/admin/events/${eventId}`);
};
