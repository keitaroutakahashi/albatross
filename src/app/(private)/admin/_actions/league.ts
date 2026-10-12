"use server";

import { redirect } from "next/navigation";
import { leagueSchema } from "@/app/(private)/admin/_schemas/league";
import {
  parseForm,
  revalidateAll,
  toDeleteFailureState,
  toFailureState,
} from "@/app/(private)/admin/_utils/action";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { requireAccess } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

export const createLeague = async (
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAccess("options");
  const parsed = parseForm(leagueSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    await prisma.league.create({ data: parsed.data });
  } catch (error) {
    return toFailureState(error, formData, { uniqueField: "name" });
  }

  revalidateAll();
  redirect("/admin/leagues");
};

export const updateLeague = async (
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAccess("options");
  const parsed = parseForm(leagueSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    await prisma.league.update({ where: { id }, data: parsed.data });
  } catch (error) {
    return toFailureState(error, formData, { uniqueField: "name" });
  }

  revalidateAll();
  redirect("/admin/leagues");
};

export const deleteLeague = async (id: number): Promise<ActionState> => {
  await requireAccess("options");

  try {
    await prisma.league.delete({ where: { id } });
  } catch (error) {
    return toDeleteFailureState(error);
  }

  revalidateAll();
  redirect("/admin/leagues");
};
