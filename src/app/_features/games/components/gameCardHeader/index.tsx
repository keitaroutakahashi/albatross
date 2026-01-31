import { clsx } from "clsx";
import type { GameWithRelations } from "@/app/_features/games/api/getGames";
import {
  formatAsMDWithColon,
  formatAsYYYY,
  formatToShortDayNameEn,
  getDayOfWeek,
} from "@/app/_utils/date/date";

type Props = {
  game: GameWithRelations;
};

export const GameCardHeader = ({ game }: Props) => {
  const dayOfWeek = getDayOfWeek(game.date);

  return (
    <div className="bg-gray-100 p-3 md:p-4 flex md:flex-col md:w-64 justify-between items-center">
      <div className="flex items-center gap-x-1">
        <p className="text-3xl font-bold">{formatAsMDWithColon(game.date)}</p>
        <div className="">
          <p
            className={clsx("text-xs font-bold", {
              "text-red-400": dayOfWeek === 0,
              "text-blue-400": dayOfWeek === 6,
              "text-gray-500": dayOfWeek !== 0 && dayOfWeek !== 6,
            })}
          >
            {formatToShortDayNameEn(game.date)}
          </p>
          <p className="text-xs font-bold">{formatAsYYYY(game.date)}</p>
        </div>
      </div>
      <p className="font-bold text-sm">{game.league.name}</p>
    </div>
  );
};
