"use server";

import { redirect } from "next/navigation";
import {
  lineupFieldName,
  parseLineup,
} from "@/app/(private)/admin/_schemas/lineup";
import {
  revalidateAll,
  toFailureState,
  toFieldErrorState,
} from "@/app/(private)/admin/_utils/action";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { requireAdmin } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

/**
 * 出場メンバー（スタメン・ベンチ）を、送信された内容に置き換える。
 * 「出場なし」にしたメンバーは削除するが、打席・投手成績が残っている場合は
 * 成績まで消えてしまうため、先に成績を削除するよう案内する。
 */
export const saveLineup = async (
  eventId: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAdmin();

  try {
    const game = await prisma.game.findUnique({
      where: { eventId },
      include: {
        gameMembers: {
          include: { _count: { select: { plateAppearances: true } } },
        },
      },
    });
    if (!game) return { message: "データが見つかりません" };

    const members = await prisma.member.findMany({ select: { id: true } });
    const parsed = parseLineup(
      formData,
      members.map((m) => m.id),
    );
    if (!parsed.success) return toFieldErrorState(formData, parsed.fieldErrors);

    const entered = new Set(parsed.entries.map((e) => e.memberId));
    const removed = game.gameMembers.filter((gm) => !entered.has(gm.memberId));

    const pitching = await prisma.pitchingResult.findMany({
      where: { gameMemberId: { in: removed.map((gm) => gm.id) } },
      select: { gameMemberId: true },
    });
    const pitchers = new Set(pitching.map((p) => p.gameMemberId));
    const blocked: Record<string, string> = {};
    for (const gm of removed) {
      if (gm._count.plateAppearances > 0 || pitchers.has(gm.id)) {
        blocked[lineupFieldName("memberType", gm.memberId)] =
          "打席・投手成績があるため外せません。先に成績を削除してください";
      }
    }
    if (Object.keys(blocked).length > 0) {
      return toFieldErrorState(formData, blocked);
    }

    await prisma.$transaction([
      prisma.gameMember.deleteMany({
        where: { id: { in: removed.map((gm) => gm.id) } },
      }),
      ...parsed.entries.map(({ memberId, ...data }) =>
        prisma.gameMember.upsert({
          where: { gameId_memberId: { gameId: game.id, memberId } },
          create: { gameId: game.id, memberId, ...data },
          update: data,
        }),
      ),
    ]);
  } catch (error) {
    return toFailureState(error, formData);
  }

  revalidateAll();
  redirect(`/admin/events/${eventId}`);
};
