import { requireAccess } from "@/app/(private)/admin/_utils/auth";
import { sortMembersByUniformNumber } from "@/app/(private)/admin/_utils/member-order";
import prisma from "@/lib/prisma";

export const getMemberList = async () => {
  await requireAccess("members");
  // 背番号は文字列で、DB の並び替えでは 10 が 2 より前になるため、取得後に並べる
  const members = await prisma.member.findMany();
  return sortMembersByUniformNumber(members);
};

export const getMember = async (id: number) => {
  await requireAccess("members");
  return prisma.member.findUnique({ where: { id } });
};
