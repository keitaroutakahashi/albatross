import Link from "next/link";
import type { GameWithRelations } from "@/app/_features/games/api/get-games";
import { GameCardBody } from "@/app/_features/games/components/game-card-body";
import { GameCardHeader } from "@/app/_features/games/components/game-card-header";

type Props = {
  game: GameWithRelations;
};

export const GameCard = ({ game }: Props) => {
  return (
    <li>
      <Link
        href={`/games/${game.id}`}
        className="flex flex-col @content:flex-row border border-gray-300 rounded overflow-hidden hover:border-black transition cursor-pointer"
      >
        <GameCardHeader game={game} />
        <GameCardBody game={game} />
      </Link>
    </li>
  );
};
