"use server";

import { redirect } from "next/navigation";
import { userSchema } from "@/app/(private)/admin/_schemas/user";
import {
  parseForm,
  revalidateAll,
  toDeleteFailureState,
  toFailureState,
  toFieldErrorState,
} from "@/app/(private)/admin/_utils/action";
import type { ActionState } from "@/app/(private)/admin/_utils/action-state";
import { requireAccess } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

/** 管理者が 0 人になると、誰も管理できなくなるため、最後の 1 人は外せない */
const isLastAdmin = async (id: number): Promise<boolean> => {
  const [target, admins] = await Promise.all([
    prisma.user.findUnique({ where: { id }, select: { role: true } }),
    prisma.user.count({ where: { role: "admin" } }),
  ]);
  return target?.role === "admin" && admins <= 1;
};

export const createUser = async (
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  await requireAccess("users");
  const parsed = parseForm(userSchema, formData);
  if (!parsed.success) return parsed.state;

  try {
    const { memberId, ...data } = parsed.data;
    await prisma.user.create({
      data: {
        ...data,
        ...(memberId && { member: { connect: { id: memberId } } }),
      },
    });
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
  await requireAccess("users");
  const parsed = parseForm(userSchema, formData);
  if (!parsed.success) return parsed.state;

  if (parsed.data.role !== "admin" && (await isLastAdmin(id))) {
    return toFieldErrorState(formData, {
      role: "最後の管理者は管理者以外に変更できません",
    });
  }

  try {
    const { memberId, ...data } = parsed.data;
    await prisma.user.update({
      where: { id },
      data: {
        ...data,
        member: memberId ? { connect: { id: memberId } } : { disconnect: true },
      },
    });
  } catch (error) {
    return toFailureState(error, formData, { uniqueField: "email" });
  }

  revalidateAll();
  redirect("/admin/users");
};

export const deleteUser = async (id: number): Promise<ActionState> => {
  await requireAccess("users");

  if (await isLastAdmin(id)) {
    return { message: "最後の管理者は削除できません" };
  }

  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    return toDeleteFailureState(error);
  }

  revalidateAll();
  redirect("/admin/users");
};
