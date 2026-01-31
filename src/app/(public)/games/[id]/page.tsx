import { notFound } from "next/navigation";
import { getGameById } from "@/app/(public)/games/_dummy/data";
import { GameHeader } from "@/app/(public)/games/[id]/_components/gameHeader";
import { GamePitchers } from "@/app/(public)/games/[id]/_components/gamePitchers";
import { GameResults } from "@/app/(public)/games/[id]/_components/gameResults";
import { GameStartingLineup } from "@/app/(public)/games/[id]/_components/gameStartingLineup";
import { GameStats } from "@/app/(public)/games/[id]/_components/gameStats";
import { GameSummary } from "@/app/(public)/games/[id]/_components/gameSummary";
import { ScoreBoard } from "@/app/(public)/games/[id]/_components/scoreBoard";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const gameId = Number.parseInt(id, 10);

  if (Number.isNaN(gameId)) {
    notFound();
  }

  const game = getGameById(gameId);

  if (!game) {
    notFound();
  }

  return (
    <div className="md:max-w-4xl md:mx-auto px-5 py-6">
      <GameHeader game={game} />
      <ScoreBoard game={game} />
      <GameSummary game={game} />
      <GamePitchers game={game} />
      <GameStartingLineup game={game} />
      <GameResults game={game} />
      <GameStats game={game} />
    </div>
  );
}
