import { requireAccess } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

export const getUserList = async () => {
  await requireAccess("users");
  return prisma.user.findMany({ orderBy: { createdAt: "asc" } });
};

export const getUser = async (id: number) => {
  await requireAccess("users");
  return prisma.user.findUnique({ where: { id } });
};
