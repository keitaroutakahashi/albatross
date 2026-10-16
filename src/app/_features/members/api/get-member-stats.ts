import { ALL_SEASONS } from "@/app/_constants/stats";
import { hitResults } from "@/app/_features/games/utils/at-bat-result";
import { formatAsYYYYMMDDWithDot, getMonthInJst } from "@/app/_utils/date/date";
import {
  type BattingPlateAppearance,
  type BattingSummary,
  summarizeBatting,
} from "@/app/_utils/stats/batting-summary";
import { resolvePitchingDecision } from "@/app/_utils/stats/pitching-decision";
import {
  type PitchingSummary,
  summarizePitching,
} from "@/app/_utils/stats/pitching-summary";
import type { Prisma } from "@/generated/prisma/client";
import { Position } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

/** 守備位置の表示順（enum の定義順） */
const POSITION_ORDER = Object.values(Position);

/** 安打方向の集計単位。内野の打球は方向に関わらず infield にまとめる */
export type HitZone = "infield" | "left" | "center" | "right" | "unknown";

/** 表示順。unknown（方向の記録がない安打）は記録があるときだけ返す */
const HIT_ZONES: HitZone[] = ["infield", "left", "center", "right", "unknown"];

export type HitDirectionRow = {
  zone: HitZone;
  singles: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  hits: number;
};

/** グラウンド別・月別など、切り口ごとの打撃成績の共通部分 */
export type BattingSplitRow = BattingSummary & {
  /** 出場試合数 */
  games: number;
};

export type GroundBattingRow = BattingSplitRow & {
  /** グラウンド未設定の試合は null */
  groundId: number | null;
  groundName: string;
};

/** 登板順 1 が先発、それ以外が救援 */
export type PitchingRole = "starter" | "reliever";

export type RolePitchingRow = PitchingSummary & {
  role: PitchingRole;
};

export type GroundPitchingRow = PitchingSummary & {
  /** グラウンド未設定の試合は null */
  groundId: number | null;
  groundName: string;
};

export type MonthlyPitchingRow = PitchingSummary & {
  /** 1〜12 */
  month: number;
};

export type OrderBattingRow = BattingSplitRow & {
  /** 打順（1〜） */
  battingOrder: number;
};

export type PositionBattingRow = BattingSplitRow & {
  position: Position;
};

export type AtBatNumberBattingRow = BattingSplitRow & {
  /** 試合中の何打席目か（1〜） */
  atBatNumber: number;
};

