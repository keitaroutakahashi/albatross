"use server";

import { redirect } from "next/navigation";
import { userSchema } from "@/app/(private)/admin/_schemas/user";
import {
  parseForm,
  revalidateAll,
  toDeleteFailureState,
  toFailureState,
} from "@/app/(private)/admin/_utils/action";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { requireAdmin } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

export const createUser = async (
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAdmin();
  const parsed = parseForm(userSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    await prisma.user.create({ data: parsed.data });
  } catch (error) {
    return toFailureState(error, formData, { uniqueField: "email" });
  }

  revalidateAll();
  redirect("/admin/users");
};

export const updateUser = async (
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAdmin();
  const parsed = parseForm(userSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    await prisma.user.update({ where: { id }, data: parsed.data });
  } catch (error) {
    return toFailureState(error, formData, { uniqueField: "email" });
  }

  revalidateAll();
  redirect("/admin/users");
};

export const deleteUser = async (id: number): Promise<ActionState> => {
  await requireAdmin();

  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    return toDeleteFailureState(error);
  }

  revalidateAll();
  redirect("/admin/users");
};
