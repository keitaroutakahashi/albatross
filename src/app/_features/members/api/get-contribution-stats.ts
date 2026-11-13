import type { MemberStatsBase } from "@/app/_features/members/utils/ranking";
import { calculateAttendanceRate } from "@/app/_utils/stats/attendance";
import prisma from "@/lib/prisma";

export type ContributionStatRow = MemberStatsBase & {
  /** 出席したイベント数（試合は参加メンバー、練習は練習参加メンバーに入っているもの） */
  attendedCount: number;
  /** 出席率（0〜1）。開催済みのイベントが 0 件のときは null */
  attendanceRate: number | null;
  /** MVP に選ばれた回数 */
  mvpCount: number;
};

export type ContributionStatsResult = {
  /** 対象シーズン */
  season: number;
  /** 開催済みのイベント数（試合・練習の合計。中止・予定は含めない） */
  eventCount: number;
  /** 選手ごとの貢献度 */
  rows: ContributionStatRow[];
};

/**
 * 指定シーズンの選手ごとの出席率・MVP 数を取得する。
 * 出席率の分母は「終了したすべてのイベント（試合・練習）」で、公式戦に限らない。
 * 集計対象は「現役の正規メンバー」（getBattingStats と同一条件）。
 * 1 度も出席していない選手は結果から除外する。
 */
export const getContributionStats = async (
  season: string | number,
): Promise<ContributionStatsResult> => {
  const [events, members] = await Promise.all([
    prisma.event.findMany({
      where: { status: "completed", season: { season: Number(season) } },
      select: {
        game: {
          select: {
            participants: { select: { memberId: true } },
            mvps: { select: { memberId: true } },
          },
        },
        practice: {
          select: { practiceMembers: { select: { memberId: true } } },
        },
      },
    }),
    prisma.member.findMany({
      where: { category: "regular", isActive: true },
      select: { id: true, name: true, uniformNumber: true },
    }),
  ]);

  const attendedCountByMemberId = new Map<number, number>();
  const mvpCountByMemberId = new Map<number, number>();

  const increment = (counts: Map<number, number>, memberId: number) =>
    counts.set(memberId, (counts.get(memberId) ?? 0) + 1);

  for (const event of events) {
    for (const { memberId } of event.game?.participants ?? []) {
      increment(attendedCountByMemberId, memberId);
    }
    for (const { memberId } of event.practice?.practiceMembers ?? []) {
      increment(attendedCountByMemberId, memberId);
    }
    for (const { memberId } of event.game?.mvps ?? []) {
      increment(mvpCountByMemberId, memberId);
    }
  }

  const eventCount = events.length;

  const rows: ContributionStatRow[] = members
    .filter((member) => attendedCountByMemberId.has(member.id))
    .map((member) => {
      const attendedCount = attendedCountByMemberId.get(member.id) ?? 0;

      return {
        memberId: member.id,
        name: member.name,
        uniformNumber: member.uniformNumber,
        attendedCount,
        attendanceRate: calculateAttendanceRate(attendedCount, eventCount),
        mvpCount: mvpCountByMemberId.get(member.id) ?? 0,
      };
    });

  return { season: Number(season), eventCount, rows };
};