export type MonthlyBattingRow = BattingSplitRow & {
  /** 1〜12 */
  month: number;
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

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const UNKNOWN_GROUND_NAME = "グラウンド未設定";

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

  // 勝敗は責任投手かどうかと、その試合の結果から決まる
  const pitchingOf = (gm: (typeof gameMembers)[number]) =>
    gm.pitchingResult && {
      ...gm.pitchingResult,
      decision: resolvePitchingDecision(
        gm.pitchingResult.isResponsible,
        gm.game.result,
      ),
    };

  const plateAppearances = gameMembers.flatMap((gm) => gm.plateAppearances);

  const hitDirectionByZone = new Map<HitZone, HitDirectionRow>(
    HIT_ZONES.map((zone) => [zone, emptyHitDirection(zone)]),
  );

  for (const { result, direction } of plateAppearances) {
    if (!hitResults.includes(result)) continue;

    // 初期化済みの全ゾーンを持つため、必ず取得できる
    const row = hitDirectionByZone.get(toHitZone(direction)) as HitDirectionRow;

    row.hits += 1;
    if (result === "single") row.singles += 1;
    if (result === "double") row.doubles += 1;
    if (result === "triple") row.triples += 1;
    if (result === "homeRun") row.homeRuns += 1;
  }

  const hitDirections = [...hitDirectionByZone.values()].filter(
    (row) => row.zone !== "unknown" || row.hits > 0,
  );

  const gameMembersByGround = Map.groupBy(
    gameMembers,
    (gm) => gm.game.ground?.id ?? null,
  );

  const groundBatting: GroundBattingRow[] = [...gameMembersByGround.values()]
    .map((members) => {
      const ground = members[0].game.ground;

      return {
        groundId: ground?.id ?? null,
        groundName: ground?.name ?? UNKNOWN_GROUND_NAME,
        ...summarizeBattingSplit(members),
      };
    })
    .filter((row) => row.plateAppearances > 0)
    .sort((a, b) => b.plateAppearances - a.plateAppearances);

  // 全年度のときは年をまたいで同じ月を合算する（季節ごとの傾向を見るため）
  const gameMembersByMonth = Map.groupBy(gameMembers, (gm) =>
    getMonthInJst(gm.game.event.date),
  );

  // 打席のない月は返さない
  const monthlyBatting: MonthlyBattingRow[] = MONTHS.map((month) => ({
    month,
    ...summarizeBattingSplit(gameMembersByMonth.get(month) ?? []),
  })).filter((row) => row.plateAppearances > 0);

  const pitchingRoles: PitchingRole[] = ["starter", "reliever"];

  // 登板のない役割は返さない
  const rolePitching: RolePitchingRow[] = pitchingRoles.flatMap((role) => {
    const results = gameMembers.flatMap((gm) => {
      const result = pitchingOf(gm);
      return result && (result.pitchingOrder === 1) === (role === "starter")
        ? [result]
        : [];
    });

    return results.length > 0 ? [{ role, ...summarizePitching(results) }] : [];
  });

  const pitchingByGround = Map.groupBy(
    gameMembers.flatMap((gm) => {
      const result = pitchingOf(gm);
      return result ? [{ ground: gm.game.ground, result }] : [];
    }),
    ({ ground }) => ground?.id ?? null,
  );

  const groundPitching: GroundPitchingRow[] = [...pitchingByGround.values()]
    .map((items) => ({
      groundId: items[0].ground?.id ?? null,
      groundName: items[0].ground?.name ?? UNKNOWN_GROUND_NAME,
      ...summarizePitching(items.map(({ result }) => result)),
    }))
    .sort((a, b) => b.games - a.games || b.outs - a.outs);

  // 全年度のときは年をまたいで同じ月を合算する。登板のない月は返さない
  const pitchingByMonth = Map.groupBy(
    gameMembers.flatMap((gm) => {
      const result = pitchingOf(gm);
      return result
        ? [{ month: getMonthInJst(gm.game.event.date), result }]
        : [];
    }),
    ({ month }) => month,
  );

  const monthlyPitching: MonthlyPitchingRow[] = MONTHS.flatMap((month) => {
    const items = pitchingByMonth.get(month);

    return items
      ? [{ month, ...summarizePitching(items.map(({ result }) => result)) }]
      : [];
  });

  const pitchingResults = gameMembers.flatMap((gm) => {
    const result = pitchingOf(gm);
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

  const gameMembersByOrder = Map.groupBy(
    gameMembers.flatMap((gm) =>
      gm.battingOrder === null
        ? []
        : [{ ...gm, battingOrder: gm.battingOrder }],
    ),
    (gm) => gm.battingOrder,
  );

  const orderBatting: OrderBattingRow[] = [...gameMembersByOrder]
    .map(([battingOrder, members]) => ({
      battingOrder,
      ...summarizeBattingSplit(members),
    }))
    .filter((row) => row.plateAppearances > 0)
    .sort((a, b) => a.battingOrder - b.battingOrder);

  const positionBatting: PositionBattingRow[] = POSITION_ORDER.flatMap(
    (position) => {
      const row = {
        position,
        ...summarizeBattingSplit(gamesByPosition.get(position) ?? []),
      };

      return row.plateAppearances > 0 ? [row] : [];
    },
  );

  // 1 打席 = 1 試合に 1 回のため、各行の「試合」は打席数と一致する
  const plateAppearancesByNumber = Map.groupBy(
    plateAppearances,
    (pa) => pa.atBatInGame,
  );

  const atBatNumberBatting: AtBatNumberBattingRow[] = [
    ...plateAppearancesByNumber,
  ]
    .map(([atBatNumber, items]) => ({
      atBatNumber,
      games: items.length,
      ...summarizeBatting(items),
    }))
    .sort((a, b) => a.atBatNumber - b.atBatNumber);

  return {
    season,
    games: gameMembers.length,
    stolenBases: gameMembers.reduce((sum, gm) => sum + gm.stolenBases, 0),
    batting: summarizeBatting(plateAppearances),
    hitDirections,
    groundBatting,
    monthlyBatting,
    orderBatting,
    positionBatting,
    atBatNumberBatting,
    pitching:
      pitchingResults.length > 0 ? summarizePitching(pitchingResults) : null,
    rolePitching,
    groundPitching,
    monthlyPitching,
    positionGames,
    mvpGames: mvps.map(({ game, comment }) => ({
      eventId: game.eventId,
      date: formatAsYYYYMMDDWithDot(game.event.date),
      opponentName: game.opponent?.name ?? null,
      comment,
    })),
  };
};

const summarizeBattingSplit = (
  members: { plateAppearances: BattingPlateAppearance[] }[],
): BattingSplitRow => ({
  games: members.length,
  ...summarizeBatting(members.flatMap((gm) => gm.plateAppearances)),
});

const emptyHitDirection = (zone: HitZone): HitDirectionRow => ({
  zone,
  singles: 0,
  doubles: 0,
  triples: 0,
  homeRuns: 0,
  hits: 0,
});

const toHitZone = (direction: Position | null): HitZone => {
  switch (direction) {
    case "left":
    case "center":
    case "right":
      return direction;
    case null:
    case "dh":
      return "unknown";
    default:
      return "infield";
  }
};
