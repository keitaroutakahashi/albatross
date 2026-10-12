"use server";

import { redirect } from "next/navigation";
import { plateAppearanceSchema } from "@/app/(private)/admin/_schemas/plate-appearance";
import {
  parseForm,
  revalidateAll,
  toDeleteFailureState,
  toFailureState,
  toFieldErrorState,
} from "@/app/(private)/admin/_utils/action";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { requireAdmin } from "@/app/(private)/admin/_utils/auth";
import { findGameId, isGameMemberOf } from "@/app/(private)/admin/_utils/game";
import prisma from "@/lib/prisma";

const NOT_FOUND: ActionState = { message: "データが見つかりません" };
const NOT_IN_GAME = "この試合の出場メンバーを選択してください";

export const createPlateAppearance = async (
  eventId: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAdmin();
  const parsed = parseForm(plateAppearanceSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    const gameId = await findGameId(eventId);
    if (gameId === null) return NOT_FOUND;
    if (!(await isGameMemberOf(gameId, parsed.data.gameMemberId))) {
      return toFieldErrorState(formData, { gameMemberId: NOT_IN_GAME });
    }

    await prisma.plateAppearance.create({ data: parsed.data });
  } catch (error) {
    return toFailureState(error, formData, { uniqueField: "atBatInGame" });
  }

  revalidateAll();
  redirect(`/admin/events/${eventId}/at-bats`);
};

export const updatePlateAppearance = async (
  eventId: number,
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAdmin();
  const parsed = parseForm(plateAppearanceSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    const gameId = await findGameId(eventId);
    if (gameId === null) return NOT_FOUND;
    if (!(await isGameMemberOf(gameId, parsed.data.gameMemberId))) {
      return toFieldErrorState(formData, { gameMemberId: NOT_IN_GAME });
    }

    // 他の試合のデータを更新できないよう、試合の範囲で絞り込む
    const { count } = await prisma.plateAppearance.updateMany({
      where: { id, gameMember: { gameId } },
      data: parsed.data,
    });
    if (count === 0) return NOT_FOUND;
  } catch (error) {
    return toFailureState(error, formData, { uniqueField: "atBatInGame" });
  }

  revalidateAll();
  redirect(`/admin/events/${eventId}/at-bats`);
};

export const deletePlateAppearance = async (
  eventId: number,
  id: number,
): Promise<ActionState> => {
  await requireAdmin();

  try {
    const gameId = await findGameId(eventId);
    if (gameId === null) return NOT_FOUND;

    const { count } = await prisma.plateAppearance.deleteMany({
      where: { id, gameMember: { gameId } },
    });
    if (count === 0) return NOT_FOUND;
  } catch (error) {
    return toDeleteFailureState(error);
  }

  revalidateAll();
  redirect(`/admin/events/${eventId}/at-bats`);
};
