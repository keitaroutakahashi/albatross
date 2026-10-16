import { notFound } from "next/navigation";
import {
  getEventType,
  getPractice,
} from "@/app/_features/events/api/get-events";
import { getGame } from "@/app/_features/games/api/get-games";
import { Root as GameRoot } from "@/app/(public)/events/[id]/_components/game/root";
import { Root as PracticeRoot } from "@/app/(public)/events/[id]/_components/practice/root";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const eventId = Number.parseInt(id, 10);

  if (Number.isNaN(eventId)) {
    notFound();
  }

  const event = await getEventType(eventId);

  if (!event) {
    notFound();
  }

  if (event.type === "game") {
    const game = await getGame(eventId);

    if (!game) {
      notFound();
    }

    return <GameRoot game={game} />;
  }

  const practice = await getPractice(eventId);

  if (!practice) {
    notFound();
  }

  return <PracticeRoot practice={practice} />;
}
