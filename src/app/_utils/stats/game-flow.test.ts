import {
  analyzeGameFlow,
  type GameFlowInput,
  summarizeGameFlows,
} from "@/app/_utils/stats/game-flow";

const inning = (
  inningNumber: number,
  teamScore: number,
  opponentScore: number,
) => ({
  inningNumber,
  teamScore,
  opponentScore,
});

describe("analyzeGameFlow", () => {
  it("先攻のとき、同じ回なら自チームの攻撃が先に来るものとして先制を判定する", () => {
    expect(
      analyzeGameFlow({
        isFirstBatting: true,
        innings: [inning(1, 1, 2)],
      }),
    ).toEqual({
      scoredFirst: true,
      wasLeading: true,
      wasTrailing: true,
      maxDeficit: 1,
    });
  });

  it("後攻のとき、同じ回なら相手の攻撃が先に来るものとして先制を判定する", () => {
    // 相手が 2 点取ったあとに 1 点返しただけなので、一度もリードしていない
    expect(
      analyzeGameFlow({
        isFirstBatting: false,
        innings: [inning(1, 1, 2)],
      }),
    ).toEqual({
      scoredFirst: false,
      wasLeading: false,
      wasTrailing: true,
      maxDeficit: 2,
    });
  });

  it("回の並びに関わらず、イニング番号の順に判定する", () => {
    const flow = analyzeGameFlow({
      isFirstBatting: true,
      innings: [inning(2, 3, 0), inning(1, 0, 1)],
    });

    expect(flow).toEqual({
      scoredFirst: false,
      wasLeading: true,
      wasTrailing: true,
      maxDeficit: 1,
    });
  });

  it("ずっとリードしていた試合は、リードされた形跡がない", () => {
    expect(
      analyzeGameFlow({
        isFirstBatting: true,
        innings: [inning(1, 2, 0), inning(2, 0, 0), inning(3, 1, 1)],
      }),
    ).toEqual({
      scoredFirst: true,
      wasLeading: true,
      wasTrailing: false,
      maxDeficit: 0,
    });
  });

  it("無得点の試合は先制がなく、リードもビハインドもない", () => {
    expect(
      analyzeGameFlow({
        isFirstBatting: false,
        innings: [inning(1, 0, 0), inning(2, 0, 0)],
      }),
    ).toEqual({
      scoredFirst: null,
      wasLeading: false,
      wasTrailing: false,
      maxDeficit: 0,
    });
  });

  it("最大の失点差は、リードされた中で最も大きい点差にする", () => {
    const flow = analyzeGameFlow({
      isFirstBatting: true,
      // 2 点差まで広がり、いったん 1 点差に戻ってから 4 点差になる
      innings: [inning(1, 0, 2), inning(2, 1, 0), inning(3, 0, 3)],
    });

    expect(flow?.maxDeficit).toBe(4);
  });

  it("先攻・後攻が未定、またはイニング得点がないときは判定できない", () => {
    expect(
      analyzeGameFlow({ isFirstBatting: null, innings: [inning(1, 1, 0)] }),
    ).toBeNull();
    expect(analyzeGameFlow({ isFirstBatting: true, innings: [] })).toBeNull();
  });
});

describe("summarizeGameFlows", () => {
  const game = (overrides: Partial<GameFlowInput>): GameFlowInput => ({
    isFirstBatting: true,
    result: "win",
    teamScore: 0,
    opponentScore: 0,
    innings: [],
    ...overrides,
  });

  it("展開ごとに戦績を集計する", () => {
    const summary = summarizeGameFlows([
      // 先制して勝ち（1 点差・相手無失点ではない）
      game({
        result: "win",
        teamScore: 3,
        opponentScore: 2,
        innings: [inning(1, 1, 0), inning(2, 2, 2)],
      }),
      // 先制されたが逆転して勝ち
      game({
        result: "win",
        teamScore: 4,
        opponentScore: 1,
        innings: [inning(1, 0, 1), inning(2, 4, 0)],
      }),
      // 先制してリードしたが逆転負け
      game({
        result: "lose",
        teamScore: 1,
        opponentScore: 5,
        innings: [inning(1, 1, 0), inning(2, 0, 5)],
      }),
      // 3 点差までリードされてから逆転して勝ち
      game({
        result: "win",
        teamScore: 6,
        opponentScore: 3,
        innings: [inning(1, 0, 3), inning(2, 6, 0)],
      }),
      // イニング得点がなく、展開は判定できない
      game({ result: "win", teamScore: 2, opponentScore: 0 }),
    ]);

    expect(summary.scoredFirst).toMatchObject({ games: 2, wins: 1, losses: 1 });
    expect(summary.concededFirst).toMatchObject({ games: 2, wins: 2 });
    // 逆転勝ち = リードされた試合の勝ち
    expect(summary.wasTrailing).toMatchObject({ games: 3, wins: 2, losses: 1 });
    // 3 点以上リードされた試合は、4 点差の逆転負けと 3 点差の逆転勝ち
    expect(summary.wasBigTrailing).toMatchObject({
      games: 2,
      wins: 1,
      losses: 1,
    });
    // 逆転負け = リードした試合の負け
    expect(summary.wasLeading).toMatchObject({ games: 4, wins: 3, losses: 1 });
    expect(summary.oneRun).toMatchObject({ games: 1, wins: 1 });
  });
});
