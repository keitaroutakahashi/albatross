import type { MemberStatsBase } from "@/app/_features/members/utils/ranking";
import { resolvePitchingDecision } from "@/app/_utils/stats/pitching-decision";
import {
  type PitchingGameResult,
  summarizePitching,
} from "@/app/_utils/stats/pitching-summary";
import { isQualifiedPitcher } from "@/app/_utils/stats/qualification";
import prisma from "@/lib/prisma";

export type PitchingStatRow = MemberStatsBase & {
  /** 登板数（その選手の投球成績レコード数） */
  games: number;
  /** 投球回（アウト数換算） */
  outs: number;
  /** 勝利 */
  wins: number;
  /** 敗戦 */
  losses: number;
  /** 奪三振 */
  strikeouts: number;
  /** 自責点 */
  earnedRuns: number;
  /** 失点 */
  runs: number;
  /** 与四球 */
  walks: number;
  /** 与死球 */
  hitByPitches: number;
  /** 被安打 */
  hitsAllowed: number;
  /** 被本塁打 */
  homeRunsAllowed: number;
  /** 防御率（7 イニング基準。投球回 0 のときは null） */
  era: number | null;
  /** WHIP = (与四球 + 被安打) ÷ 投球回（投球回 0 のときは null） */
  whip: number | null;
  /** 規定投球回を満たしているか */
  isQualified: boolean;
};

export type PitchingStatsResult = {
  /** 対象シーズン */
  season: number;
  /** 絞り込んだリーグの ID。絞り込んでいない（すべてのリーグ）ときは null */
  leagueId: number | null;
  /** 対象となった公式戦の試合数 */
  gameCount: number;
  /** 投手ごとの投球成績 */
  rows: PitchingStatRow[];
};

type MemberAccumulator = MemberStatsBase & {
  results: PitchingGameResult[];
};

/**
 * 指定シーズンの選手ごとの投球成績を取得する。leagueId を指定すると、そのリーグの試合だけに絞る。
 * 規定投球回の基準になる試合数（gameCount）も、絞り込んだ試合の数になる。
 * 集計対象は「終了した公式戦」かつ「現役の正規メンバー」（getPitchingLeaders と同一条件）。
 * 登板記録が 0 の選手は結果から除外する。
 */
export const getPitchingStats = async (
  season: string | number,
  leagueId?: number,
): Promise<PitchingStatsResult> => {
  const gameWhere = {
    gameType: "official",
    ...(leagueId !== undefined && { leagueId }),
    event: { status: "completed", season: { season: Number(season) } },
  } as const;

  const [gameCount, pitchingResults] = await Promise.all([
    prisma.game.count({ where: gameWhere }),
    prisma.pitchingResult.findMany({
      where: {
        gameMember: {
          game: gameWhere,
          member: { category: "regular", isActive: true },
        },
      },
      include: {
        gameMember: {
          include: { member: true, game: { select: { result: true } } },
        },
      },
    }),
  ]);

  // 投手ごとに 1 シーズン分の登板成績を集める
  const accumulatorByMemberId = new Map<number, MemberAccumulator>();

  for (const pitchingResult of pitchingResults) {
    const { member, memberId } = pitchingResult.gameMember;

    const accumulator = accumulatorByMemberId.get(memberId) ?? {
      memberId,
      name: member.name,
      uniformNumber: member.uniformNumber,
      results: [],
    };

    accumulator.results.push({
      ...pitchingResult,
      decision: resolvePitchingDecision(
        pitchingResult.isResponsible,
        pitchingResult.gameMember.game.result,
      ),
    });
    accumulatorByMemberId.set(memberId, accumulator);
  }

  const rows: PitchingStatRow[] = [...accumulatorByMemberId.values()].map(
    ({ results, ...accumulator }) => {
      const summary = summarizePitching(results);

      return {
        ...accumulator,
        ...summary,
        isQualified: isQualifiedPitcher(summary.outs, gameCount),
      };
    },
  );

  return {
    season: Number(season),
    leagueId: leagueId ?? null,
    gameCount,
    rows,
  };
};
