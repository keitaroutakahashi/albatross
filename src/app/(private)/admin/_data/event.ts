import { requireAdmin } from "@/app/(private)/admin/_utils/auth";
import type { EventType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export const getEventList = async ({
  seasonId,
  type,
}: {
  seasonId?: number;
  type?: EventType;
}) => {
  await requireAdmin();
  return prisma.event.findMany({
    where: { seasonId, type },
    orderBy: { date: "desc" },
    include: {
      game: { include: { opponent: true } },
      practice: { include: { ground: true } },
    },
  });
};

export const getEvent = async (id: number) => {
  await requireAdmin();
  return prisma.event.findUnique({
    where: { id },
    include: {
      game: { include: { gameWeather: true } },
      practice: {
        include: { _count: { select: { practiceMembers: true } } },
      },
    },
  });
};

/** イベントフォームの選択肢 */
export const getEventFormOptions = async () => {
  await requireAdmin();
  const [seasons, leagues, grounds, opponents] = await Promise.all([
    prisma.season.findMany({ orderBy: { season: "desc" } }),
    prisma.league.findMany({ orderBy: { name: "asc" } }),
    prisma.ground.findMany({ orderBy: { name: "asc" } }),
    prisma.opponent.findMany({ orderBy: { name: "asc" } }),
  ]);

  return {
    seasons: seasons.map((s) => ({
      value: String(s.id),
      label: `${s.season}年度`,
    })),
    leagues: leagues.map((l) => ({ value: String(l.id), label: l.name })),
    grounds: grounds.map((g) => ({ value: String(g.id), label: g.name })),
    opponents: opponents.map((o) => ({ value: String(o.id), label: o.name })),
  };
};
