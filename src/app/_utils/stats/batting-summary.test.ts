import { summarizeBatting } from "@/app/_utils/stats/batting-summary";

describe("summarizeBatting", () => {
  it("打席結果から打数・安打・各種打率を集計する", () => {
    const summary = summarizeBatting([
      { result: "single", rbi: 0, isScoringPosition: false },
      { result: "homeRun", rbi: 2, isScoringPosition: false },
      { result: "walk", rbi: 0, isScoringPosition: false },
      { result: "sacrificeFly", rbi: 1, isScoringPosition: false },
      { result: "strikeout", rbi: 0, isScoringPosition: false },
    ]);

    expect(summary).toMatchObject({
      plateAppearances: 5,
      // 四球・犠飛は打数に含めない
      atBats: 3,
      hits: 2,
      singles: 1,
      homeRuns: 1,
      rbi: 3,
      walks: 1,
      strikeouts: 1,
      sacrificeFlies: 1,
    });
    expect(summary.average).toBeCloseTo(2 / 3);
    // 塁打 = 1 + 4、長打率 = 5 / 3
    expect(summary.sluggingPercentage).toBeCloseTo(5 / 3);
    // 出塁率 = (2 + 1) / (3 + 1 + 1)
    expect(summary.onBasePercentage).toBeCloseTo(3 / 5);
  });

  it("得点圏打率は得点圏の打席だけで算出し、四死球・犠飛は打数に含めない", () => {
    const summary = summarizeBatting([
      { result: "single", rbi: 1, isScoringPosition: true },
      { result: "groundOut", rbi: 0, isScoringPosition: true },
      { result: "walk", rbi: 0, isScoringPosition: true },
      { result: "sacrificeFly", rbi: 1, isScoringPosition: true },
      { result: "homeRun", rbi: 1, isScoringPosition: false },
    ]);

    expect(summary.scoringPositionAtBats).toBe(2);
    expect(summary.scoringPositionHits).toBe(1);
    expect(summary.scoringPositionAverage).toBeCloseTo(1 / 2);
  });

  it("得点圏の打数がないときは得点圏打率が null になる", () => {
    const summary = summarizeBatting([
      { result: "single", rbi: 0, isScoringPosition: false },
    ]);

    expect(summary.scoringPositionAverage).toBeNull();
  });

  it("打席がないときは各種の率が null になる", () => {
    const summary = summarizeBatting([]);

    expect(summary.plateAppearances).toBe(0);
    expect(summary.average).toBeNull();
    expect(summary.ops).toBeNull();
  });
});
