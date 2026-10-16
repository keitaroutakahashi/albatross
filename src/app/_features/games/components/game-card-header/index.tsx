import { EventCardHeader } from "@/app/_features/events/components/event-card-header";
import type { GameWithRelations } from "@/app/_features/games/api/get-games";

type Props = {
  game: GameWithRelations;
};

export const GameCardHeader = ({ game }: Props) => {
  return (
    <EventCardHeader date={game.event.date} label={game.league?.name ?? ""} />
  );
};
