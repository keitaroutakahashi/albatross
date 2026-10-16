import type { MemberStatsBase } from "@/app/_features/members/utils/ranking";
import {
  type BattingPlateAppearance,
  summarizeBatting,
} from "@/app/_utils/stats/batting-summary";
import { isQualifiedBatter } from "@/app/_utils/stats/qualification";
import prisma from "@/lib/prisma";

export type BattingStatRow = MemberStatsBase & {
  /** 出場試合数（スタメン・ベンチ問わず GameMember レコード数） */
  games: number;
  /** 打席数 */
  plateAppearances: number;
  /** 打数 */
  atBats: number;
  /** 安打 */
  hits: number;
  /** 単打 */
  singles: number;
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

type MemberAccumulator = MemberStatsBase & {
  games: number;
  stolenBases: number;
  plateAppearances: BattingPlateAppearance[];
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
    gameType: "official",
    event: { status: "completed", season: { season: Number(season) } },
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

  // 選手ごとに 1 シーズン分の打席結果を集める
  const accumulatorByMemberId = new Map<number, MemberAccumulator>();

  for (const gameMember of gameMembers) {
    const accumulator = accumulatorByMemberId.get(gameMember.memberId) ?? {
      memberId: gameMember.memberId,
      name: gameMember.member.name,
      uniformNumber: gameMember.member.uniformNumber,
      games: 0,
      stolenBases: 0,
      plateAppearances: [],
    };

    accumulator.games += 1;
    accumulator.stolenBases += gameMember.stolenBases;
    accumulator.plateAppearances.push(...gameMember.plateAppearances);

    accumulatorByMemberId.set(gameMember.memberId, accumulator);
  }

  const rows: BattingStatRow[] = [...accumulatorByMemberId.values()]
    .filter((accumulator) => accumulator.plateAppearances.length > 0)
    .map(({ plateAppearances, ...accumulator }) => {
      const summary = summarizeBatting(plateAppearances);

      return {
        ...accumulator,
        ...summary,
        isQualified: isQualifiedBatter(summary.plateAppearances, gameCount),
      };
    });

  return { season: Number(season), gameCount, rows };
};
