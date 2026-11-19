import {
  BATTING_BENCHMARKS,
  evaluateBenchmark,
  PITCHING_BENCHMARKS,
  toGaugePosition,
  toGaugeZones,
} from "@/app/_utils/stats/benchmarks";

describe("evaluateBenchmark", () => {
  const higher = BATTING_BENCHMARKS.iso;
  const lower = BATTING_BENCHMARKS.strikeoutRate;

  it("大きいほど良い指標は、優秀の境界以上が優秀、要改善の境界未満が要改善", () => {
    expect(evaluateBenchmark(higher, 0.14)).toBe("excellent");
    expect(evaluateBenchmark(higher, 0.09)).toBe("average");
    expect(evaluateBenchmark(higher, 0.089)).toBe("poor");
  });

  it("小さいほど良い指標は、優秀の境界以下が優秀、要改善の境界超が要改善", () => {
    expect(evaluateBenchmark(lower, 0.12)).toBe("excellent");
    expect(evaluateBenchmark(lower, 0.2)).toBe("average");
    expect(evaluateBenchmark(lower, 0.201)).toBe("poor");
  });

  it("判定しない下限より小さい値は null を返す", () => {
    const benchmark = PITCHING_BENCHMARKS.pitchersPerGame;

    expect(evaluateBenchmark(benchmark, 1.2)).toBeNull();
    expect(evaluateBenchmark(benchmark, 1.5)).toBe("excellent");
    expect(evaluateBenchmark(benchmark, 3.5)).toBe("poor");
  });
});

describe("toGaugePosition", () => {
  const benchmark = BATTING_BENCHMARKS.iso;

  it("表示範囲の中の位置を 0〜1 で返す", () => {
    expect(toGaugePosition(benchmark, 0.125)).toBeCloseTo(0.5);
  });

  it("表示範囲の外の値は端に寄せる", () => {
    expect(toGaugePosition(benchmark, -1)).toBe(0);
    expect(toGaugePosition(benchmark, 1)).toBe(1);
  });
});

describe("toGaugeZones", () => {
  it("大きいほど良い指標は、左から要改善・標準・優秀の順に並ぶ", () => {
    const zones = toGaugeZones(BATTING_BENCHMARKS.iso);

    expect(zones.map((z) => z.level)).toEqual(["poor", "average", "excellent"]);
    expect(zones[0].to).toBeCloseTo(0.09 / 0.25);
    expect(zones[2].to).toBe(1);
  });

  it("小さいほど良い指標は、左から優秀・標準・要改善の順に並ぶ", () => {
    const zones = toGaugeZones(BATTING_BENCHMARKS.strikeoutRate);

    expect(zones.map((z) => z.level)).toEqual(["excellent", "average", "poor"]);
    expect(zones[1].from).toBeCloseTo(0.12 / 0.35);
  });
});
