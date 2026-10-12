"use server";

import { redirect } from "next/navigation";
import { seasonSchema } from "@/app/(private)/admin/_schemas/season";
import {
  parseForm,
  revalidateAll,
  toDeleteFailureState,
  toFailureState,
} from "@/app/(private)/admin/_utils/action";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { requireAdmin } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

export const createSeason = async (
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAdmin();
  const parsed = parseForm(seasonSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    await prisma.season.create({ data: parsed.data });
  } catch (error) {
    return toFailureState(error, formData, { uniqueField: "season" });
  }

  revalidateAll();
  redirect("/admin/seasons");
};

export const updateSeason = async (
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAdmin();
  const parsed = parseForm(seasonSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    await prisma.season.update({ where: { id }, data: parsed.data });
  } catch (error) {
    return toFailureState(error, formData, { uniqueField: "season" });
  }

  revalidateAll();
  redirect("/admin/seasons");
};

export const deleteSeason = async (id: number): Promise<ActionState> => {
  await requireAdmin();

  try {
    await prisma.season.delete({ where: { id } });
  } catch (error) {
    return toDeleteFailureState(error);
  }

  revalidateAll();
  redirect("/admin/seasons");
};
