import { hitResults } from "@/app/_features/games/utils/at-bat-result";
import { getMonthInJst } from "@/app/_utils/date/date";
import {
  type BattingPlateAppearance,
  type BattingSummary,
  summarizeBatting,
} from "@/app/_utils/stats/batting-summary";
import { resolvePitchingDecision } from "@/app/_utils/stats/pitching-decision";
import {
  type PitchingGameResult,
  type PitchingSummary,
  summarizePitching,
} from "@/app/_utils/stats/pitching-summary";
import { type GameResult, Hand, type Position } from "@/generated/prisma/enums";

/** 安打方向の集計単位。内野の打球は方向に関わらず infield にまとめる */
export type HitZone = "infield" | "left" | "center" | "right" | "unknown";

/** 表示順。unknown（方向の記録がない安打）は記録があるときだけ返す */
const HIT_ZONES: HitZone[] = ["infield", "left", "center", "right", "unknown"];

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const UNKNOWN_GROUND_NAME = "グラウンド未設定";

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
  /** 出場試合数（チーム単位では、その切り口に含まれる試合数） */
  games: number;
};

export type GroundBattingRow = BattingSplitRow & {
  /** グラウンド未設定の試合は null */
  groundId: number | null;
  groundName: string;
};

export type MonthlyBattingRow = BattingSplitRow & {
  /** 1〜12 */
  month: number;
};

export type OrderBattingRow = BattingSplitRow & {
  /** 打順（1〜） */
  battingOrder: number;
};

export type BatHandBattingRow = BattingSplitRow & {
  batHand: Hand;
};

