import prisma from "@/lib/prisma";

export type Season = {
  id: number;
  year: number;
  name: string | null;
};

/**
 * 全シーズンを取得（年度降順）
 */
export async function getSeasons(): Promise<Season[]> {
  const seasons = await prisma.season.findMany({
    select: {
      id: true,
      year: true,
      name: true,
    },
    orderBy: {
      year: "desc",
    },
  });

  return seasons;
}
