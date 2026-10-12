import { requireAccess } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

export const getGroundList = async () => {
  await requireAccess("options");
  return prisma.ground.findMany({ orderBy: { name: "asc" } });
};

export const getGround = async (id: number) => {
  await requireAccess("options");
  return prisma.ground.findUnique({ where: { id } });
};
