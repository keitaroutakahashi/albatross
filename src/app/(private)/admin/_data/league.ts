import { requireAccess } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

export const getLeagueList = async () => {
  await requireAccess("options");
  return prisma.league.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { games: true } } },
  });
};

export const getLeague = async (id: number) => {
  await requireAccess("options");
  return prisma.league.findUnique({ where: { id } });
};
