"use server";

import { redirect } from "next/navigation";
import {
  parseAtBats,
  parseStolenBases,
  STOLEN_BASES_FIELD,
} from "@/app/(private)/admin/_schemas/plate-appearance";
import {
  revalidateAll,
  toFailureState,
  toFieldErrorState,
} from "@/app/(private)/admin/_utils/action";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { requireAccess } from "@/app/(private)/admin/_utils/auth";
import { findGameId, isGameMemberOf } from "@/app/(private)/admin/_utils/game";
import { syncBattingTotals } from "@/app/(private)/admin/_utils/game-stats";
import prisma from "@/lib/prisma";

/**
 * 1 人分の打席を、送信された内容に置き換える。
 * 打席番号は行の位置で決まり、フォームから外した（空にした）打席は削除する。
 * 盗塁数（その試合の合計）も、同じ画面で保存する。
 * 試合の安打（自）・失策（相手）も、同じトランザクションで再計算する。
 */
export const savePlateAppearances = async (
  eventId: number,
  gameMemberId: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAccess("events");

  const parsed = parseAtBats(formData);
  const stolen = parseStolenBases(formData);
  if (!parsed.success || !stolen.success) {
    return toFieldErrorState(formData, {
      ...(parsed.success ? {} : parsed.fieldErrors),
      ...(stolen.success ? {} : { [STOLEN_BASES_FIELD]: stolen.message }),
    });
  }

  try {
    const gameId = await findGameId(eventId);
    if (gameId === null || !(await isGameMemberOf(gameId, gameMemberId))) {
      return { message: "データが見つかりません" };
    }

    await prisma.$transaction(async (tx) => {
      await tx.plateAppearance.deleteMany({
        where: {
          gameMemberId,
          atBatInGame: { notIn: parsed.entries.map((e) => e.atBatInGame) },
        },
      });
      for (const entry of parsed.entries) {
        await tx.plateAppearance.upsert({
          where: {
            gameMemberId_atBatInGame: {
              gameMemberId,
              atBatInGame: entry.atBatInGame,
            },
          },
          create: { gameMemberId, ...entry },
          update: entry,
        });
      }
      await tx.gameMember.update({
        where: { id: gameMemberId },
        data: { stolenBases: stolen.stolenBases },
      });
      await syncBattingTotals(tx, gameId);
    });
  } catch (error) {
    return toFailureState(error, formData);
  }

  revalidateAll();
  redirect(`/admin/events/${eventId}/at-bats`);
};
