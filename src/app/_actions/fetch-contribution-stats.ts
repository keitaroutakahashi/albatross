"use server";

import {
  type ContributionStatsResult,
  getContributionStats,
} from "@/app/_features/members/api/get-contribution-stats";

/**
 * 年度を切り替えたときに貢献度（出席率・MVP 数）を再取得する Server Action。
 * `/contribution-stats` はクエリパラメータを持たないため、クライアント側の
 * セレクトの変更をこの Action 経由でサーバーに問い合わせる。
 */
export const fetchContributionStats = async (
  season: string,
): Promise<ContributionStatsResult> => getContributionStats(season);
