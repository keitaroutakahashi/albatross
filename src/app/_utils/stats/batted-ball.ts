import type { AtBatResult, Hand, Position } from "@/generated/prisma/enums";

export type BattedBall = {
  result: AtBatResult;
  direction: Position | null;
  batHand: Hand;
};

/** 打球方向の区分。DH と方向の記録がないものは unknown にまとめる */
export type BattedBallZone = Exclude<Position, "dh"> | "unknown";

/** 打球とみなさない結果（打球にならない打席） */
const NON_BATTED_RESULTS: AtBatResult[] = ["walk", "hitByPitch", "strikeout"];

const HIT_RESULTS: AtBatResult[] = ["single", "double", "triple", "homeRun"];

/** 打球になったアウト。併殺打・犠打・犠飛を含む */
const OUT_RESULTS: AtBatResult[] = [
  "groundOut",
  "flyOut",
  "lineOut",
  "doublePlay",
  "sacrificeHit",
  "sacrificeFly",
];

/** 打数に含めない打球（犠打・犠飛） */
const NON_AT_BAT_RESULTS: AtBatResult[] = ["sacrificeHit", "sacrificeFly"];

const EXTRA_BASE_HITS: AtBatResult[] = ["double", "triple", "homeRun"];

export const BATTED_BALL_ZONES: BattedBallZone[] = [
  "third",
  "shortstop",
  "second",
  "first",
  "pitcher",
  "catcher",
  "left",
  "center",
  "right",
  "unknown",
];

export type BattedBallZoneRow = {
  zone: BattedBallZone;
  /** 打球の数（三振・四死球を除く） */
  balls: number;
  hits: number;
  /** 長打（二塁打・三塁打・本塁打） */
  extraBaseHits: number;
  outs: number;
  /** 打球打率（打球のうち、犠打・犠飛を除いた打数に対する安打の割合） */
  average: number | null;
};

const toZone = (direction: Position | null): BattedBallZone =>
  direction === null || direction === "dh" ? "unknown" : direction;

/** 打球方向ごとに、打球数・安打・アウトと打球打率を集計する。打球が 1 つもない方向も返す */
export const summarizeBattedBallZones = (
  battedBalls: Pick<BattedBall, "result" | "direction">[],
): BattedBallZoneRow[] => {
  const balls = battedBalls.filter(
    ({ result }) => !NON_BATTED_RESULTS.includes(result),
  );

  return BATTED_BALL_ZONES.map((zone) => {
    const items = balls.filter((b) => toZone(b.direction) === zone);
    const hits = items.filter((b) => HIT_RESULTS.includes(b.result)).length;
    const atBats = items.filter(
      (b) => !NON_AT_BAT_RESULTS.includes(b.result),
    ).length;

    return {
      zone,
      balls: items.length,
      hits,
      extraBaseHits: items.filter((b) => EXTRA_BASE_HITS.includes(b.result))
        .length,
      outs: items.filter((b) => OUT_RESULTS.includes(b.result)).length,
      average: atBats > 0 ? hits / atBats : null,
    };
  });
};

export type SprayDirection = "pull" | "center" | "opposite";

export type SprayTendency = {
  /** 引っ張り・センター・逆方向の打球数 */
  counts: Record<SprayDirection, number>;
  /** 集計した打球の数。両打ちと、方向の記録がない打球は含めない */
  total: number;
};

/** 右打者の引っ張り方向。左打者は左右を入れ替える */
const RIGHT_BATTER_PULL: Position[] = ["third", "shortstop", "left"];
const RIGHT_BATTER_OPPOSITE: Position[] = ["first", "second", "right"];

const toSprayDirection = (
  direction: Position | null,
  batHand: Hand,
): SprayDirection | null => {
  if (direction === null || direction === "dh" || batHand === "both") {
    return null;
  }

  const isPullSide = RIGHT_BATTER_PULL.includes(direction);
  const isOppositeSide = RIGHT_BATTER_OPPOSITE.includes(direction);

  if (!isPullSide && !isOppositeSide) return "center";
  if (batHand === "right") return isPullSide ? "pull" : "opposite";
  return isPullSide ? "opposite" : "pull";
};

/**
 * 打球が、打者から見て引っ張り・センター・逆方向のどこへ飛んだかを集計する。
 * 引っ張りは右打者なら三・遊・左、左打者なら一・二・右。投・捕・中はセンターとする。
 */
export const summarizeSprayTendency = (
  battedBalls: BattedBall[],
): SprayTendency => {
  const counts: Record<SprayDirection, number> = {
    pull: 0,
    center: 0,
    opposite: 0,
  };

  for (const { result, direction, batHand } of battedBalls) {
    if (NON_BATTED_RESULTS.includes(result)) continue;

    const spray = toSprayDirection(direction, batHand);
    if (spray) counts[spray] += 1;
  }

  return {
    counts,
    total: counts.pull + counts.center + counts.opposite,
  };
};

export type BattedBallType = "ground" | "fly" | "line";

export type BattedBallTypeSummary = {
  counts: Record<BattedBallType, number>;
  /** 打球種別が分かるアウトの数 */
  total: number;
};

/** 打球種別が分かるアウト。併殺打はゴロ、犠飛はフライとして数える */
const BATTED_BALL_TYPE_BY_RESULT: Partial<Record<AtBatResult, BattedBallType>> =
  {
    groundOut: "ground",
    doublePlay: "ground",
    flyOut: "fly",
    sacrificeFly: "fly",
    lineOut: "line",
  };

/**
 * アウトになった打球をゴロ・フライ・ライナーに分けて集計する。
 * 安打には打球種別の記録がないため、アウトだけが対象。
 */
export const summarizeBattedBallTypes = (
  results: AtBatResult[],
): BattedBallTypeSummary => {
  const counts: Record<BattedBallType, number> = { ground: 0, fly: 0, line: 0 };

  for (const result of results) {
    const type = BATTED_BALL_TYPE_BY_RESULT[result];
    if (type) counts[type] += 1;
  }

  return { counts, total: counts.ground + counts.fly + counts.line };
};

/** 打球方向を見る打者の絞り込み。all は両打ちも含む全打者 */
export type BattedBallBatter = "all" | "right" | "left";

export type BattedBallByBatter = {
  zones: BattedBallZoneRow[];
  spray: SprayTendency;
};

/** 全打者・右打者・左打者のそれぞれで、打球方向と打球の向きを集計する */
export const summarizeBattedBallsByBatter = (
  battedBalls: BattedBall[],
): Record<BattedBallBatter, BattedBallByBatter> => {
  const summarize = (items: BattedBall[]): BattedBallByBatter => ({
    zones: summarizeBattedBallZones(items),
    spray: summarizeSprayTendency(items),
  });

  return {
    all: summarize(battedBalls),
    right: summarize(battedBalls.filter((b) => b.batHand === "right")),
    left: summarize(battedBalls.filter((b) => b.batHand === "left")),
  };
};
