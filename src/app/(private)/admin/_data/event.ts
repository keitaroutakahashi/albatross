import { formatSeason } from "@/app/_utils/season";
import { requireAccess } from "@/app/(private)/admin/_utils/auth";
import type { EventType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export const getEventList = async ({
  seasonId,
  type,
}: {
  seasonId?: number;
  type?: EventType;
}) => {
  await requireAccess("events");
  return prisma.event.findMany({
    where: { seasonId, type },
    orderBy: { date: "desc" },
    include: {
      game: { include: { opponent: true, ground: true } },
      practice: { include: { ground: true } },
    },
  });
};

export const getEvent = async (id: number) => {
  await requireAccess("events");
  return prisma.event.findUnique({
    where: { id },
    include: {
      season: true,
      game: {
        include: {
          gameWeather: true,
          opponent: true,
          league: true,
          ground: true,
          mvps: { select: { id: true } },
        },
      },
      practice: {
        include: {
          ground: true,
          _count: { select: { practiceMembers: true } },
        },
      },
    },
  });
};

/** イベントフォームの選択肢 */
export const getEventFormOptions = async () => {
  await requireAccess("events");
  const [seasons, leagues, grounds, opponents] = await Promise.all([
    prisma.season.findMany({ orderBy: { season: "desc" } }),
    prisma.league.findMany({ orderBy: { name: "asc" } }),
    prisma.ground.findMany({ orderBy: { name: "asc" } }),
    prisma.opponent.findMany({ orderBy: { name: "asc" } }),
  ]);

  return {
    seasons: seasons.map((s) => ({
      value: String(s.id),
      label: formatSeason(s.season),
    })),
    leagues: leagues.map((l) => ({ value: String(l.id), label: l.name })),
    grounds: grounds.map((g) => ({ value: String(g.id), label: g.name })),
    opponents: opponents.map((o) => ({ value: String(o.id), label: o.name })),
  };
};

/** イベント一覧の絞り込み用。シーズンの管理権限がなくても使えるよう、ここで取得する */
export const getEventSeasons = async () => {
  await requireAccess("events");
  return prisma.season.findMany({ orderBy: { season: "desc" } });
};
