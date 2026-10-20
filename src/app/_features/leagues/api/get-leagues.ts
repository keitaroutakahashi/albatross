import type { LeagueModel } from "@/generated/prisma/models/League";
import prisma from "@/lib/prisma";

/** 成績ページのリーグ絞り込みに使うリーグ一覧（登録順） */
export const getLeagues = async (): Promise<LeagueModel[]> =>
  prisma.league.findMany({ orderBy: { id: "asc" } });
