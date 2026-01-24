import { GameItem } from "@/app/(public)/games/_components/gameItem";
import { data } from "@/app/(public)/games/_dummy/data";

export const GameList = () => {
  return (
    <ul className="space-y-4">
      {data.map((game) => (
        <GameItem key={game.id} game={game} />
      ))}
    </ul>
  );
};
