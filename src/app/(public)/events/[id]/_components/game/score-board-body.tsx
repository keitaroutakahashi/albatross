import type { GameDetail } from "@/app/_features/games/api/get-games";
import { ScoreBoardCell } from "@/app/(public)/games/[id]/_components/score-board-cell";
import { ScoreBoardTeamIcon } from "@/app/(public)/games/[id]/_components/score-board-team-icon";

type Props = {
  game: GameDetail;
};

// イニングでの得点に献上点（試合開始時に与えられた得点）を加算した合計を返す
const addForfeitedRuns = (
  score: number | null,
  forfeitedRuns: number | null,
) => (score === null ? null : score + (forfeitedRuns ?? 0));

export const ScoreBoardBody = ({ game }: Props) => {
  return (
    <tbody>
      {/* 先攻 */}
      <tr className="bg-white">
        <ScoreBoardTeamIcon
          isFirstBatting={game.isFirstBatting}
          opponentName={game.opponent?.name ?? "未定"}
        />
        {game.innings.map((inning) => (
          <ScoreBoardCell
            isBold
            key={inning.id}
            score={
              game.isFirstBatting ? inning.opponentScore : inning.teamScore
            }
          />
        ))}
        <ScoreBoardCell
          isBold
          bgColor="bg-gray-100"
          score={
            game.isFirstBatting
              ? addForfeitedRuns(game.teamScore, game.teamForfeitedRuns)
              : addForfeitedRuns(game.opponentScore, game.opponentForfeitedRuns)
          }
        />
        <ScoreBoardCell
          bgColor="bg-gray-100"
          score={game.isFirstBatting ? game.teamHits : game.opponentHits}
        />
        <ScoreBoardCell
          bgColor="bg-gray-100"
          score={game.isFirstBatting ? game.teamErrors : game.opponentErrors}
        />
        <ScoreBoardCell
          bgColor="bg-gray-100"
          score={
            game.isFirstBatting
              ? game.teamForfeitedRuns
              : game.opponentForfeitedRuns
          }
        />
      </tr>

      {/* 後攻 */}
      <tr className="bg-white">
        <ScoreBoardTeamIcon
          isFirstBatting={!game.isFirstBatting}
          opponentName={game.opponent?.name ?? "未定"}
        />

        {game.innings.map((inning) => (
          <ScoreBoardCell
            isBold
            key={inning.id}
            score={
              game.isFirstBatting ? inning.opponentScore : inning.teamScore
            }
          />
        ))}
        <ScoreBoardCell
          isBold
          bgColor="bg-gray-100"
          score={
            game.isFirstBatting
              ? addForfeitedRuns(game.opponentScore, game.opponentForfeitedRuns)
              : addForfeitedRuns(game.teamScore, game.teamForfeitedRuns)
          }
        />
        <ScoreBoardCell
          bgColor="bg-gray-100"
          score={game.isFirstBatting ? game.opponentHits : game.teamHits}
        />
        <ScoreBoardCell
          bgColor="bg-gray-100"
          score={game.isFirstBatting ? game.opponentErrors : game.teamErrors}
        />
        <ScoreBoardCell
          bgColor="bg-gray-100"
          score={
            game.isFirstBatting
              ? game.opponentForfeitedRuns
              : game.teamForfeitedRuns
          }
        />
      </tr>
    </tbody>
  );
};
