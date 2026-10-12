"use server";

import { redirect } from "next/navigation";
import { groundSchema } from "@/app/(private)/admin/_schemas/ground";
import {
  parseForm,
  revalidateAll,
  toDeleteFailureState,
  toFailureState,
} from "@/app/(private)/admin/_utils/action";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { requireAdmin } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

export const createGround = async (
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAdmin();
  const parsed = parseForm(groundSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    await prisma.ground.create({ data: parsed.data });
  } catch (error) {
    return toFailureState(error, formData);
  }

  revalidateAll();
  redirect("/admin/grounds");
};

export const updateGround = async (
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAdmin();
  const parsed = parseForm(groundSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    await prisma.ground.update({ where: { id }, data: parsed.data });
  } catch (error) {
    return toFailureState(error, formData);
  }

  revalidateAll();
  redirect("/admin/grounds");
};

export const deleteGround = async (id: number): Promise<ActionState> => {
  await requireAdmin();

  try {
    await prisma.ground.delete({ where: { id } });
  } catch (error) {
    return toDeleteFailureState(error);
  }

  revalidateAll();
  redirect("/admin/grounds");
};
