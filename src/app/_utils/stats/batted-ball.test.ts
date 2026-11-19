import {
  summarizeBattedBallsByBatter,
  summarizeBattedBallTypes,
  summarizeBattedBallZones,
  summarizeSprayTendency,
} from "@/app/_utils/stats/batted-ball";

describe("summarizeBattedBallZones", () => {
  it("三振・四死球は打球に含めず、方向ごとの打球数・安打・アウトと打球打率を出す", () => {
    const rows = summarizeBattedBallZones([
      { result: "single", direction: "left" },
      { result: "double", direction: "left" },
      { result: "flyOut", direction: "left" },
      { result: "sacrificeFly", direction: "left" },
      { result: "groundOut", direction: "shortstop" },
      { result: "strikeout", direction: null },
      { result: "walk", direction: null },
    ]);

    expect(rows.find((r) => r.zone === "left")).toEqual({
      zone: "left",
      balls: 4,
      hits: 2,
      extraBaseHits: 1,
      outs: 2,
      // 犠飛は打数に含めない: 2 / 3
      average: 2 / 3,
    });
    expect(rows.find((r) => r.zone === "shortstop")?.average).toBe(0);
    expect(rows.find((r) => r.zone === "center")?.average).toBeNull();
  });

  it("方向の記録がない打球と DH は unknown にまとめる", () => {
    const rows = summarizeBattedBallZones([
      { result: "single", direction: null },
      { result: "groundOut", direction: "dh" },
    ]);

    expect(rows.find((r) => r.zone === "unknown")?.balls).toBe(2);
  });
});

describe("summarizeSprayTendency", () => {
  it("右打者は左方向が引っ張り、左打者は右方向が引っ張りになる", () => {
    const tendency = summarizeSprayTendency([
      { result: "single", direction: "left", batHand: "right" },
      { result: "single", direction: "right", batHand: "right" },
      { result: "single", direction: "right", batHand: "left" },
      { result: "groundOut", direction: "pitcher", batHand: "left" },
    ]);

    expect(tendency).toEqual({
      counts: { pull: 2, center: 1, opposite: 1 },
      total: 4,
    });
  });

  it("両打ち・方向不明・打球にならない打席は含めない", () => {
    const tendency = summarizeSprayTendency([
      { result: "single", direction: "left", batHand: "both" },
      { result: "single", direction: null, batHand: "right" },
      { result: "strikeout", direction: "left", batHand: "right" },
    ]);

    expect(tendency.total).toBe(0);
  });
});

describe("summarizeBattedBallTypes", () => {
  it("併殺打をゴロ、犠飛をフライとして数え、種別のない結果は除く", () => {
    const summary = summarizeBattedBallTypes([
      "groundOut",
      "doublePlay",
      "flyOut",
      "sacrificeFly",
      "lineOut",
      "strikeout",
      "single",
    ]);

    expect(summary).toEqual({
      counts: { ground: 2, fly: 2, line: 1 },
      total: 5,
    });
  });
});

describe("summarizeBattedBallsByBatter", () => {
  const balls = [
    { result: "single", direction: "left", batHand: "right" },
    { result: "groundOut", direction: "left", batHand: "left" },
    { result: "flyOut", direction: "center", batHand: "both" },
  ] as const;

  it("全打者は両打ちを含み、右打者・左打者はそれぞれの打球だけを集計する", () => {
    const summary = summarizeBattedBallsByBatter([...balls]);
    const leftBalls = (zones: { zone: string; balls: number }[]) =>
      zones.find((z) => z.zone === "left")?.balls;

    expect(leftBalls(summary.all.zones)).toBe(2);
    expect(leftBalls(summary.right.zones)).toBe(1);
    expect(leftBalls(summary.left.zones)).toBe(1);
    expect(summary.right.zones.find((z) => z.zone === "center")?.balls).toBe(0);
  });

  it("打球の向きは、全打者でも両打ちを含めない", () => {
    const summary = summarizeBattedBallsByBatter([...balls]);

    expect(summary.all.spray.total).toBe(2);
    expect(summary.right.spray.counts).toEqual({
      pull: 1,
      center: 0,
      opposite: 0,
    });
    expect(summary.left.spray.counts).toEqual({
      pull: 0,
      center: 0,
      opposite: 1,
    });
  });
});
