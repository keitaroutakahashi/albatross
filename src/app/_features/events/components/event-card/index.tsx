import type { EventWithRelations } from "@/app/_features/events/api/get-events";
import { PracticeCard } from "@/app/_features/events/components/practice-card";
import { GameCard } from "@/app/_features/games/components/game-card";

type Props = {
  event: EventWithRelations;
};

export const EventCard = ({ event }: Props) => {
  const { game, practice, ...baseEvent } = event;

  if (game) {
    return <GameCard game={{ ...game, event: baseEvent }} />;
  }

  if (practice) {
    return <PracticeCard event={baseEvent} practice={practice} />;
  }

  return null;
};
