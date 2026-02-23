import type { GameDetail } from "@/app/_features/games/api/get-games";
import { ScoreBoardCell } from "@/app/(public)/games/[id]/_components/score-board-cell";
import { ScoreBoardTeamIcon } from "@/app/(public)/games/[id]/_components/score-board-team-icon";

type Props = {
  game: GameDetail;
};

export const ScoreBoardBody = ({ game }: Props) => {
  return (
    <tbody>
      {/* 先攻 */}
      <tr className="bg-white">
        <ScoreBoardTeamIcon
          isFirstBatting={game.isFirstBatting}
          opponentName={game.opponent.name}
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
          score={game.isFirstBatting ? game.teamScore : game.opponentScore}
        />
        <ScoreBoardCell
          bgColor="bg-gray-100"
          score={game.isFirstBatting ? game.teamHits : game.opponentHits}
        />
        <ScoreBoardCell
          bgColor="bg-gray-100"
          score={game.isFirstBatting ? game.teamErrors : game.opponentErrors}
        />
      </tr>

      {/* 後攻 */}
      <tr className="bg-white">
        <ScoreBoardTeamIcon
          isFirstBatting={!game.isFirstBatting}
          opponentName={game.opponent.name}
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
          score={game.isFirstBatting ? game.opponentScore : game.teamScore}
        />
        <ScoreBoardCell
          bgColor="bg-gray-100"
          score={game.isFirstBatting ? game.opponentHits : game.teamHits}
        />
        <ScoreBoardCell
          bgColor="bg-gray-100"
          score={game.isFirstBatting ? game.opponentErrors : game.teamErrors}
        />
      </tr>
    </tbody>
  );
};
