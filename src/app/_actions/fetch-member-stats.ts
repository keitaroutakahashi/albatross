"use server";

import {
  getMemberStats,
  type MemberStatsResult,
} from "@/app/_features/members/api/get-member-stats";

/**
 * 選手詳細で年度を切り替えたときに個人成績を再取得する Server Action。
 */
export const fetchMemberStats = async (
  memberId: number,
  season: string,
): Promise<MemberStatsResult> => getMemberStats(memberId, season);
