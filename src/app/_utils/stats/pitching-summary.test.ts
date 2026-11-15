import { summarizePitching } from "@/app/_utils/stats/pitching-summary";

const base = {
  pitchingOrder: 1,
  inningsPitched: 0,
  partialOuts: null,
  earnedRuns: 0,
  runs: 0,
  strikeouts: 0,
  walks: 0,
  hitByPitches: 0,
  hitsAllowed: 0,
  homeRunsAllowed: 0,
  pitchCount: null,
  decision: null,
};

describe("summarizePitching", () => {
  it("登板ごとの成績を合算し、投球回はアウト数で積み上げる", () => {
    const summary = summarizePitching([
      {
        ...base,
        inningsPitched: 5,
        partialOuts: 2,
        earnedRuns: 2,
        walks: 1,
        hitsAllowed: 3,
        decision: "win",
      },
      {
        ...base,
        pitchingOrder: 2,
        inningsPitched: 1,
        partialOuts: 1,
        earnedRuns: 1,
        decision: "loss",
      },
    ]);

    // 17 アウト + 4 アウト
    expect(summary.outs).toBe(21);
    expect(summary).toMatchObject({
      games: 2,
      starts: 1,
      wins: 1,
      losses: 1,
      earnedRuns: 3,
    });
    // 3 自責点 × 21 ÷ 21 アウト
    expect(summary.era).toBeCloseTo(3);
    // (1 + 3) ÷ 7 回
    expect(summary.whip).toBeCloseTo(4 / 7);
  });

  it("球数は入力のある登板だけで合計・平均を算出する", () => {
    const summary = summarizePitching([
      { ...base, pitchCount: 80 },
      { ...base, pitchCount: 100 },
      { ...base, pitchCount: null },
    ]);

    expect(summary.pitchCount).toBe(180);
    expect(summary.pitchCountAverage).toBe(90);
  });

  it("球数の入力が 1 登板もないときは null になる", () => {
    const summary = summarizePitching([base]);

    expect(summary.pitchCount).toBeNull();
    expect(summary.pitchCountAverage).toBeNull();
  });

  it("アウトを取っていないときは防御率・WHIP が null になる", () => {
    const summary = summarizePitching([{ ...base, earnedRuns: 2 }]);

    expect(summary.era).toBeNull();
    expect(summary.whip).toBeNull();
  });

  it("非自責点と 7 イニングあたりの奪三振・与四球、K/BB を算出する", () => {
    const summary = summarizePitching([
      {
        ...base,
        inningsPitched: 7,
        runs: 4,
        earnedRuns: 3,
        strikeouts: 6,
        walks: 2,
      },
    ]);

    expect(summary.unearnedRuns).toBe(1);
    expect(summary.strikeoutsPerSeven).toBeCloseTo(6);
    expect(summary.walksPerSeven).toBeCloseTo(2);
    expect(summary.strikeoutWalkRatio).toBeCloseTo(3);
  });

  it("投球回が 0 のときは 7 イニングあたりの値が null になる", () => {
    const summary = summarizePitching([{ ...base, strikeouts: 1, walks: 1 }]);

    expect(summary.strikeoutsPerSeven).toBeNull();
    expect(summary.walksPerSeven).toBeNull();
  });

  it("1 イニングあたりの球数は、球数が入力された登板だけで算出する", () => {
    const summary = summarizePitching([
      { ...base, inningsPitched: 3, pitchCount: 45 },
      // 球数が未入力の登板は、球数もアウト数も算出から除く
      { ...base, pitchingOrder: 2, inningsPitched: 4 },
    ]);

    expect(summary.pitchCountPerInning).toBeCloseTo(15);
  });
});
