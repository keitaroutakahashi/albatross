import { calcGameScore } from "@/app/_utils/stats/game-score";

const base = { teamForfeitedRuns: 0, opponentForfeitedRuns: 0 };

describe("calcGameScore", () => {
  it("各イニングの得点を合計して得点にする", () => {
    expect(
      calcGameScore({
        ...base,
        teamInnings: [0, 6, 3, 1, 0],
        opponentInnings: [1, 0, 1, 0, 1],
      }),
    ).toEqual({ teamScore: 10, opponentScore: 3, result: "win" });
  });

  it("同点なら引き分け、少なければ負け", () => {
    expect(
      calcGameScore({ ...base, teamInnings: [1, 0], opponentInnings: [0, 1] })
        .result,
    ).toBe("draw");
    expect(
      calcGameScore({ ...base, teamInnings: [0, 0], opponentInnings: [0, 2] })
        .result,
    ).toBe("lose");
  });

  it("得点には献上点を含めず、勝敗は献上点を含めた合計で判定する", () => {
    // イニングの合計は 1-1 の同点だが、献上点 1 で自チームの勝ち
    expect(
      calcGameScore({
        teamInnings: [1],
        opponentInnings: [1],
        teamForfeitedRuns: 1,
        opponentForfeitedRuns: 0,
      }),
    ).toEqual({ teamScore: 1, opponentScore: 1, result: "win" });
  });

  it("イニングが 1 つもなければ、得点・勝敗とも判定しない", () => {
    expect(
      calcGameScore({
        teamInnings: [],
        opponentInnings: [],
        teamForfeitedRuns: 3,
        opponentForfeitedRuns: 0,
      }),
    ).toEqual({ teamScore: null, opponentScore: null, result: null });
  });
});
