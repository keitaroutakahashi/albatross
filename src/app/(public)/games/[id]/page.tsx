import { notFound } from "next/navigation";
import { getGameById } from "@/app/(public)/games/_dummy/data";
import { GameHeader } from "./_components/gameHeader";
import { ScoreBoard } from "./_components/scoreBoard";
import { GameSummary } from "./_components/gameSummary";
import { GamePitchers } from "./_components/gamePitchers";
import { GameStartingLineup } from "./_components/gameStartingLineup";
import { GameResults } from "./_components/gameResults";
import { GameStats } from "./_components/gameStats";

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
