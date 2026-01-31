import { getGames } from "@/app/_features/games/api/getGames";
import { getCurrentSeason } from "@/app/_utils/date/date";
import { GameItem } from "@/app/(public)/games/_components/gameItem";

type Props = {
  season?: string;
};

export const GameList = async ({ season }: Props) => {
  const defaultSeason = getCurrentSeason();

  const games = await getGames(season ?? defaultSeason);

  return (
    <ul className="space-y-4">
      {games.map((game) => (
        <GameItem key={game.id} game={game} />
      ))}
    </ul>
  );
};
