import { requireAdmin } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

export const getMemberList = async () => {
  await requireAdmin();
  // 現役メンバーを先に並べる
  return prisma.member.findMany({
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
  });
};

export const getMember = async (id: number) => {
  await requireAdmin();
  return prisma.member.findUnique({ where: { id } });
};
