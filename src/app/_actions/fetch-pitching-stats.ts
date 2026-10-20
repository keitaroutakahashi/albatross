"use server";

import {
  getPitchingStats,
  type PitchingStatsResult,
} from "@/app/_features/members/api/get-pitching-stats";

/**
 * 年度・リーグを切り替えたときに投球成績を再取得する Server Action。
 * `/pitching-stats` はクエリパラメータを持たないため、クライアント側の
 * セレクトの変更をこの Action 経由でサーバーに問い合わせる。
 * Server Action は直接呼び出せる公開エンドポイントのため、リーグ ID は整数だけを受け付ける。
 */
export const fetchPitchingStats = async (
  season: string,
  leagueId?: number,
): Promise<PitchingStatsResult> =>
  getPitchingStats(season, Number.isInteger(leagueId) ? leagueId : undefined);
