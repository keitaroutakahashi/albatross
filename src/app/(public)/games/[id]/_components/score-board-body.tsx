import type { GameDetail } from "@/app/_features/games/api/getGames";
import { ScoreBoardCell } from "@/app/(public)/games/[id]/_components/scoreBoardCell";
import { ScoreBoardTeamIcon } from "@/app/(public)/games/[id]/_components/scoreBoardTeamIcon";

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
            key={inning.id}
            score={
              game.isFirstBatting ? inning.opponentScore : inning.teamScore
            }
          />
        ))}
        <ScoreBoardCell
          bgColor="bg-gray-100"
          score={game.isFirstBatting ? game.teamScore : game.opponentScore}
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
            key={inning.id}
            score={
              game.isFirstBatting ? inning.opponentScore : inning.teamScore
            }
          />
        ))}
        <ScoreBoardCell
          bgColor="bg-gray-100"
          score={game.isFirstBatting ? game.opponentScore : game.teamScore}
        />
      </tr>
    </tbody>
  );
};
