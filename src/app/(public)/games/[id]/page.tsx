import { notFound } from "next/navigation";
import { getGame } from "@/app/_features/games/api/getGames";
import { Root } from "@/app/(public)/games/[id]/_components/root";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const gameId = Number.parseInt(id, 10);

  if (Number.isNaN(gameId)) {
    notFound();
  }

  const game = await getGame(gameId);

  if (!game) {
    notFound();
  }

  return <Root game={game} />;
}
