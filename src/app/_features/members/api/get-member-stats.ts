import { ALL_SEASONS } from "@/app/_constants/stats";
import {
  type AtBatNumberBattingRow,
  type BattingSplitRow,
  buildAtBatNumberBatting,
  buildGroundBatting,
  buildGroundPitching,
  buildHitDirections,
  buildMonthlyBatting,
  buildMonthlyPitching,
  buildOrderBatting,
  buildRolePitching,
  type GroundBattingRow,
  type GroundPitchingRow,
  type HitDirectionRow,
  type MonthlyBattingRow,
  type MonthlyPitchingRow,
  type OrderBattingRow,
  type RolePitchingRow,
  summarizeBattingSplit,
  toPitchingGameResult,
} from "@/app/_features/stats/utils/stats-splits";
import { formatAsYYYYMMDDWithDot } from "@/app/_utils/date/date";
import {
  type BattingSummary,
  summarizeBatting,
} from "@/app/_utils/stats/batting-summary";
import {
  type PitchingSummary,
  summarizePitching,
} from "@/app/_utils/stats/pitching-summary";
import type { Prisma } from "@/generated/prisma/client";
import { Position } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

/** 守備位置の表示順（enum の定義順） */
const POSITION_ORDER = Object.values(Position);

export type PositionBattingRow = BattingSplitRow & {
  position: Position;
};

export type PositionGamesRow = {
  position: Position;
  games: number;
};

/** MVP を獲得した試合 */
export type MvpGameRow = {
  eventId: number;
  /** 表示用に整形した開催日（Server Action で受け渡すため、文字列で持つ） */
  date: string;
  opponentName: string | null;
  /** MVP に添えられたコメント */
  comment: string | null;
};

export type MemberStatsResult = {
  /** 対象の年度（全年度のときは ALL_SEASONS） */
  season: string;
  /** 出場試合数 */
  games: number;
  /** 盗塁 */
  stolenBases: number;
  batting: BattingSummary;
  hitDirections: HitDirectionRow[];
  groundBatting: GroundBattingRow[];
  monthlyBatting: MonthlyBattingRow[];
  orderBatting: OrderBattingRow[];
  positionBatting: PositionBattingRow[];
  atBatNumberBatting: AtBatNumberBattingRow[];
  /** 登板記録がない選手は null */
  pitching: PitchingSummary | null;
  rolePitching: RolePitchingRow[];
  groundPitching: GroundPitchingRow[];
  monthlyPitching: MonthlyPitchingRow[];
  positionGames: PositionGamesRow[];
  /** MVP を獲得した試合（新しい順） */
  mvpGames: MvpGameRow[];
};

/**
 * 選手個人の成績を取得する。
 * 集計対象は「終了した公式戦」（打者・投手成績ランキングと同一条件）。
 * `season` に ALL_SEASONS を指定すると全年度を通算する。
 */
export const getMemberStats = async (
  memberId: number,
  season: string,
): Promise<MemberStatsResult> => {
  const gameWhere: Prisma.GameWhereInput = {
    gameType: "official",
    event: {
      status: "completed",
      ...(season !== ALL_SEASONS && { season: { season: Number(season) } }),
    },
  };

  const mvps = await prisma.gameMvp.findMany({
    where: { memberId, game: gameWhere },
    select: {
      comment: true,
      game: {
        select: {
          eventId: true,
          opponent: { select: { name: true } },
          event: { select: { date: true } },
        },
      },
    },
    orderBy: { game: { event: { date: "desc" } } },
  });

  const gameMembers = await prisma.gameMember.findMany({
    where: { memberId, game: gameWhere },
    include: {
      plateAppearances: true,
      pitchingResult: true,
      game: {
        select: {
          result: true,
          ground: { select: { id: true, name: true } },
          event: { select: { date: true } },
        },
      },
    },
  });

  const plateAppearances = gameMembers.flatMap((gm) => gm.plateAppearances);

  const pitchingResults = gameMembers.flatMap((gm) => {
    const result = toPitchingGameResult(gm);
    return result ? [result] : [];
  });

  const gamesByPosition = Map.groupBy(
    gameMembers.filter((gm) => gm.position !== null),
    (gm) => gm.position as Position,
  );

  const positionGames: PositionGamesRow[] = POSITION_ORDER.flatMap(
    (position) => {
      const games = gamesByPosition.get(position)?.length ?? 0;

      return games > 0 ? [{ position, games }] : [];
    },
  );

  const positionBatting: PositionBattingRow[] = POSITION_ORDER.flatMap(
    (position) => {
      const row = {
        position,
        ...summarizeBattingSplit(gamesByPosition.get(position) ?? []),
      };

      return row.plateAppearances > 0 ? [row] : [];
    },
  );

  return {
    season,
    games: gameMembers.length,
    stolenBases: gameMembers.reduce((sum, gm) => sum + gm.stolenBases, 0),
    batting: summarizeBatting(plateAppearances),
    hitDirections: buildHitDirections(plateAppearances),
    groundBatting: buildGroundBatting(gameMembers),
    monthlyBatting: buildMonthlyBatting(gameMembers),
    orderBatting: buildOrderBatting(gameMembers),
    positionBatting,
    atBatNumberBatting: buildAtBatNumberBatting(plateAppearances),
    pitching:
      pitchingResults.length > 0 ? summarizePitching(pitchingResults) : null,
    rolePitching: buildRolePitching(gameMembers),
    groundPitching: buildGroundPitching(gameMembers),
    monthlyPitching: buildMonthlyPitching(gameMembers),
    positionGames,
    mvpGames: mvps.map(({ game, comment }) => ({
      eventId: game.eventId,
      date: formatAsYYYYMMDDWithDot(game.event.date),
      opponentName: game.opponent?.name ?? null,
      comment,
    })),
  };
};
