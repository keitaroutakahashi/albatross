import { getGames } from "@/app/_features/games/api/getGames";
import { GameCard } from "@/app/_features/games/components/gameCard";
import { getCurrentSeason } from "@/app/_utils/date/date";

type Props = {
  season?: string;
};

export const GameList = async ({ season }: Props) => {
  const defaultSeason = getCurrentSeason();

  const games = await getGames(season ?? defaultSeason);

  return (
    <ul className="space-y-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </ul>
  );
};
