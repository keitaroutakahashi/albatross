"use server";

import {
  getPitchingStats,
  type PitchingStatsResult,
} from "@/app/_features/members/api/get-pitching-stats";

/**
 * 年度を切り替えたときに投球成績を再取得する Server Action。
 * `/pitching-stats` はクエリパラメータを持たないため、クライアント側の
 * 年度セレクトの変更をこの Action 経由でサーバーに問い合わせる。
 */
export const fetchPitchingStats = async (
  season: string,
): Promise<PitchingStatsResult> => getPitchingStats(season);
