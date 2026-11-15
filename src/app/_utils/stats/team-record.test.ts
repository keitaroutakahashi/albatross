import { summarizeTeamRecord } from "@/app/_utils/stats/team-record";

describe("summarizeTeamRecord", () => {
  it("勝敗と得失点を集計し、勝率は引き分けを除いて求める", () => {
    const record = summarizeTeamRecord([
      { result: "win", teamScore: 5, opponentScore: 2 },
      { result: "win", teamScore: 3, opponentScore: 1 },
      { result: "lose", teamScore: 0, opponentScore: 4 },
      { result: "draw", teamScore: 2, opponentScore: 2 },
    ]);

    expect(record).toMatchObject({
      games: 4,
      wins: 2,
      losses: 1,
      draws: 1,
      runsScored: 10,
      runsAllowed: 9,
      runDifferential: 1,
    });
    expect(record.winningPercentage).toBeCloseTo(2 / 3);
    expect(record.runsScoredAverage).toBeCloseTo(2.5);
    expect(record.runsAllowedAverage).toBeCloseTo(2.25);
  });

  it("得点が未入力の試合は、得点の合計と平均から除く", () => {
    const record = summarizeTeamRecord([
      { result: "win", teamScore: 4, opponentScore: 1 },
      { result: null, teamScore: null, opponentScore: null },
    ]);

    expect(record.games).toBe(2);
    expect(record.runsScored).toBe(4);
    expect(record.runsScoredAverage).toBeCloseTo(4);
  });

  it("試合がないときは勝率・平均が null になる", () => {
    const record = summarizeTeamRecord([]);

    expect(record.games).toBe(0);
    expect(record.winningPercentage).toBeNull();
    expect(record.runsScoredAverage).toBeNull();
    expect(record.runsAllowedAverage).toBeNull();
  });

  it("引き分けだけのときは勝率が null になる", () => {
    const record = summarizeTeamRecord([
      { result: "draw", teamScore: 1, opponentScore: 1 },
    ]);

    expect(record.winningPercentage).toBeNull();
  });
});
