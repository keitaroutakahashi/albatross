"use server";

import {
  type BattingStatsResult,
  getBattingStats,
} from "@/app/_features/members/api/get-batting-stats";

/**
 * 年度・リーグを切り替えたときに打撃成績を再取得する Server Action。
 * `/batting-stats` はクエリパラメータを持たないため、クライアント側の
 * セレクトの変更をこの Action 経由でサーバーに問い合わせる。
 * Server Action は直接呼び出せる公開エンドポイントのため、リーグ ID は整数だけを受け付ける。
 */
export const fetchBattingStats = async (
  season: string,
  leagueId?: number,
): Promise<BattingStatsResult> =>
  getBattingStats(season, Number.isInteger(leagueId) ? leagueId : undefined);
