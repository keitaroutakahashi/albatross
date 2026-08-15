import {
  hitResults,
  nonAtBatResults,
} from "@/app/_features/games/utils/at-bat-result";
import { isQualifiedBatter } from "@/app/_features/members/utils/qualification";
import {
  type MemberRanking,
  type MemberStatsBase,
  toMemberRanking,
} from "@/app/_features/members/utils/ranking";
import prisma from "@/lib/prisma";

export type BattingLeaders = {
  /** 打率（規定打席を満たす選手のみ） */
  average: MemberRanking[];
  /** 打点 */
  rbi: MemberRanking[];
  /** 本塁打 */
  homeRun: MemberRanking[];
  /** 盗塁 */
  stolenBase: MemberRanking[];
};

type MemberStats = MemberStatsBase & {
  plateAppearances: number;
  atBats: number;
  hits: number;
  rbi: number;
  homeRuns: number;
  stolenBases: number;
};

/**
 * 指定シーズンの打撃成績上位者を取得する。
 * 集計対象は「終了した公式戦」かつ「現役の正規メンバー」。
 */
export const getBattingLeaders = async (
  season: string | number,
): Promise<BattingLeaders> => {
  const gameWhere = {
    status: "completed",
    gameType: "official",
    season: { season: Number(season) },
  } as const;

  const [gameCount, gameMembers] = await Promise.all([
    prisma.game.count({ where: gameWhere }),
    prisma.gameMember.findMany({
      where: {
        game: gameWhere,
        member: { category: "regular", isActive: true },
      },
      include: {
        member: true,
        plateAppearances: true,
      },
    }),
  ]);

  // 選手ごとに 1 シーズン分の成績を積み上げる
  const statsByMemberId = new Map<number, MemberStats>();

  for (const gameMember of gameMembers) {
    const stats = statsByMemberId.get(gameMember.memberId) ?? {
      memberId: gameMember.memberId,
      name: gameMember.member.name,
      uniformNumber: gameMember.member.uniformNumber,
      plateAppearances: 0,
      atBats: 0,
      hits: 0,
      rbi: 0,
      homeRuns: 0,
      stolenBases: 0,
    };

    stats.stolenBases += gameMember.stolenBases;

    for (const plateAppearance of gameMember.plateAppearances) {
      stats.plateAppearances += 1;
      stats.rbi += plateAppearance.rbi;

      // 四死球・犠打・犠飛は打数に含めない
      if (!nonAtBatResults.includes(plateAppearance.result)) {
        stats.atBats += 1;
      }

      if (hitResults.includes(plateAppearance.result)) {
        stats.hits += 1;
      }

      if (plateAppearance.result === "homeRun") {
        stats.homeRuns += 1;
      }
    }

    statsByMemberId.set(gameMember.memberId, stats);
  }

  const stats = [...statsByMemberId.values()];

  const qualified = stats.filter(
    (stat) =>
      stat.atBats > 0 && isQualifiedBatter(stat.plateAppearances, gameCount),
  );

  // 記録が 0 の選手はランキングに含めない
  return {
    average: toMemberRanking(
      qualified.filter((stat) => stat.hits > 0),
      (stat) => stat.hits / stat.atBats,
    ),
    rbi: toMemberRanking(
      stats.filter((stat) => stat.rbi > 0),
      (stat) => stat.rbi,
    ),
    homeRun: toMemberRanking(
      stats.filter((stat) => stat.homeRuns > 0),
      (stat) => stat.homeRuns,
    ),
    stolenBase: toMemberRanking(
      stats.filter((stat) => stat.stolenBases > 0),
      (stat) => stat.stolenBases,
    ),
  };
};
