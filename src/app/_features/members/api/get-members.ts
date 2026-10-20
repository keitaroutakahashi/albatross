import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

// 助っ人は選手一覧・選手詳細ページの対象外
export const getMembers = async () => {
  const members = await prisma.member.findMany({
    where: { category: "regular" },
  });

  return members;
};

export const getMember = async (id: number) => {
  const member = await prisma.member.findFirst({
    where: { id, category: "regular" },
  });

  if (!member) notFound();

  return member;
};
