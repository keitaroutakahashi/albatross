import { requireAdmin } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

export const getOpponentList = async () => {
  await requireAdmin();
  return prisma.opponent.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { games: true } } },
  });
};

export const getOpponent = async (id: number) => {
  await requireAdmin();
  return prisma.opponent.findUnique({ where: { id } });
};