export type AtBatNumberBattingRow = BattingSplitRow & {
  /** 試合中の何打席目か（1〜） */
  atBatNumber: number;
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

export type SplitPlateAppearance = BattingPlateAppearance & {
  direction: Position | null;
  /** 選手ごとの、試合中の打席番号 */
  atBatInGame: number;
};

export type SplitPitchingResult = Omit<PitchingGameResult, "decision"> & {
  isResponsible: boolean;
};

/** 切り口ごとの集計に必要な、試合に出場した選手 1 人分のデータ */
export type SplitGameMember = {
  gameId: number;
  battingOrder: number | null;
  plateAppearances: SplitPlateAppearance[];
  pitchingResult: SplitPitchingResult | null;
  game: {
    result: GameResult | null;
    ground: { id: number; name: string } | null;
    event: { date: Date };
  };
};

/** 打席の左右を切り口にした集計に必要な、選手の打席の向き */
export type BatHandGameMember = SplitGameMember & { batHand: Hand };

/** 勝敗は責任投手かどうかと、その試合の結果から決まる */
export const toPitchingGameResult = (
  gm: Pick<SplitGameMember, "pitchingResult" | "game">,
): PitchingGameResult | null =>
  gm.pitchingResult && {
    ...gm.pitchingResult,
    decision: resolvePitchingDecision(
      gm.pitchingResult.isResponsible,
      gm.game.result,
    ),
  };

/**
 * 出場した選手の打席を集計する。
 * 試合数は選手の延べ人数ではなく、含まれる試合の数（個人では出場試合数と一致する）。
 */
export const summarizeBattingSplit = (
  members: Pick<SplitGameMember, "gameId" | "plateAppearances">[],
): BattingSplitRow => ({
  games: new Set(members.map((gm) => gm.gameId)).size,
  ...summarizeBatting(members.flatMap((gm) => gm.plateAppearances)),
});

export const buildHitDirections = (
  plateAppearances: Pick<SplitPlateAppearance, "result" | "direction">[],
): HitDirectionRow[] => {
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

  return [...hitDirectionByZone.values()].filter(
    (row) => row.zone !== "unknown" || row.hits > 0,
  );
};

export const buildGroundBatting = (
  gameMembers: SplitGameMember[],
): GroundBattingRow[] => {
  const gameMembersByGround = Map.groupBy(
    gameMembers,
    (gm) => gm.game.ground?.id ?? null,
  );

  return [...gameMembersByGround.values()]
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
};

/**
 * 月別の打撃成績。
 * 全年度のときは年をまたいで同じ月を合算する（季節ごとの傾向を見るため）。
 * 打席のない月は返さない。
 */
export const buildMonthlyBatting = (
  gameMembers: SplitGameMember[],
): MonthlyBattingRow[] => {
  const gameMembersByMonth = Map.groupBy(gameMembers, (gm) =>
    getMonthInJst(gm.game.event.date),
  );

  return MONTHS.map((month) => ({
    month,
    ...summarizeBattingSplit(gameMembersByMonth.get(month) ?? []),
  })).filter((row) => row.plateAppearances > 0);
};

export const buildOrderBatting = (
  gameMembers: SplitGameMember[],
): OrderBattingRow[] => {
  const gameMembersByOrder = Map.groupBy(
    gameMembers.flatMap((gm) =>
      gm.battingOrder === null
        ? []
        : [{ ...gm, battingOrder: gm.battingOrder }],
    ),
    (gm) => gm.battingOrder,
  );

  return [...gameMembersByOrder]
    .map(([battingOrder, members]) => ({
      battingOrder,
      ...summarizeBattingSplit(members),
    }))
    .filter((row) => row.plateAppearances > 0)
    .sort((a, b) => a.battingOrder - b.battingOrder);
};

/**
 * 打者の左右別の打撃成績。打席ごとの左右は記録がないため、両打ちの選手は「両」としてまとめる。
 * 打席のない区分は返さない。
 */
export const buildBatHandBatting = (
  gameMembers: BatHandGameMember[],
): BatHandBattingRow[] => {
  const gameMembersByHand = Map.groupBy(gameMembers, (gm) => gm.batHand);

  return Object.values(Hand)
    .map((batHand) => ({
      batHand,
      ...summarizeBattingSplit(gameMembersByHand.get(batHand) ?? []),
    }))
    .filter((row) => row.plateAppearances > 0);
};

/**
 * 試合中の打席番号（何打席目か）別の打撃成績。
 * 打席番号は選手ごとに振られるため、「試合」は同じ打席番号の打席数で、
 * 個人でしか意味を持たない（表では省く）。
 */
export const buildAtBatNumberBatting = (
  plateAppearances: SplitPlateAppearance[],
): AtBatNumberBattingRow[] => {
  const plateAppearancesByNumber = Map.groupBy(
    plateAppearances,
    (pa) => pa.atBatInGame,
  );

  return [...plateAppearancesByNumber]
    .map(([atBatNumber, items]) => ({
      atBatNumber,
      games: items.length,
      ...summarizeBatting(items),
    }))
    .sort((a, b) => a.atBatNumber - b.atBatNumber);
};

/** 登板のない役割は返さない */
export const buildRolePitching = (
  gameMembers: SplitGameMember[],
): RolePitchingRow[] => {
  const pitchingRoles: PitchingRole[] = ["starter", "reliever"];

  return pitchingRoles.flatMap((role) => {
    const results = gameMembers.flatMap((gm) => {
      const result = toPitchingGameResult(gm);
      return result && (result.pitchingOrder === 1) === (role === "starter")
        ? [result]
        : [];
    });

    return results.length > 0 ? [{ role, ...summarizePitching(results) }] : [];
  });
};

export const buildGroundPitching = (
  gameMembers: SplitGameMember[],
): GroundPitchingRow[] => {
  const pitchingByGround = Map.groupBy(
    gameMembers.flatMap((gm) => {
      const result = toPitchingGameResult(gm);
      return result ? [{ ground: gm.game.ground, result }] : [];
    }),
    ({ ground }) => ground?.id ?? null,
  );

  return [...pitchingByGround.values()]
    .map((items) => ({
      groundId: items[0].ground?.id ?? null,
      groundName: items[0].ground?.name ?? UNKNOWN_GROUND_NAME,
      ...summarizePitching(items.map(({ result }) => result)),
    }))
    .sort((a, b) => b.games - a.games || b.outs - a.outs);
};

/** 全年度のときは年をまたいで同じ月を合算する。登板のない月は返さない */
export const buildMonthlyPitching = (
  gameMembers: SplitGameMember[],
): MonthlyPitchingRow[] => {
  const pitchingByMonth = Map.groupBy(
    gameMembers.flatMap((gm) => {
      const result = toPitchingGameResult(gm);
      return result
        ? [{ month: getMonthInJst(gm.game.event.date), result }]
        : [];
    }),
    ({ month }) => month,
  );

  return MONTHS.flatMap((month) => {
    const items = pitchingByMonth.get(month);

    return items
      ? [{ month, ...summarizePitching(items.map(({ result }) => result)) }]
      : [];
  });
};

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
