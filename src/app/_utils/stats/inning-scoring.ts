import type { InningScore } from "@/app/_utils/stats/game-flow";

/** 回別得点を出すときの最低イニング数（草野球は 7 イニング制） */
const MIN_INNINGS = 7;

export type InningScoringRow = {
  inningNumber: number;
  /** その回まで行った試合数 */
  games: number;
  /** その回の総得点 */
  runsScored: number;
  /** その回の総失点 */
  runsAllowed: number;
};

/**
 * 試合ごとのイニング得点を、回ごとに合算する。
 * 7 回までは、試合がなくても行を返す（延長の回は記録がある分だけ）。
 */
export const summarizeInningScoring = (
  gameInnings: InningScore[][],
): InningScoringRow[] => {
  const innings = gameInnings.flat();
  const maxInning = Math.max(
    MIN_INNINGS,
    ...innings.map((i) => i.inningNumber),
  );

  return Array.from({ length: maxInning }, (_, i) => {
    const inningNumber = i + 1;
    const rows = innings.filter((row) => row.inningNumber === inningNumber);

    return {
      inningNumber,
      games: rows.length,
      runsScored: rows.reduce((total, row) => total + row.teamScore, 0),
      runsAllowed: rows.reduce((total, row) => total + row.opponentScore, 0),
    };
  });
};
