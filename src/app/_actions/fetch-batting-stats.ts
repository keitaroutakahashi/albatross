"use server";

import {
  type BattingStatsResult,
  getBattingStats,
} from "@/app/_features/members/api/get-batting-stats";

/**
 * 年度を切り替えたときに打撃成績を再取得する Server Action。
 * `/batting-stats` はクエリパラメータを持たないため、クライアント側の
 * 年度セレクトの変更をこの Action 経由でサーバーに問い合わせる。
 */
export const fetchBattingStats = async (
  season: string,
): Promise<BattingStatsResult> => getBattingStats(season);
