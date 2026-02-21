import prisma from "@/lib/prisma";

export const getMembers = async () => {
  const members = await prisma.member.findMany();

  return members;
};
