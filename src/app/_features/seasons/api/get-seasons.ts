import type { SeasonModel } from "@/generated/prisma/models/Season";
import prisma from "@/lib/prisma";

export async function getSeasons(): Promise<SeasonModel[]> {
  const seasons = await prisma.season.findMany({
    orderBy: {
      season: "desc",
    },
  });

  return seasons;
}
