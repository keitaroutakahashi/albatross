import {
  type MemberRanking,
  type MemberStatsBase,
  toMemberRanking,
} from "@/app/_features/members/utils/ranking";
import prisma from "@/lib/prisma";

/** 1 イニングのアウト数 */
const OUTS_PER_INNING = 3;

/** 防御率の規定投球回（この投球回に達していれば試合数に関わらず対象） */
const QUALIFIED_INNINGS = 10;

export type PitchingLeaders = {
  /** 防御率（規定投球回を満たす投手のみ。値が小さいほど上位） */
  era: MemberRanking[];
  /** 勝利数 */
  win: MemberRanking[];
  /** 奪三振 */
  strikeout: MemberRanking[];
  /** 投球回（value はアウト数。表示側で "5.1" のような回数表記に変換する） */
  inning: MemberRanking[];
};

type MemberStats = MemberStatsBase & {
  /** 投球回はアウト数で保持し、1/3 回単位の端数を落とさないようにする */
  outs: number;
  earnedRuns: number;
  strikeouts: number;
  wins: number;
};

/** 防御率 = 自責点 * 9 / 投球回 */
const toEra = (stat: MemberStats) =>
  (stat.earnedRuns * 9 * OUTS_PER_INNING) / stat.outs;

/**
 * 指定シーズンの投手成績上位者を取得する。
 * 集計対象は「終了した公式戦」かつ「現役の正規メンバー」。
 */
export const getPitchingLeaders = async (
  season: string | number,
): Promise<PitchingLeaders> => {
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
      outs: 0,
      earnedRuns: 0,
      strikeouts: 0,
      wins: 0,
    };

    stats.outs +=
      pitchingResult.inningsPitched * OUTS_PER_INNING +
      (pitchingResult.partialOuts ?? 0);
    stats.earnedRuns += pitchingResult.earnedRuns;
    stats.strikeouts += pitchingResult.strikeouts;

    if (pitchingResult.decision === "win") {
      stats.wins += 1;
    }

    statsByMemberId.set(memberId, stats);
  }

  const stats = [...statsByMemberId.values()];

  // 規定投球回: 10 イニング以上、またはシーズンの試合数以上を投げていること
  const qualified = stats.filter(
    (stat) =>
      stat.outs > 0 &&
      (stat.outs >= QUALIFIED_INNINGS * OUTS_PER_INNING ||
        stat.outs >= gameCount * OUTS_PER_INNING),
  );

  return {
    // 防御率は 0.00 が最上位のため、値が 0 でも除外しない
    era: toMemberRanking(qualified, toEra, "asc"),
    // 記録が 0 の投手はランキングに含めない
    win: toMemberRanking(
      stats.filter((stat) => stat.wins > 0),
      (stat) => stat.wins,
    ),
    strikeout: toMemberRanking(
      stats.filter((stat) => stat.strikeouts > 0),
      (stat) => stat.strikeouts,
    ),
    inning: toMemberRanking(
      stats.filter((stat) => stat.outs > 0),
      (stat) => stat.outs,
    ),
  };
};
