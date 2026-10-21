import { requireAccess } from "@/app/(private)/admin/_utils/auth";
import { sortMembersForSelect } from "@/app/(private)/admin/_utils/member-order";
import prisma from "@/lib/prisma";

export const getUserList = async () => {
  await requireAccess("users");
  return prisma.user.findMany({ orderBy: { createdAt: "asc" } });
};

export const getUser = async (id: number) => {
  await requireAccess("users");
  return prisma.user.findUnique({
    where: { id },
    include: {
      member: { select: { id: true } },
      _count: { select: { passkeys: true } },
    },
  });
};

/** 他のユーザーに紐づいていない選手（編集中のユーザー自身の選手は含める） */
export const getLinkableMembers = async (userId?: number) => {
  await requireAccess("users");
  const members = await prisma.member.findMany({
    where: { OR: [{ userId: null }, ...(userId ? [{ userId }] : [])] },
    select: { id: true, name: true, uniformNumber: true, isActive: true },
  });
  return sortMembersForSelect(members);
};
