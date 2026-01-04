import { GameItem } from "@/app/(public)/games/_components/gameItem";

export const GameList = () => {
  return (
    <ul className="space-y-4">
      <GameItem />
      <GameItem />
    </ul>
  );
};
