import { requireAdmin } from "@/app/(private)/admin/_utils/auth";
import prisma from "@/lib/prisma";

export const getSeasonList = async () => {
  await requireAdmin();
  return prisma.season.findMany({
    orderBy: { season: "desc" },
    include: { _count: { select: { events: true } } },
  });
};

export const getSeason = async (id: number) => {
  await requireAdmin();
  return prisma.season.findUnique({ where: { id } });
};
