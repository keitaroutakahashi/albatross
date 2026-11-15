import { summarizeInningScoring } from "@/app/_utils/stats/inning-scoring";

describe("summarizeInningScoring", () => {
  it("回ごとに得点・失点・試合数を合算する", () => {
    const rows = summarizeInningScoring([
      [
        { inningNumber: 1, teamScore: 2, opponentScore: 0 },
        { inningNumber: 2, teamScore: 0, opponentScore: 1 },
      ],
      [{ inningNumber: 1, teamScore: 1, opponentScore: 3 }],
    ]);

    expect(rows[0]).toEqual({
      inningNumber: 1,
      games: 2,
      runsScored: 3,
      runsAllowed: 3,
    });
    expect(rows[1]).toEqual({
      inningNumber: 2,
      games: 1,
      runsScored: 0,
      runsAllowed: 1,
    });
  });

  it("記録がなくても 7 回までの行を返す", () => {
    const rows = summarizeInningScoring([]);

    expect(rows).toHaveLength(7);
    expect(rows.every((row) => row.games === 0)).toBe(true);
  });

  it("延長の回は、記録がある分だけ行を増やす", () => {
    const rows = summarizeInningScoring([
      [{ inningNumber: 9, teamScore: 1, opponentScore: 0 }],
    ]);

    expect(rows).toHaveLength(9);
    expect(rows[8].runsScored).toBe(1);
  });
});
