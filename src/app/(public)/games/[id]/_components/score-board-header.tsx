import type { GameDetail } from "@/app/_features/games/api/get-games";

type Props = {
  game: GameDetail;
};

const SCORE_DETAILS = ["R", "H", "E"];

export const ScoreBoardHeader = ({ game }: Props) => {
  return (
    <thead>
      <tr className="bg-primary text-white">
        <th />
        {game.innings.map((inning) => (
          <th key={inning.id} className="py-1 text-center font-bold text-xs">
            {inning.inningNumber}
          </th>
        ))}
        {SCORE_DETAILS.map((detail) => (
          <th
            key={detail}
            className="text-center text-xs font-bold bg-gray-500"
          >
            {detail}
          </th>
        ))}
      </tr>
    </thead>
  );
};
