import { requireAdmin } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

export const getLeagueList = async () => {
  await requireAdmin();
  return prisma.league.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { games: true } } },
  });
};

export const getLeague = async (id: number) => {
  await requireAdmin();
  return prisma.league.findUnique({ where: { id } });
};
