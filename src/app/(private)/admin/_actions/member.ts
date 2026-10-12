"use server";

import { redirect } from "next/navigation";
import { memberSchema } from "@/app/(private)/admin/_schemas/member";
import {
  parseForm,
  revalidateAll,
  toDeleteFailureState,
  toFailureState,
} from "@/app/(private)/admin/_utils/action";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { requireAdmin } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

export const createMember = async (
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAdmin();
  const parsed = parseForm(memberSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    await prisma.member.create({ data: parsed.data });
  } catch (error) {
    return toFailureState(error, formData);
  }

  revalidateAll();
  redirect("/admin/members");
};

export const updateMember = async (
  id: number,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAdmin();
  const parsed = parseForm(memberSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    await prisma.member.update({ where: { id }, data: parsed.data });
  } catch (error) {
    return toFailureState(error, formData);
  }

  revalidateAll();
  redirect("/admin/members");
};

export const deleteMember = async (id: number): Promise<ActionState> => {
  await requireAdmin();

  try {
    await prisma.member.delete({ where: { id } });
  } catch (error) {
    return toDeleteFailureState(error);
  }

  revalidateAll();
  redirect("/admin/members");
};
