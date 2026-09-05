import {
  hitResults,
  nonAtBatResults,
} from "@/app/_features/games/utils/at-bat-result";
import type { MemberStatsBase } from "@/app/_features/members/utils/ranking";
import {
  calculateBattingAverage,
  calculateOnBasePercentage,
  calculateOps,
  calculateSluggingPercentage,
} from "@/app/_utils/stats/batting";
import { isQualifiedBatter } from "@/app/_utils/stats/qualification";
import prisma from "@/lib/prisma";

/** 単打以外の安打1本あたりの塁打数 */
const TOTAL_BASES_BY_HIT: Record<string, number> = {
  single: 1,
  double: 2,
  triple: 3,
  homeRun: 4,
};

export type BattingStatRow = MemberStatsBase & {
  /** 出場試合数（スタメン・ベンチ問わず GameMember レコード数） */
  games: number;
  /** 打席数 */
  plateAppearances: number;
  /** 打数 */
  atBats: number;
  /** 安打 */
  hits: number;
  /** 二塁打 */
  doubles: number;
  /** 三塁打 */
  triples: number;
  /** 本塁打 */
  homeRuns: number;
  /** 打点 */
  rbi: number;
  /** 盗塁 */
  stolenBases: number;
  /** 四死球（四球 + 死球） */
  walks: number;
  /** 三振 */
  strikeouts: number;
  /** 犠打 */
  sacrificeHits: number;
  /** 犠飛 */
  sacrificeFlies: number;
  /** 打率（打数 0 のときは null） */
  average: number | null;
  /** 出塁率（分母 0 のときは null） */
  onBasePercentage: number | null;
  /** 長打率（打数 0 のときは null） */
  sluggingPercentage: number | null;
  /** OPS = 出塁率 + 長打率（どちらかが null のときは null） */
  ops: number | null;
  /** 規定打席を満たしているか */
  isQualified: boolean;
};

export type BattingStatsResult = {
  /** 対象シーズン */
  season: number;
  /** 対象となった公式戦の試合数 */
  gameCount: number;
  /** 選手ごとの打撃成績 */
  rows: BattingStatRow[];
};

type MemberStats = MemberStatsBase & {
  games: number;
  plateAppearances: number;
  atBats: number;
  hits: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  totalBases: number;
  rbi: number;
  stolenBases: number;
  walks: number;
  strikeouts: number;
  sacrificeHits: number;
  sacrificeFlies: number;
};

/**
 * 指定シーズンの選手ごとの打撃成績を取得する。
 * 集計対象は「終了した公式戦」かつ「現役の正規メンバー」（getBattingLeaders と同一条件）。
 * 打席数が 0 の選手は結果から除外する。
 */
export const getBattingStats = async (
  season: string | number,
): Promise<BattingStatsResult> => {
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
      games: 0,
      plateAppearances: 0,
      atBats: 0,
      hits: 0,
      doubles: 0,
      triples: 0,
      homeRuns: 0,
      totalBases: 0,
      rbi: 0,
      stolenBases: 0,
      walks: 0,
      strikeouts: 0,
      sacrificeHits: 0,
      sacrificeFlies: 0,
    };

    stats.games += 1;
    stats.stolenBases += gameMember.stolenBases;

    for (const plateAppearance of gameMember.plateAppearances) {
      const { result } = plateAppearance;

      stats.plateAppearances += 1;
      stats.rbi += plateAppearance.rbi;

      // 四死球・犠打・犠飛は打数に含めない
      if (!nonAtBatResults.includes(result)) {
        stats.atBats += 1;
      }

      if (hitResults.includes(result)) {
        stats.hits += 1;
        stats.totalBases += TOTAL_BASES_BY_HIT[result];

        if (result === "double") stats.doubles += 1;
        if (result === "triple") stats.triples += 1;
        if (result === "homeRun") stats.homeRuns += 1;
      }

      if (result === "walk" || result === "hitByPitch") stats.walks += 1;
      if (result === "strikeout") stats.strikeouts += 1;
      if (result === "sacrificeHit") stats.sacrificeHits += 1;
      if (result === "sacrificeFly") stats.sacrificeFlies += 1;
    }

    statsByMemberId.set(gameMember.memberId, stats);
  }

  const rows: BattingStatRow[] = [...statsByMemberId.values()]
    .filter((stats) => stats.plateAppearances > 0)
    .map((stats) => {
      const onBasePercentage = calculateOnBasePercentage({
        hits: stats.hits,
        walks: stats.walks,
        atBats: stats.atBats,
        sacrificeFlies: stats.sacrificeFlies,
      });
      const sluggingPercentage = calculateSluggingPercentage({
        totalBases: stats.totalBases,
        atBats: stats.atBats,
      });

      return {
        memberId: stats.memberId,
        name: stats.name,
        uniformNumber: stats.uniformNumber,
        games: stats.games,
        plateAppearances: stats.plateAppearances,
        atBats: stats.atBats,
        hits: stats.hits,
        doubles: stats.doubles,
        triples: stats.triples,
        homeRuns: stats.homeRuns,
        rbi: stats.rbi,
        stolenBases: stats.stolenBases,
        walks: stats.walks,
        strikeouts: stats.strikeouts,
        sacrificeHits: stats.sacrificeHits,
        sacrificeFlies: stats.sacrificeFlies,
        average: calculateBattingAverage({
          hits: stats.hits,
          atBats: stats.atBats,
        }),
        onBasePercentage,
        sluggingPercentage,
        ops: calculateOps({ onBasePercentage, sluggingPercentage }),
        isQualified: isQualifiedBatter(stats.plateAppearances, gameCount),
      };
    });

  return { season: Number(season), gameCount, rows };
};
