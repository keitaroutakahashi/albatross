import type { PitchingGameResult } from "@/app/_utils/stats/pitching-summary";
import { summarizePitchingUsage } from "@/app/_utils/stats/pitching-usage";

const result = (
  overrides: Partial<PitchingGameResult>,
): PitchingGameResult => ({
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
  ...overrides,
});

describe("summarizePitchingUsage", () => {
  it("1 試合あたりの使用投手数と、先発の平均アウト数を求める", () => {
    const usage = summarizePitchingUsage([
      [
        result({ pitchingOrder: 1, inningsPitched: 4, partialOuts: 1 }),
        result({ pitchingOrder: 2, inningsPitched: 3 }),
      ],
      [result({ pitchingOrder: 1, inningsPitched: 7 })],
    ]);

    // 3 人 ÷ 2 試合
    expect(usage.pitchersPerGame).toBeCloseTo(1.5);
    // (13 アウト + 21 アウト) ÷ 2
    expect(usage.starterAverageOuts).toBeCloseTo(17);
  });

  it("登板のない試合は使用投手数の平均に含めない", () => {
    const usage = summarizePitchingUsage([[result({ inningsPitched: 7 })], []]);

    expect(usage.pitchersPerGame).toBeCloseTo(1);
  });

  it("登板がないときは null になる", () => {
    expect(summarizePitchingUsage([])).toEqual({
      pitchersPerGame: null,
      starterAverageOuts: null,
    });
  });
});
