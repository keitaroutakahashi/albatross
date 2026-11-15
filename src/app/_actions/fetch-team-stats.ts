"use server";

import {
  getTeamStats,
  type TeamStatsResult,
} from "@/app/_features/team/api/get-team-stats";

/**
 * チーム成績ページで年度を切り替えたときにチーム成績を再取得する Server Action。
 */
export const fetchTeamStats = async (
  season: string,
): Promise<TeamStatsResult> => getTeamStats(season);
