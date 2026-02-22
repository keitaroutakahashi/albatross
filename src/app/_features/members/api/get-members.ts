import prisma from "@/lib/prisma";

export const getMembers = async () => {
  const members = await prisma.member.findMany();

  return members;
};

export const getMember = async (id: number) => {
  const member = await prisma.member.findUniqueOrThrow({
    where: { id },
  });

  return member;
};
