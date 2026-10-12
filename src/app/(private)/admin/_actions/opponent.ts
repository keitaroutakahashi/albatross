"use server";

import { redirect } from "next/navigation";
import { opponentSchema } from "@/app/(private)/admin/_schemas/opponent";
import {
  parseForm,
  revalidateAll,
  toDeleteFailureState,
  toFailureState,
} from "@/app/(private)/admin/_utils/action";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { requireAdmin } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

export const createOpponent = async (
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAdmin();
  const parsed = parseForm(opponentSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    await prisma.opponent.create({ data: parsed.data });
  } catch (error) {
    return toFailureState(error, formData, { uniqueField: "name" });
  }

  revalidateAll();
  redirect("/admin/opponents");
};

export const updateOpponent = async (
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAdmin();
  const parsed = parseForm(opponentSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    await prisma.opponent.update({ where: { id }, data: parsed.data });
  } catch (error) {
    return toFailureState(error, formData, { uniqueField: "name" });
  }

  revalidateAll();
  redirect("/admin/opponents");
};

export const deleteOpponent = async (id: number): Promise<ActionState> => {
  await requireAdmin();

  try {
    await prisma.opponent.delete({ where: { id } });
  } catch (error) {
    return toDeleteFailureState(error);
  }

  revalidateAll();
  redirect("/admin/opponents");
};
