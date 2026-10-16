import { calcGameResult } from "@/app/_utils/stats/game-result";
import type { GameResult } from "@/generated/prisma/enums";

type Input = {
  /** 1 回から順の、各イニングの得点 */
  teamInnings: number[];
  opponentInnings: number[];
  /** 試合開始時に与えられた得点 */
  teamForfeitedRuns: number;
  opponentForfeitedRuns: number;
};

type Output = {
  /** 各イニングの得点の合計（献上点は含まない） */
  teamScore: number | null;
  opponentScore: number | null;
  result: GameResult | null;
};

const sum = (values: number[]) => values.reduce((total, v) => total + v, 0);

/**
 * イニングごとの得点から、試合の得点と勝敗を求める。
 * 得点は献上点を含めずに保持し（スコアボードが献上点を加えて表示するため）、
 * 勝敗は献上点を含めた合計で判定する。イニングが 1 つもなければ判定できない。
 */
export const calcGameScore = ({
  teamInnings,
  opponentInnings,
  teamForfeitedRuns,
  opponentForfeitedRuns,
}: Input): Output => {
  if (teamInnings.length === 0) {
    return { teamScore: null, opponentScore: null, result: null };
  }

  const teamScore = sum(teamInnings);
  const opponentScore = sum(opponentInnings);

  return {
    teamScore,
    opponentScore,
    result: calcGameResult(
      teamScore + teamForfeitedRuns,
      opponentScore + opponentForfeitedRuns,
    ),
  };
};
