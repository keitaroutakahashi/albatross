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

  it("ISO・BABIP・四死球率・三振率・BB/K を算出する", () => {
    const summary = summarizeBatting([
      { result: "single", rbi: 0, isScoringPosition: false },
      { result: "homeRun", rbi: 1, isScoringPosition: false },
      { result: "groundOut", rbi: 0, isScoringPosition: false },
      { result: "strikeout", rbi: 0, isScoringPosition: false },
      { result: "walk", rbi: 0, isScoringPosition: false },
    ]);

    // 打率 2/4、長打率 5/4
    expect(summary.iso).toBeCloseTo(5 / 4 - 2 / 4);
    // (2 - 1) ÷ (4 - 1 - 1 + 0)
    expect(summary.babip).toBeCloseTo(1 / 2);
    expect(summary.walkRate).toBeCloseTo(1 / 5);
    expect(summary.strikeoutRate).toBeCloseTo(1 / 5);
    expect(summary.walkStrikeoutRatio).toBeCloseTo(1);
  });

  it("三振がないときは BB/K が null になる", () => {
    const summary = summarizeBatting([
      { result: "walk", rbi: 0, isScoringPosition: false },
    ]);

    expect(summary.walkStrikeoutRatio).toBeNull();
  });

  it("併殺打と得点圏での打点を数える", () => {
    const summary = summarizeBatting([
      { result: "doublePlay", rbi: 0, isScoringPosition: false },
      { result: "single", rbi: 2, isScoringPosition: true },
      { result: "homeRun", rbi: 3, isScoringPosition: false },
    ]);

    expect(summary.doublePlays).toBe(1);
    expect(summary.scoringPositionRbi).toBe(2);
  });
});

describe("summarizeBatting の長打割合", () => {
  it("安打のうち二塁打・三塁打・本塁打が占める割合を出す", () => {
    const summary = summarizeBatting([
      { result: "single", rbi: 0, isScoringPosition: false },
      { result: "double", rbi: 0, isScoringPosition: false },
      { result: "homeRun", rbi: 0, isScoringPosition: false },
      { result: "groundOut", rbi: 0, isScoringPosition: false },
    ]);

    expect(summary.extraBaseHitRate).toBeCloseTo(2 / 3);
  });

  it("安打がないときは null になる", () => {
    const summary = summarizeBatting([
      { result: "groundOut", rbi: 0, isScoringPosition: false },
    ]);

    expect(summary.extraBaseHitRate).toBeNull();
  });
});
