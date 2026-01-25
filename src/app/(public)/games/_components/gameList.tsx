import { getGames } from "@/app/_features/games/apis/getGames";
import { GameItem } from "@/app/(public)/games/_components/gameItem";

export const GameList = async () => {
  const games = await getGames();

  return (
    <ul className="space-y-4">
      {games.map((game) => (
        <GameItem key={game.id} game={game} />
      ))}
    </ul>
  );
};
