import type { GameDetail } from "@/app/_features/games/api/get-games";
import {
  formatAsDayName,
  formatAsFullDate,
  formatAsTime24,
} from "@/app/_utils/date/date";

type Props = {
  game: GameDetail;
};

export const GameHeader = ({ game }: Props) => {
  const fullDate = formatAsFullDate(game.date);
  const dayName = formatAsDayName(game.date);
  const time24 = formatAsTime24(game.date);

  return (
    <div className="">
      <p className="text-center font-bold text-sm @content:text-base">
        {game.league.name}
      </p>
      <div className="mt-3"></div>
      <p className="text-center font-bold text-base @content:text-2xl">
        {fullDate} ({dayName}) {time24} vs {game.opponent.name}
      </p>
    </div>
  );
};
