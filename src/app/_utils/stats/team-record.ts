import type { GameResult } from "@/generated/prisma/enums";

export type TeamGameScore = {
  result: GameResult | null;
  teamScore: number | null;
  opponentScore: number | null;
};

export type TeamRecord = {
  /** 試合数 */
  games: number;
  wins: number;
  losses: number;
  draws: number;
  /** 勝率 = 勝 ÷ (勝 + 敗)。引き分けは含めない（勝敗がないときは null） */
  winningPercentage: number | null;
  /** 総得点 */
  runsScored: number;
  /** 総失点 */
  runsAllowed: number;
  /** 得失点差 */
  runDifferential: number;
  /** 1 試合あたりの得点（得点が入力された試合がなければ null） */
  runsScoredAverage: number | null;
  /** 1 試合あたりの失点（失点が入力された試合がなければ null） */
  runsAllowedAverage: number | null;
};

/**
 * 試合結果の一覧からチームの戦績を集計する。
 * 得点・失点は、入力のない試合を合計と平均の両方から除く。
 */
export const summarizeTeamRecord = (games: TeamGameScore[]): TeamRecord => {
  const wins = games.filter((g) => g.result === "win").length;
  const losses = games.filter((g) => g.result === "lose").length;
  const draws = games.filter((g) => g.result === "draw").length;

  const teamScores = games.flatMap((g) =>
    g.teamScore === null ? [] : [g.teamScore],
  );
  const opponentScores = games.flatMap((g) =>
    g.opponentScore === null ? [] : [g.opponentScore],
  );
  const runsScored = sum(teamScores);
  const runsAllowed = sum(opponentScores);

  return {
    games: games.length,
    wins,
    losses,
    draws,
    winningPercentage: wins + losses > 0 ? wins / (wins + losses) : null,
    runsScored,
    runsAllowed,
    runDifferential: runsScored - runsAllowed,
    runsScoredAverage:
      teamScores.length > 0 ? runsScored / teamScores.length : null,
    runsAllowedAverage:
      opponentScores.length > 0 ? runsAllowed / opponentScores.length : null,
  };
};

const sum = (values: number[]) => values.reduce((total, v) => total + v, 0);
