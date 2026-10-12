"use server";

import { redirect } from "next/navigation";
import { parseLineup } from "@/app/(private)/admin/_schemas/lineup";
import {
  revalidateAll,
  toFailureState,
  toFieldErrorState,
} from "@/app/(private)/admin/_utils/action";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { requireAccess } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

/**
 * 出場した選手（打順・守備位置・ベンチ）を、送信された内容に置き換える。
 * フォームから外した選手は削除するが、打席・投手の成績が残っている場合は
 * 成績まで消えてしまうため、先に成績を削除するよう案内する。
 * 盗塁数はこの画面では扱わないので、保存済みの値は変更しない。
 */
export const saveLineup = async (
  eventId: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAccess("events");

  const parsed = parseLineup(formData);
  if (!parsed.success) return toFieldErrorState(formData, parsed.fieldErrors);

  try {
    const game = await prisma.game.findUnique({
      where: { eventId },
      include: {
        gameMembers: {
          include: {
            member: { select: { name: true } },
            pitchingResult: { select: { id: true } },
            _count: { select: { plateAppearances: true } },
          },
        },
      },
    });
    if (!game) return { message: "データが見つかりません" };

    const entered = new Set(parsed.entries.map((e) => e.memberId));
    const removed = game.gameMembers.filter((gm) => !entered.has(gm.memberId));

    const blocked = removed.filter(
      (gm) => gm._count.plateAppearances > 0 || gm.pitchingResult !== null,
    );
    if (blocked.length > 0) {
      const names = blocked.map((gm) => gm.member.name).join("、");
      return {
        ...toFieldErrorState(formData, {}),
        message: `${names} は打席・投手の成績があるため外せません。先に成績を削除してください`,
      };
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
