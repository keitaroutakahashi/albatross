export type BenchmarkLevel = "excellent" | "average" | "poor";

export type Benchmark = {
  /** 値が大きいほど良いか、小さいほど良いか */
  better: "higher" | "lower";
  /** 優秀の境界（higher は以上、lower は以下） */
  excellent: number;
  /** 要改善の境界（higher は未満、lower は超） */
  poor: number;
  /** ゲージで表示する範囲 */
  min: number;
  max: number;
  /** この値未満は良し悪しを判定しない（投手の使い方など、少なすぎることが問題とは限らない指標用） */
  judgeFrom?: number;
};

/**
 * 草野球（7 イニング制）を想定した暫定の目安。
 * 一般的な野球の指標と草野球の傾向から置いたもので、リーグの実データで裏付けたものではない。
 */
export const BATTING_BENCHMARKS = {
  iso: { better: "higher", excellent: 0.14, poor: 0.09, min: 0, max: 0.25 },
  babip: { better: "higher", excellent: 0.36, poor: 0.29, min: 0.2, max: 0.45 },
  walkRate: { better: "higher", excellent: 0.12, poor: 0.08, min: 0, max: 0.2 },
  strikeoutRate: {
    better: "lower",
    excellent: 0.12,
    poor: 0.2,
    min: 0,
    max: 0.35,
  },
  walkStrikeoutRatio: {
    better: "higher",
    excellent: 0.8,
    poor: 0.4,
    min: 0,
    max: 1.5,
  },
  extraBaseHitRate: {
    better: "higher",
    excellent: 0.3,
    poor: 0.18,
    min: 0,
    max: 0.5,
  },
  scoringRate: {
    better: "higher",
    excellent: 0.5,
    poor: 0.35,
    min: 0.1,
    max: 0.8,
  },
} as const satisfies Record<string, Benchmark>;

export const PITCHING_BENCHMARKS = {
  strikeoutsPerSeven: {
    better: "higher",
    excellent: 5.5,
    poor: 3.5,
    min: 0,
    max: 9,
  },
  walksPerSeven: { better: "lower", excellent: 2.5, poor: 4.5, min: 0, max: 8 },
  strikeoutWalkRatio: {
    better: "higher",
    excellent: 2,
    poor: 1,
    min: 0,
    max: 4,
  },
  pitchCountPerInning: {
    better: "lower",
    excellent: 14,
    poor: 18,
    min: 8,
    max: 24,
  },
  unearnedRunRate: {
    better: "lower",
    excellent: 0.15,
    poor: 0.25,
    min: 0,
    max: 0.5,
  },
  /** 単位は回（アウト数 ÷ 3） */
  starterInnings: {
    better: "higher",
    excellent: 5,
    poor: 3,
    min: 0,
    max: 7,
  },
  /** 1.5 人未満は継投なしで投げ切る試合が多く、少ないこと自体は問題と言えないので判定しない */
  pitchersPerGame: {
    better: "lower",
    excellent: 2.5,
    poor: 3,
    min: 1,
    max: 4,
    judgeFrom: 1.5,
  },
} as const satisfies Record<string, Benchmark>;

/** 値を目安と比べて、優秀・標準・要改善のどれかを返す。判定しない値のときは null */
export const evaluateBenchmark = (
  benchmark: Benchmark,
  value: number,
): BenchmarkLevel | null => {
  if (benchmark.judgeFrom !== undefined && value < benchmark.judgeFrom) {
    return null;
  }

  if (benchmark.better === "higher") {
    if (value >= benchmark.excellent) return "excellent";
    if (value < benchmark.poor) return "poor";
    return "average";
  }

  if (value <= benchmark.excellent) return "excellent";
  if (value > benchmark.poor) return "poor";
  return "average";
};

/** ゲージ上の位置（0〜1）。表示範囲の外にある値は端に寄せる */
export const toGaugePosition = (benchmark: Benchmark, value: number): number =>
  Math.min(
    1,
    Math.max(0, (value - benchmark.min) / (benchmark.max - benchmark.min)),
  );

export type GaugeZone = { level: BenchmarkLevel; from: number; to: number };

/** ゲージを左（小さい値）から順に塗り分ける区間（位置は 0〜1） */
export const toGaugeZones = (benchmark: Benchmark): GaugeZone[] => {
  const excellent = toGaugePosition(benchmark, benchmark.excellent);
  const poor = toGaugePosition(benchmark, benchmark.poor);

  return benchmark.better === "higher"
    ? [
        { level: "poor", from: 0, to: poor },
        { level: "average", from: poor, to: excellent },
        { level: "excellent", from: excellent, to: 1 },
      ]
    : [
        { level: "excellent", from: 0, to: excellent },
        { level: "average", from: excellent, to: poor },
        { level: "poor", from: poor, to: 1 },
      ];
};
