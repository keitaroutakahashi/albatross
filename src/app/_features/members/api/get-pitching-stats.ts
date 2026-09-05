import type { MemberStatsBase } from "@/app/_features/members/utils/ranking";
import { calculateEra } from "@/app/_utils/stats/era";
import { OUTS_PER_INNING } from "@/app/_utils/stats/innings";
import { isQualifiedPitcher } from "@/app/_utils/stats/qualification";
import { calculateWhip } from "@/app/_utils/stats/whip";
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
  /** 対象となった公式戦の試合数 */
  gameCount: number;
  /** 投手ごとの投球成績 */
  rows: PitchingStatRow[];
};

type MemberStats = MemberStatsBase & {
  games: number;
  outs: number;
  wins: number;
  losses: number;
  strikeouts: number;
  earnedRuns: number;
  runs: number;
  walks: number;
  hitByPitches: number;
  hitsAllowed: number;
  homeRunsAllowed: number;
};

/**
 * 指定シーズンの選手ごとの投球成績を取得する。
 * 集計対象は「終了した公式戦」かつ「現役の正規メンバー」（getPitchingLeaders と同一条件）。
 * 登板記録が 0 の選手は結果から除外する。
 */
export const getPitchingStats = async (
  season: string | number,
): Promise<PitchingStatsResult> => {
  const gameWhere = {
    status: "completed",
    gameType: "official",
    season: { season: Number(season) },
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
        gameMember: { include: { member: true } },
      },
    }),
  ]);

  // 投手ごとに 1 シーズン分の成績を積み上げる
  const statsByMemberId = new Map<number, MemberStats>();

  for (const pitchingResult of pitchingResults) {
    const { member, memberId } = pitchingResult.gameMember;

    const stats = statsByMemberId.get(memberId) ?? {
      memberId,
      name: member.name,
      uniformNumber: member.uniformNumber,
      games: 0,
      outs: 0,
      wins: 0,
      losses: 0,
      strikeouts: 0,
      earnedRuns: 0,
      runs: 0,
      walks: 0,
      hitByPitches: 0,
      hitsAllowed: 0,
      homeRunsAllowed: 0,
    };

    stats.games += 1;
    stats.outs +=
      pitchingResult.inningsPitched * OUTS_PER_INNING +
      (pitchingResult.partialOuts ?? 0);
    stats.earnedRuns += pitchingResult.earnedRuns;
    stats.runs += pitchingResult.runs;
    stats.strikeouts += pitchingResult.strikeouts;
    stats.walks += pitchingResult.walks;
    stats.hitByPitches += pitchingResult.hitByPitches;
    stats.hitsAllowed += pitchingResult.hitsAllowed;
    stats.homeRunsAllowed += pitchingResult.homeRunsAllowed;

    if (pitchingResult.decision === "win") stats.wins += 1;
    if (pitchingResult.decision === "loss") stats.losses += 1;

    statsByMemberId.set(memberId, stats);
  }

  const rows: PitchingStatRow[] = [...statsByMemberId.values()]
    .filter((stats) => stats.games > 0)
    .map((stats) => {
      const era = calculateEra({
        earnedRuns: stats.earnedRuns,
        inningsPitched: Math.floor(stats.outs / OUTS_PER_INNING),
        partialOuts: stats.outs % OUTS_PER_INNING,
      });
      const whip = calculateWhip({
        walks: stats.walks,
        hitsAllowed: stats.hitsAllowed,
        outs: stats.outs,
      });

      return {
        memberId: stats.memberId,
        name: stats.name,
        uniformNumber: stats.uniformNumber,
        games: stats.games,
        outs: stats.outs,
        wins: stats.wins,
        losses: stats.losses,
        strikeouts: stats.strikeouts,
        earnedRuns: stats.earnedRuns,
        runs: stats.runs,
        walks: stats.walks,
        hitByPitches: stats.hitByPitches,
        hitsAllowed: stats.hitsAllowed,
        homeRunsAllowed: stats.homeRunsAllowed,
        era,
        whip,
        isQualified: isQualifiedPitcher(stats.outs, gameCount),
      };
    });

  return { season: Number(season), gameCount, rows };
};
